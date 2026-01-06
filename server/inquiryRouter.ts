import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createInquiry, addInquiryPhoto, getInquiries, getInquiryById, getInquiryPhotos, updateInquiryStatus } from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// 問い合わせ作成のスキーマ
const createInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  serviceType: z.string().optional().nullable(),
  message: z.string().min(1),
  utmParams: z.record(z.string(), z.string()).optional().nullable(),
  trafficSource: z.string().optional().nullable(),
  landingPage: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
});

// 写真アップロードのスキーマ
const uploadPhotoSchema = z.object({
  inquiryId: z.number(),
  filename: z.string(),
  mimeType: z.string(),
  base64Data: z.string(), // Base64エンコードされた画像データ
});

export const inquiryRouter = router({
  // 問い合わせを作成（公開API）
  create: publicProcedure
    .input(createInquirySchema)
    .mutation(async ({ input }) => {
      const inquiryId = await createInquiry({
        name: input.name,
        email: input.email ?? null,
        phone: input.phone ?? null,
        address: input.address ?? null,
        serviceType: input.serviceType ?? null,
        message: input.message,
        utmParams: input.utmParams ?? null,
        trafficSource: input.trafficSource ?? null,
        landingPage: input.landingPage ?? null,
        referrer: input.referrer ?? null,
        status: "new",
      });

      return { success: true, inquiryId };
    }),

  // 写真をアップロード（公開API）
  uploadPhoto: publicProcedure
    .input(uploadPhotoSchema)
    .mutation(async ({ input }) => {
      const { inquiryId, filename, mimeType, base64Data } = input;

      // Base64をBufferに変換
      const buffer = Buffer.from(base64Data, "base64");
      const fileSize = buffer.length;

      // S3にアップロード
      const fileKey = `inquiries/${inquiryId}/${nanoid()}-${filename}`;
      const { url } = await storagePut(fileKey, buffer, mimeType);

      // DBに保存
      const photoId = await addInquiryPhoto({
        inquiryId,
        fileKey,
        url,
        filename,
        mimeType,
        fileSize,
      });

      return { success: true, photoId, url };
    }),

  // 問い合わせ一覧を取得（管理者用）
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input, ctx }) => {
      // 管理者のみアクセス可能
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      return await getInquiries(limit, offset);
    }),

  // 問い合わせ詳細を取得（管理者用）
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const inquiry = await getInquiryById(input.id);
      if (!inquiry) {
        throw new Error("Inquiry not found");
      }
      const photos = await getInquiryPhotos(input.id);
      return { ...inquiry, photos };
    }),

  // ステータス更新（管理者用）
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "contacted", "quoted", "completed", "cancelled"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      await updateInquiryStatus(input.id, input.status);
      return { success: true };
    }),
});

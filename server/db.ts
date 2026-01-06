import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, inquiries, inquiryPhotos, InsertInquiry, InsertInquiryPhoto } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// 問い合わせ関連のクエリヘルパー
// ============================================

/**
 * 問い合わせを作成
 */
export async function createInquiry(inquiry: InsertInquiry): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create inquiry: database not available");
  }

  const result = await db.insert(inquiries).values(inquiry);
  return result[0].insertId;
}

/**
 * 問い合わせに写真を追加
 */
export async function addInquiryPhoto(photo: InsertInquiryPhoto): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot add inquiry photo: database not available");
  }

  const result = await db.insert(inquiryPhotos).values(photo);
  return result[0].insertId;
}

/**
 * 問い合わせ一覧を取得（管理者用）
 */
export async function getInquiries(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiries: database not available");
    return [];
  }

  return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit).offset(offset);
}

/**
 * 問い合わせ詳細を取得
 */
export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry: database not available");
    return null;
  }

  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * 問い合わせの写真一覧を取得
 */
export async function getInquiryPhotos(inquiryId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiry photos: database not available");
    return [];
  }

  return await db.select().from(inquiryPhotos).where(eq(inquiryPhotos.inquiryId, inquiryId));
}

/**
 * 問い合わせのステータスを更新
 */
export async function updateInquiryStatus(id: number, status: "new" | "contacted" | "quoted" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot update inquiry status: database not available");
  }

  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

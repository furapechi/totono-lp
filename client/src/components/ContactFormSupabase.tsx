import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Upload, X, Loader2, ImageIcon, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useUtmParams } from "@/hooks/useUtmParams";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface FilePreview {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export function ContactFormSupabase() {
  const [, navigate] = useLocation();
  const utmParams = useUtmParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    message: "",
  });
  
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createInquiry = trpc.inquiry.create.useMutation();
  const uploadPhoto = trpc.inquiry.uploadPhoto.useMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, serviceType: value }));
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`写真は最大${MAX_FILES}枚までです`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}は20MBを超えています`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}は画像ファイルではありません`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    setFiles((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  }, [files.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (files.length + droppedFiles.length > MAX_FILES) {
      toast.error(`写真は最大${MAX_FILES}枚までです`);
      return;
    }

    const validFiles = droppedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}は20MBを超えています`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}は画像ファイルではありません`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    setFiles((prev) => [...prev, ...newPreviews]);
  }, [files.length]);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, の部分を除去
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("お名前を入力してください");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("お問い合わせ内容を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 問い合わせを作成
      const result = await createInquiry.mutateAsync({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        serviceType: formData.serviceType || null,
        message: formData.message,
        utmParams: utmParams.getUtmParamsForForm(),
        trafficSource: utmParams.getUtmSummary(),
        landingPage: utmParams.utmParams.landing_page || null,
        referrer: utmParams.utmParams.referrer || null,
      });

      const inquiryId = result.inquiryId;

      // 2. 写真をアップロード
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i] = { ...newFiles[i], uploading: true };
            return newFiles;
          });

          try {
            const base64Data = await fileToBase64(files[i].file);
            await uploadPhoto.mutateAsync({
              inquiryId,
              filename: files[i].file.name,
              mimeType: files[i].file.type,
              base64Data,
            });

            setFiles((prev) => {
              const newFiles = [...prev];
              newFiles[i] = { ...newFiles[i], uploading: false, uploaded: true };
              return newFiles;
            });
          } catch (error) {
            setFiles((prev) => {
              const newFiles = [...prev];
              newFiles[i] = { ...newFiles[i], uploading: false, error: "アップロード失敗" };
              return newFiles;
            });
          }
        }
      }

      toast.success("お問い合わせを送信しました");
      navigate("/thanks");
    } catch (error) {
      console.error("送信エラー:", error);
      toast.error("送信に失敗しました。お手数ですがお電話でお問い合わせください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* お名前 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-700 font-medium">
          お名前 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="山田 太郎"
          required
          className="h-12"
        />
      </div>

      {/* メールアドレス */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">
          メールアドレス
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="example@email.com"
          className="h-12"
        />
      </div>

      {/* 電話番号 */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium">
          電話番号
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="090-1234-5678"
          className="h-12"
        />
      </div>

      {/* ご住所 */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-gray-700 font-medium">
          ご住所（市区町村まで）
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="茨城県桜川市"
          className="h-12"
        />
      </div>

      {/* サービス種類 */}
      <div className="space-y-2">
        <Label htmlFor="serviceType" className="text-gray-700 font-medium">
          ご希望のサービス
        </Label>
        <Select value={formData.serviceType} onValueChange={handleServiceChange}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pruning">剪定</SelectItem>
            <SelectItem value="felling">伐採</SelectItem>
            <SelectItem value="mowing">草刈り</SelectItem>
            <SelectItem value="garden">庭づくり・外構</SelectItem>
            <SelectItem value="other">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* お問い合わせ内容 */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 font-medium">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="ご依頼内容やご質問をご記入ください"
          required
          rows={5}
          className="resize-none"
        />
      </div>

      {/* 写真添付 */}
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">
          写真添付（最大{MAX_FILES}枚・各20MBまで）
        </Label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">
            クリックまたはドラッグ&ドロップで写真を追加
          </p>
          <p className="text-gray-400 text-xs mt-1">
            現場の写真を送っていただくと、より正確なお見積りが可能です
          </p>
        </div>

        {/* プレビュー */}
        {files.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
            {files.map((filePreview, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={filePreview.preview}
                  alt={`プレビュー ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {filePreview.uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                {filePreview.uploaded && (
                  <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {filePreview.error && (
                  <div className="absolute inset-0 bg-red-500/50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">エラー</span>
                  </div>
                )}
                {!isSubmitting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {files.length < MAX_FILES && (
              <button
                type="button"
                onClick={() => document.getElementById("file-input")?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 transition-colors"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs mt-1">追加</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 送信ボタン */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            無料で相談する
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        ※ 通常24時間以内にご返信いたします
      </p>
    </form>
  );
}

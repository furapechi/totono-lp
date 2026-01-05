/**
 * ContactForm - Formspree連携のお問い合わせフォーム
 * 写真添付対応（最大10枚、1枚20MBまで）
 */

import { useState, useRef, FormEvent } from "react";
import { Phone, Camera, X, Upload, AlertCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqnznbw";
const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  error?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const remainingSlots = MAX_FILES - files.length;
    
    if (remainingSlots <= 0) {
      toast.error(`写真は最大${MAX_FILES}枚までです`);
      return;
    }

    const filesToAdd = fileArray.slice(0, remainingSlots);
    
    const processedFiles: UploadedFile[] = filesToAdd.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      if (file.size > MAX_FILE_SIZE) {
        return {
          id,
          file,
          preview: "",
          error: "ファイルサイズが20MBを超えています",
        };
      }

      if (!file.type.startsWith("image/")) {
        return {
          id,
          file,
          preview: "",
          error: "画像ファイルのみアップロード可能です",
        };
      }

      const preview = URL.createObjectURL(file);
      
      return {
        id,
        file,
        preview,
      };
    });

    setFiles((prev) => [...prev, ...processedFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add files to FormData
      const validFiles = files.filter(f => !f.error);
      validFiles.forEach((uploadedFile, index) => {
        formData.append(`photo_${index + 1}`, uploadedFile.file);
      });

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormStatus("success");
        toast.success("お問い合わせを送信しました。12時間以内にご連絡いたします。");
        
        // Reset form
        formRef.current?.reset();
        setFiles([]);
        
        // Reset status after 5 seconds
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch (error) {
      setFormStatus("error");
      toast.error("送信に失敗しました。お手数ですがお電話でお問い合わせください。");
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  };

  if (formStatus === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-forest" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          送信完了しました
        </h3>
        <p className="text-muted-foreground mb-6">
          お問い合わせありがとうございます。<br />
          12時間以内にご連絡いたします。
        </p>
        <Button
          onClick={() => setFormStatus("idle")}
          variant="outline"
        >
          新しいお問い合わせ
        </Button>
      </div>
    );
  }

  return (
    <form 
      ref={formRef}
      className="space-y-6" 
      onSubmit={handleSubmit}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            お名前 <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
            placeholder="山田 太郎"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            メールアドレス <span className="text-coral">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
            placeholder="example@email.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            電話番号
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
            placeholder="090-1234-5678"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ご住所（市区町村まで）<span className="text-coral">*</span>
          </label>
          <input
            type="text"
            name="address"
            required
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
            placeholder="茨城県桜川市"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          ご依頼内容 <span className="text-coral">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["剪定", "伐採", "草刈り", "防草シート", "人工芝", "空き家管理", "その他"].map((item) => (
            <label key={item} className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
              <input type="checkbox" name="service" value={item} className="rounded border-input text-forest focus:ring-forest" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          本数・面積・状況など
        </label>
        <textarea
          name="details"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest resize-none"
          placeholder="例）松の木3本、高さ約3m。隣家との境界近くにあり、枝が越境しそうです。"
        />
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ご希望時期
          </label>
          <select
            name="timing"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">選択してください</option>
            <option value="なるべく早く">なるべく早く</option>
            <option value="今週中">今週中</option>
            <option value="今月中">今月中</option>
            <option value="相談して決めたい">相談して決めたい</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ご希望の連絡方法
          </label>
          <select
            name="contact_method"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">選択してください</option>
            <option value="電話">電話</option>
            <option value="メール">メール</option>
            <option value="LINE">LINE</option>
          </select>
        </div>
      </div>
      
      {/* Photo Upload Section */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          写真添付（最大10枚まで、各1枚20MB以下）
        </label>
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>写真があるとより正確な概算が可能です</strong><br />
            庭木や草の状態がわかる写真をお送りください。
          </p>
          
          {/* Upload area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragActive
                ? "border-forest bg-forest/5"
                : "border-border hover:border-forest/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-forest" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  写真をドラッグ＆ドロップ
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  または
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                ファイルを選択
              </Button>
              <p className="text-xs text-muted-foreground">
                {files.length}/{MAX_FILES}枚 • 1枚あたり最大20MB
              </p>
            </div>
          </div>

          {/* Preview grid */}
          {files.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                >
                  {file.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-destructive/10">
                      <AlertCircle className="w-6 h-6 text-destructive mb-1" />
                      <p className="text-[10px] text-destructive text-center leading-tight">
                        {file.error}
                      </p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {!file.error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                      <p className="text-[10px] text-white truncate">
                        {(file.file.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        <input 
          type="checkbox" 
          id="privacy" 
          name="privacy_agreed"
          value="同意する"
          required 
          className="mt-1 rounded border-input text-forest focus:ring-forest" 
        />
        <label htmlFor="privacy" className="text-sm text-muted-foreground">
          <a href="#" className="text-forest underline">プライバシーポリシー</a>に同意の上、送信します
        </label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full cta-button bg-coral hover:bg-coral-dark text-white"
        disabled={formStatus === "submitting"}
      >
        {formStatus === "submitting" ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            送信する
          </>
        )}
      </Button>
    </form>
  );
}

export default ContactForm;

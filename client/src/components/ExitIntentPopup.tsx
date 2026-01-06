import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Gift, Phone, MessageCircle, Clock } from "lucide-react";

const PHONE = "090-5306-0197";
const LINE_URL = "#line";

interface ExitIntentPopupProps {
  delay?: number; // ポップアップを表示するまでの遅延（ミリ秒）
}

export function ExitIntentPopup({ delay = 3000 }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 遅延後に準備完了
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // セッションストレージで表示済みかチェック
  useEffect(() => {
    const shown = sessionStorage.getItem("exitIntentShown");
    if (shown) {
      setHasShown(true);
    }
  }, []);

  const showPopup = useCallback(() => {
    if (!hasShown && isReady) {
      setIsOpen(true);
      setHasShown(true);
      sessionStorage.setItem("exitIntentShown", "true");
    }
  }, [hasShown, isReady]);

  // Exit Intent検出（デスクトップ）
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showPopup]);

  // スクロールアップ検出（モバイル）
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 上にスクロールした場合
      if (currentScrollY < lastScrollY && currentScrollY > 100) {
        scrollUpCount++;
        // 3回連続で上スクロールしたら表示
        if (scrollUpCount >= 3) {
          showPopup();
          scrollUpCount = 0;
        }
      } else {
        scrollUpCount = 0;
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showPopup]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Gift className="w-6 h-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                ちょっと待って！
              </DialogTitle>
            </DialogHeader>
          </div>
          <p className="text-green-100">
            今月中のお問い合わせで
          </p>
          <p className="text-2xl font-bold mt-1">
            出張費 ¥5,000 → 無料！
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              このキャンペーンは今月末まで
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base"
            >
              <a href={`tel:${PHONE}`}>
                <Phone className="w-5 h-5 mr-2" />
                今すぐ電話で相談
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 h-12 text-base"
            >
              <a href={LINE_URL}>
                <MessageCircle className="w-5 h-5 mr-2" />
                LINEで写真を送る
              </a>
            </Button>
          </div>
          
          <p className="text-center text-xs text-gray-500">
            見積り無料・キャンセル料なし
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

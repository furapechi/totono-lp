/**
 * トトノLP - 地域密着の造園・伐採・草刈りサービス
 * デザイン: プロフェッショナル・クラフト
 * - 職人の道具箱のような実直さと現代的な洗練の融合
 * - カラー: オフホワイト + チャコール + ディープグリーン + コーラルオレンジCTA
 * - アニメーション: 軽量なtransform/opacityベース
 * - モバイルファースト設計
 */

import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, Mail, Check, ChevronRight, Clock, MapPin, Shield, Sparkles, TreeDeciduous, Scissors, Leaf, Home as HomeIcon, Building, Mountain, AlertTriangle, Star, ArrowRight, Send, Menu, X, ChevronDown, Users, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContactForm } from "@/components/ContactForm";

// Contact info
const PHONE = "090-5306-0197";
const EMAIL = "extend.engineer007@gmail.com";
const LINE_URL = "#line"; // LINE公式アカウントURL

export default function Home() {
  const [isFloatingCtaVisible, setIsFloatingCtaVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // SEO: ページタイトルの設定（30-60文字）
  useEffect(() => {
    document.title = "【茨城・栃木・千葉】庭木の剪定・伐採・草刈りならトトノ｜1本からOK・見積無料";
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Floating CTA visibility
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setIsFloatingCtaVisible(heroBottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - モバイル最適化 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-14 md:h-16">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-forest rounded-lg flex items-center justify-center">
              <TreeDeciduous className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-bold text-lg md:text-xl text-charcoal">トトノ</span>
          </a>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">サービス</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">料金</a>
            <a href="#cases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">施工事例</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">よくある質問</a>
            <a href={`tel:${PHONE}`} className="cta-button bg-coral text-white text-sm py-2 px-4">
              <Phone className="w-4 h-4 inline mr-1" />
              電話で相談
            </a>
          </nav>
          
          {/* Mobile: 電話ボタン + メニュー */}
          <div className="flex items-center gap-2 md:hidden">
            <a href={`tel:${PHONE}`} className="bg-coral text-white p-2 rounded-lg">
              <Phone className="w-5 h-5" />
            </a>
            <button 
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border py-4">
            <nav className="container flex flex-col gap-4">
              <a href="#services" className="text-base font-medium py-2" onClick={() => setMobileMenuOpen(false)}>サービス</a>
              <a href="#pricing" className="text-base font-medium py-2" onClick={() => setMobileMenuOpen(false)}>料金</a>
              <a href="#cases" className="text-base font-medium py-2" onClick={() => setMobileMenuOpen(false)}>施工事例</a>
              <a href="#faq" className="text-base font-medium py-2" onClick={() => setMobileMenuOpen(false)}>よくある質問</a>
              <a href="#contact" className="text-base font-medium py-2" onClick={() => setMobileMenuOpen(false)}>お問い合わせ</a>
            </nav>
          </div>
        )}
      </header>

      {/* Campaign Banner - モバイル最適化 */}
      <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-gradient-to-r from-coral to-coral-dark text-white py-1.5 md:py-2 campaign-banner">
        <div className="container flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
          <Zap className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
          <span>【今月限定】初回<span className="font-bold">10%OFF</span></span>
          <span className="hidden sm:inline text-white/80">| 残りわずか</span>
        </div>
      </div>

      {/* Hero Section - モバイル完全最適化 */}
      <section ref={heroRef} className="relative pt-20 md:pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Desktop image */}
          <img 
            src="/images/hero-team-desktop.jpg" 
            alt="トトノのスタッフ" 
            className="hidden md:block w-full h-full object-cover object-center"
          />
          {/* Mobile image */}
          <img 
            src="/images/hero-team-mobile.jpg" 
            alt="トトノのスタッフ" 
            className="md:hidden w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40 md:to-transparent" />
        </div>
        
        <div className="relative z-10 container py-8 md:py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* モバイル: シンプルなバッジ */}
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              <span className="inline-flex items-center gap-1.5 bg-coral text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-full w-full bg-white"></span>
                </span>
                即日対応可能
              </span>
              <span className="inline-flex items-center gap-1 bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs md:text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                茨城・栃木・千葉
              </span>
            </div>
            
            {/* Main headline - モバイル最適化 */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 md:mb-4">
              お庭の困りごと、<br />
              <span className="text-coral">1本から</span>スッキリ解決
            </h1>
            
            <p className="text-sm sm:text-base md:text-xl text-white/90 mb-4 md:mb-6 leading-relaxed">
              庭木の剪定・伐採・草刈りなら地元密着の「トトノ」へ。
              <span className="hidden sm:inline"><br /></span>
              写真を送るだけで概算見積もりOK。
            </p>
            
            {/* 実績数 - モバイルは2列 */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center">
                <div className="text-xl md:text-2xl font-black text-white">500<span className="text-sm md:text-lg">+</span></div>
                <div className="text-[10px] md:text-xs text-white/70">累計対応件数</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center">
                <div className="text-xl md:text-2xl font-black text-white">4.8</div>
                <div className="text-[10px] md:text-xs text-white/70">お客様満足度</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 md:p-3 text-center">
                <div className="text-xl md:text-2xl font-black text-white">98<span className="text-sm md:text-lg">%</span></div>
                <div className="text-[10px] md:text-xs text-white/70">リピート率</div>
              </div>
            </div>
            
            {/* Trust badges - モバイルはコンパクト */}
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {["見積無料", "写真見積OK", "1本からOK", "追加料金なし"].map((text, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-coral" />
                  <span className="text-xs md:text-sm text-white">{text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons - モバイル最適化（大きく、タップしやすく） */}
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE}`} className="cta-button-mobile bg-coral text-white flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg shadow-lg relative">
                <Phone className="w-6 h-6" />
                <span>今すぐ電話で相談</span>
                <span className="absolute -top-2 -right-2 bg-white text-coral text-xs font-bold px-2 py-0.5 rounded-full shadow-md">無料</span>
              </a>
              <a href={LINE_URL} className="cta-button-mobile bg-[#06C755] text-white flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg shadow-lg relative">
                <MessageCircle className="w-6 h-6" />
                <span>LINEで写真を送る</span>
                <span className="absolute -top-2 -right-2 bg-white text-[#06C755] text-xs font-bold px-2 py-0.5 rounded-full shadow-md">30秒</span>
              </a>
            </div>
            
            <p className="text-xs md:text-sm text-white/70 mt-3 md:mt-4 text-center md:text-left">
              📞 7:00〜20:00（不在時は折り返します）
            </p>
          </div>
        </div>
        
        {/* Scroll indicator - デスクトップのみ */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 scroll-indicator">
          <span className="text-white/60 text-xs">詳しく見る</span>
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-background"/>
          </svg>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-10 md:py-16 bg-background">
        <div className="container">
          <div className="reveal">
            <div className="text-center mb-6 md:mb-8">
              <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                対応エリア
              </span>
              <h2 className="text-xl md:text-3xl font-bold text-foreground">
                茨城・栃木・千葉の広域に対応
              </h2>
            </div>
            
            <div className="bg-secondary/50 rounded-xl md:rounded-2xl p-4 md:p-8">
              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                <div>
                  <h3 className="font-bold text-forest mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 bg-forest rounded-full"></span>
                    茨城県（メイン）
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    桜川市・筑西市・結城市・下妻市・常総市・つくば市・土浦市・石岡市・笠間市・水戸市・古河市・坂東市・境町・八千代町・五霞町
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-forest mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 bg-forest rounded-full"></span>
                    栃木県
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    栃木市・小山市・佐野市・足利市・真岡市・下野市・壬生町・野木町
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-forest mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
                    <span className="w-2 h-2 bg-forest rounded-full"></span>
                    千葉県
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    我孫子市・柏市・野田市・流山市・松戸市・印西市・白井市
                  </p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6 text-center">
                ※上記以外のエリアもお気軽にご相談ください
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-10 md:py-20 bg-muted">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-2 md:mb-4">
              こんなお悩みありませんか？
            </h2>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-4 reveal">
            {[
              "庭木が伸びすぎて、ご近所に迷惑をかけていないか心配",
              "空き家の庭が荒れ放題で、どこに頼めばいいかわからない",
              "業者に頼むと高そう…追加料金が怖い",
              "自分で草刈りするのは体力的にキツくなってきた",
              "山林の木が倒れそうで危険",
              "見積もりを取りたいけど、立ち会う時間がない",
            ].map((problem, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 md:p-4 shadow-sm">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-coral/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-coral" />
                </div>
                <p className="text-xs md:text-sm text-foreground">{problem}</p>
              </div>
            ))}
          </div>
          
          <div className="reveal mt-6 md:mt-10 text-center">
            <div className="inline-block bg-forest text-white rounded-xl md:rounded-2xl px-6 py-4 md:px-8 md:py-6">
              <p className="text-base md:text-xl font-bold mb-1 md:mb-2">
                そのお悩み、トトノが解決します
              </p>
              <p className="text-xs md:text-sm text-white/80">
                地元密着だからできる、丁寧で誠実な対応
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="services" className="py-10 md:py-20 bg-background">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              選ばれる理由
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              トトノが選ばれる5つの理由
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 reveal">
            {[
              {
                icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />,
                title: "12時間以内に返信",
                description: "LINE・メールは24時間受付。お問い合わせから12時間以内にスタッフが返信します。",
              },
              {
                icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
                title: "追加料金なしの明朗会計",
                description: "お見積もり金額から追加請求は一切なし。作業前に料金の内訳をしっかりご説明します。",
              },
              {
                icon: <TreeDeciduous className="w-6 h-6 md:w-8 md:h-8" />,
                title: "1本からでもOK",
                description: "「この木1本だけ切ってほしい」も大歓迎。小さな作業でも丁寧に対応します。",
              },
              {
                icon: <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />,
                title: "写真で概算見積もり",
                description: "LINEで写真を送るだけで概算をお伝えできます。忙しくて立ち会えない方も安心。",
              },
              {
                icon: <MapPin className="w-6 h-6 md:w-8 md:h-8" />,
                title: "地元密着の安心感",
                description: "茨城県桜川市を拠点に、地域の気候や植生を熟知。ご近所への配慮も万全です。",
              },
            ].map((item, i) => (
              <Card key={i} className="card-hover border-0 shadow-md">
                <CardContent className="p-4 md:p-6">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-forest/10 rounded-xl flex items-center justify-center text-forest mb-3 md:mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-foreground mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-10 md:py-20 bg-forest text-white">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold">
              ご依頼から完了まで3ステップ
            </h2>
            <p className="text-white/80 mt-1 md:mt-2 text-sm md:text-base">かんたん・スピーディーにお庭をキレイに</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 md:gap-6 reveal">
            {[
              {
                step: "01",
                title: "お問い合わせ",
                description: "電話・LINE・メールでお気軽にご連絡ください。",
              },
              {
                step: "02",
                title: "現地確認・お見積もり",
                description: "現地を確認し、正式なお見積もりをご提示。",
              },
              {
                step: "03",
                title: "作業・お支払い",
                description: "プロの技術で丁寧に作業。完了後にお支払い。",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6">
                  <div className="text-2xl md:text-4xl font-black text-coral mb-2 md:mb-4">{item.step}</div>
                  <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-white/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-10 md:py-20 bg-background">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
              料金目安
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              サービス・料金のご案内
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              ※料金は目安です。現地の状況により変動します
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 reveal">
            {[
              {
                icon: <Scissors className="w-6 h-6 md:w-8 md:h-8" />,
                title: "庭木の剪定",
                price: "3,000円〜",
                unit: "/ 1本",
                description: "松・槙・庭木全般の本格剪定。",
                features: ["低木〜高木まで対応", "枝葉の処分込み"],
                image: "/images/hero-garden.jpg",
              },
              {
                icon: <TreeDeciduous className="w-6 h-6 md:w-8 md:h-8" />,
                title: "伐採・抜根",
                price: "5,000円〜",
                unit: "/ 1本",
                description: "邪魔な木、危険な木を安全に伐採。",
                features: ["重機使用可能", "山林・竹林OK"],
                image: "/images/tree-cutting.jpg",
              },
              {
                icon: <Leaf className="w-6 h-6 md:w-8 md:h-8" />,
                title: "草刈り・草抜き",
                price: "500円〜",
                unit: "/ 1㎡",
                description: "伸び放題の雑草をスッキリ。",
                features: ["機械刈り・手作業", "定期契約割引あり"],
                image: "/images/grass-cutting.jpg",
              },
              {
                icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
                title: "防草シート施工",
                price: "1,500円〜",
                unit: "/ 1㎡",
                description: "草刈りの手間を大幅削減。",
                features: ["高耐久シート使用", "10年保証品あり"],
              },
              {
                icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
                title: "人工芝施工",
                price: "8,000円〜",
                unit: "/ 1㎡",
                description: "お手入れ不要で年中キレイな緑。",
                features: ["高品質人工芝", "下地処理込み"],
              },
              {
                icon: <HomeIcon className="w-6 h-6 md:w-8 md:h-8" />,
                title: "空き家の定期管理",
                price: "5,000円〜",
                unit: "/ 月",
                description: "遠方にお住まいの方も安心。",
                features: ["月1回〜対応", "写真報告あり"],
              },
            ].map((item, i) => (
              <Card key={i} className="card-hover border-0 shadow-md overflow-hidden">
                {item.image && (
                  <div className="h-32 md:h-40 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-forest/10 rounded-xl flex items-center justify-center text-forest">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-foreground">{item.title}</h3>
                    </div>
                  </div>
                  <div className="mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl font-black text-coral">{item.price}</span>
                    <span className="text-xs md:text-sm text-muted-foreground">{item.unit}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{item.description}</p>
                  <ul className="space-y-1 md:space-y-2">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs md:text-sm">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-forest" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Locations */}
      <section className="py-10 md:py-20 bg-muted">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              こんな場所も対応します
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 reveal">
            {[
              { icon: <HomeIcon className="w-5 h-5 md:w-6 md:h-6" />, label: "戸建て住宅" },
              { icon: <Building className="w-5 h-5 md:w-6 md:h-6" />, label: "空き家・空き地" },
              { icon: <Building className="w-5 h-5 md:w-6 md:h-6" />, label: "店舗・施設" },
              { icon: <Mountain className="w-5 h-5 md:w-6 md:h-6" />, label: "山林・竹林" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-forest/10 rounded-full flex items-center justify-center text-forest mx-auto mb-2 md:mb-3">
                  {item.icon}
                </div>
                <p className="font-medium text-foreground text-sm md:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Section */}
      <section className="py-10 md:py-20 bg-coral/5">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              放置するとこんなリスクが…
            </h2>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4 reveal">
            {[
              { title: "近隣トラブル", desc: "枝葉が隣家に侵入、落ち葉で迷惑" },
              { title: "害虫の発生", desc: "毛虫・蜂の巣など、人体への被害" },
              { title: "倒木の危険", desc: "台風・強風で倒れ、建物や人に被害" },
              { title: "景観の悪化", desc: "荒れた庭は地域の美観を損ねる" },
              { title: "防犯上の問題", desc: "空き家と見なされ、不法侵入のリスク" },
              { title: "資産価値の低下", desc: "売却時に大幅なマイナス評価" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-l-4 border-coral">
                <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="reveal mt-6 md:mt-8 text-center">
            <p className="text-base md:text-lg font-medium text-foreground">
              早めの対処で、費用も手間も最小限に
            </p>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="py-10 md:py-20 bg-background">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
              施工事例
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              ビフォー・アフター
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 md:gap-6 reveal">
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="aspect-video">
                <img src="/images/grass-cutting.jpg" alt="草刈りビフォーアフター" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg text-foreground mb-1 md:mb-2">草刈り｜桜川市 S様邸</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                  1年以上放置されていた庭の草刈り。膝丈まで伸びた雑草を機械と手作業で除去。
                </p>
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                  <span className="text-muted-foreground">作業時間: 半日</span>
                  <span className="text-muted-foreground">面積: 約50㎡</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="aspect-video">
                <img src="/images/before-after-garden.jpg" alt="庭木剪定ビフォーアフター" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4 md:p-6">
                <h3 className="font-bold text-base md:text-lg text-foreground mb-1 md:mb-2">庭木剪定｜筑西市 T様邸</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                  伸び放題だった庭木を本格剪定。樹形を整え、日当たりと風通しを改善。
                </p>
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                  <span className="text-muted-foreground">作業時間: 1日</span>
                  <span className="text-muted-foreground">本数: 8本</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 md:py-20 bg-muted">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
              <Star className="w-3 h-3 md:w-4 md:h-4" />
              お客様の声
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              ご利用いただいたお客様から
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 md:gap-6 reveal">
            {[
              {
                name: "K様（桜川市・60代）",
                service: "庭木剪定",
                comment: "LINEで写真を送っただけで、すぐに概算を教えてもらえて助かりました。当日の作業も丁寧で、仕上がりに大満足です。",
              },
              {
                name: "M様（筑西市・50代）",
                service: "草刈り・防草シート",
                comment: "空き家になった実家の庭をお願いしました。遠方に住んでいるので、写真で報告してもらえるのがありがたいです。",
              },
              {
                name: "S様（栃木市・70代）",
                service: "伐採",
                comment: "大きくなりすぎた木を3本伐採してもらいました。近所への挨拶もしてくれて、安心してお任せできました。",
              },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-1 mb-2 md:mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 md:w-4 md:h-4 fill-coral text-coral" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-foreground mb-3 md:mb-4 leading-relaxed">「{item.comment}」</p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-forest/10 rounded-full flex items-center justify-center">
                      <span className="text-forest font-bold text-sm md:text-base">{item.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs md:text-sm">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{item.service}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 bg-forest text-white">
        <div className="container">
          <div className="reveal text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
              まずはお気軽にご相談ください
            </h2>
            <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base">
              お見積もりは無料。LINEで写真を送るだけでも概算をお伝えできます。
            </p>
            
            <div className="grid gap-3 sm:grid-cols-3 md:gap-4 mb-6 md:mb-8">
              <a href={`tel:${PHONE}`} className="cta-button bg-coral text-white flex flex-col items-center gap-1 md:gap-2 py-4 md:py-6">
                <Phone className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-bold text-sm md:text-base">電話で相談</span>
                <span className="text-xs md:text-sm text-white/80">7:00〜20:00</span>
              </a>
              <a href={LINE_URL} className="cta-button bg-[#06C755] text-white flex flex-col items-center gap-1 md:gap-2 py-4 md:py-6">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-bold text-sm md:text-base">LINEで相談</span>
                <span className="text-xs md:text-sm text-white/80">写真を送るだけ</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="cta-button bg-white text-forest flex flex-col items-center gap-1 md:gap-2 py-4 md:py-6">
                <Mail className="w-6 h-6 md:w-8 md:h-8" />
                <span className="font-bold text-sm md:text-base">メールで相談</span>
                <span className="text-xs md:text-sm text-forest/70">24時間受付</span>
              </a>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 md:w-4 md:h-4" />
                見積無料
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 md:w-4 md:h-4" />
                12時間以内返信
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 md:w-4 md:h-4" />
                1本からOK
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-10 md:py-20 bg-background">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <span className="badge bg-forest/10 text-forest mb-3 md:mb-4 text-xs md:text-sm">
              FAQ
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-foreground">
              よくあるご質問
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto reveal">
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {[
                {
                  q: "見積もりは無料ですか？",
                  a: "はい、お見積もりは完全無料です。LINEで写真を送っていただければ概算をお伝えすることもできます。",
                },
                {
                  q: "1本だけでも依頼できますか？",
                  a: "もちろんです。「この木1本だけ」といった小さなご依頼も喜んでお受けします。",
                },
                {
                  q: "作業後に追加料金を請求されることはありますか？",
                  a: "お見積もり金額から追加請求することは一切ありません。追加作業が必要な場合は、必ず事前にご説明します。",
                },
                {
                  q: "切った枝や草は処分してもらえますか？",
                  a: "はい、基本的にお見積もりに処分費用を含めてご提示します。",
                },
                {
                  q: "どのくらいの期間で作業してもらえますか？",
                  a: "繁忙期を除き、お問い合わせから1〜2週間程度で作業可能です。お急ぎの場合はご相談ください。",
                },
                {
                  q: "雨の日でも作業できますか？",
                  a: "小雨程度であれば作業可能ですが、安全面を考慮し、大雨や強風の日は延期させていただく場合があります。",
                },
                {
                  q: "支払い方法は？",
                  a: "現金またはお振込みでお願いしております。作業完了後、ご確認いただいてからのお支払いとなります。",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl shadow-sm border-0 px-4 md:px-6">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4 md:py-5 text-sm md:text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 md:pb-5 text-xs md:text-sm">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-10 md:py-20 bg-muted">
        <div className="container">
          <div className="reveal text-center mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
              メールでのお問い合わせ
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              24時間受付・12時間以内に返信いたします
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto reveal">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 md:p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-12 bg-charcoal text-white">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-forest rounded-lg flex items-center justify-center">
                  <TreeDeciduous className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="font-bold text-lg md:text-xl">トトノ</span>
              </div>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                茨城県桜川市を拠点に、庭木の剪定・伐採・草刈りを承ります。
                地域密着の丁寧な対応で、お庭のお悩みを解決します。
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">事業者情報</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-white/70">
                <li>屋号：トトノ</li>
                <li>代表：棟方 信行</li>
                <li>本拠点：茨城県桜川市</li>
                <li>その他拠点：栃木県栃木市、茨城県筑西市、千葉県我孫子市</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">お問い合わせ</h3>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <li>
                  <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                    {PHONE}（7:00〜20:00）
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    {EMAIL}
                  </a>
                </li>
                <li>
                  <a href={LINE_URL} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    LINE公式アカウント
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 md:pt-8 text-center text-xs md:text-sm text-white/50">
            <p>© 2024 トトノ All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA - モバイル最適化 */}
      <div className={`floating-cta ${isFloatingCtaVisible ? "" : "hidden"}`}>
        <div className="container py-2 md:py-3">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <a href={`tel:${PHONE}`} className="flex-1 bg-coral text-white text-sm md:text-base py-3 md:py-3 px-3 md:px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md">
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              <span>電話</span>
            </a>
            <a href={LINE_URL} className="flex-1 bg-[#06C755] text-white text-sm md:text-base py-3 md:py-3 px-3 md:px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span>LINE</span>
            </a>
            <a href="#contact" className="flex-1 bg-forest text-white text-sm md:text-base py-3 md:py-3 px-3 md:px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md">
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              <span>メール</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

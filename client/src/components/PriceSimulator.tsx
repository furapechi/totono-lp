import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, TreeDeciduous, Scissors, Leaf, Phone, MessageCircle } from "lucide-react";

type ServiceType = "pruning" | "felling" | "mowing";

interface PriceRange {
  min: number;
  max: number;
}

// 料金設定
const PRICING = {
  pruning: {
    // 剪定: 木の高さと本数
    perTree: {
      low: { min: 3000, max: 5000 },      // 3m未満
      medium: { min: 5000, max: 10000 },  // 3-5m
      high: { min: 10000, max: 20000 },   // 5m以上
    },
    baseCharge: 5000, // 出張費
  },
  felling: {
    // 伐採: 木の高さと本数
    perTree: {
      low: { min: 5000, max: 10000 },     // 3m未満
      medium: { min: 10000, max: 30000 }, // 3-5m
      high: { min: 30000, max: 80000 },   // 5m以上
    },
    baseCharge: 5000,
  },
  mowing: {
    // 草刈り: 面積
    perSqm: { min: 200, max: 500 }, // 1㎡あたり
    baseCharge: 5000,
    minArea: 10, // 最小面積
  },
};

const PHONE = "090-5306-0197";
const LINE_URL = "#line";

export function PriceSimulator() {
  const [serviceType, setServiceType] = useState<ServiceType>("pruning");
  const [treeCount, setTreeCount] = useState(1);
  const [treeHeight, setTreeHeight] = useState<"low" | "medium" | "high">("low");
  const [area, setArea] = useState(30);

  const priceRange = useMemo((): PriceRange => {
    if (serviceType === "mowing") {
      const pricing = PRICING.mowing;
      const effectiveArea = Math.max(area, pricing.minArea);
      return {
        min: pricing.baseCharge + effectiveArea * pricing.perSqm.min,
        max: pricing.baseCharge + effectiveArea * pricing.perSqm.max,
      };
    }

    const pricing = PRICING[serviceType];
    const perTreePrice = pricing.perTree[treeHeight];
    return {
      min: pricing.baseCharge + treeCount * perTreePrice.min,
      max: pricing.baseCharge + treeCount * perTreePrice.max,
    };
  }, [serviceType, treeCount, treeHeight, area]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("ja-JP");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Calculator className="w-6 h-6" />
          概算料金シミュレーター
        </CardTitle>
        <p className="text-green-100 text-sm mt-1">
          ※実際の料金は現地確認後にお見積りいたします
        </p>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        {/* サービス選択 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-gray-800">
            サービスを選択
          </Label>
          <RadioGroup
            value={serviceType}
            onValueChange={(v) => setServiceType(v as ServiceType)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <Label
              htmlFor="pruning"
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                serviceType === "pruning"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <RadioGroupItem value="pruning" id="pruning" className="sr-only" />
              <Scissors className="w-5 h-5 text-green-600" />
              <span className="font-medium">剪定</span>
            </Label>
            <Label
              htmlFor="felling"
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                serviceType === "felling"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <RadioGroupItem value="felling" id="felling" className="sr-only" />
              <TreeDeciduous className="w-5 h-5 text-green-600" />
              <span className="font-medium">伐採</span>
            </Label>
            <Label
              htmlFor="mowing"
              className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                serviceType === "mowing"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <RadioGroupItem value="mowing" id="mowing" className="sr-only" />
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-medium">草刈り</span>
            </Label>
          </RadioGroup>
        </div>

        {/* 剪定・伐採の場合 */}
        {(serviceType === "pruning" || serviceType === "felling") && (
          <>
            {/* 木の高さ */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-800">
                木の高さ
              </Label>
              <RadioGroup
                value={treeHeight}
                onValueChange={(v) => setTreeHeight(v as "low" | "medium" | "high")}
                className="grid grid-cols-3 gap-3"
              >
                <Label
                  htmlFor="height-low"
                  className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    treeHeight === "low"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <RadioGroupItem value="low" id="height-low" className="sr-only" />
                  <span className="text-2xl mb-1">🌱</span>
                  <span className="font-medium text-sm">3m未満</span>
                </Label>
                <Label
                  htmlFor="height-medium"
                  className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    treeHeight === "medium"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <RadioGroupItem value="medium" id="height-medium" className="sr-only" />
                  <span className="text-2xl mb-1">🌳</span>
                  <span className="font-medium text-sm">3〜5m</span>
                </Label>
                <Label
                  htmlFor="height-high"
                  className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    treeHeight === "high"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <RadioGroupItem value="high" id="height-high" className="sr-only" />
                  <span className="text-2xl mb-1">🌲</span>
                  <span className="font-medium text-sm">5m以上</span>
                </Label>
              </RadioGroup>
            </div>

            {/* 本数 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold text-gray-800">
                  本数
                </Label>
                <span className="text-2xl font-bold text-green-700">{treeCount}本</span>
              </div>
              <Slider
                value={[treeCount]}
                onValueChange={(v) => setTreeCount(v[0])}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1本</span>
                <span>20本</span>
              </div>
            </div>
          </>
        )}

        {/* 草刈りの場合 */}
        {serviceType === "mowing" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold text-gray-800">
                面積
              </Label>
              <span className="text-2xl font-bold text-green-700">{area}㎡</span>
            </div>
            <Slider
              value={[area]}
              onValueChange={(v) => setArea(v[0])}
              min={10}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10㎡</span>
              <span>500㎡</span>
            </div>
            <p className="text-xs text-gray-500">
              ※1坪 ≒ 3.3㎡、10坪 ≒ 33㎡
            </p>
          </div>
        )}

        {/* 概算結果 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 md:p-6 border border-orange-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">概算料金（税込）</p>
            <div className="text-3xl md:text-4xl font-bold text-orange-600">
              ¥{formatPrice(priceRange.min)} 〜 ¥{formatPrice(priceRange.max)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ※出張費 ¥5,000 込み / 処分費別途
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-600">
            正確なお見積りは無料です！お気軽にご相談ください
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white h-12"
            >
              <a href={`tel:${PHONE}`}>
                <Phone className="w-4 h-4 mr-2" />
                電話で相談
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50 h-12"
            >
              <a href={LINE_URL}>
                <MessageCircle className="w-4 h-4 mr-2" />
                LINEで相談
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

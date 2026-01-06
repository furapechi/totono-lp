/**
 * LazyImage - 遅延読み込み対応の画像コンポーネント
 * 
 * 機能:
 * - Intersection Observer APIによる遅延読み込み
 * - WebP形式の自動検出とフォールバック
 * - プレースホルダー表示（ぼかし効果）
 * - フェードインアニメーション
 * - ネイティブlazy loading属性のフォールバック
 */

import { useState, useRef, useEffect } from "react";

// JPG/PNG画像のパスからWebPパスを生成
function getWebPPath(src: string): string | null {
  if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
    return src.replace(/\.jpe?g$/, '.webp');
  }
  if (src.endsWith('.png')) {
    return src.replace(/\.png$/, '.webp');
  }
  return null;
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  src,
  alt,
  className = "",
  placeholderColor = "#e5e7eb",
  threshold = 0.1,
  rootMargin = "50px",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const webpSrc = getWebPPath(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor }}
    >
      {/* プレースホルダー */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      )}
      
      {/* エラー時のフォールバック */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">画像を読み込めません</span>
        </div>
      )}
      
      {/* 実際の画像 - WebP対応 */}
      {isInView && !hasError && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      )}
    </div>
  );
}

/**
 * OptimizedImage - 最適化された画像コンポーネント
 * 
 * 機能:
 * - レスポンシブ画像（srcset対応準備）
 * - WebP形式の自動検出とフォールバック
 * - 遅延読み込み
 * - アスペクト比の維持
 */
interface OptimizedImageProps {
  src: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  mobileSrc,
  alt,
  className = "",
  aspectRatio,
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const webpSrc = getWebPPath(src);
  const mobileWebpSrc = mobileSrc ? getWebPPath(mobileSrc) : null;

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* ローディングプレースホルダー */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
      )}

      {/* エラー時のフォールバック */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">画像を読み込めません</span>
        </div>
      )}

      {isInView && !hasError && (
        <picture>
          {/* モバイル用WebP */}
          {mobileWebpSrc && (
            <source 
              media="(max-width: 767px)" 
              srcSet={mobileWebpSrc} 
              type="image/webp" 
            />
          )}
          {/* モバイル用フォールバック */}
          {mobileSrc && (
            <source media="(max-width: 767px)" srcSet={mobileSrc} />
          )}
          {/* デスクトップ用WebP */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          {/* デスクトップ用フォールバック */}
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </picture>
      )}
    </div>
  );
}

export default LazyImage;

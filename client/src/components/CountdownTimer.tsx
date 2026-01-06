import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function calculateTimeLeft(endDate: Date): TimeLeft {
  const now = new Date();
  const difference = endDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface CountdownTimerProps {
  className?: string;
  variant?: "banner" | "inline";
}

export function CountdownTimer({ className = "", variant = "banner" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(getEndOfMonth()));
  const [endDate] = useState(() => getEndOfMonth());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className={`${variant === "banner" ? "bg-white/20 text-white" : "bg-green-100 text-green-800"} rounded-lg px-2 py-1 min-w-[40px] md:min-w-[50px]`}>
        <span className="text-lg md:text-2xl font-bold font-mono">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`text-[10px] md:text-xs mt-1 ${variant === "banner" ? "text-white/80" : "text-gray-600"}`}>
        {label}
      </span>
    </div>
  );

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">
          残り
        </span>
        <div className="flex items-center gap-1">
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
            {timeLeft.days}日
          </span>
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
            {timeLeft.hours}時間
          </span>
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
            {timeLeft.minutes}分
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-500 py-3 px-4 ${className}`}>
      <div className="container flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          <span className="font-bold text-sm md:text-base">今月限定キャンペーン終了まで</span>
        </div>
        <div className="flex items-center gap-2">
          <TimeBlock value={timeLeft.days} label="日" />
          <span className="text-white text-xl font-bold">:</span>
          <TimeBlock value={timeLeft.hours} label="時間" />
          <span className="text-white text-xl font-bold">:</span>
          <TimeBlock value={timeLeft.minutes} label="分" />
          <span className="text-white text-xl font-bold">:</span>
          <TimeBlock value={timeLeft.seconds} label="秒" />
        </div>
      </div>
    </div>
  );
}

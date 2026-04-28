"use client";

import { useEffect, useState } from "react";

type NumberTickerProps = {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

export default function NumberTicker({
  value,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = "",
}: NumberTickerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <h2 className={`text-4xl font-bold ${className}`}>
      {prefix}
      {count}
      {suffix}
    </h2>
  );
}

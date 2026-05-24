"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  /** Suffix appended after the number (e.g. "+", "%") */
  suffix?: string;
  /** Duration of count animation in ms */
  duration?: number;
  /** Format the number (defaults to integer) */
  format?: (n: number) => string;
  className?: string;
};

export function Counter({
  to,
  suffix = "",
  duration = 1400,
  format = (n) => Math.round(n).toString(),
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setValue(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
      {suffix}
    </span>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Pixels of translateY before reveal */
  y?: number;
  /** Delay in ms */
  delay?: number;
  /** Transition duration in ms */
  duration?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Reveal only the first time it enters */
  once?: boolean;
};

export function Reveal({
  children,
  y = 24,
  delay = 0,
  duration = 700,
  as: As = "div",
  className = "",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Comp = As as keyof React.JSX.IntrinsicElements;
  return (
    // @ts-expect-error generic element ref
    <Comp
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Comp>
  );
}

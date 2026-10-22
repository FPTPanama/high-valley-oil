"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function AccentRule() {
  const rule = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const motion = gsap.matchMedia();

    motion.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(rule.current, { scaleX: 1 });
    });

    motion.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(rule.current, {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });

  return (
    <div
      ref={rule}
      className="h-0.5 origin-left scale-x-0 bg-accent"
      aria-hidden="true"
    />
  );
}

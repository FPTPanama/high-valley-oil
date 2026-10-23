"use client";

import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const DESKTOP_SMOOTH =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const motion = gsap.matchMedia();

    motion.add(DESKTOP_SMOOTH, () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.1,
        effects: true,
        // Never smooth on touch — Chrome/iOS gesture conflicts.
        smoothTouch: false,
      });

      return () => {
        smoother.kill();
      };
    });

    return () => {
      motion.revert();
    };
  });

  return (
    <div id="smooth-wrapper" className="relative z-0">
      <div id="smooth-content" className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { contentFrame } from "@/components/general-layout";
import {
  SiteHeaderNav,
  type SiteHeaderNavProps,
} from "@/components/site-header-nav";

gsap.registerPlugin(useGSAP);

const SCROLL_THRESHOLD = 24;

export function SiteHeaderBar(props: SiteHeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useGSAP(
    () => {
      const panel = surface.current;
      if (!panel) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(panel, {
        scaleX: scrolled ? 1 : 0,
        duration: prefersReduced ? 0 : 0.55,
        ease: scrolled ? "power2.out" : "power2.inOut",
        overwrite: "auto",
      });
    },
    { dependencies: [scrolled] },
  );

  useEffect(() => {
    window.dispatchEvent(new Event("header-surface"));
  }, [scrolled]);

  return (
    <header className="sticky top-0 z-40 pt-25">
      <div className={contentFrame}>
        <div className="relative overflow-hidden">
          <div
            ref={surface}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-canvas"
          />
          <div className="relative px-4 py-4 sm:px-6">
            <SiteHeaderNav {...props} />
          </div>
        </div>
      </div>
    </header>
  );
}

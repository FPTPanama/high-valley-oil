"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { contentFrame, contentInset } from "@/components/general-layout";
import {
  SiteHeaderNav,
  type SiteHeaderNavProps,
} from "@/components/site-header-nav";

gsap.registerPlugin(useGSAP);

const SCROLL_THRESHOLD = 24;

export function SiteHeaderBar(props: SiteHeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);

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
      const rootEl = root.current;
      if (!rootEl) return;

      const panels = gsap.utils.toArray<HTMLElement>(
        "[data-header-surface]",
        rootEl,
      );
      if (panels.length === 0) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(panels, {
        scaleX: scrolled ? 1 : 0,
        duration: prefersReduced ? 0 : 0.55,
        ease: scrolled ? "power2.out" : "power2.inOut",
        overwrite: "auto",
      });
    },
    { scope: root, dependencies: [scrolled] },
  );

  useEffect(() => {
    window.dispatchEvent(new Event("header-surface"));
  }, [scrolled]);

  return (
    // Mobile: flush to the top so scroll content cannot peek above the bar.
    // Desktop keeps the floating offset (`md:pt-25`).
    <header ref={root} className="fixed inset-x-0 top-0 z-50 pt-0 md:pt-25">
      {/* Mobile full-bleed canvas — covers the whole strip edge-to-edge. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden">
        <div
          data-header-surface
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-canvas"
        />
      </div>
      <div className={contentFrame}>
        <div className={`relative ${contentInset}`}>
          {/* Desktop fill stays inside the content inset (floating bar). */}
          <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
            <div
              data-header-surface
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-canvas"
            />
          </div>
          <div className="relative py-4">
            <SiteHeaderNav {...props} scrolled={scrolled} />
          </div>
        </div>
      </div>
    </header>
  );
}

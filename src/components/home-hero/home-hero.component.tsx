"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentFrame,
  contentInset,
  sectionShell,
} from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HomeHeroProps = {
  title: string[];
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

const HERO_VIDEO_SRC = "/media/oil_and_gas.webm";

export function HomeHero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: HomeHeroProps) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);
  const bottom = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const topEl = top.current;
      const rightEl = right.current;
      const bottomEl = bottom.current;
      const leftEl = left.current;
      const sectionEl = section.current;
      if (!topEl || !rightEl || !bottomEl || !leftEl || !sectionEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(topEl, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(rightEl, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(bottomEl, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(leftEl, { scaleY: 0, transformOrigin: "bottom center" });

      if (prefersReduced) {
        gsap.set([topEl, bottomEl], { scaleX: 1 });
        gsap.set([rightEl, leftEl], { scaleY: 1 });
        return;
      }

      const edgeDuration = 0.22;

      const setDrawOrigins = () => {
        gsap.set(topEl, { transformOrigin: "left center" });
        gsap.set(rightEl, { transformOrigin: "top center" });
        gsap.set(bottomEl, { transformOrigin: "right center" });
        gsap.set(leftEl, { transformOrigin: "bottom center" });
      };

      const setUndrawOrigins = () => {
        // Collapse toward the next corner so the wipe reads top → right → …
        gsap.set(topEl, { transformOrigin: "right center" });
        gsap.set(rightEl, { transformOrigin: "bottom center" });
        gsap.set(bottomEl, { transformOrigin: "left center" });
        gsap.set(leftEl, { transformOrigin: "top center" });
      };

      setDrawOrigins();

      const intro = gsap.timeline({ delay: 0.35 });
      intro
        .to(topEl, { scaleX: 1, duration: edgeDuration, ease: "none" })
        .to(rightEl, { scaleY: 1, duration: edgeDuration, ease: "none" })
        .to(bottomEl, { scaleX: 1, duration: edgeDuration, ease: "none" })
        .to(leftEl, { scaleY: 1, duration: edgeDuration, ease: "none" });

      // Top → right → bottom → left (auto timeline, not scrubbed).
      const undraw = gsap.timeline({
        paused: true,
        onReverseComplete: setDrawOrigins,
      });
      undraw
        .to(topEl, { scaleX: 0, duration: edgeDuration, ease: "none" })
        .to(rightEl, { scaleY: 0, duration: edgeDuration, ease: "none" })
        .to(bottomEl, { scaleX: 0, duration: edgeDuration, ease: "none" })
        .to(leftEl, { scaleY: 0, duration: edgeDuration, ease: "none" });

      let trigger: ScrollTrigger | undefined;

      intro.eventCallback("onComplete", () => {
        trigger = ScrollTrigger.create({
          trigger: sectionEl,
          // Fire once ~20% of the hero has scrolled past the top.
          start: "20% top",
          onEnter: () => {
            setUndrawOrigins();
            undraw.play();
          },
          onLeaveBack: () => {
            undraw.reverse();
          },
        });
      });

      return () => {
        intro.kill();
        trigger?.kill();
        undraw.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label={title.join(" ")}
      className={`${sectionShell} overflow-hidden bg-canvas`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {/* Grayscale + ink color blend → luminance kept, hue from brand ink */}
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 size-full object-cover grayscale contrast-[1.05]"
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-ink mix-blend-color" />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-canvas/70 via-canvas/55 to-canvas" />
      </div>

      <div
        ref={frame}
        className={`${contentFrame} relative z-10 mt-40 sm:mt-48`}
      >
        <span
          ref={top}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-0.5 w-full bg-ink will-change-transform"
        />
        <span
          ref={right}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-0.5 bg-ink will-change-transform"
        />
        <span
          ref={bottom}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full bg-ink will-change-transform"
        />
        <span
          ref={left}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-full w-0.5 bg-ink will-change-transform"
        />

        <div
          className={`${contentInset} flex min-h-[min(28rem,58dvh)] flex-col justify-center py-10 sm:min-h-[min(32rem,60dvh)] sm:py-12`}
        >
          <h1 className="max-w-3xl text-4xl font-light tracking-[0.04em] text-balance text-ink sm:text-5xl lg:text-6xl">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed tracking-[0.02em] text-ink sm:text-xl">
            {subtitle}
          </p>

          <div className="mt-10">
            <SiteButton href={ctaHref}>{ctaLabel}</SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

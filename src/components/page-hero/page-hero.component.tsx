"use client";

import { useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentFrame,
  contentInset,
  sectionShell,
} from "@/components/general-layout";
import {
  HeroMediaReveal,
  HeroRevealImage,
} from "@/components/hero-media-reveal";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const target = document.getElementById(id);
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    // Offset for the fixed header so the section lands below the bar.
    smoother.scrollTo(target, true, "top 120px");
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.history.pushState(null, "", `#${id}`);
}

export type PageHeroProps = {
  eyebrow: string;
  title: string[];
  subtitle?: string | string[];
  /** Optional full-bleed background image (same wash language as the home video). */
  backgroundSrc?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundSrc,
  ctaLabel,
  ctaHref,
}: PageHeroProps) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);
  const bottom = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const backgroundParallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const topEl = top.current;
      const rightEl = right.current;
      const bottomEl = bottom.current;
      const leftEl = left.current;
      const sectionEl = section.current;
      const backgroundEl = backgroundParallax.current;
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
        if (backgroundEl) gsap.set(backgroundEl, { clearProps: "transform" });
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
      let parallaxTween: gsap.core.Tween | undefined;

      intro.eventCallback("onComplete", () => {
        trigger = ScrollTrigger.create({
          trigger: sectionEl,
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

      if (backgroundEl) {
        // Start at 0 so the first scrub tick does not jump from CSS layout.
        gsap.set(backgroundEl, { yPercent: 0 });
        parallaxTween = gsap.to(backgroundEl, {
          yPercent: 28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      return () => {
        intro.kill();
        trigger?.kill();
        undraw.kill();
        parallaxTween?.scrollTrigger?.kill();
        parallaxTween?.kill();
      };
    },
    { scope: section, dependencies: [backgroundSrc] },
  );

  return (
    <section
      ref={section}
      aria-label={title.join(" ")}
      className={`${sectionShell} overflow-hidden bg-canvas`}
    >
      {backgroundSrc ? (
        <div
          className="absolute inset-0 overflow-hidden isolate"
          aria-hidden="true"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              ref={backgroundParallax}
              className="absolute inset-x-0 top-0 h-[max(56.25vw,72%)] w-full will-change-transform"
            >
              <HeroMediaReveal>
                <HeroRevealImage
                  src={backgroundSrc}
                  alt=""
                  fill
                  priority
                  quality={90}
                  sizes="100vw"
                  className="object-cover object-center grayscale brightness-[0.62] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-ink mix-blend-color" />
              </HeroMediaReveal>
            </div>
          </div>
          <div className="absolute inset-x-0 top-0 z-10 h-[32%] bg-linear-to-b from-ink from-10% via-ink/55 via-55% to-transparent to-100%" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-[40%] bg-linear-to-t from-canvas from-35% via-canvas/70 via-60% to-transparent to-100%" />
          {/* Overhang seal: covers subpixel gaps / blend edges at the section join. */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-5 bg-canvas" />
        </div>
      ) : null}

      <div
        ref={frame}
        className={`${contentFrame} relative z-10 mt-40 sm:mt-48`}
      >
        <span
          ref={top}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-0.5 w-full will-change-transform ${backgroundSrc ? "bg-accent" : "bg-ink"}`}
        />
        <span
          ref={right}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 right-0 h-full w-0.5 will-change-transform ${backgroundSrc ? "bg-accent" : "bg-ink"}`}
        />
        <span
          ref={bottom}
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 left-0 h-0.5 w-full will-change-transform ${backgroundSrc ? "bg-accent" : "bg-ink"}`}
        />
        <span
          ref={left}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 left-0 h-full w-0.5 will-change-transform ${backgroundSrc ? "bg-accent" : "bg-ink"}`}
        />

        <div
          className={`${contentInset} flex min-h-[min(28rem,58dvh)] flex-col justify-center py-10 sm:min-h-[min(32rem,60dvh)] sm:py-12`}
        >
          <p
            className={`mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] ${backgroundSrc ? "text-canvas" : "text-ink"}`}
          >
            {eyebrow}
          </p>

          <h1
            className={`max-w-3xl font-light tracking-[0.04em] text-balance ${backgroundSrc ? "text-5xl text-canvas sm:text-6xl lg:text-7xl" : "text-4xl text-ink sm:text-5xl lg:text-6xl"}`}
          >
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {subtitle ? (
            <div
              className={`mt-6 flex max-w-xl flex-col gap-1 text-lg leading-relaxed tracking-[0.02em] sm:text-xl ${backgroundSrc ? "font-black text-canvas" : "font-normal text-ink"}`}
            >
              {(Array.isArray(subtitle) ? subtitle : [subtitle]).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : null}

          {ctaLabel && ctaHref ? (
            <div className="mt-10">
              <SiteButton
                href={ctaHref}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  if (!ctaHref.startsWith("#")) return;
                  event.preventDefault();
                  scrollToHash(ctaHref);
                }}
              >
                {ctaLabel}
              </SiteButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

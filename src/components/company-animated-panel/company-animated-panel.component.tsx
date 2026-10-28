"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CompanyAnimatedPanelProps = {
  index: string;
  eyebrow: string;
  title: string[];
  lead: string;
  headingId?: string;
};

const TOPO_SRC = "/images/topografic_lines_01.svg";

export function CompanyAnimatedPanel({
  index,
  eyebrow,
  title,
  lead,
  headingId = "company-panel-heading",
}: CompanyAnimatedPanelProps) {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      const panelEl = panel.current;
      const rightEl = rightCol.current;
      const parallaxEl = parallax.current;
      if (!sectionEl || !panelEl) return;

      const revealEls = gsap.utils.toArray<HTMLElement>(
        "[data-company-reveal]",
        sectionEl,
      );

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set(panelEl, { clearProps: "transform" });
        gsap.set([parallaxEl, ...revealEls].filter(Boolean), {
          clearProps: "opacity,transform",
        });
        return;
      }

      gsap.set(panelEl, { scaleX: 0.012, transformOrigin: "50% 50%" });
      if (parallaxEl) gsap.set(parallaxEl, { opacity: 0 });
      gsap.set(revealEls, { opacity: 0, x: -28 });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "top 40%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      intro.to(panelEl, {
        scaleX: 1,
        duration: 2.4,
        ease: "none",
      });

      if (parallaxEl) {
        intro.to(
          parallaxEl,
          {
            opacity: 1,
            duration: 0.85,
            ease: "none",
          },
          "-=0.05",
        );
      }

      intro.to(
        revealEls,
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "none",
          stagger: 0.12,
        },
        "-=0.55",
      );

      let parallaxTween: gsap.core.Tween | undefined;
      if (parallaxEl && rightEl) {
        parallaxTween = gsap.fromTo(
          parallaxEl,
          { yPercent: -32 },
          {
            yPercent: 32,
            ease: "none",
            scrollTrigger: {
              trigger: rightEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      return () => {
        intro.scrollTrigger?.kill();
        intro.kill();
        parallaxTween?.scrollTrigger?.kill();
        parallaxTween?.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby={headingId}
      className="relative w-full"
    >
      <div
        ref={panel}
        className={`${contentFrame} origin-center overflow-hidden will-change-transform`}
      >
        <div className="grid gap-0 lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-w-0 flex-col items-center justify-center bg-ink px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div
              data-company-reveal
              className="flex w-2/3 max-w-xl flex-col gap-6 text-left text-canvas will-change-[opacity,transform]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                <span className="text-accent">{index}</span>
                <span className="mx-2 text-canvas/40" aria-hidden="true">
                  /
                </span>
                {eyebrow}
              </p>

              <h2
                id={headingId}
                className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
              >
                {title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          <div
            ref={rightCol}
            className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-canvas px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
          >
            <div
              ref={parallax}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[-45%] z-0 h-[190%] w-full scale-110 will-change-[opacity,transform]"
            >
              <Image
                src={TOPO_SRC}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <p
              data-company-reveal
              className="relative z-10 text-xl font-normal leading-snug tracking-[0.02em] text-ink will-change-[opacity,transform] sm:text-2xl"
            >
              <span className="box-decoration-clone bg-canvas px-[0.4em] py-[0.12em] shadow-[0.4em_0_0_var(--canvas),-0.4em_0_0_var(--canvas)]">
                {lead}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

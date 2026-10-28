"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HomeApproachStep = {
  index: string;
  title: string;
  body: string;
};

export type HomeApproachSectionProps = {
  index: string;
  eyebrow: string;
  title: string;
  steps: HomeApproachStep[];
};

const TOPO_SRC = "/images/topografic_lines_canvas.svg";

export function HomeApproachSection({
  index,
  eyebrow,
  title,
  steps,
}: HomeApproachSectionProps) {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panelEl = panel.current;
      const parallaxEl = parallax.current;
      if (!panelEl || !parallaxEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set(parallaxEl, { clearProps: "transform" });
        return;
      }

      const tween = gsap.fromTo(
        parallaxEl,
        { yPercent: -32 },
        {
          yPercent: 32,
          ease: "none",
          scrollTrigger: {
            trigger: panelEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="home-approach-heading"
      className="relative mt-28 w-full sm:mt-36 lg:mt-44"
    >
      <div
        ref={panel}
        className={`${contentFrame} relative overflow-hidden bg-accent text-canvas`}
      >
        <div
          ref={parallax}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-45%] z-0 h-[190%] w-full scale-110 will-change-transform"
        >
          <Image
            src={TOPO_SRC}
            alt=""
            fill
            sizes="(min-width: 1024px) 72rem, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-10 p-4 sm:gap-12 sm:p-6 lg:gap-14 lg:p-8">
          <header className="flex max-w-xl flex-col gap-5 bg-accent p-4 sm:gap-6 sm:p-6 lg:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              <span className="text-canvas">{index}</span>
              <span className="mx-2 text-canvas/40" aria-hidden="true">
                /
              </span>
              {eyebrow}
            </p>
            <h2
              id="home-approach-heading"
              className="text-3xl font-light leading-snug tracking-[0.04em] text-balance uppercase sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.25]"
            >
              {title}
            </h2>
          </header>

          <ol className="grid gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <li
                key={step.index}
                className="flex flex-col gap-4 bg-accent p-4 sm:p-6 lg:p-8"
              >
                <span className="text-[11px] font-semibold tracking-[0.18em] text-canvas">
                  {step.index}
                  <span aria-hidden="true"> —</span>
                </span>
                <h3 className="text-xl font-light leading-snug tracking-[0.04em] text-balance uppercase sm:text-2xl sm:leading-snug">
                  {step.title}
                </h3>
                <p className="text-base font-light leading-relaxed tracking-[0.02em] text-canvas/80 sm:text-lg">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

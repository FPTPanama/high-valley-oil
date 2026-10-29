"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame, contentInset } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IMAGE_SRC = "/images/high_valley_operador.webp";
const TOPO_SRC = "/images/topografic_lines_accent.svg";
/** Intrinsic pixel size of the asset (keeps Next/Image aspect correct). */
const IMAGE_WIDTH = 603;
const IMAGE_HEIGHT = 537;
const IMAGE_MAX_VIEWPORT_WIDTH = "45vw";
/** Ink band height — independent from the operator width. */
const INK_HEIGHT = "52dvh";

const IMAGE_WIDTH_EXPR = IMAGE_MAX_VIEWPORT_WIDTH;

export type CompanyPageIntroProps = {
  title: string;
};

export function CompanyPageIntro({ title }: CompanyPageIntroProps) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const operatorParallax = useRef<HTMLDivElement>(null);
  const topoParallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const operatorEl = operatorParallax.current;
      const topoEl = topoParallax.current;
      if (!stageEl || !operatorEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set([operatorEl, topoEl].filter(Boolean), {
          clearProps: "transform",
        });
        return;
      }

      const sharedTrigger = {
        trigger: stageEl,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      } as const;

      const operatorTween = gsap.fromTo(
        operatorEl,
        { yPercent: -8 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: sharedTrigger,
        },
      );

      let topoTween: gsap.core.Tween | undefined;
      if (topoEl) {
        topoTween = gsap.fromTo(
          topoEl,
          { yPercent: -32 },
          {
            yPercent: 32,
            ease: "none",
            scrollTrigger: { ...sharedTrigger },
          },
        );
      }

      return () => {
        operatorTween.scrollTrigger?.kill();
        operatorTween.kill();
        topoTween?.scrollTrigger?.kill();
        topoTween?.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="company-intro-heading"
      className="relative mt-16 w-full sm:mt-20 lg:mt-24"
    >
      <div className={contentFrame}>
        {/* No overflow-hidden here: operator may protrude past the ink band. */}
        <div
          ref={stage}
          className="relative bg-ink"
          style={{ height: INK_HEIGHT }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <div
              ref={topoParallax}
              className="absolute inset-x-0 top-[-40%] h-[180%] w-full will-change-transform"
            >
              <Image
                src={TOPO_SRC}
                alt=""
                fill
                sizes="(min-width: 1024px) 72rem, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <svg aria-hidden="true" className="absolute h-0 w-0">
            <defs>
              {/* Ink duotone: keeps alpha; maps black→ink, white→canvas. */}
              <filter
                id="company-operator-ink"
                colorInterpolationFilters="sRGB"
              >
                <feColorMatrix
                  type="matrix"
                  values="0.2126 0.7152 0.0722 0 0
                          0.2126 0.7152 0.0722 0 0
                          0.2126 0.7152 0.0722 0 0
                          0      0      0      1 0"
                  result="gray"
                />
                <feComponentTransfer in="gray">
                  <feFuncR type="table" tableValues="0.090 0.953" />
                  <feFuncG type="table" tableValues="0.169 0.953" />
                  <feFuncB type="table" tableValues="0.176 0.953" />
                  <feFuncA type="identity" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>

          <div className="absolute top-1/2 left-1/2 z-[1] w-fit -translate-x-1/2 -translate-y-1/2">
            <div
              ref={operatorParallax}
              className="relative will-change-transform"
            >
              <Image
                src={IMAGE_SRC}
                alt=""
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                sizes={IMAGE_MAX_VIEWPORT_WIDTH}
                className="h-auto max-w-none [filter:url(#company-operator-ink)]"
                style={{ width: IMAGE_WIDTH_EXPR }}
                priority
              />
            </div>
          </div>

          <div
            className={`${contentInset} pointer-events-none absolute inset-0 z-10 flex items-center justify-center`}
          >
            <h2
              id="company-intro-heading"
              className="w-full text-center text-5xl font-light tracking-[0.04em] text-balance text-canvas uppercase sm:text-6xl lg:text-7xl"
            >
              {title}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURE_IMAGE_SRC = "/images/empresa_01.webp";

export type CompanyPageFeatureProps = {
  title: string;
  body: string;
  caption: string;
  action: string;
  href: string;
};

export function CompanyPageFeature({
  title,
  body,
  caption,
  action,
  href,
}: CompanyPageFeatureProps) {
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
        { yPercent: -12 },
        {
          yPercent: 12,
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
    { scope: panel },
  );

  return (
    <section
      className="relative mt-10 w-full sm:mt-12 lg:mt-14"
      aria-labelledby="company-feature-heading"
    >
      <div
        ref={panel}
        className={`${contentFrame} flex flex-col gap-4 sm:gap-5`}
      >
        <Link
          href={href}
          className="group relative flex min-h-[min(70vh,36rem)] items-end justify-start overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-[min(75vh,42rem)]"
        >
          <div
            ref={parallax}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[-28%] z-0 h-[156%] w-full will-change-transform"
          >
            <Image
              src={FEATURE_IMAGE_SRC}
              alt=""
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative z-10 m-6 flex aspect-square w-1/4 min-w-[10.5rem] flex-col justify-between gap-3 bg-ink p-4 text-canvas sm:m-8 sm:p-5 lg:m-10 lg:p-6">
            <div className="flex w-full flex-col gap-3">
              <h3
                id="company-feature-heading"
                className="w-full text-sm font-light tracking-[0.04em] uppercase sm:text-base lg:text-lg"
              >
                {title}
              </h3>
              <p className="w-full text-xs font-light leading-snug tracking-[0.02em] text-canvas/80 sm:text-sm">
                {body}
              </p>
            </div>
            <span className="flex w-full items-center justify-between gap-2 text-[11px] font-medium tracking-wide uppercase sm:text-[12px]">
              {action}
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-4"
                strokeWidth={1.75}
              />
            </span>
          </div>
        </Link>
        <p className="ml-auto flex max-w-3xl items-start gap-2.5 text-left text-[11px] font-semibold tracking-[0.2em] text-ink/55 uppercase">
          <Wrench
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-ink"
            strokeWidth={1.75}
          />
          <span>{caption}</span>
        </p>
      </div>
    </section>
  );
}

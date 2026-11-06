"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentColumn } from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURE_IMAGE_SRC = "/images/empresa_01.webp";
const FEATURE_IMAGE_WIDTH = 5525;
const FEATURE_IMAGE_HEIGHT = 3108;

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
      const desktop = window.matchMedia("(min-width: 640px)").matches;

      if (prefersReduced || !desktop) {
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
      className="relative mt-16 w-full sm:mt-20 lg:mt-24"
      aria-labelledby="company-feature-heading"
    >
      <div
        ref={panel}
        className={`${contentColumn} flex flex-col gap-4 sm:gap-5`}
      >
        {/* Mobile: real title above the image (no ink card). */}
        <header className="flex flex-col gap-3 sm:hidden">
          <h2
            id="company-feature-heading"
            className="text-3xl font-light tracking-[0.04em] text-balance text-ink uppercase"
          >
            {title}
          </h2>
          <p className="text-sm font-light leading-relaxed tracking-[0.02em] text-ink/80">
            {body}
          </p>
        </header>

        <Image
          src={FEATURE_IMAGE_SRC}
          alt=""
          width={FEATURE_IMAGE_WIDTH}
          height={FEATURE_IMAGE_HEIGHT}
          sizes="100vw"
          className="h-auto w-full object-contain sm:hidden"
        />

        <p className="flex max-w-3xl items-start gap-2.5 text-left text-[11px] font-semibold tracking-[0.2em] text-ink/55 uppercase sm:hidden">
          <Wrench
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-ink"
            strokeWidth={1.75}
          />
          <span>{caption}</span>
        </p>

        <div className="w-full sm:hidden">
          <SiteButton href={href} tone="ink" layout="spread">
            {title}
          </SiteButton>
        </div>

        {/* Desktop: cover image + overlay card. */}
        <Link
          href={href}
          className="group relative hidden min-h-[min(75vh,42rem)] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:block"
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
          <div className="relative z-10 m-8 flex aspect-square w-1/4 min-w-[10.5rem] flex-col justify-between gap-3 bg-ink p-5 text-canvas lg:m-10 lg:p-6">
            <div className="flex w-full flex-col gap-3">
              <h3
                id="company-feature-heading-desktop"
                className="w-full text-base font-light tracking-[0.04em] uppercase lg:text-lg"
              >
                {title}
              </h3>
              <p className="w-full text-sm font-light leading-snug tracking-[0.02em] text-canvas/80">
                {body}
              </p>
            </div>
            <span className="flex w-full items-center justify-between gap-2 text-[12px] font-medium tracking-wide uppercase">
              {action}
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </span>
          </div>
        </Link>

        <p className="ml-auto hidden max-w-3xl items-start gap-2.5 text-left text-[11px] font-semibold tracking-[0.2em] text-ink/55 uppercase sm:flex">
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

"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CompanyPagePrinciple = {
  index: string;
  title: string;
  cta: string;
};

export type CompanyPagePrinciplesProps = {
  index: string;
  eyebrow: string;
  title: string;
  items: CompanyPagePrinciple[];
  ctaHref: string;
};

const TOPO_SRC = "/images/topografic_lines_01.svg";

export function CompanyPagePrinciples({
  index,
  eyebrow,
  title,
  items,
  ctaHref,
}: CompanyPagePrinciplesProps) {
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
        { yPercent: -14 },
        {
          yPercent: 14,
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
      aria-labelledby="company-principles-heading"
      className="relative z-30 mt-10 w-full sm:mt-12 lg:mt-14"
    >
      <div
        className={`${contentFrame} bg-canvas shadow-[0_-28px_56px_-18px_rgb(23_43_45_/_0.08),0_-8px_20px_-10px_rgb(23_43_45_/_0.04)]`}
      >
        <div ref={panel} className="relative overflow-hidden text-ink">
          <div
            ref={parallax}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[-12%] z-0 h-[124%] w-full will-change-transform"
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
            <header className="flex max-w-xl flex-col gap-5 bg-canvas p-4 sm:gap-6 sm:p-6 lg:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                <span>{index}</span>
                <span className="mx-2 text-ink/40" aria-hidden="true">
                  /
                </span>
                {eyebrow}
              </p>
              <h2
                id="company-principles-heading"
                className="text-3xl font-light leading-snug tracking-[0.04em] text-balance uppercase sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.25]"
              >
                {title}
              </h2>
            </header>

            <ol className="grid gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {items.map((item) => (
                <li
                  key={item.index}
                  className="flex h-full flex-col gap-5 bg-canvas p-4 sm:gap-6 sm:p-6 lg:p-8"
                >
                  <div className="flex flex-col gap-5 sm:gap-6">
                    <span className="text-[11px] font-semibold tracking-[0.18em]">
                      {item.index}
                      <span aria-hidden="true"> —</span>
                    </span>
                    <h3 className="text-xl font-light leading-snug tracking-[0.04em] text-balance uppercase sm:text-2xl sm:leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-auto">
                    <SiteButton href={ctaHref} layout="spread" tone="ink">
                      {item.cta}
                    </SiteButton>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

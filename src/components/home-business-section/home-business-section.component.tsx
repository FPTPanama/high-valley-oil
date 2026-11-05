"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentColumn,
  contentInsetAfterGutter,
} from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type HomeBusinessCard = {
  index: string;
  label: string;
  cta: string;
};

export type HomeBusinessSectionProps = {
  index: string;
  eyebrow: string;
  title: string[];
  subtitle: string[];
  cards: HomeBusinessCard[];
  businessHref: string;
};

export function HomeBusinessSection({
  index,
  eyebrow,
  title,
  subtitle,
  cards,
  businessHref,
}: HomeBusinessSectionProps) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      if (!sectionEl) return;

      const introEls = gsap.utils.toArray<HTMLElement>(
        "[data-business-intro]",
        sectionEl,
      );
      const cardEls = gsap.utils.toArray<HTMLElement>(
        "[data-business-card]",
        sectionEl,
      );

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set([...introEls, ...cardEls], {
          clearProps: "opacity,transform",
        });
        return;
      }

      gsap.set(introEls, { opacity: 0, x: -28 });
      gsap.set(cardEls, { opacity: 0, y: 28 });

      const introTween = gsap.to(introEls, {
        opacity: 1,
        x: 0,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 85%",
          end: "top 55%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      const cardTween = gsap.to(cardEls, {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 70%",
          end: "top 40%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        introTween.scrollTrigger?.kill();
        introTween.kill();
        cardTween.scrollTrigger?.kill();
        cardTween.kill();
      };
    },
    { scope: section, dependencies: [cards.length] },
  );

  return (
    <section
      ref={section}
      aria-labelledby="home-business-heading"
      className="relative mt-28 w-full sm:mt-36 lg:mt-44"
    >
      <div
        className={`${contentColumn} ${contentInsetAfterGutter} flex flex-col gap-6 text-left text-ink`}
      >
        <p
          data-business-intro
          className="text-[11px] font-semibold uppercase tracking-[0.2em] will-change-[opacity,transform]"
        >
          <span className="text-accent">{index}</span>
          <span className="mx-2 text-ink/40" aria-hidden="true">
            /
          </span>
          {eyebrow}
        </p>

        <h2
          data-business-intro
          id="home-business-heading"
          className="max-w-3xl text-3xl font-light tracking-[0.04em] text-balance uppercase will-change-[opacity,transform] sm:text-4xl lg:text-5xl"
        >
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p
          data-business-intro
          className="max-w-xl text-lg font-normal leading-snug tracking-[0.02em] text-ink/80 will-change-[opacity,transform] sm:text-xl"
        >
          {subtitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {cards.map((card) => (
            <li
              key={card.index}
              data-business-card
              className="h-full will-change-[opacity,transform]"
            >
              <Link
                href={`${businessHref}#business-focus-${card.index}`}
                className="group flex h-full min-h-[12rem] flex-col justify-between gap-6 border border-accent p-5 text-ink transition-colors duration-200 hover:bg-accent hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-[14rem] sm:p-6"
              >
                <span className="text-lg font-light tracking-[0.04em] text-balance uppercase sm:text-xl">
                  {card.label}
                </span>
                <span className="mt-auto flex w-full items-center justify-between gap-3 text-[13px] font-medium tracking-wide uppercase">
                  {card.cta}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

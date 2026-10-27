"use client";

import { useRef, type ComponentType } from "react";
import {
  Anchor,
  Cog,
  Droplets,
  Factory,
  Gauge,
  Package,
  PencilRuler,
  Route,
  Scale,
  Ship,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame, contentInset } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const businessIcons = {
  gauge: Gauge,
  wrench: Wrench,
  factory: Factory,
  droplets: Droplets,
  package: Package,
  route: Route,
  pencilRuler: PencilRuler,
  cog: Cog,
  zap: Zap,
  anchor: Anchor,
  scale: Scale,
  ship: Ship,
} as const;

export type HomeBusinessIconName = keyof typeof businessIcons;

export type HomeBusinessBlock = {
  title: string;
  info: string;
  icon: string;
};

function BusinessBlockIcon({ name }: { name: string }) {
  const Icon = (businessIcons[name as HomeBusinessIconName] ??
    Gauge) as ComponentType<LucideProps>;
  return (
    <Icon
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0 text-accent"
      strokeWidth={1.75}
    />
  );
}

function DrawFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span
        data-edge="top"
        className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-ink will-change-transform"
      />
      <span
        data-edge="right"
        className="absolute top-0 right-0 h-full w-0.5 origin-top scale-y-0 bg-ink will-change-transform"
      />
      <span
        data-edge="bottom"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-right scale-x-0 bg-ink will-change-transform"
      />
      <span
        data-edge="left"
        className="absolute top-0 left-0 h-full w-0.5 origin-bottom scale-y-0 bg-ink will-change-transform"
      />
    </div>
  );
}

export type HomeBusinessFocus = {
  index: string;
  label: string;
  /** Short lead under the slide title. */
  lead: string;
  /** Items listed in the third column. */
  blocks: HomeBusinessBlock[];
};

export type HomeBusinessSectionProps = {
  index: string;
  eyebrow: string;
  title: string[];
  subtitle: string[];
  focuses: HomeBusinessFocus[];
};

export function HomeBusinessSection({
  index,
  eyebrow,
  title,
  subtitle,
  focuses,
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
      const blockEls = gsap.utils.toArray<HTMLElement>(
        "[data-business-block]",
        sectionEl,
      );

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set(introEls, { clearProps: "opacity,transform" });
        blockEls.forEach((block) => {
          gsap.set(block.querySelector("[data-business-block-content]"), {
            clearProps: "opacity,transform",
          });
          gsap.set(block.querySelectorAll("[data-edge]"), {
            clearProps: "transform",
          });
        });
        return;
      }

      gsap.set(introEls, { opacity: 0, x: -28 });

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

      const blockTweens = blockEls.map((block) => {
        const content = block.querySelector<HTMLElement>(
          "[data-business-block-content]",
        );
        const top = block.querySelector<HTMLElement>('[data-edge="top"]');
        const right = block.querySelector<HTMLElement>('[data-edge="right"]');
        const bottom = block.querySelector<HTMLElement>('[data-edge="bottom"]');
        const left = block.querySelector<HTMLElement>('[data-edge="left"]');
        if (!content || !top || !right || !bottom || !left) return null;

        gsap.set(content, { opacity: 0, y: 36 });
        gsap.set(top, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(right, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(bottom, { scaleX: 0, transformOrigin: "right center" });
        gsap.set(left, { scaleY: 0, transformOrigin: "bottom center" });

        const edgeDuration = 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        tl.to(top, { scaleX: 1, duration: edgeDuration, ease: "none" })
          .to(right, { scaleY: 1, duration: edgeDuration, ease: "none" })
          .to(bottom, { scaleX: 1, duration: edgeDuration, ease: "none" })
          .to(left, { scaleY: 1, duration: edgeDuration, ease: "none" })
          .to(
            content,
            { opacity: 1, y: 0, duration: 1.4, ease: "none" },
            0.15,
          );

        return tl;
      });

      return () => {
        introTween.scrollTrigger?.kill();
        introTween.kill();
        blockTweens.forEach((tween) => {
          tween?.scrollTrigger?.kill();
          tween?.kill();
        });
      };
    },
    { scope: section, dependencies: [focuses.length] },
  );

  return (
    <section
      ref={section}
      aria-labelledby="home-business-heading"
      className="relative mt-28 w-full sm:mt-36 lg:mt-44"
    >
      <div className={`${contentFrame} mb-16 sm:mb-20 lg:mb-24`}>
        <div className="flex max-w-3xl flex-col gap-6 text-left text-ink">
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
            className="text-3xl font-light tracking-[0.04em] text-balance uppercase will-change-[opacity,transform] sm:text-4xl lg:text-5xl"
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
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {focuses.map((focus) => (
          <article
            key={focus.index}
            data-business-block
            aria-label={`${focus.index}. ${focus.label}`}
            className={`relative w-full bg-canvas ${contentFrame}`}
          >
            <DrawFrame />
            <div
              data-business-block-content
              className={`grid w-full grid-cols-1 items-start gap-8 text-ink will-change-[opacity,transform] sm:gap-10 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-center lg:gap-12 ${contentInset} py-10 sm:py-12`}
            >
              <span
                aria-hidden="true"
                className="min-w-0 p-4 text-7xl leading-none font-light tracking-tighter text-ink tabular-nums sm:text-8xl lg:text-9xl"
              >
                {focus.index}
              </span>

              <div className="flex min-w-0 flex-col gap-4 p-4">
                <h3 className="text-2xl font-light tracking-[0.04em] text-balance uppercase sm:text-3xl lg:text-4xl">
                  {focus.label}
                </h3>
                {focus.lead ? (
                  <p className="text-base font-normal leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
                    {focus.lead}
                  </p>
                ) : null}
              </div>

              {focus.blocks.length > 0 ? (
                <ul className="flex min-w-0 flex-col justify-center gap-4 border-t border-ink/15 p-4 pt-4 lg:border-t-0 lg:pt-4">
                  {focus.blocks.map((block) => (
                    <li
                      key={block.title}
                      className="flex min-w-0 items-start gap-3 text-base font-light leading-snug tracking-[0.02em] text-ink sm:text-lg"
                    >
                      <BusinessBlockIcon name={block.icon} />
                      <span className="min-w-0 break-words">
                        <span className="block">{block.title}</span>
                        {block.info ? (
                          <span className="mt-1 block text-sm text-ink/70 sm:text-base">
                            {block.info}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="min-w-0" />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

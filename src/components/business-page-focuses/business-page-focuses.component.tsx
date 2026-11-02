"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame, contentInset } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type BusinessPageFocusBlock = {
  title: string;
  info: string;
};

export type BusinessPageFocus = {
  index: string;
  label: string;
  lead: string;
  blocks: BusinessPageFocusBlock[];
};

export type BusinessPageFocusesProps = {
  eyebrow: string;
  focuses: BusinessPageFocus[];
};

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

export function BusinessPageFocuses({
  eyebrow,
  focuses,
}: BusinessPageFocusesProps) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      if (!sectionEl) return;

      const introEl = sectionEl.querySelector<HTMLElement>(
        "[data-focus-areas-intro]",
      );
      const blockEls = gsap.utils.toArray<HTMLElement>(
        "[data-business-block]",
        sectionEl,
      );

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        if (introEl) gsap.set(introEl, { clearProps: "opacity,transform" });
        blockEls.forEach((block) => {
          gsap.set(block, { clearProps: "opacity" });
          gsap.set(
            block.querySelectorAll(
              "[data-focus-number], [data-focus-middle], [data-focus-item]",
            ),
            { clearProps: "transform" },
          );
          gsap.set(block.querySelectorAll("[data-edge]"), {
            clearProps: "transform",
          });
        });
        return;
      }

      let introTween: gsap.core.Tween | undefined;
      if (introEl) {
        gsap.set(introEl, { opacity: 0, x: -28 });
        introTween = gsap.to(introEl, {
          opacity: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });
      }

      const enter = 1;
      const hold = 0.75;
      const exit = 1;
      const edgeStep = enter * 0.25;

      const blockTweens = blockEls.map((block) => {
        const numberEl = block.querySelector<HTMLElement>(
          "[data-focus-number]",
        );
        const middleEl = block.querySelector<HTMLElement>(
          "[data-focus-middle]",
        );
        const itemEls = gsap.utils.toArray<HTMLElement>(
          "[data-focus-item]",
          block,
        );
        const top = block.querySelector<HTMLElement>('[data-edge="top"]');
        const right = block.querySelector<HTMLElement>('[data-edge="right"]');
        const bottom = block.querySelector<HTMLElement>('[data-edge="bottom"]');
        const left = block.querySelector<HTMLElement>('[data-edge="left"]');
        if (!numberEl || !middleEl || !top || !right || !bottom || !left) {
          return null;
        }

        gsap.set(block, { opacity: 0 });
        gsap.set(numberEl, { x: -56 });
        gsap.set(middleEl, { y: 48 });
        if (itemEls.length > 0) gsap.set(itemEls, { x: 56 });
        gsap.set(top, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(right, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(bottom, { scaleX: 0, transformOrigin: "right center" });
        gsap.set(left, { scaleY: 0, transformOrigin: "bottom center" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            // Peak (hold) lands when the slide center crosses the viewport center.
            start: "center 88%",
            end: "center 12%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        // Enter — fade + directional columns + frame draw
        tl.to(block, { opacity: 1, duration: enter, ease: "none" }, 0)
          .to(numberEl, { x: 0, duration: enter, ease: "none" }, 0)
          .to(middleEl, { y: 0, duration: enter, ease: "none" }, 0)
          .to(top, { scaleX: 1, duration: edgeStep, ease: "none" }, 0)
          .to(right, { scaleY: 1, duration: edgeStep, ease: "none" }, edgeStep)
          .to(
            bottom,
            { scaleX: 1, duration: edgeStep, ease: "none" },
            edgeStep * 2,
          )
          .to(
            left,
            { scaleY: 1, duration: edgeStep, ease: "none" },
            edgeStep * 3,
          );

        if (itemEls.length > 0) {
          tl.to(
            itemEls,
            {
              x: 0,
              duration: enter,
              ease: "none",
              stagger: 0.08,
            },
            0,
          );
        }

        // Hold — full focus while centered
        tl.to({}, { duration: hold });

        // Exit — mirror of enter
        const exitAt = enter + hold;
        tl.to(block, { opacity: 0, duration: exit, ease: "none" }, exitAt)
          .to(numberEl, { x: -56, duration: exit, ease: "none" }, exitAt)
          .to(middleEl, { y: 48, duration: exit, ease: "none" }, exitAt)
          .to(left, { scaleY: 0, duration: edgeStep, ease: "none" }, exitAt)
          .to(
            bottom,
            { scaleX: 0, duration: edgeStep, ease: "none" },
            exitAt + edgeStep,
          )
          .to(
            right,
            { scaleY: 0, duration: edgeStep, ease: "none" },
            exitAt + edgeStep * 2,
          )
          .to(
            top,
            { scaleX: 0, duration: edgeStep, ease: "none" },
            exitAt + edgeStep * 3,
          );

        if (itemEls.length > 0) {
          tl.to(
            itemEls,
            {
              x: 56,
              duration: exit,
              ease: "none",
              stagger: 0.08,
            },
            exitAt,
          );
        }

        return tl;
      });

      return () => {
        introTween?.scrollTrigger?.kill();
        introTween?.kill();
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
      id="focus-areas"
      aria-label={eyebrow}
      className="relative mt-10 w-full scroll-mt-28 sm:mt-12 sm:scroll-mt-32 lg:mt-14"
    >
      <div className={`${contentFrame} mb-10 sm:mb-12 lg:mb-14`}>
        <p
          data-focus-areas-intro
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent will-change-[opacity,transform]"
        >
          {eyebrow}
        </p>
      </div>

      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {focuses.map((focus) => (
          <article
            key={focus.index}
            id={`business-focus-${focus.index}`}
            data-business-block
            aria-labelledby={`business-focus-${focus.index}-heading`}
            className={`relative w-full bg-canvas ${contentFrame}`}
          >
            <DrawFrame />
            <div
              className={`grid w-full grid-cols-1 gap-8 text-ink sm:gap-10 lg:grid-cols-[1fr_1.25fr_1fr] lg:gap-12 ${contentInset} py-10 sm:py-12`}
            >
              <span
                data-focus-number
                aria-hidden="true"
                className="flex min-h-24 min-w-0 items-center justify-center p-4 text-7xl leading-none font-light tracking-tighter text-ink tabular-nums will-change-transform sm:text-8xl lg:min-h-0 lg:text-[16rem]"
              >
                {Number(focus.index)}
              </span>

              <div
                data-focus-middle
                className="flex min-w-0 flex-col gap-4 p-4 will-change-transform"
              >
                <h3
                  id={`business-focus-${focus.index}-heading`}
                  className="text-2xl font-light tracking-[0.04em] text-balance uppercase sm:text-3xl lg:text-4xl"
                >
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
                      data-focus-item
                      className="min-w-0 text-base font-light leading-snug tracking-[0.02em] text-ink will-change-transform sm:text-lg"
                    >
                      <span className="block">{block.title}</span>
                      {block.info ? (
                        <span className="mt-1 block text-sm text-ink/70 sm:text-base">
                          {block.info}
                        </span>
                      ) : null}
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

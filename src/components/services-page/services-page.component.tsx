"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TOPO_SRC = "/images/topografic_lines_accent.svg";

export type ServicesPageItem = {
  index: string;
  title: string;
  slug: string;
  body: string;
  points: string[];
};

export type ServicesPageProps = {
  eyebrow: string;
  items: ServicesPageItem[];
};

function DrawFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span
        data-edge="top"
        className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent will-change-transform"
      />
      <span
        data-edge="right"
        className="absolute top-0 right-0 h-full w-0.5 origin-top scale-y-0 bg-accent will-change-transform"
      />
      <span
        data-edge="bottom"
        className="absolute bottom-0 left-0 h-0.5 w-full origin-right scale-x-0 bg-accent will-change-transform"
      />
      <span
        data-edge="left"
        className="absolute top-0 left-0 h-full w-0.5 origin-bottom scale-y-0 bg-accent will-change-transform"
      />
    </div>
  );
}

export function ServicesPageContent({ eyebrow, items }: ServicesPageProps) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      if (!sectionEl) return;

      const introEl = sectionEl.querySelector<HTMLElement>(
        "[data-services-intro]",
      );
      const blockEls = gsap.utils.toArray<HTMLElement>(
        "[data-service-block]",
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
              "[data-service-number], [data-service-middle], [data-service-item], [data-service-topo]",
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

      const parallaxTweens: gsap.core.Tween[] = [];

      const blockTweens = blockEls.map((block) => {
        const numberEl = block.querySelector<HTMLElement>(
          "[data-service-number]",
        );
        const middleEl = block.querySelector<HTMLElement>(
          "[data-service-middle]",
        );
        const topoEl = block.querySelector<HTMLElement>("[data-service-topo]");
        const itemEls = gsap.utils.toArray<HTMLElement>(
          "[data-service-item]",
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

        if (topoEl) {
          parallaxTweens.push(
            gsap.fromTo(
              topoEl,
              { yPercent: -14 },
              {
                yPercent: 14,
                ease: "none",
                scrollTrigger: {
                  trigger: block,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            ),
          );
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "center 88%",
            end: "center 12%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

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

        tl.to({}, { duration: hold });

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
        parallaxTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    },
    { scope: section, dependencies: [items.length] },
  );

  return (
    <section
      ref={section}
      id="services"
      aria-label={eyebrow}
      className="relative mt-10 w-full scroll-mt-28 sm:mt-12 sm:scroll-mt-32 lg:mt-14"
    >
      <div className={`${contentFrame} mb-10 sm:mb-12 lg:mb-14`}>
        <p
          data-services-intro
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent will-change-[opacity,transform]"
        >
          {eyebrow}
        </p>
      </div>

      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {items.map((item) => (
          <article
            key={item.slug}
            id={item.slug}
            data-service-block
            aria-labelledby={`services-${item.slug}-heading`}
            className={`relative w-full scroll-mt-28 bg-canvas sm:scroll-mt-32 ${contentFrame}`}
          >
            <DrawFrame />
            <div className="grid w-full grid-cols-1 gap-3 text-accent sm:gap-4 lg:grid-cols-3 lg:gap-5">
              <div className="relative flex min-h-24 min-w-0 items-center justify-center overflow-hidden lg:aspect-square lg:min-h-0">
                <div
                  data-service-topo
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[-12%] z-0 h-[124%] w-full will-change-transform"
                >
                  <Image
                    src={TOPO_SRC}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
                <span
                  data-service-number
                  aria-hidden="true"
                  className="relative z-10 flex min-w-0 items-center justify-center text-7xl leading-none font-light tracking-tighter text-accent tabular-nums will-change-transform sm:text-8xl lg:text-[clamp(4rem,22vw,16rem)]"
                >
                  {Number(item.index)}
                </span>
              </div>

              <div className="flex min-w-0 items-center p-5 sm:p-6 lg:aspect-square">
                <div
                  data-service-middle
                  className="flex min-w-0 flex-col gap-4 will-change-transform"
                >
                  <h3
                    id={`services-${item.slug}-heading`}
                    className="text-2xl font-light tracking-[0.04em] text-balance uppercase sm:text-3xl lg:text-4xl"
                  >
                    {item.title}
                  </h3>
                  {item.body ? (
                    <p className="text-base font-normal leading-relaxed tracking-[0.02em] text-accent/80 sm:text-lg">
                      {item.body}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex min-w-0 items-center border-t border-accent/20 p-5 sm:p-6 lg:aspect-square lg:border-t-0">
                {item.points.length > 0 ? (
                  <ul className="flex min-w-0 flex-col justify-center gap-4">
                    {item.points.map((point, pointIndex) => (
                      <li
                        key={point}
                        data-service-item
                        className={`min-w-0 text-base leading-snug tracking-[0.02em] text-accent will-change-transform sm:text-lg ${pointIndex % 2 === 0 ? "font-bold" : "font-light"}`}
                      >
                        <span className="block">{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

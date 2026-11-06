"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentColumn,
  contentInsetAfterGutter,
} from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type VenezuelaPageStepDetail = {
  title: string;
  body: string;
};

export type VenezuelaPageStep = {
  index: string;
  title: string;
  details: VenezuelaPageStepDetail[];
  caption?: VenezuelaPageStepDetail;
};

export type VenezuelaPageProps = {
  stepsLabel: string;
  steps: VenezuelaPageStep[];
};

const panelClassName = "bg-canvas p-5 sm:p-7 lg:p-8";

const TOPO_SRC = "/images/topographic_1.svg";
/** Trial: Venezuela flag yellow / blue / red. */
const TOPO_FLAG_COLORS = ["#FCD116", "#003DA5", "#CF142B"] as const;
const STEP_IMAGES = [
  "/images/definir_alcance_foto.webp",
  "/images/coordinar_recursos.webp",
  "/images/seguir_entrega.webp",
] as const;

export function VenezuelaPageContent({
  stepsLabel,
  steps,
}: VenezuelaPageProps) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      if (!sectionEl) return;

      const slideEls = gsap.utils.toArray<HTMLElement>(
        "[data-vz-slide]",
        sectionEl,
      );
      if (slideEls.length === 0) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const sideEls = gsap.utils.toArray<HTMLElement>(
        "[data-vz-side]",
        sectionEl,
      );

      let cancelled = false;
      const cleanups: Array<() => void> = [];

      const topoStroke = (index: number) =>
        TOPO_FLAG_COLORS[index % TOPO_FLAG_COLORS.length];

      const showTopoStrokesStatic = (paths: SVGPathElement[]) => {
        paths.forEach((path, index) => {
          const length = Math.max(path.getTotalLength(), 1);
          const dash = length * 0.42;
          const gap = length - dash;
          gsap.set(path, {
            fill: "transparent",
            stroke: topoStroke(index),
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: `${dash} ${gap}`,
            strokeDashoffset: 0,
            vectorEffect: "non-scaling-stroke",
          });
        });
      };

      /**
       * Filled topo bands are compound paths (outer + inner hole).
       * Keep only the longest subpath so each contour draws once.
       */
      const keepOuterContours = (rawPaths: SVGPathElement[]) => {
        const contours: SVGPathElement[] = [];

        rawPaths.forEach((path) => {
          const d = path.getAttribute("d") ?? "";
          const parts = d.split(/(?=[Mm])/).filter((part) => part.trim());
          const parent = path.parentNode;

          if (parts.length <= 1 || !parent) {
            contours.push(path);
            return;
          }

          const clones = parts.map((part) => {
            const clone = path.cloneNode(false) as SVGPathElement;
            clone.setAttribute("d", part.trim());
            parent.insertBefore(clone, path);
            return clone;
          });
          path.remove();

          const ranked = [...clones].sort(
            (a, b) => b.getTotalLength() - a.getTotalLength(),
          );
          const [outer, ...holes] = ranked;
          holes.forEach((hole) => hole.remove());
          if (outer) contours.push(outer);
        });

        return contours;
      };

      /** Open dash + scroll-scrubbed travel; never reads as a closed loop. */
      const startTopoScrollTravel = (
        paths: SVGPathElement[],
        trigger: HTMLElement,
      ) => {
        const travelTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        paths.forEach((path, index) => {
          const length = Math.max(path.getTotalLength(), 1);
          const dash = length * (0.34 + (index % 3) * 0.04);
          const gap = Math.max(length - dash, length * 0.35);
          const reverse = index % 2 === 1;
          const travel = length * (2.8 + index * 0.85 + (index % 2) * 0.5);

          gsap.set(path, {
            fill: "transparent",
            stroke: topoStroke(index),
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: `${dash} ${gap}`,
            strokeDashoffset: 0,
            vectorEffect: "non-scaling-stroke",
          });

          travelTl.to(
            path,
            {
              strokeDashoffset: reverse ? travel : -travel,
              duration: 1,
            },
            0,
          );
        });

        cleanups.push(() => {
          travelTl.scrollTrigger?.kill();
          travelTl.kill();
        });
      };

      const setupSlideMotion = (topoPaths: SVGPathElement[] = []) => {
        if (prefersReduced) {
          gsap.set(sideEls, { clearProps: "opacity,transform" });
          gsap.set(
            gsap.utils.toArray<HTMLElement>(
              "[data-vz-topo], [data-vz-parallax]",
              sectionEl,
            ),
            { clearProps: "transform" },
          );
          if (topoPaths.length > 0) showTopoStrokesStatic(topoPaths);
          return;
        }

        const isMobile = window.matchMedia("(max-width: 1023px)").matches;
        const enter = 1;
        // Mobile: longer hold so exit does not start while the block is still mid-screen.
        const hold = isMobile ? 1.85 : 0.75;
        const exit = isMobile ? 0.9 : 1;
        const offset = 72;
        // Early enter, late exit — start when the slide arrives, finish after it has mostly left.
        const slideStart = isMobile ? "top 92%" : "center 88%";
        const slideEnd = isMobile ? "top -8%" : "center 12%";

        // Sticky topo already lags the scroll; scrub must drift UP (negative),
        // not down — positive yPercent reads as inverted parallax on mobile.
        const topoEl = sectionEl.querySelector<HTMLElement>("[data-vz-topo]");
        if (topoEl) {
          const topoTween = gsap.fromTo(
            topoEl,
            { yPercent: isMobile ? 4 : 8 },
            {
              yPercent: isMobile ? -18 : -22,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top bottom",
                end: "bottom top",
                scrub: isMobile ? 0.45 : true,
                invalidateOnRefresh: true,
              },
            },
          );
          cleanups.push(() => {
            topoTween.scrollTrigger?.kill();
            topoTween.kill();
          });
        }

        if (topoPaths.length > 0) {
          startTopoScrollTravel(topoPaths, sectionEl);
        }

        slideEls.forEach((slideEl) => {
          const leftEls = gsap.utils.toArray<HTMLElement>(
            '[data-vz-side="left"]',
            slideEl,
          );
          const rightEls = gsap.utils.toArray<HTMLElement>(
            '[data-vz-side="right"]',
            slideEl,
          );
          if (leftEls.length === 0 || rightEls.length === 0) return;

          gsap.set(leftEls, { opacity: 0, x: -offset });
          gsap.set(rightEls, { opacity: 0, x: offset });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: slideEl,
              start: slideStart,
              end: slideEnd,
              scrub: isMobile ? 0.35 : 0.5,
              invalidateOnRefresh: true,
            },
          });

          tl.to(leftEls, { opacity: 1, x: 0, duration: enter }, 0)
            .to(rightEls, { opacity: 1, x: 0, duration: enter }, 0)
            .to({}, { duration: hold });

          const exitAt = enter + hold;
          tl.to(leftEls, { opacity: 0, x: -offset, duration: exit }, exitAt).to(
            rightEls,
            { opacity: 0, x: offset, duration: exit },
            exitAt,
          );

          cleanups.push(() => {
            tl.scrollTrigger?.kill();
            tl.kill();
          });

          const parallaxEl =
            slideEl.querySelector<HTMLElement>("[data-vz-parallax]");
          if (parallaxEl) {
            const parallaxTween = gsap.fromTo(
              parallaxEl,
              { yPercent: -24 },
              {
                yPercent: 24,
                ease: "none",
                scrollTrigger: {
                  trigger: slideEl,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
            cleanups.push(() => {
              parallaxTween.scrollTrigger?.kill();
              parallaxTween.kill();
            });
          }
        });
      };

      const topoHost = sectionEl.querySelector<HTMLElement>(
        "[data-vz-topo-host]",
      );

      if (!topoHost) {
        setupSlideMotion();
      } else {
        void fetch(TOPO_SRC)
          .then((response) => response.text())
          .then((markup) => {
            if (cancelled) return;
            topoHost.innerHTML = markup;
            const svg = topoHost.querySelector("svg");
            if (svg) {
              svg.setAttribute("preserveAspectRatio", "xMaxYMid meet");
              svg.classList.add("h-full", "w-full");
            }
            const rawPaths = gsap.utils.toArray<SVGPathElement>(
              "path",
              topoHost,
            );
            const paths = keepOuterContours(rawPaths);
            setupSlideMotion(paths);
            ScrollTrigger.refresh();
          })
          .catch(() => {
            if (!cancelled) setupSlideMotion();
          });
      }

      return () => {
        cancelled = true;
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: section, dependencies: [steps] },
  );

  return (
    <section
      ref={section}
      aria-label={stepsLabel}
      className="relative isolate w-full overflow-x-clip pb-8 sm:pb-12 lg:pb-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-[1] h-dvh w-full overflow-x-clip"
      >
        <div className="absolute top-[28%] right-0 h-[min(160vh,96rem)] w-[min(165vw,96rem)] -translate-y-1/2 translate-x-[38%]">
          <div
            data-vz-topo
            className="relative size-full will-change-transform"
          >
            <div
              data-vz-topo-host
              className="absolute inset-0 opacity-80 [&_svg]:h-full [&_svg]:w-full"
            />
          </div>
        </div>
      </div>

      <div
        className={`${contentColumn} relative -mt-[100dvh] bg-transparent text-ink`}
      >
        <div
          className={`${contentInsetAfterGutter} flex flex-col gap-0 pt-0 pb-10 sm:pb-14 lg:pb-16`}
        >
          {steps.map((step, stepIndex) => {
            const panelOnRight = stepIndex % 2 === 1;
            const sideImageSrc = STEP_IMAGES[stepIndex];
            const panel = (
              <div
                data-vz-side={panelOnRight ? "right" : "left"}
                className={`relative z-10 flex w-full flex-col justify-center gap-6 opacity-0 will-change-[opacity,transform] motion-reduce:opacity-100 sm:gap-8 ${panelClassName}`}
              >
                <h2 className="text-left text-4xl font-light leading-[1.05] tracking-[0.04em] text-balance uppercase sm:text-5xl sm:leading-[1.05] lg:text-6xl lg:leading-[1.05]">
                  {step.title}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8">
                  {step.details.map((detail) => (
                    <article
                      key={detail.title}
                      className="flex flex-col gap-2 text-left sm:gap-2.5"
                    >
                      <h3 className="text-lg font-black tracking-[0.04em] text-balance uppercase sm:text-xl">
                        {detail.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-base">
                        {detail.body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            );
            const sideKey = panelOnRight ? "left" : "right";
            const sideBorderClass = panelOnRight
              ? "border-l-2 border-accent"
              : "border-r-2 border-accent";
            const side = (
              <div className="relative flex flex-col gap-0">
                <div
                  data-vz-side={sideKey}
                  className={`relative z-0 h-[42dvh] w-full overflow-hidden opacity-0 will-change-[opacity,transform] motion-reduce:opacity-100 sm:h-[50dvh] lg:h-[60dvh] ${sideBorderClass}`}
                >
                  <div
                    data-vz-parallax
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-[-24%] z-0 h-[148%] w-full will-change-transform"
                  >
                    <Image
                      src={sideImageSrc ?? STEP_IMAGES[0]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 36rem, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                {step.caption ? (
                  <p
                    data-vz-side={sideKey}
                    className="relative z-10 flex flex-wrap items-baseline gap-x-2 gap-y-1 bg-canvas p-2 text-left text-sm leading-snug tracking-[0.02em] text-accent opacity-0 will-change-[opacity,transform] motion-reduce:opacity-100 sm:text-base sm:leading-snug lg:p-2"
                  >
                    <span className="text-xs font-black tracking-[0.04em] text-balance uppercase sm:text-sm">
                      {step.caption.title}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="relative top-px size-3.5 shrink-0 text-accent sm:size-4"
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 flex-1 font-light text-accent/80">
                      {step.caption.body}
                    </span>
                  </p>
                ) : null}
              </div>
            );

            return (
              <div
                key={step.index}
                data-vz-slide
                className="relative grid h-auto items-stretch gap-6 py-6 sm:gap-8 sm:py-8 lg:grid-cols-2 lg:gap-10 lg:py-10"
              >
                {panelOnRight ? (
                  <>
                    {side}
                    {panel}
                  </>
                ) : (
                  <>
                    {panel}
                    {side}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

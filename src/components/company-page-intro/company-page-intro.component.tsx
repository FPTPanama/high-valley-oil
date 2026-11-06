"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentColumn } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const IMAGE_SRC = "/images/high_valley_operador.webp";
const PANEL_TOPO_SRC = "/images/topografic_lines_accent.svg";
/** Stroke topo that travels with scroll (same asset/motion as Venezuela / field-to-market). */
const STROKE_TOPO_SRC = "/images/topographic_1.svg";
const TOPO_ACCENT = "#aa5900";
/** Intrinsic pixel size of the asset (keeps Next/Image aspect correct). */
const IMAGE_WIDTH = 603;
const IMAGE_HEIGHT = 537;

export type CompanyPageIntroProps = {
  title: string;
};

export function CompanyPageIntro({ title }: CompanyPageIntroProps) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const operatorParallax = useRef<HTMLDivElement>(null);
  const figureTopoParallax = useRef<HTMLDivElement>(null);
  const panelTopoParallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      const stageEl = stage.current;
      const operatorEl = operatorParallax.current;
      const figureTopoEl = figureTopoParallax.current;
      const panelTopoEl = panelTopoParallax.current;
      if (!sectionEl || !stageEl || !operatorEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let cancelled = false;
      const cleanups: Array<() => void> = [];

      const showTopoStrokesStatic = (paths: SVGPathElement[]) => {
        paths.forEach((path) => {
          const length = Math.max(path.getTotalLength(), 1);
          const dash = length * 0.42;
          const gap = length - dash;
          gsap.set(path, {
            fill: "transparent",
            stroke: TOPO_ACCENT,
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: `${dash} ${gap}`,
            strokeDashoffset: 0,
            vectorEffect: "non-scaling-stroke",
          });
        });
      };

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
            stroke: TOPO_ACCENT,
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

      if (prefersReduced) {
        gsap.set(operatorEl, { autoAlpha: 1, clearProps: "transform" });
        if (figureTopoEl) gsap.set(figureTopoEl, { clearProps: "transform" });
        if (panelTopoEl) gsap.set(panelTopoEl, { clearProps: "transform" });
      } else {
        gsap.set(operatorEl, { autoAlpha: 0 });

        const fadeTween = gsap.fromTo(
          operatorEl,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: operatorEl,
              start: "top 92%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
        cleanups.push(() => {
          fadeTween.scrollTrigger?.kill();
          fadeTween.kill();
        });

        const sharedTrigger = {
          trigger: sectionEl,
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
        cleanups.push(() => {
          operatorTween.scrollTrigger?.kill();
          operatorTween.kill();
        });

        if (figureTopoEl) {
          const figureTopoTween = gsap.fromTo(
            figureTopoEl,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                ...sharedTrigger,
                invalidateOnRefresh: true,
              },
            },
          );
          cleanups.push(() => {
            figureTopoTween.scrollTrigger?.kill();
            figureTopoTween.kill();
          });
        }

        if (panelTopoEl) {
          const panelTopoTween = gsap.fromTo(
            panelTopoEl,
            { yPercent: -32 },
            {
              yPercent: 32,
              ease: "none",
              scrollTrigger: sharedTrigger,
            },
          );
          cleanups.push(() => {
            panelTopoTween.scrollTrigger?.kill();
            panelTopoTween.kill();
          });
        }
      }

      const topoHost = sectionEl.querySelector<HTMLElement>(
        "[data-company-intro-topo-host]",
      );

      if (topoHost) {
        void fetch(STROKE_TOPO_SRC)
          .then((response) => response.text())
          .then((markup) => {
            if (cancelled) return;
            topoHost.innerHTML = markup;
            const svg = topoHost.querySelector("svg");
            if (svg) {
              svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
              svg.classList.add("h-full", "w-full");
            }
            const rawPaths = gsap.utils.toArray<SVGPathElement>(
              "path",
              topoHost,
            );
            const paths = keepOuterContours(rawPaths);
            if (prefersReduced) {
              showTopoStrokesStatic(paths);
            } else {
              startTopoScrollTravel(paths, sectionEl);
            }
            ScrollTrigger.refresh();
          })
          .catch(() => {
            /* Stroke topo is decorative; fail silently. */
          });
      }

      return () => {
        cancelled = true;
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="company-intro-heading"
      className="relative isolate mt-16 w-full sm:mt-20 lg:mt-24"
    >
      <div className={contentColumn}>
        <div className="relative">
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

          {/*
            Operator above the ink band (tucks 2% behind).
            Behind it: accent stroke topo that travels with scroll.
          */}
          <div className="relative z-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[-18%] bottom-[-8%] z-0 overflow-hidden"
            >
              <div
                ref={figureTopoParallax}
                className="absolute inset-0 will-change-transform"
              >
                <div
                  data-company-intro-topo-host
                  className="absolute inset-0 opacity-70 [&_svg]:h-full [&_svg]:w-full"
                />
              </div>
            </div>

            <div className="relative z-[1] flex justify-center">
              <div
                ref={operatorParallax}
                className="relative w-full -mb-[2%] opacity-0 will-change-transform sm:w-auto"
              >
                <Image
                  src={IMAGE_SRC}
                  alt=""
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="h-auto w-full max-w-none [filter:url(#company-operator-ink)] sm:w-[45vw]"
                  priority
                />
              </div>
            </div>
          </div>

          <div
            ref={stage}
            className="relative z-10 h-auto bg-ink sm:h-[52dvh]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            >
              <div
                ref={panelTopoParallax}
                className="absolute inset-x-0 top-[-40%] h-[180%] w-full will-change-transform"
              >
                <Image
                  src={PANEL_TOPO_SRC}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 72rem, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-center px-5 py-10 sm:absolute sm:inset-0 sm:px-6 sm:py-0 lg:px-8">
              <h2
                id="company-intro-heading"
                className="w-full text-center text-4xl font-light tracking-[0.04em] text-balance text-canvas uppercase sm:text-6xl lg:text-7xl"
              >
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

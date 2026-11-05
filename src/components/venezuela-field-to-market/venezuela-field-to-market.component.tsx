"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame, contentInset } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type VenezuelaFieldToMarketProps = {
  eyebrow: string;
  lines: string[];
  stages: string[];
};

const TOPO_SRC = "/images/topographic_1.svg";
const TOPO_ACCENT = "#aa5900";

export function VenezuelaFieldToMarket({
  eyebrow,
  lines,
  stages,
}: VenezuelaFieldToMarketProps) {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const headingLabel = lines.join(" ");

  useGSAP(
    () => {
      const sectionEl = section.current;
      const panelEl = panel.current;
      if (!sectionEl || !panelEl) return;

      const eyebrowEl =
        panelEl.querySelector<HTMLElement>("[data-ftm-eyebrow]");
      const charEls = gsap.utils.toArray<HTMLElement>(
        "[data-ftm-char]",
        panelEl,
      );
      const stepEls = gsap.utils.toArray<HTMLElement>(
        "[data-ftm-step]",
        panelEl,
      );

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

      const setupTopoMotion = (topoPaths: SVGPathElement[] = []) => {
        if (prefersReduced) {
          gsap.set(
            gsap.utils.toArray<HTMLElement>("[data-ftm-topo]", sectionEl),
            { clearProps: "transform" },
          );
          if (topoPaths.length > 0) showTopoStrokesStatic(topoPaths);
          return;
        }

        const topoEl = sectionEl.querySelector<HTMLElement>("[data-ftm-topo]");
        if (topoEl) {
          const topoTween = gsap.fromTo(
            topoEl,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: sectionEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
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
      };

      if (prefersReduced) {
        gsap.set([eyebrowEl, ...charEls].filter(Boolean), {
          clearProps: "opacity,transform",
        });
        gsap.set(stepEls, { clearProps: "opacity" });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-ftm-mark]", panelEl), {
          clearProps: "transform",
        });
        gsap.set(gsap.utils.toArray<HTMLElement>("[data-ftm-fill]", panelEl), {
          clearProps: "transform",
        });
      } else {
        if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 0, y: 16 });
        gsap.set(charEls, { opacity: 0, y: 8 });
        gsap.set(stepEls, { opacity: 0.28 });

        stepEls.forEach((stepEl) => {
          const markEl = stepEl.querySelector<HTMLElement>("[data-ftm-mark]");
          const fillX = stepEl.querySelector<HTMLElement>(
            '[data-ftm-fill="x"]',
          );
          const fillY = stepEl.querySelector<HTMLElement>(
            '[data-ftm-fill="y"]',
          );
          if (markEl) gsap.set(markEl, { scale: 0 });
          if (fillX)
            gsap.set(fillX, { scaleX: 0, transformOrigin: "left center" });
          if (fillY)
            gsap.set(fillY, { scaleY: 0, transformOrigin: "top center" });
        });

        const intro = gsap.timeline({
          paused: true,
          defaults: { ease: "power2.out" },
        });

        if (eyebrowEl) {
          intro.to(eyebrowEl, {
            opacity: 1,
            y: 0,
            duration: 0.45,
          });
        }

        intro.to(
          charEls,
          {
            opacity: 1,
            y: 0,
            duration: 0.04,
            stagger: 0.028,
            ease: "none",
          },
          eyebrowEl ? "-=0.1" : 0,
        );

        const stepsAt = Math.max(intro.duration() - 0.05, 0.35);

        stepEls.forEach((stepEl, index) => {
          const at = stepsAt + index * 0.4;
          const markEl = stepEl.querySelector<HTMLElement>("[data-ftm-mark]");
          const fillX = stepEl.querySelector<HTMLElement>(
            '[data-ftm-fill="x"]',
          );
          const fillY = stepEl.querySelector<HTMLElement>(
            '[data-ftm-fill="y"]',
          );

          intro.to(
            stepEl,
            {
              opacity: 1,
              duration: 0.35,
            },
            at,
          );

          if (markEl) {
            intro.to(
              markEl,
              {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.6)",
              },
              at,
            );
          }

          if (fillX) {
            intro.to(
              fillX,
              {
                scaleX: 1,
                duration: 0.35,
                ease: "none",
              },
              at + 0.12,
            );
          }

          if (fillY) {
            intro.to(
              fillY,
              {
                scaleY: 1,
                duration: 0.35,
                ease: "none",
              },
              at + 0.12,
            );
          }
        });

        const trigger = ScrollTrigger.create({
          trigger: panelEl,
          start: "top 70%",
          end: "bottom top",
          onEnter: () => {
            intro.restart();
          },
          onEnterBack: () => {
            intro.restart();
          },
          onLeave: () => {
            intro.pause(0);
            intro.progress(0);
          },
          onLeaveBack: () => {
            intro.pause(0);
            intro.progress(0);
          },
        });

        cleanups.push(() => {
          trigger.kill();
          intro.kill();
        });
      }

      const topoHost = sectionEl.querySelector<HTMLElement>(
        "[data-ftm-topo-host]",
      );

      if (!topoHost) {
        setupTopoMotion();
      } else {
        void fetch(TOPO_SRC)
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
            setupTopoMotion(paths);
            ScrollTrigger.refresh();
          })
          .catch(() => {
            if (!cancelled) setupTopoMotion();
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
      id="field-to-market"
      aria-labelledby="venezuela-field-to-market-heading"
      className="relative isolate w-full scroll-mt-28 overflow-x-clip pb-8 sm:pb-12 lg:pb-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div data-ftm-topo className="absolute inset-0 will-change-transform">
          <div
            data-ftm-topo-host
            className="absolute inset-0 opacity-70 [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-[100vw]"
          />
        </div>
      </div>

      <div
        ref={panel}
        className={`${contentFrame} relative z-10 overflow-hidden bg-transparent text-ink`}
      >
        <div
          className={`${contentInset} flex min-h-[min(70vh,40rem)] flex-col items-center justify-center gap-16 py-16 text-center sm:gap-20 sm:py-20 lg:min-h-[min(75vh,44rem)] lg:gap-24 lg:py-24`}
        >
          <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-ink sm:gap-8">
            <p
              data-ftm-eyebrow
              className="bg-canvas px-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent will-change-[opacity,transform] sm:text-sm"
            >
              {eyebrow}
            </p>
            <h2
              id="venezuela-field-to-market-heading"
              aria-label={headingLabel}
              className="text-[clamp(1.65rem,7.2vw,2.25rem)] font-light tracking-[0.04em] uppercase sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {lines.map((line) => (
                <span
                  key={line}
                  aria-hidden="true"
                  className="block whitespace-nowrap"
                >
                  {Array.from(line).map((char, charIndex) => (
                    <span
                      key={`${line}-${charIndex}`}
                      data-ftm-char
                      className={`inline-block will-change-[opacity,transform] ${
                        char === " " ? "" : "bg-canvas"
                      }`}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>

          <ol className="grid w-full max-w-5xl grid-cols-1 gap-0 sm:grid-cols-4 sm:items-start">
            {stages.map((stage, index) => {
              const stepIndex = String(index + 1).padStart(2, "0");
              const isLast = index === stages.length - 1;

              return (
                <li
                  key={stage}
                  data-ftm-step
                  className="relative grid grid-cols-[auto_0.75rem_minmax(0,1fr)] items-start gap-x-3 py-4 text-ink will-change-[opacity] sm:flex sm:flex-col sm:items-center sm:gap-4 sm:px-3 sm:py-0"
                >
                  <span className="col-start-1 row-start-1 self-center text-[11px] font-semibold tracking-[0.2em] text-accent sm:order-2 sm:self-auto">
                    {stepIndex}
                  </span>

                  <div className="relative col-start-2 row-start-1 row-span-1 min-h-3 w-3 self-stretch sm:order-1 sm:h-3 sm:w-full sm:self-auto">
                    {!isLast ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute top-1/2 left-[calc(50%+0.375rem)] hidden h-px w-[calc(100%-0.75rem)] -translate-y-1/2 bg-ink/15 sm:block"
                        >
                          <span
                            data-ftm-fill="x"
                            className="absolute inset-0 origin-left scale-x-0 bg-accent will-change-transform"
                          />
                        </span>
                        <span
                          aria-hidden="true"
                          className="absolute top-3 bottom-[-1rem] left-1/2 w-px -translate-x-1/2 bg-ink/15 sm:hidden"
                        >
                          <span
                            data-ftm-fill="y"
                            className="absolute inset-0 origin-top scale-y-0 bg-accent will-change-transform"
                          />
                        </span>
                      </>
                    ) : null}
                    {/* Outer shell keeps centering; GSAP scale lives on the inner mark. */}
                    <span
                      className="absolute top-0 left-1/2 z-10 flex size-3 -translate-x-1/2 items-center justify-center sm:top-1/2 sm:-translate-y-1/2"
                      aria-hidden="true"
                    >
                      <span
                        data-ftm-mark
                        className="size-full rounded-full bg-accent will-change-transform"
                      />
                    </span>
                  </div>

                  <span className="col-start-3 row-start-1 self-center text-left text-sm font-semibold tracking-[0.14em] text-balance uppercase sm:order-3 sm:self-auto sm:text-center sm:text-[13px]">
                    <span className="box-decoration-clone bg-canvas px-[0.35em] py-[0.12em] shadow-[0.35em_0_0_var(--canvas),-0.35em_0_0_var(--canvas)]">
                      {stage}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

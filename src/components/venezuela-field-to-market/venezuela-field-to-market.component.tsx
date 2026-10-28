"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteSection } from "@/components/site-section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type VenezuelaFieldToMarketProps = {
  eyebrow: string;
  lines: string[];
  stages: string[];
};

export function VenezuelaFieldToMarket({
  eyebrow,
  lines,
  stages,
}: VenezuelaFieldToMarketProps) {
  const panel = useRef<HTMLDivElement>(null);
  const headingLabel = lines.join(" ");

  useGSAP(
    () => {
      const panelEl = panel.current;
      if (!panelEl) return;

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
        return;
      }

      if (eyebrowEl) gsap.set(eyebrowEl, { opacity: 0, y: 16 });
      gsap.set(charEls, { opacity: 0, y: 8 });
      gsap.set(stepEls, { opacity: 0.28 });

      stepEls.forEach((stepEl) => {
        const markEl = stepEl.querySelector<HTMLElement>("[data-ftm-mark]");
        const fillX = stepEl.querySelector<HTMLElement>('[data-ftm-fill="x"]');
        const fillY = stepEl.querySelector<HTMLElement>('[data-ftm-fill="y"]');
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
        const fillX = stepEl.querySelector<HTMLElement>('[data-ftm-fill="x"]');
        const fillY = stepEl.querySelector<HTMLElement>('[data-ftm-fill="y"]');

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

      return () => {
        trigger.kill();
        intro.kill();
      };
    },
    { scope: panel },
  );

  return (
    <SiteSection
      ref={panel}
      tone="canvas"
      className="pb-8 sm:pb-12 lg:pb-16"
      contentClassName="flex min-h-[min(70vh,40rem)] flex-col items-center justify-center gap-16 py-16 text-center sm:gap-20 sm:py-20 lg:min-h-[min(75vh,44rem)] lg:gap-24 lg:py-24"
      aria-labelledby="venezuela-field-to-market-heading"
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-ink sm:gap-8">
        <p
          data-ftm-eyebrow
          className="text-xs font-semibold uppercase tracking-[0.22em] text-accent will-change-[opacity,transform] sm:text-sm"
        >
          {eyebrow}
        </p>
        <h2
          id="venezuela-field-to-market-heading"
          aria-label={headingLabel}
          className="text-4xl font-light tracking-[0.04em] text-balance uppercase sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {lines.map((line) => (
            <span key={line} aria-hidden="true" className="block">
              {Array.from(line).map((char, charIndex) => (
                <span
                  key={`${line}-${charIndex}`}
                  data-ftm-char
                  className="inline-block will-change-[opacity,transform]"
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
              className="relative flex flex-col items-center gap-4 py-5 text-ink will-change-[opacity] sm:py-0 sm:px-3"
            >
              <div className="relative flex w-full items-center justify-center">
                <span
                  data-ftm-mark
                  className="relative z-10 flex size-3 shrink-0 rounded-full bg-accent will-change-transform"
                  aria-hidden="true"
                />
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-[calc(50%+0.55rem)] hidden h-px w-[calc(100%-0.55rem)] -translate-y-1/2 bg-ink/15 sm:block"
                  >
                    <span
                      data-ftm-fill="x"
                      className="absolute inset-0 origin-left scale-x-0 bg-accent will-change-transform"
                    />
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] text-accent">
                  {stepIndex}
                </span>
                <span className="max-w-[11rem] text-sm font-semibold uppercase tracking-[0.14em] text-balance sm:text-[13px]">
                  {stage}
                </span>
              </div>

              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-1/2 h-8 w-px -translate-x-1/2 bg-ink/15 sm:hidden"
                >
                  <span
                    data-ftm-fill="y"
                    className="absolute inset-0 origin-top scale-y-0 bg-accent will-change-transform"
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </SiteSection>
  );
}

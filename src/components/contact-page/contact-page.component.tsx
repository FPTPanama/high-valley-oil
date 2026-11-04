"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentFrame,
  contentInset,
  sectionShell,
} from "@/components/general-layout";
import {
  HeroMediaReveal,
  HeroRevealImage,
} from "@/components/hero-media-reveal";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ContactPageField = {
  id: string;
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  required?: boolean;
};

export type ContactPageProps = {
  eyebrow: string;
  title: string;
  fields: ContactPageField[];
  submitLabel: string;
};

const HERO_SRC = "/images/obreros_en_fabrica.webp";

const fieldClassName =
  "w-full border border-canvas bg-transparent px-3 py-2 text-sm font-light tracking-[0.02em] text-canvas outline-none transition-colors placeholder:text-canvas/40 focus-visible:border-accent";

export function ContactPageContent({
  eyebrow,
  title,
  fields,
  submitLabel,
}: ContactPageProps) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);
  const bottom = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const backgroundParallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const topEl = top.current;
      const rightEl = right.current;
      const bottomEl = bottom.current;
      const leftEl = left.current;
      const sectionEl = section.current;
      const backgroundEl = backgroundParallax.current;
      if (!topEl || !rightEl || !bottomEl || !leftEl || !sectionEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(topEl, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(rightEl, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(bottomEl, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(leftEl, { scaleY: 0, transformOrigin: "bottom center" });

      if (prefersReduced) {
        gsap.set([topEl, bottomEl], { scaleX: 1 });
        gsap.set([rightEl, leftEl], { scaleY: 1 });
        if (backgroundEl) gsap.set(backgroundEl, { clearProps: "transform" });
        return;
      }

      const edgeDuration = 0.22;

      const setDrawOrigins = () => {
        gsap.set(topEl, { transformOrigin: "left center" });
        gsap.set(rightEl, { transformOrigin: "top center" });
        gsap.set(bottomEl, { transformOrigin: "right center" });
        gsap.set(leftEl, { transformOrigin: "bottom center" });
      };

      const setUndrawOrigins = () => {
        gsap.set(topEl, { transformOrigin: "right center" });
        gsap.set(rightEl, { transformOrigin: "bottom center" });
        gsap.set(bottomEl, { transformOrigin: "left center" });
        gsap.set(leftEl, { transformOrigin: "top center" });
      };

      setDrawOrigins();

      const intro = gsap.timeline({ delay: 0.35 });
      intro
        .to(topEl, { scaleX: 1, duration: edgeDuration, ease: "none" })
        .to(rightEl, { scaleY: 1, duration: edgeDuration, ease: "none" })
        .to(bottomEl, { scaleX: 1, duration: edgeDuration, ease: "none" })
        .to(leftEl, { scaleY: 1, duration: edgeDuration, ease: "none" });

      const undraw = gsap.timeline({
        paused: true,
        onReverseComplete: setDrawOrigins,
      });
      undraw
        .to(topEl, { scaleX: 0, duration: edgeDuration, ease: "none" })
        .to(rightEl, { scaleY: 0, duration: edgeDuration, ease: "none" })
        .to(bottomEl, { scaleX: 0, duration: edgeDuration, ease: "none" })
        .to(leftEl, { scaleY: 0, duration: edgeDuration, ease: "none" });

      let trigger: ScrollTrigger | undefined;
      let parallaxTween: gsap.core.Tween | undefined;

      intro.eventCallback("onComplete", () => {
        trigger = ScrollTrigger.create({
          trigger: sectionEl,
          start: "20% top",
          onEnter: () => {
            setUndrawOrigins();
            undraw.play();
          },
          onLeaveBack: () => {
            undraw.reverse();
          },
        });
      });

      if (backgroundEl) {
        gsap.set(backgroundEl, { yPercent: 0 });
        parallaxTween = gsap.to(backgroundEl, {
          yPercent: 28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      return () => {
        intro.kill();
        trigger?.kill();
        undraw.kill();
        parallaxTween?.scrollTrigger?.kill();
        parallaxTween?.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="contact-heading"
      className={`${sectionShell} overflow-hidden bg-canvas`}
    >
      <div
        className="absolute inset-0 overflow-hidden isolate"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            ref={backgroundParallax}
            className="absolute inset-x-0 top-0 h-[max(56.25vw,72%)] w-full will-change-transform"
          >
            <HeroMediaReveal>
              <HeroRevealImage
                src={HERO_SRC}
                alt=""
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center grayscale brightness-[0.62] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-ink mix-blend-color" />
            </HeroMediaReveal>
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 z-10 h-[32%] bg-linear-to-b from-ink from-10% via-ink/55 via-55% to-transparent to-100%" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-[40%] bg-linear-to-t from-canvas from-35% via-canvas/70 via-60% to-transparent to-100%" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-5 bg-canvas" />
      </div>

      <div
        ref={frame}
        className={`${contentFrame} relative z-10 mt-40 sm:mt-48`}
      >
        <span
          ref={top}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-0.5 w-full bg-accent will-change-transform"
        />
        <span
          ref={right}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-0.5 bg-accent will-change-transform"
        />
        <span
          ref={bottom}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full bg-accent will-change-transform"
        />
        <span
          ref={left}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-full w-0.5 bg-accent will-change-transform"
        />

        <div
          className={`${contentInset} flex min-h-[min(28rem,58dvh)] flex-col justify-center py-10 sm:min-h-[min(32rem,60dvh)] sm:py-12`}
        >
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-20">
            <header className="flex max-w-xl flex-col justify-center gap-5 text-left lg:h-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-canvas">
                {eyebrow}
              </p>
              <h1
                id="contact-heading"
                className="text-5xl font-light tracking-[0.04em] text-balance text-canvas sm:text-6xl lg:text-7xl"
              >
                {title}
              </h1>
            </header>

            <div className="w-full max-w-xl p-6 backdrop-blur-xs sm:p-8 lg:max-w-none lg:justify-self-stretch">
              <form
                className="flex flex-col justify-center gap-4"
                action="#"
                method="post"
                noValidate
              >
                {fields.map((field) => (
                  <label
                    key={field.id}
                    className="flex flex-col gap-1.5"
                    htmlFor={field.id}
                  >
                    <span className="text-sm font-medium tracking-[0.02em] text-canvas">
                      {field.label}
                    </span>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        name={field.name}
                        rows={4}
                        required={field.required}
                        className={`${fieldClassName} min-h-24 resize-y`}
                      />
                    ) : (
                      <input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        required={field.required}
                        className={fieldClassName}
                      />
                    )}
                  </label>
                ))}

                <div className="pt-1">
                  <SiteButton type="submit" layout="spread">
                    {submitLabel}
                  </SiteButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

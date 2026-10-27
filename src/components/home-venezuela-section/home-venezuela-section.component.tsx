"use client";

import { useRef } from "react";
import { FlagTriangleRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MAP_SRC = "/images/venezuela_mapa.svg";
const INK = "#172B2D";
const MAP_ASPECT = "1672.75 / 1434.62";

/** Positions as % of the SVG viewBox (tip of the pin). */
const MAP_PINS = [
  { id: "zulia", left: "22%", top: "30%" },
  { id: "falcon", left: "32%", top: "22%" },
  { id: "caracas", left: "48%", top: "24%" },
  { id: "barinas", left: "38%", top: "42%" },
  { id: "oriente", left: "68%", top: "34%" },
  { id: "faja", left: "58%", top: "48%" },
  { id: "delta", left: "78%", top: "42%" },
  { id: "amazonas", left: "52%", top: "62%" },
  { id: "guayana", left: "62%", top: "56%" },
] as const;

export type HomeVenezuelaSectionProps = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HomeVenezuelaSection({
  index,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
}: HomeVenezuelaSectionProps) {
  const section = useRef<HTMLElement>(null);
  const mapHost = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      const host = mapHost.current;
      if (!sectionEl || !host) return;

      const introEls = gsap.utils.toArray<HTMLElement>(
        "[data-venezuela-intro]",
        sectionEl,
      );
      const pinEls = gsap.utils.toArray<HTMLElement>(
        "[data-map-pin]",
        sectionEl,
      );
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      let cancelled = false;
      let mapTween: gsap.core.Timeline | undefined;
      let mapTrigger: ScrollTrigger | undefined;
      let introTween: gsap.core.Tween | undefined;
      const controller = new AbortController();

      const showIntro = () => {
        if (prefersReduced) {
          gsap.set([...introEls, ...pinEls], {
            clearProps: "opacity,transform",
          });
          return;
        }

        gsap.set(introEls, { opacity: 0, y: 28 });
        introTween = gsap.to(introEls, {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });
      };

      const splitCompoundPaths = (paths: SVGPathElement[]) => {
        const expanded: SVGPathElement[] = [];

        paths.forEach((path) => {
          const d = path.getAttribute("d") ?? "";
          const parts = d.split(/(?=[Mm])/).filter((part) => part.trim());

          if (parts.length <= 1) {
            expanded.push(path);
            return;
          }

          const parent = path.parentNode;
          if (!parent) {
            expanded.push(path);
            return;
          }

          parts.forEach((part) => {
            const clone = path.cloneNode(false) as SVGPathElement;
            clone.setAttribute("d", part.trim());
            parent.insertBefore(clone, path);
            expanded.push(clone);
          });
          path.remove();
        });

        return expanded;
      };

      const prepareStrokePath = (rawPaths: SVGPathElement[]) => {
        const paths = splitCompoundPaths(rawPaths);
        const [mainPath, ...otherPaths] = [...paths].sort(
          (a, b) => b.getTotalLength() - a.getTotalLength(),
        );

        otherPaths.forEach((path) => path.remove());
        mainPath.style.vectorEffect = "non-scaling-stroke";

        return mainPath;
      };

      const showMapComplete = (rawPaths: SVGPathElement[]) => {
        const mainPath = prepareStrokePath(rawPaths);
        gsap.set(mainPath, {
          fill: "transparent",
          stroke: INK,
          strokeOpacity: 1,
          strokeWidth: 3,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "none",
          strokeDashoffset: 0,
        });
        gsap.set(pinEls, { clearProps: "opacity,transform" });
      };

      const scrubMapDraw = (rawPaths: SVGPathElement[]) => {
        const mainPath = prepareStrokePath(rawPaths);
        const length = mainPath.getTotalLength();

        gsap.set(mainPath, {
          fill: "transparent",
          stroke: INK,
          strokeOpacity: 1,
          strokeWidth: 3,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.set(pinEls, {
          opacity: 0,
          scale: 0.35,
          y: 10,
          transformOrigin: "50% 100%",
        });

        mapTween = gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 80%",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .to(mainPath, {
            strokeDashoffset: 0,
            ease: "none",
            duration: 1,
          })
          .to(
            pinEls,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: "none",
              stagger: 0.08,
              duration: 0.28,
            },
            0.42,
          );

        mapTrigger = mapTween.scrollTrigger;
      };

      showIntro();

      void fetch(MAP_SRC, { signal: controller.signal, cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load map: ${response.status}`);
          }
          return response.text();
        })
        .then((markup) => {
          if (cancelled || !host) return;

          host.innerHTML = markup;
          const svg = host.querySelector("svg");
          if (!svg) return;

          svg.setAttribute("class", "h-full w-full max-w-none text-ink");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          svg.setAttribute("aria-hidden", "true");
          svg.removeAttribute("width");
          svg.removeAttribute("height");

          const paths = Array.from(
            svg.querySelectorAll("path"),
          ) as SVGPathElement[];
          if (paths.length === 0) return;

          if (prefersReduced) {
            showMapComplete(paths);
            return;
          }

          scrubMapDraw(paths);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          console.error(error);
        });

      return () => {
        cancelled = true;
        controller.abort();
        mapTrigger?.kill();
        mapTween?.kill();
        introTween?.scrollTrigger?.kill();
        introTween?.kill();
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="home-venezuela-heading"
      className="relative mt-28 w-full overflow-hidden sm:mt-36 lg:mt-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <div
          className="relative h-full max-h-full w-full max-w-full"
          style={{ aspectRatio: MAP_ASPECT }}
        >
          <div
            ref={mapHost}
            className="absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
          />
          <ul className="absolute inset-0">
            {MAP_PINS.map((pin) => (
              <li
                key={pin.id}
                data-map-pin
                className="absolute -translate-x-1/2 -translate-y-full will-change-[opacity,transform]"
                style={{ left: pin.left, top: pin.top }}
              >
                <FlagTriangleRight
                  className="size-7 text-accent sm:size-8"
                  strokeWidth={1.75}
                  fill="currentColor"
                  fillOpacity={0.2}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`${contentFrame} relative z-10 flex min-h-[min(85vh,48rem)] flex-col justify-center py-16 sm:py-20 lg:py-24`}
      >
        <div className="flex max-w-xl flex-col gap-6 text-ink sm:gap-8">
          <p
            data-venezuela-intro
            className="text-[11px] font-semibold uppercase tracking-[0.2em] will-change-[opacity,transform]"
          >
            <span className="text-accent">{index}</span>
            <span className="mx-2 text-ink/40" aria-hidden="true">
              /
            </span>
            {eyebrow}
          </p>

          <h2
            data-venezuela-intro
            id="home-venezuela-heading"
            className="text-3xl font-light leading-snug tracking-[0.04em] text-balance uppercase will-change-[opacity,transform] sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]"
          >
            <span className="box-decoration-clone bg-canvas px-[0.35em] py-[0.12em] shadow-[0.35em_0_0_var(--canvas),-0.35em_0_0_var(--canvas)]">
              {title}
            </span>
          </h2>

          <p
            data-venezuela-intro
            className="text-base font-light leading-8 tracking-[0.02em] text-ink/80 will-change-[opacity,transform] sm:text-lg sm:leading-9"
          >
            <span className="box-decoration-clone bg-canvas px-[0.35em] py-[0.12em] shadow-[0.35em_0_0_var(--canvas),-0.35em_0_0_var(--canvas)]">
              {body}
            </span>
          </p>

          <div data-venezuela-intro className="will-change-[opacity,transform]">
            <SiteButton href={ctaHref}>{ctaLabel}</SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

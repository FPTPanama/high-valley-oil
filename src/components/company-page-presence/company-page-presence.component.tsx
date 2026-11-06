"use client";

import { useRef } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  HardHat,
  Package,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentColumn,
  contentInsetAfterGutter,
} from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CompanyPagePresencePoint = {
  title: string;
  body: string;
};

export type CompanyPagePresenceProps = {
  eyebrow: string;
  title: string;
  body: string;
  points: CompanyPagePresencePoint[];
};

const MAP_SRC_DESKTOP = "/images/ven_usa_mapa.svg";
const MAP_SRC_MOBILE = "/images/usa_mapa_vertical.svg";

/** Icons per point, in dictionary order (Venezuela → USA). */
const POINT_ICONS: LucideIcon[][] = [
  [HardHat, Wrench, Package],
  [Building2, BriefcaseBusiness, ClipboardList],
];

/** Renders `**bold**` markers from i18n as semibold spans. */
function renderHighlightedBody(body: string) {
  return body.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function sortFlagSegments(paths: SVGPathElement[]) {
  return [...paths].sort((a, b) => {
    const aOffset = Math.abs(Number(a.getAttribute("stroke-dashoffset") ?? 0));
    const bOffset = Math.abs(Number(b.getAttribute("stroke-dashoffset") ?? 0));
    return aOffset - bOffset;
  });
}

/** Reveal flag-colored path thirds/quarters along the stroke (progress 0 → segmentCount). */
function applyFlagReveal(
  paths: SVGPathElement[],
  segmentCount: number,
  progress: number,
) {
  paths.forEach((path, index) => {
    const visible = Math.max(0, Math.min(1, progress - index));
    path.setAttribute("pathLength", String(segmentCount));
    path.style.strokeDasharray = `${visible} ${segmentCount}`;
    path.style.strokeDashoffset = String(-index);
  });
}

function PresencePointArticle({
  point,
  index,
  variant,
}: {
  point: CompanyPagePresencePoint;
  index: number;
  variant: "desktop" | "mobile";
}) {
  const icons = POINT_ICONS[index] ?? [];
  const isDesktop = variant === "desktop";
  const alignEnd = isDesktop && index % 2 === 0;
  const alignClass = isDesktop
    ? alignEnd
      ? "items-end text-right"
      : "items-start text-left"
    : "items-center text-center";

  return (
    <article
      data-presence-point={variant}
      className={`flex flex-col justify-start gap-3 text-ink ${
        isDesktop ? "mt-[15%] h-full" : ""
      } ${alignClass}`}
    >
      {icons.length > 0 ? (
        <ul
          className={`flex items-center gap-3 ${
            isDesktop
              ? alignEnd
                ? "justify-end"
                : "justify-start"
              : "justify-center"
          }`}
          aria-hidden
        >
          {icons.map((Icon) => (
            <li
              key={Icon.displayName ?? Icon.name}
              data-presence-icon
              className="bg-canvas p-1.5 text-accent will-change-transform"
            >
              <Icon className="size-5" strokeWidth={1.5} />
            </li>
          ))}
        </ul>
      ) : null}

      <div
        data-presence-copy
        className={`flex flex-col gap-3 will-change-transform ${
          isDesktop
            ? alignEnd
              ? "items-end"
              : "items-start"
            : "items-center"
        }`}
      >
        <h3
          className={`w-fit font-light tracking-[0.04em] uppercase ${
            isDesktop ? "text-4xl sm:text-5xl" : "text-3xl"
          }`}
        >
          <span
            className={`box-decoration-clone bg-canvas py-[0.12em] ${
              isDesktop
                ? alignEnd
                  ? "pl-[0.35em] shadow-[-0.35em_0_0_var(--canvas)]"
                  : "pr-[0.35em] shadow-[0.35em_0_0_var(--canvas)]"
                : "px-[0.35em] shadow-[0.35em_0_0_var(--canvas),-0.35em_0_0_var(--canvas)]"
            }`}
          >
            {point.title}
          </span>
        </h3>

        <p
          className={`text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg ${
            isDesktop ? "w-2/3" : "w-full max-w-prose"
          }`}
        >
          <span className="box-decoration-clone bg-canvas px-[0.35em] py-[0.12em] shadow-[0.35em_0_0_var(--canvas),-0.35em_0_0_var(--canvas)]">
            {renderHighlightedBody(point.body)}
          </span>
        </p>
      </div>
    </article>
  );
}

export function CompanyPagePresence({
  eyebrow,
  title,
  body,
  points,
}: CompanyPagePresenceProps) {
  const section = useRef<HTMLElement>(null);
  const desktopMapBlock = useRef<HTMLDivElement>(null);
  const desktopMapHost = useRef<HTMLDivElement>(null);
  const mobileMapBlock = useRef<HTMLDivElement>(null);
  const mobileMapHost = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const cleanups: Array<() => void> = [];

      const setupPointReveals = (
        root: HTMLElement,
        variant: "desktop" | "mobile",
      ) => {
        const pointsEls = gsap.utils.toArray<HTMLElement>(
          `[data-presence-point="${variant}"]`,
          root,
        );

        if (prefersReduced) {
          gsap.set(
            root.querySelectorAll(
              `[data-presence-point="${variant}"] [data-presence-copy], [data-presence-point="${variant}"] [data-presence-icon]`,
            ),
            { clearProps: "opacity,transform" },
          );
          return pointsEls;
        }

        pointsEls.forEach((pointEl, index) => {
          const fromLeft = variant === "desktop" ? index % 2 === 0 : true;
          const copyEl = pointEl.querySelector<HTMLElement>(
            "[data-presence-copy]",
          );
          const iconEls = gsap.utils.toArray<HTMLElement>(
            "[data-presence-icon]",
            pointEl,
          );

          if (!copyEl) return;

          gsap.set(copyEl, {
            autoAlpha: 0,
            x: fromLeft ? -40 : 40,
            ...(variant === "mobile" ? { y: 16, x: 0 } : null),
          });
          gsap.set(iconEls, { autoAlpha: 0, y: 10 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pointEl,
              start: "top 88%",
              end: variant === "desktop" ? "top 45%" : "top 55%",
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            iconEls,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              ease: "none",
              stagger: 0.14,
            },
            0,
          ).to(
            copyEl,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "none",
            },
            0.12,
          );

          cleanups.push(() => {
            tl.scrollTrigger?.kill();
            tl.kill();
          });
        });

        return pointsEls;
      };

      const loadMapAndScrub = (
        host: HTMLDivElement,
        src: string,
        pointsEls: HTMLElement[],
        options?: { separateCountries?: boolean },
      ) => {
        let cancelled = false;
        const controller = new AbortController();

        void fetch(src, { signal: controller.signal, cache: "no-store" })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to load map: ${response.status}`);
            }
            return response.text();
          })
          .then((markup) => {
            if (cancelled) return;

            host.innerHTML = markup;
            const svg = host.querySelector("svg");
            if (!svg) return;

            svg.setAttribute("class", "h-full w-full");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("aria-hidden", "true");
            svg.removeAttribute("width");
            svg.removeAttribute("height");

            if (options?.separateCountries) {
              const venezuelaGroup = svg.querySelector<SVGGElement>(
                '[data-country-group="venezuela"]',
              );
              const usaGroup = svg.querySelector<SVGGElement>(
                '[data-country-group="usa"]',
              );
              // Pull countries apart so each sits nearer its text block.
              if (venezuelaGroup) {
                gsap.set(venezuelaGroup, { yPercent: -10 });
              }
              if (usaGroup) {
                gsap.set(usaGroup, { yPercent: 10 });
              }
            }

            const venezuelaPaths = sortFlagSegments(
              Array.from(
                svg.querySelectorAll('[data-country="venezuela"]'),
              ) as SVGPathElement[],
            );
            const usaPaths = sortFlagSegments(
              Array.from(
                svg.querySelectorAll('[data-country="usa"]'),
              ) as SVGPathElement[],
            );

            if (prefersReduced) {
              applyFlagReveal(venezuelaPaths, 3, 3);
              applyFlagReveal(usaPaths, 4, 4);
              return;
            }

            applyFlagReveal(venezuelaPaths, 3, 0);
            applyFlagReveal(usaPaths, 4, 0);

            const scrubCountry = (
              paths: SVGPathElement[],
              segmentCount: number,
              trigger: HTMLElement | undefined,
            ) => {
              if (!trigger || paths.length === 0) return;

              const state = { progress: 0 };
              const tween = gsap.to(state, {
                progress: segmentCount,
                ease: "none",
                onUpdate: () => {
                  applyFlagReveal(paths, segmentCount, state.progress);
                },
                scrollTrigger: {
                  trigger,
                  start: "top 85%",
                  end: "top 45%",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                },
              });

              cleanups.push(() => {
                tween.scrollTrigger?.kill();
                tween.kill();
              });
            };

            // Points order: Venezuela → USA
            scrubCountry(venezuelaPaths, 3, pointsEls[0]);
            scrubCountry(usaPaths, 4, pointsEls[1]);
            ScrollTrigger.refresh();
          })
          .catch((error: unknown) => {
            if (controller.signal.aborted) return;
            console.error(error);
          });

        cleanups.push(() => {
          cancelled = true;
          controller.abort();
        });
      };

      if (isDesktop) {
        const mapEl = desktopMapBlock.current;
        const host = desktopMapHost.current;
        if (!mapEl || !host) return;

        const pointsEls = setupPointReveals(mapEl, "desktop");
        loadMapAndScrub(host, MAP_SRC_DESKTOP, pointsEls);
      } else {
        const mapEl = mobileMapBlock.current;
        const host = mobileMapHost.current;
        if (!mapEl || !host) return;

        const pointsEls = setupPointReveals(mapEl, "mobile");
        loadMapAndScrub(host, MAP_SRC_MOBILE, pointsEls, {
          separateCountries: true,
        });
      }

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="relative mt-8 w-full sm:mt-10 lg:mt-12"
      aria-labelledby="company-presence-heading"
    >
      <div
        className={`${contentColumn} ${contentInsetAfterGutter} grid gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20`}
      >
        <header className="flex flex-col gap-5 text-ink">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h2
            id="company-presence-heading"
            className="text-3xl font-light tracking-[0.04em] text-balance uppercase sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </header>

        <p className="text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg lg:self-end">
          {body}
        </p>
      </div>

      {/* Mobile: content defines height; vertical map fills behind */}
      <div
        ref={mobileMapBlock}
        className={`${contentColumn} relative lg:hidden`}
      >
        <div
          ref={mobileMapHost}
          className="pointer-events-none absolute inset-0 [&_svg]:h-full [&_svg]:w-full"
          aria-hidden
        />

        <div
          className={`${contentInsetAfterGutter} relative grid grid-cols-1 gap-10 py-10 sm:gap-12 sm:py-12`}
        >
          {points.map((point, index) => (
            <PresencePointArticle
              key={`mobile-${point.title}`}
              point={point}
              index={index}
              variant="mobile"
            />
          ))}
        </div>
      </div>

      {/* Desktop: horizontal map with overlay columns */}
      <div
        ref={desktopMapBlock}
        className={`${contentColumn} relative hidden lg:block`}
      >
        <div
          ref={desktopMapHost}
          className="pointer-events-none aspect-[718/380] w-full [&_svg]:h-full [&_svg]:w-full"
          aria-hidden
        />

        <div
          className={`${contentInsetAfterGutter} absolute inset-0 grid gap-4 py-12 sm:gap-6 sm:py-16 lg:grid-cols-2 lg:gap-6 lg:py-20`}
        >
          {points.map((point, index) => (
            <PresencePointArticle
              key={`desktop-${point.title}`}
              point={point}
              index={index}
              variant="desktop"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Languages } from "lucide-react";
import { HomeLink } from "@/components/home-link";
import { locales, type Locale } from "@/i18n/config";

const BRAND_LOGO_SRC = "/images/high_valley_2.svg";
const BRAND_LOGO_WIDTH = 167;
const BRAND_LOGO_HEIGHT = 50;

gsap.registerPlugin(useGSAP);

export type NavItem = {
  href: string;
  label: string;
};

export type SiteHeaderNavProps = {
  locale: Locale;
  homeHref: string;
  brandName: string;
  items: NavItem[];
  contact: NavItem | null;
  mainLabel: string;
  languageLabel: string;
  languages: Record<Locale, string>;
};

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// Module flag (not sessionStorage): hard refresh replays; Strict Mode remount
// still animates because we only set this in onComplete.
let headerIntroPlayed = false;

let indicatorReady = false;

const navLinkClass = (active: boolean) =>
  `relative inline-block text-[13px] font-semibold uppercase tracking-[0.16em] text-ink transition-opacity duration-200 hover:opacity-100 ${linkFocus} ${
    active ? "opacity-100" : "opacity-55"
  }`;

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      data-header-item
      data-nav-link
      aria-current={active ? "page" : undefined}
      className={navLinkClass(active)}
    >
      {label}
    </Link>
  );
}

function LanguageSwitch({
  href,
  nextLocale,
  languageLabel,
  currentLabel,
  nextLabel,
}: {
  href: string;
  nextLocale: Locale;
  languageLabel: string;
  currentLabel: string;
  nextLabel: string;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const track = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const link = root.current;
      const reel = track.current;
      if (!link || !reel) return;

      const prefersReduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const showNext = () => {
        gsap.to(reel, {
          yPercent: -50,
          duration: prefersReduced() ? 0 : 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const showCurrent = () => {
        gsap.to(reel, {
          yPercent: 0,
          duration: prefersReduced() ? 0 : 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      link.addEventListener("pointerenter", showNext);
      link.addEventListener("pointerleave", showCurrent);
      link.addEventListener("blur", showCurrent);

      return () => {
        link.removeEventListener("pointerenter", showNext);
        link.removeEventListener("pointerleave", showCurrent);
        link.removeEventListener("blur", showCurrent);
      };
    },
    { scope: root, dependencies: [currentLabel, nextLabel] },
  );

  return (
    <Link
      ref={root}
      href={href}
      hrefLang={nextLocale}
      lang={nextLocale}
      scroll={false}
      prefetch
      data-header-item
      aria-label={`${languageLabel}: ${nextLabel}`}
      className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink transition-opacity duration-200 hover:opacity-100 ${linkFocus}`}
    >
      <Languages aria-hidden="true" className="size-3.5" />
      <span
        aria-hidden="true"
        className="relative inline-block h-[1em] overflow-hidden leading-none"
      >
        <span ref={track} className="flex flex-col will-change-transform">
          <span className="block h-[1em] leading-none">{currentLabel}</span>
          <span className="block h-[1em] leading-none">{nextLabel}</span>
        </span>
      </span>
    </Link>
  );
}

function measureLink(
  rootEl: HTMLElement,
  link: HTMLElement,
): { left: number; top: number; width: number } {
  const rootBox = rootEl.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();
  return {
    left: linkBox.left - rootBox.left + rootEl.scrollLeft,
    top: linkBox.bottom - rootBox.top + rootEl.scrollTop + 10,
    width: linkBox.width,
  };
}

export function SiteHeaderNav({
  locale,
  homeHref,
  brandName,
  items,
  contact,
  mainLabel,
  languageLabel,
  languages,
}: SiteHeaderNavProps) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const nextLocale = locales.find((code) => code !== locale) ?? locale;
  const nextHref = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${nextLocale}`);

  useGSAP(
    () => {
      const rootEl = root.current;
      const targets = gsap.utils.toArray<HTMLElement>(
        rootEl?.querySelectorAll("[data-header-item]") ?? [],
      );

      if (!rootEl || targets.length === 0) return;

      if (headerIntroPlayed) {
        rootEl.removeAttribute("data-header-intro");
        return;
      }

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        rootEl.removeAttribute("data-header-intro");
        headerIntroPlayed = true;
        window.dispatchEvent(new Event("header-intro-done"));
        return;
      }

      // CSS keeps items hidden via data-header-intro; GSAP takes over from there.
      const tween = gsap.fromTo(
        targets,
        { y: -28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.14,
          delay: 0.2,
          ease: "power2.out",
          onComplete: () => {
            headerIntroPlayed = true;
            rootEl.removeAttribute("data-header-intro");
            gsap.set(targets, {
              clearProps: "opacity,visibility,transform",
            });
            window.dispatchEvent(new Event("header-intro-done"));
          },
        },
      );

      return () => {
        tween.kill();
      };
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const rootEl = root.current;
      const marker = indicator.current;
      if (!rootEl || !marker) return;

      const prefersReduced = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const hide = (animate: boolean) => {
        indicatorReady = false;
        gsap.to(marker, {
          autoAlpha: 0,
          duration: animate && !prefersReduced() ? 0.2 : 0,
          overwrite: "auto",
        });
      };

      const moveTo = (link: HTMLElement | null, animate: boolean) => {
        if (!link) {
          hide(animate);
          return;
        }

        const { left, top, width } = measureLink(rootEl, link);

        if (animate && !prefersReduced() && indicatorReady) {
          gsap.to(marker, {
            x: left,
            y: top,
            width,
            autoAlpha: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          // First paint / remeasure: set in place — never sweep from x:0.
          gsap.set(marker, { x: left, y: top, width, autoAlpha: 1 });
          indicatorReady = true;
        }
      };

      const activeLink = () =>
        rootEl.querySelector<HTMLElement>(
          "[data-nav-link][aria-current='page']",
        );

      const snapToActive = () => moveTo(activeLink(), false);
      const returnToActive = () => moveTo(activeLink(), true);

      const onPointerOver = (event: PointerEvent) => {
        const link = (event.target as HTMLElement | null)?.closest<HTMLElement>(
          "[data-nav-link]",
        );
        if (!link || !rootEl.contains(link)) return;
        moveTo(link, true);
      };

      // Stay hidden until intro finishes so the bar does not sit over moving items.
      gsap.set(marker, { autoAlpha: 0 });
      indicatorReady = false;

      let cancelled = false;
      const arm = () => {
        if (cancelled) return;
        void document.fonts?.ready.then(() => {
          if (!cancelled) snapToActive();
        });
      };

      const onIntroDone = () => arm();
      let fallback: number | undefined;

      if (headerIntroPlayed || !rootEl.hasAttribute("data-header-intro")) {
        arm();
      } else {
        window.addEventListener("header-intro-done", onIntroDone);
        fallback = window.setTimeout(arm, 1800);
      }

      rootEl.addEventListener("pointerover", onPointerOver);
      rootEl.addEventListener("pointerleave", returnToActive);
      window.addEventListener("resize", snapToActive);
      window.addEventListener("header-surface", snapToActive);

      return () => {
        cancelled = true;
        window.removeEventListener("header-intro-done", onIntroDone);
        if (fallback !== undefined) window.clearTimeout(fallback);
        rootEl.removeEventListener("pointerover", onPointerOver);
        rootEl.removeEventListener("pointerleave", returnToActive);
        window.removeEventListener("resize", snapToActive);
        window.removeEventListener("header-surface", snapToActive);
      };
    },
    { scope: root, dependencies: [pathname] },
  );

  return (
    <div
      ref={root}
      data-header-intro="pending"
      className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
    >
      <div data-header-item className="shrink-0">
        <HomeLink href={homeHref}>
          <Image
            src={BRAND_LOGO_SRC}
            alt={brandName}
            width={BRAND_LOGO_WIDTH}
            height={BRAND_LOGO_HEIGHT}
            className="h-8 w-auto"
            priority
          />
        </HomeLink>
      </div>

      <nav
        aria-label={mainLabel}
        className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-center lg:gap-x-7"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-end lg:gap-x-7">
        {contact ? (
          <NavLink
            href={contact.href}
            label={contact.label}
            active={pathname === contact.href}
          />
        ) : null}
        <LanguageSwitch
          href={nextHref}
          nextLocale={nextLocale}
          languageLabel={languageLabel}
          currentLabel={languages[locale]}
          nextLabel={languages[nextLocale]}
        />
      </div>

      <span
        ref={indicator}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 h-px w-0 bg-ink opacity-0 will-change-transform"
      />
    </div>
  );
}

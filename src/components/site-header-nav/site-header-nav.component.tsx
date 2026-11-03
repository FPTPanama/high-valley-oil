"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Languages, Menu, X } from "lucide-react";
import { HomeLink } from "@/components/home-link";
import { locales, type Locale } from "@/i18n/config";

const BRAND_LOGO_SRC = "/images/high_valley_2.svg";
const BRAND_LOGO_CANVAS_SRC = "/images/high_valley_2_canvas.svg";
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
  /** True when the canvas header surface is filled after scroll. */
  scrolled?: boolean;
};

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

// Module flag (not sessionStorage): hard refresh replays; Strict Mode remount
// still animates because we only set this in onComplete.
let headerIntroPlayed = false;

let indicatorReady = false;

const navLinkClass = (active: boolean, onCanvas: boolean) =>
  `relative inline-block text-[13px] font-semibold uppercase tracking-[0.16em] transition-[color,opacity] duration-200 hover:opacity-100 ${linkFocus} ${
    onCanvas ? "text-canvas" : "text-ink"
  } ${active ? "opacity-100" : "opacity-55"}`;

function NavLink({
  href,
  label,
  active,
  onCanvas,
}: {
  href: string;
  label: string;
  active: boolean;
  onCanvas: boolean;
}) {
  return (
    <Link
      href={href}
      data-header-item
      data-nav-link
      aria-current={active ? "page" : undefined}
      className={navLinkClass(active, onCanvas)}
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
  onCanvas,
}: {
  href: string;
  nextLocale: Locale;
  languageLabel: string;
  currentLabel: string;
  nextLabel: string;
  onCanvas: boolean;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const router = useRouter();

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
      onClick={(event) => {
        // Keep the chrome mounted: client transition, no scroll jump.
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        router.push(href, { scroll: false });
      }}
      className={`inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] transition-[color,opacity] duration-200 hover:opacity-100 ${linkFocus} ${
        onCanvas ? "text-canvas" : "text-ink"
      }`}
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

const LOGO_SWAP_X = 18;

function BrandLogo({
  brandName,
  onCanvas,
}: {
  brandName: string;
  onCanvas: boolean;
}) {
  const canvasLayer = useRef<HTMLSpanElement>(null);
  const inkLayer = useRef<HTMLSpanElement>(null);
  // GSAP owns opacity after mount — React style must not clearProps mid-swap.
  const modeRef = useRef<"canvas" | "ink" | null>(null);

  useGSAP(
    () => {
      const canvasEl = canvasLayer.current;
      const inkEl = inkLayer.current;
      if (!canvasEl || !inkEl) return;

      const nextMode = onCanvas ? "canvas" : "ink";
      const snapTo = (mode: "canvas" | "ink") => {
        gsap.set(canvasEl, {
          autoAlpha: mode === "canvas" ? 1 : 0,
          x: 0,
        });
        gsap.set(inkEl, {
          autoAlpha: mode === "ink" ? 1 : 0,
          x: 0,
        });
      };

      // Header intro clearProps on the parent can leave the stacked marks wrong
      // on desktop (logo is the only intro target). Re-snap when intro ends.
      const onIntroDone = () => {
        snapTo(modeRef.current ?? nextMode);
      };
      window.addEventListener("header-intro-done", onIntroDone);

      // First paint: set the correct mark before the browser paints.
      if (modeRef.current === null) {
        snapTo(nextMode);
        modeRef.current = nextMode;
        return () => {
          window.removeEventListener("header-intro-done", onIntroDone);
        };
      }

      if (modeRef.current === nextMode) {
        snapTo(nextMode);
        return () => {
          window.removeEventListener("header-intro-done", onIntroDone);
        };
      }

      const prevMode = modeRef.current;
      modeRef.current = nextMode;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf([canvasEl, inkEl]);

      if (prefersReduced) {
        snapTo(nextMode);
        return () => {
          window.removeEventListener("header-intro-done", onIntroDone);
        };
      }

      const outgoing = prevMode === "canvas" ? canvasEl : inkEl;
      const incoming = nextMode === "canvas" ? canvasEl : inkEl;

      // Outgoing drifts right and fades; incoming arrives from the left.
      gsap.set(outgoing, { autoAlpha: 1, x: 0 });
      gsap.set(incoming, { autoAlpha: 0, x: -LOGO_SWAP_X });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
      });

      tl.to(outgoing, {
        autoAlpha: 0,
        x: LOGO_SWAP_X,
        duration: 0.35,
      }).to(
        incoming,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.05,
      );

      return () => {
        tl.kill();
        snapTo(nextMode);
        window.removeEventListener("header-intro-done", onIntroDone);
      };
    },
    { dependencies: [onCanvas] },
  );

  return (
    <span
      className="relative inline-block h-8 overflow-hidden"
      style={{ width: (BRAND_LOGO_WIDTH / BRAND_LOGO_HEIGHT) * 32 }}
    >
      <span
        ref={inkLayer}
        className="absolute inset-0 opacity-0 will-change-[opacity,transform]"
      >
        <Image
          src={BRAND_LOGO_SRC}
          alt={brandName}
          width={BRAND_LOGO_WIDTH}
          height={BRAND_LOGO_HEIGHT}
          className="h-8 w-auto"
          priority
        />
      </span>
      <span
        ref={canvasLayer}
        className="absolute inset-0 will-change-[opacity,transform]"
      >
        <Image
          src={BRAND_LOGO_CANVAS_SRC}
          alt=""
          width={BRAND_LOGO_WIDTH}
          height={BRAND_LOGO_HEIGHT}
          className="h-8 w-auto"
          priority
        />
      </span>
    </span>
  );
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
  scrolled = false,
}: SiteHeaderNavProps) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introPending, setIntroPending] = useState(() => !headerIntroPlayed);
  const menuId = useId();
  const nextLocale = locales.find((code) => code !== locale) ?? locale;
  const nextHref = pathname.replace(/^\/(en|es)(?=\/|$)/, `/${nextLocale}`);
  // Same chrome on every route: light mark at the top, ink mark after scroll.
  // Pages that still need a dark hero (company, services, …) will catch up later.
  const onCanvas = !scrolled;
  const mobileLinks = contact ? [...items, contact] : items;

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const rootEl = root.current;
      // Skip desktop-only / display:none nodes so mobile intro does not
      // stagger through hidden nav links and delay clearProps on the logo.
      const targets = gsap.utils
        .toArray<HTMLElement>(
          rootEl?.querySelectorAll("[data-header-item]") ?? [],
        )
        .filter((el) => el.getClientRects().length > 0);

      if (!rootEl || targets.length === 0) return;

      const releaseIntroGate = () => {
        queueMicrotask(() => setIntroPending(false));
      };

      if (headerIntroPlayed) {
        releaseIntroGate();
        window.dispatchEvent(new Event("header-intro-done"));
        return;
      }

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        headerIntroPlayed = true;
        releaseIntroGate();
        window.dispatchEvent(new Event("header-intro-done"));
        return;
      }

      // CSS only zeros opacity; GSAP owns the rise so the end state is stable.
      gsap.set(targets, { y: -20, autoAlpha: 0 });
      releaseIntroGate();

      const tween = gsap.to(targets, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.12,
        ease: "power2.out",
        onComplete: () => {
          headerIntroPlayed = true;
          // Only clear transform — clearing opacity/visibility on the logo
          // wrapper (often the sole desktop target) raced the brand mark swap.
          gsap.set(targets, {
            clearProps: "transform",
            autoAlpha: 1,
          });
          window.dispatchEvent(new Event("header-intro-done"));
        },
      });

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
          gsap.set(marker, { x: left, y: top, width, autoAlpha: 1 });
          indicatorReady = true;
        }
      };

      const activeLink = () =>
        rootEl.querySelector<HTMLElement>(
          "[data-nav-link][aria-current='page']",
        );

      /** First reveal: sweep from the left edge to the active item. */
      const enterFromLeft = (link: HTMLElement | null) => {
        if (!link) {
          hide(false);
          return;
        }

        const { left, top, width } = measureLink(rootEl, link);

        if (prefersReduced()) {
          gsap.set(marker, { x: left, y: top, width, autoAlpha: 1 });
          indicatorReady = true;
          return;
        }

        gsap.fromTo(
          marker,
          { x: 0, y: top, width, autoAlpha: 1 },
          {
            x: left,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              indicatorReady = true;
            },
          },
        );
      };

      const snapToActive = () => {
        // Don't kill the entrance sweep with a mid-flight remeasure.
        if (!indicatorReady) return;
        moveTo(activeLink(), false);
      };
      const returnToActive = () => moveTo(activeLink(), true);

      const onPointerOver = (event: PointerEvent) => {
        const link = (event.target as HTMLElement | null)?.closest<HTMLElement>(
          "[data-nav-link]",
        );
        if (!link || !rootEl.contains(link)) return;
        moveTo(link, true);
      };

      // Stay hidden until intro finishes so the bar does not sit over moving items.
      gsap.set(marker, { autoAlpha: 0, x: 0 });
      indicatorReady = false;

      let cancelled = false;
      let armed = false;
      const arm = () => {
        if (cancelled || armed) return;
        armed = true;
        void document.fonts?.ready.then(() => {
          if (!cancelled) enterFromLeft(activeLink());
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
      // Skip the pending gate once GSAP (or a prior visit) owns visibility.
      {...(introPending ? { "data-header-intro": "pending" as const } : {})}
      className="relative flex flex-row items-center justify-between gap-4 md:gap-6"
    >
      <div data-header-item className="shrink-0">
        <HomeLink href={homeHref}>
          <BrandLogo brandName={brandName} onCanvas={onCanvas} />
        </HomeLink>
      </div>

      <nav
        aria-label={mainLabel}
        className="hidden flex-wrap items-center gap-x-5 gap-y-3 md:flex md:justify-center lg:gap-x-7"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={pathname === item.href}
            onCanvas={onCanvas}
          />
        ))}
      </nav>

      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 md:gap-x-5 md:justify-end lg:gap-x-7">
        {contact ? (
          <span className="hidden md:inline-flex">
            <NavLink
              href={contact.href}
              label={contact.label}
              active={pathname === contact.href}
              onCanvas={onCanvas}
            />
          </span>
        ) : null}
        <LanguageSwitch
          href={nextHref}
          nextLocale={nextLocale}
          languageLabel={languageLabel}
          currentLabel={languages[locale]}
          nextLabel={languages[nextLocale]}
          onCanvas={onCanvas}
        />
        <button
          type="button"
          data-header-item
          aria-label={menuOpen ? "Close menu" : "Menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className={`inline-flex items-center justify-center md:hidden ${linkFocus} ${
            onCanvas ? "text-canvas" : "text-ink"
          }`}
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
          ) : (
            <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      <span
        ref={indicator}
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-0 hidden h-px w-0 opacity-0 will-change-transform transition-colors duration-200 md:block ${
          onCanvas ? "bg-canvas" : "bg-ink"
        }`}
      />

      {/* overflow-hidden clips the off-screen slide so it cannot widen the page. */}
      <div
        className={`fixed inset-0 z-40 overflow-hidden md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label={mainLabel}
          aria-hidden={!menuOpen}
          className={`absolute inset-0 flex w-full flex-col bg-ink/80 px-6 pt-24 pb-10 backdrop-blur-md transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav
            aria-label={mainLabel}
            className="flex flex-col items-end gap-5 text-right"
          >
            {mobileLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[15px] font-semibold tracking-[0.16em] uppercase transition-opacity duration-200 ${linkFocus} ${
                    active
                      ? "text-accent opacity-100"
                      : "text-canvas opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Gauge,
  Leaf,
  PencilRuler,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentFrame } from "@/components/general-layout";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURE_IMAGE_SRC = "/images/intervencion_pozos.webp";

const serviceIcons = {
  wrench: Wrench,
  gauge: Gauge,
  pencilRuler: PencilRuler,
  zap: Zap,
  leaf: Leaf,
  droplets: Droplets,
} as const;

export type HomeServiceIconName = keyof typeof serviceIcons;

export type HomeServiceItem = {
  index: string;
  title: string;
  slug: string;
  icon: string;
};

export type HomeServicesSectionProps = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  itemAction: string;
  feature: {
    title: string;
    body: string;
    slug: string;
  };
  items: HomeServiceItem[];
  servicesBasePath: string;
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = (serviceIcons[name as HomeServiceIconName] ??
    Wrench) as ComponentType<LucideProps>;
  return (
    <Icon
      aria-hidden="true"
      className="size-8 shrink-0 text-ink transition-colors duration-300 group-hover:text-canvas sm:size-9"
      strokeWidth={1.5}
    />
  );
}

export function HomeServicesSection({
  index,
  eyebrow,
  title,
  body,
  itemAction,
  feature,
  items,
  servicesBasePath,
}: HomeServicesSectionProps) {
  const section = useRef<HTMLElement>(null);
  const featurePanel = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sectionEl = section.current;
      if (!sectionEl) return;

      const introEls = gsap.utils.toArray<HTMLElement>(
        "[data-services-intro]",
        sectionEl,
      );
      const itemEls = gsap.utils.toArray<HTMLElement>(
        "[data-services-item]",
        sectionEl,
      );
      const featurePanelEl = featurePanel.current;
      const parallaxEl = parallax.current;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReduced) {
        gsap.set([...introEls, ...itemEls, parallaxEl].filter(Boolean), {
          clearProps: "opacity,transform",
        });
        return;
      }

      gsap.set(introEls, { opacity: 0, x: -28 });
      gsap.set(itemEls, { opacity: 0, y: 28 });

      const introTween = gsap.to(introEls, {
        opacity: 1,
        x: 0,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 85%",
          end: "top 55%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      const itemTweens = itemEls.map((item) =>
        gsap.to(item, {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "top 65%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        }),
      );

      let parallaxTween: gsap.core.Tween | undefined;
      if (parallaxEl && featurePanelEl) {
        parallaxTween = gsap.fromTo(
          parallaxEl,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: featurePanelEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      return () => {
        introTween.scrollTrigger?.kill();
        introTween.kill();
        itemTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
        parallaxTween?.scrollTrigger?.kill();
        parallaxTween?.kill();
      };
    },
    { scope: section, dependencies: [items.length] },
  );

  return (
    <section
      ref={section}
      aria-labelledby="home-services-heading"
      className="relative mt-28 w-full sm:mt-36 lg:mt-44"
    >
      <div className={contentFrame}>
        <div className="flex flex-col gap-10 text-ink sm:gap-12 lg:gap-14">
          <div className="flex flex-col gap-6">
            <p
              data-services-intro
              className="text-[11px] font-semibold uppercase tracking-[0.2em] will-change-[opacity,transform]"
            >
              <span className="text-accent">{index}</span>
              <span className="mx-2 text-ink/40" aria-hidden="true">
                /
              </span>
              {eyebrow}
            </p>

            <h2
              data-services-intro
              id="home-services-heading"
              className="max-w-xl text-3xl font-light tracking-[0.04em] text-balance uppercase will-change-[opacity,transform] sm:text-4xl lg:text-5xl"
            >
              {title}
            </h2>
          </div>

          <p
            data-services-intro
            className="max-w-3xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 will-change-[opacity,transform] sm:text-lg"
          >
            {body}
          </p>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {items.map((item) => (
              <li
                key={item.slug}
                data-services-item
                className="will-change-[opacity,transform]"
              >
                <Link
                  href={`${servicesBasePath}#${item.slug}`}
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden border border-ink/20 bg-canvas p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-y-100"
                  />
                  <span className="relative z-10 flex flex-col gap-4 sm:gap-5">
                    <ServiceIcon name={item.icon} />
                    <span className="text-2xl font-medium leading-tight tracking-[0.02em] text-ink transition-colors duration-300 group-hover:text-canvas">
                      {item.title}
                    </span>
                  </span>
                  <span className="relative z-10 flex w-full items-center justify-between gap-3 text-[13px] font-medium tracking-wide text-ink uppercase transition-colors duration-300 group-hover:text-canvas">
                    {itemAction}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.75}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        ref={featurePanel}
        className={`${contentFrame} mt-16 sm:mt-20 lg:mt-24`}
      >
        <Link
          href={`${servicesBasePath}#${feature.slug}`}
          className="group relative flex min-h-[min(70vh,36rem)] items-end justify-start overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-[min(75vh,42rem)]"
        >
          <div
            ref={parallax}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[-28%] z-0 h-[156%] w-full will-change-transform"
          >
            <Image
              src={FEATURE_IMAGE_SRC}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_65%]"
            />
          </div>
          <div className="relative z-10 m-6 flex aspect-square w-1/4 min-w-[10.5rem] flex-col justify-between gap-3 bg-ink p-4 text-canvas sm:m-8 sm:p-5 lg:m-10 lg:p-6">
            <div className="flex w-full flex-col gap-3">
              <h3 className="w-full text-sm font-light tracking-[0.04em] uppercase sm:text-base lg:text-lg">
                {feature.title}
              </h3>
              <p className="w-full text-xs font-light leading-snug tracking-[0.02em] text-canvas/80 sm:text-sm">
                {feature.body}
              </p>
            </div>
            <span className="flex w-full items-center justify-between gap-2 text-[11px] font-medium tracking-wide uppercase sm:text-[12px]">
              {itemAction}
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-4"
                strokeWidth={1.75}
              />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

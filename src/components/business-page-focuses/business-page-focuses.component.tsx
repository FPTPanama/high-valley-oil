import { type ComponentType } from "react";
import {
  Anchor,
  Cog,
  Droplets,
  Factory,
  Gauge,
  Package,
  PencilRuler,
  Route,
  Scale,
  Ship,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import { SiteSection } from "@/components/site-section";

const businessIcons = {
  gauge: Gauge,
  wrench: Wrench,
  factory: Factory,
  droplets: Droplets,
  package: Package,
  route: Route,
  pencilRuler: PencilRuler,
  cog: Cog,
  zap: Zap,
  anchor: Anchor,
  scale: Scale,
  ship: Ship,
} as const;

type BusinessIconName = keyof typeof businessIcons;

export type BusinessPageFocusBlock = {
  title: string;
  info: string;
  icon: string;
};

export type BusinessPageFocus = {
  index: string;
  label: string;
  lead: string;
  blocks: BusinessPageFocusBlock[];
};

export type BusinessPageFocusesProps = {
  eyebrow: string;
  focuses: BusinessPageFocus[];
};

function FocusIcon({ name }: { name: string }) {
  const Icon = (businessIcons[name as BusinessIconName] ??
    Gauge) as ComponentType<LucideProps>;
  return (
    <Icon
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0 text-accent"
      strokeWidth={1.75}
    />
  );
}

export function BusinessPageFocuses({
  eyebrow,
  focuses,
}: BusinessPageFocusesProps) {
  return (
    <SiteSection
      tone="canvas"
      className="mt-8 sm:mt-10 lg:mt-12"
      contentClassName="flex flex-col gap-12 py-12 sm:gap-16 sm:py-16 lg:py-20"
      aria-label={eyebrow}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
        {eyebrow}
      </p>

      <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
        {focuses.map((focus) => (
          <article
            key={focus.index}
            id={`business-focus-${focus.index}`}
            aria-labelledby={`business-focus-${focus.index}-heading`}
            className="grid gap-8 border-t border-ink/20 pt-8 lg:grid-cols-[auto_1.1fr_1fr] lg:gap-12 lg:pt-10"
          >
            <span className="text-sm font-semibold tracking-[0.2em] text-accent">
              {focus.index}
            </span>

            <div className="flex flex-col gap-4 text-ink">
              <h3
                id={`business-focus-${focus.index}-heading`}
                className="text-2xl font-light tracking-[0.04em] text-balance uppercase sm:text-3xl"
              >
                {focus.label}
              </h3>
              <p className="max-w-xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
                {focus.lead}
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {focus.blocks.map((block) => (
                <li
                  key={block.title}
                  className="flex gap-3 border-t border-ink/15 pt-4 text-ink first:border-t-0 first:pt-0"
                >
                  <FocusIcon name={block.icon} />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-base font-medium tracking-[0.02em] sm:text-lg">
                      {block.title}
                    </span>
                    {block.info ? (
                      <span className="text-sm font-light leading-relaxed tracking-[0.02em] text-ink/70">
                        {block.info}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SiteSection>
  );
}

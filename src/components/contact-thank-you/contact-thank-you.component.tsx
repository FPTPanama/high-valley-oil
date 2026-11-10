import {
  contentColumn,
  contentInsetAfterGutter,
  sectionShell,
} from "@/components/general-layout";
import { SiteButton } from "@/components/site-button";

export type ContactThankYouProps = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  homeHref: string;
};

export function ContactThankYou({
  eyebrow,
  title,
  body,
  ctaLabel,
  homeHref,
}: ContactThankYouProps) {
  return (
    <section
      aria-labelledby="contact-thank-you-heading"
      className={`${sectionShell} bg-canvas`}
    >
      <div
        className={`${contentColumn} relative z-10 flex flex-1 flex-col justify-center py-24 sm:py-32`}
      >
        <div
          className={`${contentInsetAfterGutter} flex w-full max-w-2xl flex-col items-start gap-6`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
          <h1
            id="contact-thank-you-heading"
            className="text-4xl font-light tracking-[0.04em] text-balance text-ink uppercase sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          <p className="max-w-xl text-base font-light leading-relaxed tracking-[0.02em] text-ink/80 sm:text-lg">
            {body}
          </p>
          <div className="pt-2">
            <SiteButton href={homeHref}>{ctaLabel}</SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}

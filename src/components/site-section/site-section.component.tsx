import { forwardRef, type ReactNode } from "react";
import {
  contentColumn,
  contentInsetAfterGutter,
} from "@/components/general-layout";

export type SiteSectionTone = "canvas" | "ink" | "accent";

export type SiteSectionProps = {
  children: ReactNode;
  /** Panel surface inside the shared content width. */
  tone?: SiteSectionTone;
  /** Extra classes on the outer `<section>` (spacing around the panel). */
  className?: string;
  /** Extra classes on the framed panel (`contentColumn`). */
  frameClassName?: string;
  /** Extra classes on the padded content box (grid, gaps, py, etc.). */
  contentClassName?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

const toneClassName: Record<SiteSectionTone, string> = {
  canvas: "bg-transparent text-ink",
  ink: "bg-ink text-canvas",
  accent: "bg-accent text-canvas",
};

/**
 * Shared home/content column: `contentColumn` (frame + mobile gutter) like the hero.
 * Put section backgrounds on the framed panel via `tone`, not full-bleed.
 * `ref` points at the framed panel (useful for GSAP).
 */
export const SiteSection = forwardRef<HTMLDivElement, SiteSectionProps>(
  function SiteSection(
    {
      children,
      tone = "canvas",
      className = "",
      frameClassName = "",
      contentClassName = "",
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    },
    ref,
  ) {
    return (
      <section
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={`relative w-full ${className}`}
      >
        <div
          ref={ref}
          className={`${contentColumn} overflow-hidden ${toneClassName[tone]} ${frameClassName}`}
        >
          <div className={`${contentInsetAfterGutter} ${contentClassName}`}>
            {children}
          </div>
        </div>
      </section>
    );
  },
);

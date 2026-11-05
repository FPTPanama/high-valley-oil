import type { ReactNode } from "react";

/** Max content width shared by header, hero frame, footer, and pages. */
export const contentFrame = "mx-auto w-full max-w-6xl";

/**
 * Mobile-only outer gutter — same px as the header bar.
 * Use on the section shell so panels/borders sit inside the margin (not only the text).
 * No-op from `sm` up so desktop keeps the full `contentFrame` width.
 */
export const contentMobileGutter = "px-6 sm:px-0";

/** Shared page column: `contentFrame` + mobile gutter. Prefer this for section shells. */
export const contentColumn = `${contentFrame} ${contentMobileGutter}`;

/** Horizontal inset inside the content frame — same as the header bar. */
export const contentInset = "px-6 sm:px-6 lg:px-8";

/**
 * Inset when the parent already applies `contentMobileGutter`.
 * Avoids double padding on mobile; matches header inset from `sm` up.
 */
export const contentInsetAfterGutter = "px-0 sm:px-6 lg:px-8";

/** Frame + inset in one class (typical page columns / header / footer). */
export const contentFramePadded = `${contentFrame} ${contentInset}`;

/** Optional full-viewport shell (e.g. home hero). Not required for every section. */
export const sectionShell = "relative flex min-h-dvh w-full flex-col";

/** Stack for home sections (no forced gap; height comes from each block’s content). */
export const sectionStackGap = "gap-0";

export function GeneralLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${contentFramePadded} flex flex-1 flex-col pt-36 pb-8 sm:pt-40 sm:pb-12 lg:pb-16`}
    >
      {children}
    </div>
  );
}

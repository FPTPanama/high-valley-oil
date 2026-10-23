import type { ReactNode } from "react";

/** Max content width shared by header, hero frame, footer, and pages. */
export const contentFrame = "mx-auto w-full max-w-6xl";

/** Horizontal inset inside the content frame. */
export const contentInset = "px-4 sm:px-6 lg:px-8";

/** Frame + inset in one class (typical page columns). */
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

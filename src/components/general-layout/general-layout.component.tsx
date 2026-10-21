import type { ReactNode } from "react";

export const contentFrame = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export function GeneralLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${contentFrame} flex flex-1 flex-col py-8 sm:py-12 lg:py-16`}
    >
      {children}
    </div>
  );
}

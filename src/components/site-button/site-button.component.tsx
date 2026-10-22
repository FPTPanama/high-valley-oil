import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export type SiteButtonProps = {
  href: string;
  children: ReactNode;
  /** Defaults to ArrowRight. Pass `null` to hide the icon. */
  icon?: ReactNode | null;
  className?: string;
};

function DrawBorder() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Clockwise draw on enter; reverse on leave via delay swap */}
      <span className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform delay-300 duration-100 ease-linear group-hover:scale-x-100 group-hover:delay-0" />
      <span className="absolute top-0 right-0 h-full w-px origin-top scale-y-0 bg-ink transition-transform delay-200 duration-100 ease-linear group-hover:scale-y-100 group-hover:delay-100" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform delay-100 duration-100 ease-linear group-hover:scale-x-100 group-hover:delay-200" />
      <span className="absolute top-0 left-0 h-full w-px origin-bottom scale-y-0 bg-ink transition-transform delay-0 duration-100 ease-linear group-hover:scale-y-100 group-hover:delay-300" />
    </span>
  );
}

export function SiteButton({
  href,
  children,
  icon,
  className = "",
}: SiteButtonProps) {
  const resolvedIcon =
    icon === null ? null : (icon ?? (
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    ));

  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-3 bg-accent px-5 py-3 text-[13px] font-medium tracking-wide text-ink transition-[gap,background-color] duration-100 hover:gap-24 hover:bg-canvas sm:hover:gap-32 ${linkFocus} ${className}`}
    >
      <DrawBorder />
      {children}
      {resolvedIcon}
    </Link>
  );
}

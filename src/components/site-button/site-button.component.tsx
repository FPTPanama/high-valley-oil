import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export type SiteButtonLayout = "gap" | "spread";
export type SiteButtonTone = "accent" | "ink";

type SiteButtonSharedProps = {
  children: ReactNode;
  /** Defaults to ArrowRight. Pass `null` to hide the icon. */
  icon?: ReactNode | null;
  /**
   * `gap` — icon separates with a growing hover gap (default).
   * `spread` — full-width; `justify-start` at rest, `justify-between` on hover.
   */
  layout?: SiteButtonLayout;
  /** Fill color at rest. Defaults to `accent`. */
  tone?: SiteButtonTone;
  className?: string;
};

export type SiteButtonProps = SiteButtonSharedProps &
  (
    | { href: string; type?: never }
    | {
        href?: undefined;
        type: Extract<
          ButtonHTMLAttributes<HTMLButtonElement>["type"],
          "button" | "submit" | "reset"
        >;
      }
  );

function DrawBorder({ edgeClassName }: { edgeClassName: string }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Clockwise draw on enter; reverse on leave via delay swap */}
      <span
        className={`absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform delay-300 duration-100 ease-linear group-hover:scale-x-100 group-hover:delay-0 ${edgeClassName}`}
      />
      <span
        className={`absolute top-0 right-0 h-full w-px origin-top scale-y-0 transition-transform delay-200 duration-100 ease-linear group-hover:scale-y-100 group-hover:delay-100 ${edgeClassName}`}
      />
      <span
        className={`absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 transition-transform delay-100 duration-100 ease-linear group-hover:scale-x-100 group-hover:delay-200 ${edgeClassName}`}
      />
      <span
        className={`absolute top-0 left-0 h-full w-px origin-bottom scale-y-0 transition-transform delay-0 duration-100 ease-linear group-hover:scale-y-100 group-hover:delay-300 ${edgeClassName}`}
      />
    </span>
  );
}

const layoutClassName: Record<SiteButtonLayout, string> = {
  gap: "gap-3 transition-[gap,background-color,color] duration-100 hover:gap-24 sm:hover:gap-32",
  spread:
    "w-full justify-start gap-3 transition-[background-color,color,justify-content] duration-100 hover:justify-between",
};

const toneClassName: Record<
  SiteButtonTone,
  { rest: string; hover: string; border: string }
> = {
  accent: {
    rest: "bg-accent text-canvas",
    hover: "hover:bg-canvas hover:text-ink",
    border: "bg-ink",
  },
  ink: {
    rest: "bg-ink text-canvas",
    hover: "hover:bg-canvas hover:text-ink",
    border: "bg-ink",
  },
};

/** Spread hover text matches the fill tone (accent stays accent; ink stays ink). */
const spreadHoverTextClassName: Record<SiteButtonTone, string> = {
  accent: "hover:text-accent",
  ink: "hover:text-ink",
};

export function SiteButton({
  children,
  icon,
  layout = "gap",
  tone = "accent",
  className = "",
  ...props
}: SiteButtonProps) {
  const resolvedIcon =
    icon === null
      ? null
      : (icon ?? <ArrowRight aria-hidden="true" className="size-4 shrink-0" />);

  const toneStyles = toneClassName[tone];
  const borderEdgeClassName =
    layout === "spread" && tone === "accent" ? "bg-accent" : toneStyles.border;
  const hoverClassName =
    layout === "spread"
      ? `hover:bg-canvas ${spreadHoverTextClassName[tone]}`
      : toneStyles.hover;

  const classNames = `group relative inline-flex items-center px-5 py-3 text-[13px] font-medium tracking-wide uppercase ${toneStyles.rest} ${layoutClassName[layout]} ${hoverClassName} ${linkFocus} ${className}`;

  const content = (
    <>
      <DrawBorder edgeClassName={borderEdgeClassName} />
      <span className="min-w-0 text-left">{children}</span>
      {resolvedIcon}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classNames}>
        {content}
      </Link>
    );
  }

  return (
    <button type={props.type} className={classNames}>
      {content}
    </button>
  );
}

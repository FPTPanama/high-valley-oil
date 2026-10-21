"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function HomeLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`text-xs font-black uppercase tracking-[0.18em] text-ink ${linkFocus}`}
    >
      {children}
    </Link>
  );
}

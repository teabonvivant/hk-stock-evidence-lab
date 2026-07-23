"use client";

import {
  BookOpen,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  GraduationCap,
  LibraryBig,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const desktopItems = [
  { href: "/learn", label: "學習", icon: GraduationCap },
  { href: "/indicators", label: "指標百科", icon: LibraryBig },
  { href: "/compare", label: "比較", icon: GitCompareArrows },
  { href: "/casebook", label: "港股實例", icon: BookOpen },
  { href: "/strategy-cases", label: "回測研究", icon: FlaskConical },
  { href: "/toolbox", label: "工具", icon: Gauge },
  { href: "/trust", label: "信任中心", icon: ShieldCheck },
] as const;

const mobileItems = [
  { href: "/", label: "首頁", icon: BookOpen },
  { href: "/learn", label: "學習", icon: GraduationCap },
  { href: "/indicators", label: "指標", icon: LibraryBig },
  { href: "/strategy-cases", label: "研究", icon: FlaskConical },
  { href: "/trust", label: "信任", icon: ShieldCheck },
] as const;

export function SiteNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="主要導覽" className="site-nav">
      {desktopItems.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="流動版主要導覽" className="mobile-nav">
      {mobileItems.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

type NavItem = (typeof desktopItems)[number] | (typeof mobileItems)[number];

function NavLink({ item, pathname }: { readonly item: NavItem; readonly pathname: string }) {
  const Icon = item.icon;
  const isCurrent = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  return (
    <Link href={item.href} aria-current={isCurrent ? "page" : undefined}>
      <Icon aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

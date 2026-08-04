"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const t = useTranslations("header");
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors duration-300",
      pathname === href
        ? "text-primary"
        : "text-foreground/80 hover:text-primary"
    );

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/" title={t("viewer")} className={linkClass("/")}>
        {t("viewer")}
      </Link>
      <Link href="/svg-optimizer" title={t("optimizer")} className={linkClass("/svg-optimizer")}>
        {t("optimizer")}
      </Link>
      <div className="relative group">
        <button className={cn("text-sm font-medium transition-colors duration-300", pathname.startsWith("/svg-converter") || pathname.startsWith("/svg-to-png") ? "text-primary" : "text-foreground/80 hover:text-primary")}>
          {t("converter")}
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
          <Link href="/svg-converter" title={t("converter")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300 first:rounded-t-xl last:rounded-b-xl">
            {t("converter")}
          </Link>
          <Link href="/svg-to-png" title={t("svgToPng")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300 first:rounded-t-xl last:rounded-b-xl">
            {t("svgToPng")}
          </Link>
        </div>
      </div>
      <div className="relative group">
        <button className={cn("text-sm font-medium transition-colors duration-300", pathname.startsWith("/free-svg") || pathname.startsWith("/category") ? "text-primary" : "text-foreground/80 hover:text-primary")}>
          {t("svgCollection")}
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
          <Link href="/free-svg" title={t("freeSvgCollections")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300 first:rounded-t-xl last:rounded-b-xl">
            {t("freeSvgCollections")}
          </Link>
          <Link href="/category/heart" title={t("heartSvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300">
            {t("heartSvg")}
          </Link>
          <Link href="/category/hello-kitty" title={t("helloKittySvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300">
            {t("helloKittySvg")}
          </Link>
          <Link href="/category/btc-logo" title={t("btcLogoSvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300">
            {t("btcLogoSvg")}
          </Link>
          <Link href="/category/japanese-culture" title={t("japaneseCultureSvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300">
            {t("japaneseCultureSvg")}
          </Link>
          <Link href="/category/flower" title={t("flowerSvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300">
            {t("flowerSvg")}
          </Link>
          <Link href="/category/butterfly" title={t("butterflySvg")} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent/50 transition-colors duration-300 last:rounded-b-xl">
            {t("butterflySvg")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

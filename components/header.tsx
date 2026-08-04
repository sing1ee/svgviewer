import {Link} from "@/i18n/navigation";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import LocaleSwitcher from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks } from "./nav-links";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations('header');
  return (
    <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" title={t('siteName')} className="flex items-center gap-2 hover:opacity-80 transition-all duration-300">
              <Image src="/logo.png" alt={t('siteName')} width={32} height={32} className="rounded-lg shadow-sm" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('siteName')}</span>
            </Link>
          </div>
          <NavLinks />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
            <MobileNav />
          </div>
        </div>
      </header>
  );
}

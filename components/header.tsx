import {Link} from "@/i18n/navigation";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";
import LocaleSwitcher from "./locale-switcher";
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
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" title={t('viewer')} className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
              {t('viewer')}
            </Link>
            <Link href="/svg-optimizer" title={t('optimizer')} className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
              {t('optimizer')}
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
                {t('converter')}
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
                <Link href="/svg-converter" title={t('converter')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  {t('converter')}
                </Link>
                <Link href="/svg-to-png" title={t('svgToPng')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  {t('svgToPng')}
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
                {t('svgCollection')}
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
                <Link href="/free-svg" title={t('freeSvgCollections')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  {t('freeSvgCollections')}
                </Link>
                <Link href="/category/heart" title={t('heartSvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('heartSvg')}
                </Link>
                <Link href="/category/hello-kitty" title={t('helloKittySvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('helloKittySvg')}
                </Link>
                <Link href="/category/btc-logo" title={t('btcLogoSvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('btcLogoSvg')}
                </Link>
                <Link href="/category/japanese-culture" title={t('japaneseCultureSvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('japaneseCultureSvg')}
                </Link>
                <Link href="/category/flower" title={t('flowerSvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('flowerSvg')}
                </Link>
                <Link href="/category/butterfly" title={t('butterflySvg')} className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  {t('butterflySvg')}
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <MobileNav />
          </div>
        </div>
      </header>
  );
}
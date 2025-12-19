import {Link} from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import links from '@/data/links.json';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="border-t border-border/40 py-12 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-lg shadow-sm" />
                <span className="font-poppins font-bold text-xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('siteName')}</span>
              </div>
              <div className="text-sm text-foreground/70">
                © {new Date().getFullYear()} {t('copyright')}
              </div>
              <a 
                href="https://fazier.com" 
                target="_blank" 
                rel="dofollow" 
                className="text-sm text-foreground/70 hover:text-primary transition-all duration-300"
              >
                <img 
                  src="https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=launched&theme=light" 
                  width={120} 
                  alt="Fazier badge" 
                  className="mt-2"
                />
              </a>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-medium text-sm text-foreground/90">{t('navigation')}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/" title={t('viewer')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('viewer')}
                  </Link>
                </li>
                <li>
                  <Link href="/svg-optimizer" title={t('optimizer')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('optimizer')}
                  </Link>
                </li>
                <li>
                  <Link href="/svg-converter" title={t('converter')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('converter')}
                  </Link>
                </li>
                <li>
                  <Link href="/svg-to-png" title={t('svgToPng')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('svgToPng')}
                  </Link>
                </li>
                <li>
                  <Link href="/free-svg" title={t('freeSvgCollections')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('freeSvgCollections')}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" title={t('blog')} className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('blog')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-medium text-sm text-foreground/90">{t('legal')}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="/privacy.html" title='Privacy Policy' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('privacy')}
                  </a>
                </li>
                <li>
                  <a href="/terms.html" title='Terms of Service' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    {t('terms')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Languages and Friends Links */}
            <div className="flex flex-col items-center md:items-start gap-6">
              {/* Languages */}
              <div className="w-full">
                <h3 className="font-medium text-sm text-foreground/90 mb-3">{t('languages')}</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/en" locale="en" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      English
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="zh" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      中文
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="zh-TW" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      繁體中文
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="ja" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      日本語
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="ru" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      русский
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="pt" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      português
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="es" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      español
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="ko" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      한국어
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="ar" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      العربية
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="hi" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      हिंदी
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="fr" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      français
                    </Link>
                  </li>
                  <li>
                    <Link href="/" locale="de" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      deutsch
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-slate-700/50">
            <h3 className="font-semibold mb-4">
              Friendly Links
            </h3>
            <div className="flex flex-wrap gap-3 text-slate-400">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 hover:text-primary transition-all duration-300"
                  title={link.name}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}
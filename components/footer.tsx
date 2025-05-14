import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="border-t border-border/40 py-12 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-lg shadow-sm" />
                <span className="font-poppins font-bold text-xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{t('siteName')}</span>
              </div>
              <div className="text-sm text-foreground/70">
                © {new Date().getFullYear()} {t('copyright')}
              </div>
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
                <li className="pt-2 border-t border-border/40">
                  <h4 className="text-sm font-medium text-foreground/90 mb-2">{t('languages')}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/en" locale="en" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      English
                    </Link>
                    <Link href="/zh" locale="zh" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      中文
                    </Link>
                    <Link href="/zh-TW" locale="zh-TW" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      繁體中文
                    </Link>
                    <Link href="/ja" locale="ja" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      日本語
                    </Link>
                    <Link href="/ru" locale="ru" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      русский
                    </Link>
                    <Link href="/pt" locale="pt" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      português
                    </Link>
                    <Link href="/es" locale="es" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      español
                    </Link>
                    <Link href="/ko" locale="ko" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      한국어
                    </Link>
                    <Link href="/ar" locale="ar" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      العربية
                    </Link>
                    <Link href="/hi" locale="hi" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      हिंदी
                    </Link>
                    <Link href="/fr" locale="fr" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      français
                    </Link>
                    <Link href="/de" locale="de" className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                      deutsch
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            {/* Friends Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-medium text-sm text-foreground/90">{t('friends')}</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a 
                    href="https://qwq32.com/" 
                    target="_blank" 
                    rel="dofollow" 
                    className="text-sm text-foreground/70 hover:text-primary transition-all duration-300"
                  >
                    QwQ AI
                  </a>
                </li>
                <li>
                  <a 
                    href="https://deepbolt.xyz" 
                    target="_blank" 
                    rel="dofollow" 
                    className="text-sm text-foreground/70 hover:text-primary transition-all duration-300"
                  >
                    DeepBolt
                  </a>
                </li>
                <li>
                  <a 
                    href="https://a2aprotocol.ai" 
                    target="_blank" 
                    rel="dofollow" 
                    className="text-sm text-foreground/70 hover:text-primary transition-all duration-300"
                  >
                    A2AProtocol.ai
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
  );
}
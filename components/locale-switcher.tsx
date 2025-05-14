'use client';

import { useParams } from 'next/navigation';
import { Locale, useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const localesMap = {
  "en": "English",
  "zh": "中文",
  "zh-TW": "繁體中文",
  "ja": "日本語",
  "ru": "русский",
  "pt": "português",
  "es": "español",
  "ko": "한국어",
  "ar": "العربية",
  "hi": "हिंदी",
  "fr": "français",
  "de": "deutsch",
}

export default function LocaleSwitcher() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = useLocale();

  function onSelectChange(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale }
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full hover:bg-accent/50 transition-colors",
            isPending && "opacity-50"
          )}
          disabled={isPending}
        >
          <Globe className="h-[1.25rem] w-[1.25rem] text-muted-foreground" />
          <span className="sr-only">{t('changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg"
      >
        {Object.entries(localesMap).map(([locale, name]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onSelectChange(locale as Locale)}
            className={cn(
              "cursor-pointer px-3 py-2 text-sm",
              currentLocale === locale
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {name}
          </DropdownMenuItem> 
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 

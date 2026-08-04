'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Locale, useLocale } from 'next-intl';
import { useTransition, Suspense } from 'react';
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
import { locales } from '@/i18n/locales';

function LocaleSwitcherContent() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  function onSelectChange(locale: Locale) {
    startTransition(() => {
      // 保留当前的查询参数
      const currentSearchParams = searchParams.toString();
      const pathnameWithParams = currentSearchParams 
        ? `${pathname}?${currentSearchParams}` 
        : pathname;
      
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname: pathnameWithParams, params },
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
        {locales.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => onSelectChange(code as Locale)}
            className={cn(
              "cursor-pointer px-3 py-2 text-sm",
              currentLocale === code
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function LocaleSwitcher() {
  return (
    <Suspense fallback={
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-accent/50 transition-colors opacity-50"
        disabled
      >
        <Globe className="h-[1.25rem] w-[1.25rem] text-muted-foreground" />
        <span className="sr-only">Loading...</span>
      </Button>
    }>
      <LocaleSwitcherContent />
    </Suspense>
  );
}

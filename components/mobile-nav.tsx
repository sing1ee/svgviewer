"use client";

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import { useTranslations } from 'next-intl';
export function MobileNav() {
  const t = useTranslations('header');
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col gap-4">
          <Link 
            href="/" 
            title='SVGViewer'
            className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            {t('viewer')}
          </Link>
          <Link 
            href="/svg-optimizer" 
            title='SVG Optimizer'
            className={`text-sm font-medium transition-colors ${pathname === '/svg-optimizer' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            {t('optimizer')}
          </Link>
          <Link 
            href="/svg-converter" 
            title='SVG Converter'
            className={`text-sm font-medium transition-colors ${pathname === '/svg-converter' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            {t('converter')}
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
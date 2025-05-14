import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" title='SVGViewer' className="flex items-center gap-2 hover:opacity-80 transition-all duration-300">
              <Image src="/logo.png" alt="SVGViewer Logo" width={32} height={32} className="rounded-lg shadow-sm" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" title='SVGViewer' className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
              Viewer
            </Link>
            <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
              Optimizer
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
                Converter
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
                <Link href="/svg-converter" title="SVG Converter" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  SVG Converter
                </Link>
                <Link href="/svg-to-png" title="SVG to PNG" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  SVG to PNG
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300">
                SVG Collection
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border/40">
                <Link href="/free-svg" title="Free SVG Collections" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300 first:rounded-t-xl last:rounded-b-xl">
                  Free SVG Collections
                </Link>
                <Link href="/category/heart" title="Heart SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Heart
                </Link>
                <Link href="/category/hello-kitty" title="Hello Kitty SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Hello Kitty
                </Link>
                <Link href="/category/btc-logo" title="BTC Logo SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  BTC Logo
                </Link>
                <Link href="/category/japanese-culture" title="Japanese Culture SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Japanese Culture
                </Link>
                <Link href="/category/flower" title="Flower SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Flower
                </Link>
                <Link href="/category/butterfly" title="Butterfly SVGs" className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-300">
                  Butterfly
                </Link>
              </div>
            </div>
          </nav>
          <MobileNav />
        </div>
      </header>
  );
}
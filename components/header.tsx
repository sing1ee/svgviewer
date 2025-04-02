import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" title='SVGViewer' className="flex items-center gap-2">
              <Image src="/logo.png" alt="SVGViewer Logo" width={32} height={32} className="rounded-md" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" title='SVGViewer' className="text-sm font-medium transition-colors">
              Viewer
            </Link>
            <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm font-medium transition-colors">
              Optimizer
            </Link>
            <Link href="/svg-converter" title='SVG Converter' className="text-sm font-medium transition-colors">
              Converter
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium transition-colors">
                SVG Collection
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/category/heart" title="Heart SVGs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Heart
                </Link>
                <Link href="/category/hello-kitty" title="Hello Kitty SVGs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Hello Kitty
                </Link>
                <Link href="/category/btc-logo" title="BTC Logo SVGs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  BTC Logo
                </Link>
                <Link href="/category/japanese-culture" title="Japanese Culture SVGs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Japanese Culture
                </Link>
              </div>
            </div>
          </nav>
          <MobileNav />
        </div>
      </header>
  );
}
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
          </nav>
          <MobileNav />
        </div>
      </header>
  );
}
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="border-t py-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-md" />
              <span className="font-poppins font-bold text-xl">SVGViewer</span>
            </div>
            <div className="flex gap-8">
              <Link href="/" title='SVGViewer' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Viewer
              </Link>
              <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Optimizer
              </Link>
              <Link href="/svg-converter" title='SVG Converter' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Converter
              </Link>
              <Link href="/blog" title='Blog' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="/privacy.html" title='Privacy Policy' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/terms.html" title='Terms of Service' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SVGViewer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
  );
}
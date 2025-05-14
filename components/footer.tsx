import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-lg shadow-sm" />
                <span className="font-poppins font-bold text-xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
              </div>
              <div className="text-sm text-foreground/70">
                © {new Date().getFullYear()} SVGViewer. All rights reserved.
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-medium text-sm text-foreground/90">Navigation</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/" title='SVGViewer' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Viewer
                  </Link>
                </li>
                <li>
                  <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Optimizer
                  </Link>
                </li>
                <li>
                  <Link href="/svg-converter" title='SVG Converter' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Converter
                  </Link>
                </li>
                <li>
                  <Link href="/svg-to-png" title='SVG to PNG' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    SVG to PNG
                  </Link>
                </li>
                <li>
                  <Link href="/free-svg" title='Free SVG Collections' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Free SVG Collections
                  </Link>
                </li>
                <li>
                  <Link href="/blog" title='Blog' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href="/privacy.html" title='Privacy Policy' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="/terms.html" title='Terms of Service' className="text-sm text-foreground/70 hover:text-primary transition-all duration-300">
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            {/* Friends Links */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="font-medium text-sm text-foreground/90">Friends</h3>
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
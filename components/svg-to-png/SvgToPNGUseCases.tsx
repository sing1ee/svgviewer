import { Card } from '@/components/ui/card';

export default function SvgToPNGUseCases() {
  return (
    <section className="my-16 bg-card p-8 rounded-xl shadow-lg gradient-border">
      <h2 className="text-3xl font-bold mb-6 text-center">SVG to PNG Converter Use Cases</h2>
      <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
        Our SVG to PNG converter is a versatile tool that helps you transform vector graphics into high-quality PNG images for various applications. Here are some common use cases where SVG to PNG conversion proves invaluable.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">Social Media Graphics</h3>
            <p className="text-muted-foreground flex-grow">
              Convert your SVG logos and graphics to PNG for use on social media platforms. Our SVG to PNG converter ensures your brand assets look crisp and professional across all social networks.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Profile pictures and cover images</li>
              <li>• Post graphics and banners</li>
              <li>• Story and reel content</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">Website Assets</h3>
            <p className="text-muted-foreground flex-grow">
              Use our SVG to PNG converter to create website elements that maintain quality across all devices. Perfect for creating favicons, hero images, and other web graphics.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Favicons and site icons</li>
              <li>• Hero section images</li>
              <li>• Background patterns</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">Open Graph Images</h3>
            <p className="text-muted-foreground flex-grow">
              Create perfect Open Graph images for social sharing using our SVG to PNG converter. Ensure your content looks great when shared on platforms like Twitter, Facebook, and LinkedIn.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Blog post previews</li>
              <li>• Product share cards</li>
              <li>• Article thumbnails</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">Print Materials</h3>
            <p className="text-muted-foreground flex-grow">
              Convert your SVG designs to high-resolution PNG files for print materials. Our SVG to PNG converter maintains quality for business cards, brochures, and other printed materials.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Business cards and letterheads</li>
              <li>• Brochures and flyers</li>
              <li>• Posters and banners</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">App Development</h3>
            <p className="text-muted-foreground flex-grow">
              Use our SVG to PNG converter to create app icons and UI elements. Perfect for mobile and desktop applications that require high-quality graphics.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• App icons and splash screens</li>
              <li>• UI elements and buttons</li>
              <li>• In-app graphics</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-3 text-primary">Email Marketing</h3>
            <p className="text-muted-foreground flex-grow">
              Convert your SVG graphics to PNG for email campaigns. Our SVG to PNG converter ensures your emails look great across all email clients and devices.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Email headers and footers</li>
              <li>• Newsletter graphics</li>
              <li>• Product showcase images</li>
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground">
          Our SVG to PNG converter is your go-to tool for all these use cases and more. Whether you're a designer, developer, or marketer, converting SVG to PNG has never been easier.
        </p>
      </div>
    </section>
  );
} 
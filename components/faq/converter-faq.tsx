import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ConverterFaq() {
  return (
    <section className="my-16 bg-card p-8 rounded-xl shadow-lg gradient-border">
      <h2 className="text-3xl font-bold mb-6 text-center">SVG Converter FAQ</h2>
      <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
        Our SVG converter tool allows you to convert SVG files to various image formats including PNG, JPEG, WebP and ICO. The SVG converter maintains high quality while transforming vector graphics to raster images.
      </p>
      
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">SVG Converter Frequently Asked Questions</h3>
        
        <Accordion type="single" collapsible className="w-full mb-12">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-lg font-medium">What is an SVG converter?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              An SVG converter is a tool that transforms SVG (Scalable Vector Graphics) files into raster image formats like PNG, JPEG, WebP or ICO. Our SVG converter works by rendering the vector graphics and capturing the result as a bitmap image. The SVG converter is essential when you need to use your vector graphics in contexts that don't support SVG format, such as certain social media platforms, older applications, or when specific raster formats are required.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-lg font-medium">How does this SVG converter work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our SVG converter renders your SVG file in the browser and then captures the output as a raster image. The SVG converter allows you to choose from different output formats (PNG, JPEG, WebP，ICO) and set the scale factor to control the resolution of the converted image. Simply paste your SVG code or upload an SVG file, select your desired format and settings, and our SVG converter will generate a high-quality image that you can download.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Why would I need to convert SVG to PNG?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Converting SVG to PNG is useful in many scenarios. PNG supports transparency like SVG but works in environments where SVG isn't supported. Our SVG to PNG converter creates high-quality transparent PNG images that maintain the crispness of your original SVG. The SVG to PNG conversion is perfect for using vector graphics in applications, websites, or platforms that don't support SVG format but do support PNG. Additionally, PNG is widely compatible across all devices and browsers.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-lg font-medium">When should I convert SVG to JPEG?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Converting SVG to JPEG is ideal when file size is a priority and your image doesn't require transparency. Our SVG to JPEG converter produces smaller file sizes than PNG, making it perfect for web images where loading speed is crucial. The SVG to JPEG conversion is also useful when you need to use your vector graphics in systems that only accept JPEG format, such as certain content management systems, email platforms, or when creating print materials where transparency isn't needed.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b">
            <AccordionTrigger className="text-lg font-medium">What are the benefits of converting SVG to WebP?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              WebP offers the best of both worlds: smaller file sizes than PNG while supporting transparency like PNG. Our SVG to WebP converter creates images that load faster on websites while maintaining high quality. The SVG to WebP conversion is ideal for modern web projects where performance is important. WebP is supported by all major browsers and provides excellent compression, making it a great choice for web graphics converted from SVG.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Why convert SVG to ICO?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              ICO files are primarily used for website favicons and Windows application icons. Our SVG to ICO converter allows you to transform your vector logos or icons into the ICO format required for these specific uses. The SVG to ICO conversion ensures your branding remains consistent across all touchpoints. Our converter creates ICO files that work well at small sizes while maintaining clarity and recognizability.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Will I lose quality when converting SVG to raster formats?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Unlike SVG, raster formats like PNG, JPEG, WebP, and ICO have fixed resolutions. Our SVG converter allows you to set a scale factor to ensure your converted image has sufficient resolution for your needs. For web graphics, our default settings produce excellent results. For print or large-format displays, you can increase the scale factor to create higher-resolution outputs. While vector SVGs can scale infinitely without quality loss, our converter produces the highest quality raster versions possible.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium">Is this SVG converter free to use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG converter is completely free to use with no limitations. You can convert as many SVG files as you need to PNG, JPEG, WebP, or ICO formats without any cost. The SVG converter processes your files directly in your browser, ensuring your data remains private and secure. There's no need to create an account or provide any personal information to use our SVG converter.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <h3 className="text-2xl font-semibold mb-6">SVG Converter Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Multiple Output Formats</h4>
            <p className="text-muted-foreground">Convert your SVG files to PNG, JPEG, WebP, or ICO formats depending on your specific needs.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Adjustable Resolution</h4>
            <p className="text-muted-foreground">Control the quality and size of your converted images with customizable scale factors.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Transparency Support</h4>
            <p className="text-muted-foreground">Maintain transparency in your PNG and WebP conversions for versatile use in various contexts.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Browser-based Processing</h4>
            <p className="text-muted-foreground">Convert your SVG files directly in your browser with no need to upload them to external servers.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
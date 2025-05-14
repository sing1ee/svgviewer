import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function SvgToPNGFAQ() {
  return (
    <section className="my-16 bg-card p-8 rounded-xl shadow-lg gradient-border">
      <h2 className="text-3xl font-bold mb-6 text-center">SVG to PNG Converter FAQ</h2>
      <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
        Our SVG to PNG converter tool allows you to transform SVG files into high-quality PNG images. The SVG to PNG converter maintains the highest possible quality while converting vector graphics to raster format.
      </p>
      
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">SVG to PNG Converter Frequently Asked Questions</h3>
        
        <Accordion type="single" collapsible className="w-full mb-12">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-lg font-medium">What is SVG to PNG conversion?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              SVG to PNG conversion is the process of transforming Scalable Vector Graphics (SVG) files into Portable Network Graphics (PNG) format. Our SVG to PNG converter works by rendering the vector graphics and capturing the result as a high-quality PNG image. The SVG to PNG converter is essential when you need to use your vector graphics in contexts that don't support SVG format, such as certain social media platforms, older applications, or when specific raster formats are required.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-lg font-medium">How does this SVG to PNG converter work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our SVG to PNG converter renders your SVG file in the browser and then captures the output as a PNG image. The SVG to PNG converter allows you to set the scale factor to control the resolution of the converted image. Simply paste your SVG code or upload an SVG file, and our SVG to PNG converter will generate a high-quality PNG that you can download.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Why would I need to convert SVG to PNG?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Converting SVG to PNG is useful in many scenarios. PNG supports transparency like SVG but works in environments where SVG isn't supported. Our SVG to PNG converter creates high-quality transparent PNG images that maintain the crispness of your original SVG. The SVG to PNG conversion is perfect for using vector graphics in applications, websites, or platforms that don't support SVG format but do support PNG. Additionally, PNG is widely compatible across all devices and browsers.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Will I lose quality when converting SVG to PNG?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Unlike SVG, PNG has a fixed resolution. Our SVG to PNG converter allows you to set a scale factor to ensure your converted image has sufficient resolution for your needs. For web graphics, our default settings produce excellent results. For print or large-format displays, you can increase the scale factor to create higher-resolution outputs. While vector SVGs can scale infinitely without quality loss, our SVG to PNG converter produces the highest quality PNG versions possible.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Can I customize the PNG output?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG to PNG converter allows you to customize various aspects of the output. You can adjust the resolution, set the background color, and control transparency settings. The SVG to PNG converter gives you full control over the final PNG image to ensure it meets your specific requirements.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Is SVG to PNG conversion lossless?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              While PNG is a lossless format, converting from SVG to PNG involves rasterization, which means the vector information is converted to pixels. The quality of the SVG to PNG conversion depends on the resolution you choose. Our SVG to PNG converter uses high-quality rendering to ensure the best possible results.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7" className="border-b">
            <AccordionTrigger className="text-lg font-medium">What are the best practices for SVG to PNG conversion?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              For optimal SVG to PNG conversion results, ensure your SVG files are well-formed, choose an appropriate resolution for your needs, and consider the target display size when setting the output dimensions. Our SVG to PNG converter provides guidance and tools to help you achieve the best results.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium">Is this SVG to PNG converter free to use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG to PNG converter is completely free to use with no limitations. You can convert as many SVG files to PNG as you need without any cost. The SVG to PNG converter processes your files directly in your browser, ensuring your data remains private and secure. There's no need to create an account or provide any personal information to use our SVG to PNG converter.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <h3 className="text-2xl font-semibold mb-6">SVG to PNG Converter Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">High-Quality Output</h4>
            <p className="text-muted-foreground">Our SVG to PNG converter produces high-quality PNG images that maintain the clarity and detail of your original SVG files.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Adjustable Resolution</h4>
            <p className="text-muted-foreground">Control the quality and size of your converted PNG images with customizable scale factors in our SVG to PNG converter.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Transparency Support</h4>
            <p className="text-muted-foreground">Maintain transparency in your PNG conversions for versatile use in various contexts with our SVG to PNG converter.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Browser-based Processing</h4>
            <p className="text-muted-foreground">Convert your SVG files to PNG directly in your browser with no need to upload them to external servers.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
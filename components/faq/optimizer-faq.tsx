import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function OptimizerFaq() {
  return (
    <section className="my-16 bg-card p-8 rounded-xl shadow-lg gradient-border">
      <h2 className="text-3xl font-bold mb-6 text-center">SVG Optimizer FAQ</h2>
      <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
        Our SVG optimizer tool helps you reduce the file size of your SVG files without compromising quality. The SVG optimizer removes unnecessary data and optimizes the code structure for better performance.
      </p>
      
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-6">SVG Optimizer Frequently Asked Questions</h3>
        
        <Accordion type="single" collapsible className="w-full mb-12">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-lg font-medium">What is an SVG optimizer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              An SVG optimizer is a tool that reduces the file size of SVG (Scalable Vector Graphics) files while maintaining visual quality. Our SVG optimizer works by removing unnecessary metadata, optimizing path data, and cleaning up the SVG code structure. The SVG optimizer is essential for web performance as it can significantly reduce load times for pages containing SVG graphics.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-lg font-medium">How does this SVG optimizer work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our SVG optimizer uses advanced algorithms to analyze and optimize your SVG files. The SVG optimizer removes redundant information, simplifies path data, merges similar paths, and eliminates unnecessary attributes. The SVG optimizer also minifies the code by removing whitespace and comments. You can simply paste your SVG code or upload an SVG file, and our SVG optimizer will instantly process it to create a more efficient version.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Will the SVG optimizer affect the quality of my SVG?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              No, our SVG optimizer is designed to maintain visual quality while reducing file size. The SVG optimizer only removes data that doesn't affect the appearance of your SVG. In some cases, the SVG optimizer might make minor adjustments to decimal precision or path data, but these changes are typically imperceptible to the human eye. You can always compare the original and optimized versions side by side in our preview panel.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-lg font-medium">How much can the SVG optimizer reduce file size?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              The amount of file size reduction achieved by our SVG optimizer varies depending on the complexity and initial optimization of your SVG. For SVGs created by graphic design software, the SVG optimizer can often reduce file size by 30-70%. The SVG optimizer is particularly effective for SVGs with complex paths, redundant elements, or excessive precision. Our tool shows you the original and optimized file sizes so you can see exactly how much the SVG optimizer has reduced your file.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Is this SVG optimizer free to use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG optimizer is completely free to use. You can optimize as many SVG files as you want without any cost or limitations. The SVG optimizer processes your files directly in your browser, so there's no need to upload them to a server, ensuring your data remains private and secure.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Can I optimize multiple SVG files at once?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Currently, our SVG optimizer processes one file at a time. This allows you to review the optimization results and make any necessary adjustments before proceeding. For bulk optimization needs, you can optimize each SVG file individually and download them one by one. We're considering adding batch processing to the SVG optimizer in future updates.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7" className="border-b">
            <AccordionTrigger className="text-lg font-medium">Is the SVG optimizer safe for my files?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG optimizer is completely safe. The SVG optimizer processes your files entirely in your browser, so your SVGs never leave your device. The original file remains unchanged, and the SVG optimizer creates an optimized copy that you can download if you're satisfied with the results. If you're concerned about potential issues, you can always compare the original and optimized versions in our preview panel before downloading.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-medium">Can I customize the optimization settings?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our SVG optimizer currently uses a balanced approach that maximizes file size reduction while preserving visual quality. While we don't offer customizable settings at the moment, the SVG optimizer applies industry best practices for SVG optimization. We're considering adding advanced options to the SVG optimizer in future updates, allowing you to tailor the optimization process to your specific needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <h3 className="text-2xl font-semibold mb-6">SVG Optimizer Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Path Optimization</h4>
            <p className="text-muted-foreground">The SVG optimizer simplifies path data and reduces decimal precision without affecting visual quality.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Metadata Removal</h4>
            <p className="text-muted-foreground">The SVG optimizer strips unnecessary metadata, comments, and hidden elements to reduce file size.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Real-time Comparison</h4>
            <p className="text-muted-foreground">Compare original and optimized SVGs side by side to verify quality and see file size reduction.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-xl mb-3 text-primary">Browser-based Processing</h4>
            <p className="text-muted-foreground">The SVG optimizer works entirely in your browser, ensuring privacy and eliminating upload limits.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
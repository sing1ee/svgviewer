import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ViewerFaq() {
  return (
    <section className="my-8 md:my-16 bg-card p-6 md:p-8 rounded-xl shadow-lg gradient-border">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">SVG Viewer FAQ</h2>
      <p className="mb-6 md:mb-8 text-center text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
        Our SVG viewer tool is designed to help you work with SVG files efficiently. The SVG viewer allows you to visualize, edit, and optimize your SVG graphics in real-time.
      </p>
      
      <div className="w-full max-w-4xl mx-auto">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">SVG Viewer Frequently Asked Questions</h3>
        
        <Accordion type="single" collapsible className="w-full mb-8 md:mb-12">
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">What is an SVG viewer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              An SVG viewer is a tool that allows you to open, view, and interact with SVG (Scalable Vector Graphics) files. Our online SVG viewer provides a convenient way to visualize SVG code without installing any software. With our SVG viewer, you can see how your SVG looks, edit the code, and optimize it for better performance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">How do I use this SVG viewer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Using our SVG viewer is simple: paste your SVG code into the editor or upload an SVG file. The SVG viewer will instantly render the graphic in the preview panel. You can edit the code in real-time and see the changes immediately in the SVG viewer preview. Adjust the canvas size and zoom level to get a better view of your SVG.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">Can I edit SVG files with this SVG viewer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG viewer includes a code editor that allows you to modify the SVG code directly. As you type, the SVG viewer updates the preview in real-time. This makes our SVG viewer perfect for quick edits and adjustments to your SVG files without needing specialized graphic design software.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">Is this SVG viewer free to use?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes, our SVG viewer is completely free to use. You can use the SVG viewer to open, view, edit, and download SVG files without any cost. The SVG viewer works directly in your browser, so there's no need to download or install any software.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">Can I optimize SVG files with this SVG viewer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              While our main SVG viewer focuses on viewing and editing, we also offer an SVG optimizer tool that works alongside the SVG viewer. The optimizer can reduce the file size of your SVG while maintaining visual quality. The SVG viewer shows you both the original and optimized file sizes so you can see the difference.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">How does the SVG viewer handle large files?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our SVG viewer is designed to handle SVG files of various sizes efficiently. However, very complex SVGs with thousands of elements might affect performance. The SVG viewer provides zoom and canvas size controls to help you work with SVGs of any dimension.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-base md:text-lg font-medium">Can I convert SVGs to other formats with this SVG viewer?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              While the primary SVG viewer focuses on viewing and editing SVGs, we offer a companion SVG converter tool. From the SVG viewer, you can easily navigate to our converter to transform your SVG files into formats like PNG, JPG, or PDF after previewing them in the SVG viewer.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8" className="border-b">
            <AccordionTrigger className="text-base md:text-lg font-medium">How can this SVG viewer help with AI-generated SVG code?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              With the rise of AI assistants like ChatGPT, Claude, and DeepSeek, more users are generating SVG code through AI. Our SVG viewer is the perfect companion tool for AI-generated SVGs, allowing you to instantly visualize, refine, and optimize code produced by AI. The SVG viewer helps bridge the gap between AI generation and production-ready graphics by providing real-time feedback on how the SVG actually renders, helping you spot and fix any issues in the AI-generated code. As AI continues to evolve in generating more complex vector graphics, our SVG viewer remains an essential tool for working with these AI outputs effectively.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">SVG Viewer Key Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Real-time SVG Viewer</h4>
            <p className="text-muted-foreground text-sm md:text-base">See your SVG changes instantly with our responsive SVG viewer that updates as you type.</p>
          </div>
          <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Code Highlighting</h4>
            <p className="text-muted-foreground text-sm md:text-base">Edit your SVG with syntax highlighting that makes it easier to understand and modify the code.</p>
          </div>
          <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">File Import/Export</h4>
            <p className="text-muted-foreground text-sm md:text-base">Upload existing SVG files and download your edited SVGs with just a click.</p>
          </div>
          <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
            <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Zoom Controls</h4>
            <p className="text-muted-foreground text-sm md:text-base">Zoom in and out to examine details or get a broader view of your SVG graphics.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 
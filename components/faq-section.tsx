import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqData {
  [key: string]: FaqItem[];
}

// Generate FAQ data dynamically to include keywords
const generateFaqData = (category: string): FaqItem[] => {
  const keyword = `${category.replace('-', ' ')} svg`;
  const titleCaseKeyword = keyword.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // e.g., Heart Svg, Hello Kitty Svg

  const commonQuestions = [
    { q: `What is a ${keyword}?`, a: `A ${keyword} is a Scalable Vector Graphic file depicting a ${category}. It allows for lossless scaling, making it ideal for various digital and print projects.` },
    { q: `Where can I find free ${keyword} files?`, a: `You can find a variety of free ${keyword} files on websites dedicated to SVG resources, including potentially on this site. Always check the license before use.` },
    { q: `How to use a ${keyword} in my design project?`, a: `You can import a ${keyword} into most graphic design software like Adobe Illustrator, Inkscape, Figma, or use it directly in web development with HTML <img> tags or CSS.` },
    { q: `Can I customize the color of a ${keyword}?`, a: `Yes, since it's a vector file, you can easily change the colors of a ${keyword} using vector editing software.` },
    { q: `What are the different styles of ${keyword} available?`, a: ` ${titleCaseKeyword} designs come in many styles, from simple outlines to detailed illustrations, cute cartoon versions, realistic depictions, and more.` },
    { q: `Is the ${keyword} format compatible with cutting machines like Cricut?`, a: `Yes, ${keyword} files are widely compatible with cutting machines like Cricut and Silhouette, making them popular for crafts.` },
    { q: `How to convert a ${keyword} to other formats like PNG or JPG?`, a: `You can use online converters or graphic design software to export or save a ${keyword} file as a raster image format like PNG or JPG.` },
    { q: `What are some popular uses for ${keyword} images?`, a: `Popular uses for ${keyword} images include web design, t-shirt printing, sticker making, card crafting, digital scrapbooking, and more.` },
    { q: `Are there any licensing restrictions on using a free ${keyword}?`, a: `Licensing varies. Some free ${keyword} files are for personal use only, while others allow commercial use, sometimes with attribution. Always check the specific license.` },
    { q: `How to create my own ${keyword}?`, a: `You can create your own ${keyword} using vector graphics software like Adobe Illustrator, Inkscape, Affinity Designer, or Figma by drawing the shapes and paths.` },
  ];

  // Specific adjustments if needed (example for hello kitty)
  if (category === 'hello-kitty') {
      commonQuestions[1] = { q: `Where can I download official or fan-made ${keyword} files?`, a: `Official Sanrio resources might offer ${keyword} files. Fan-made ${keyword} designs are available online, but be mindful of copyright for commercial use.` };
      commonQuestions[3] = { q: `Is it legal to use a ${keyword} for commercial purposes?`, a: `Generally, using copyrighted characters like Hello Kitty commercially requires a license from Sanrio. Using a ${keyword} for personal, non-profit projects is usually acceptable, but check specific terms.` };
  }


  return commonQuestions.map(item => ({ question: item.q, answer: item.a }));
};


const faqData: FaqData = {
  heart: generateFaqData('heart'),
  'hello-kitty': generateFaqData('hello-kitty'),
  'btc-logo': generateFaqData('btc-logo'),
  'japanese-culture': generateFaqData('japanese-culture'),
  'flower': generateFaqData('flower'),
  'butterfly': generateFaqData('butterfly'),
  // Add other categories here if needed
};


interface FaqSectionProps {
  category: string;
}

export default function FaqSection({ category }: FaqSectionProps) {
  const faqs = faqData[category] || [];
  const titleCaseKeyword = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (faqs.length === 0) {
    return null; // Don't render if no FAQs for this category
  }

  return (
    <div className="mt-16">
      <div className="bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-border/40">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Frequently Asked Questions about {titleCaseKeyword} SVGs
        </h2>
        <p className="mb-8 md:mb-12 text-center text-base md:text-lg max-w-3xl mx-auto text-foreground/70">
          Find answers to common questions about {titleCaseKeyword} SVG files, their usage, and customization options.
        </p>
        
        <div className="w-full max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                value={`item-${index}`} 
                key={index}
                className="border-b border-border/40 last:border-0"
              >
                <AccordionTrigger className="text-base md:text-lg font-medium text-foreground/90 hover:text-primary transition-all duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
} 
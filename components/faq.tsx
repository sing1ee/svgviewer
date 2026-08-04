import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getTranslations } from 'next-intl/server';

interface Question {
  question: string;
  answer: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

export default async function FAQ({ page, showFeatures = true }: { page: string; showFeatures?: boolean }) {
  const faqT = await getTranslations('faq');
  const featuresT = await getTranslations('features');

  // Parse the JSON strings into objects
  const questions = faqT.raw(`${page}.questions`) as Question[];
  const features = showFeatures ? (featuresT.raw(`${page}.features`) as FeatureItem[]) : [];
  
  return (
    <section className="my-8 md:my-16 bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border/40">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-foreground">{faqT(`${page}.title`)}</h2>
      <p className="mb-8 md:mb-12 text-center text-base md:text-lg max-w-3xl mx-auto text-foreground/70">
        {faqT(`${page}.description`)}
      </p>
      
      <div className="w-full max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full mb-12 md:mb-16">
          {questions.map((item, index) => (
            <AccordionItem key={`item-${index}`} value={`item-${index}`} className="border-b border-border/40">
              <AccordionTrigger className="text-base md:text-lg font-medium text-foreground/90 hover:text-primary transition-colors duration-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {showFeatures && (
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-foreground/90">{featuresT(`${page}.title`)}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-6">
              {features.map((subItem, subIndex) => (
                <div key={`feature-item-${subIndex}`} className="rounded-xl border border-border/40 bg-card p-6 md:p-8 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-primary">{subItem.title}</h4>
                  <p className="text-foreground/70 text-sm md:text-base">{subItem.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 
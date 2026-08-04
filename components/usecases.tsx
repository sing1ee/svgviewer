import { Card } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';

interface Case {
  title: string;
  description: string;
  items: string[];
}

export default async function UseCases({page}: {page: string}) {

  const t = await getTranslations(page);
  const cases = t.raw('cases') as Case[];
  return (
    <section className="my-16 rounded-2xl border border-border/40 bg-card p-8 shadow-sm">
      <h2 className="text-3xl font-bold mb-6 text-center text-foreground">{t('title')}</h2>
      <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
        {t('description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <Card key={caseItem.title} className="p-6 border-border/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-3 text-primary">{caseItem.title}</h3>
              <p className="text-muted-foreground flex-grow">
                {caseItem.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {caseItem.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-muted-foreground">
          {t('footerDescription')}
        </p>
      </div>
    </section>
  );
} 
import Link from 'next/link';
import { Button, Icons } from '@orc/web/ui/custom-ui';
import MaxWidthWrapper from '@orc/web/components/shared/max-width-wrapper';
import { cn } from '@orc/web/ui/custom-ui';

type Card = {
  title: string;
  description: string;
  href?: string;
  icon?: React.FC;
  button?: string;
};

interface CardsProps {
  cards: Card[];
  cardsPerRow?: 2 | 3; // New prop for cards per row
  className?: string;
}

export function MarketingCard({
  card,
  className,
}: {
  card: Card;
  className?: string;
}) {
  const Icon = card.icon;
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8',
        className
      )}
      key={card.title}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
      />
      <div className="relative">
        <div className="flex">
          {Icon && (
            <div className="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6">
              <Icon />
            </div>
          )}
          <div className="pl-5 content-center font-medium">{card.title}</div>
        </div>
        <p className="mt-6 pb-6 text-muted-foreground">{card.description}</p>
        {card.href && (
          <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
            <Button variant="secondary" size="sm" className="px-4">
              <Link href={card.href} className="flex items-center gap-2">
                <span>{card.button || 'Learn more'}</span>
                <Icons.arrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Cards({
  cards,
  cardsPerRow = 3, // Default to 3 cards per row
  className,
}: CardsProps) {
  // Determine grid class based on cardsPerRow
  const gridColsClass =
    cardsPerRow === 2
      ? 'sm:grid-cols-2 md:w-4/5 mx-auto'
      : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className={cn(className)}>
      <div className="pb-6">
        <MaxWidthWrapper>
          <div className={`mt-12 grid gap-3 ${gridColsClass}`}>
            {cards.map((card, i) => (
              <MarketingCard key={i} card={card} />
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}

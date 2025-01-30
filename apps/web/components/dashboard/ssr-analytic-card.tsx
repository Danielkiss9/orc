import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Skeleton,
} from '@orc/web/ui/custom-ui';
import { Activity } from 'lucide-react';

interface SimpleAnalyticCardProps {
  title: string;
  value?: number | string;
  subtitle: string;

  type: 'percent' | 'decimal' | 'string';
}

export default function SimpleAnalyticCard(props: SimpleAnalyticCardProps) {
  const { title, value, subtitle } = props;
  const Icon = Activity;
  const formatted =
    props.type === 'string'
      ? { format: (x: string | number) => x.toString() }
      : new Intl.NumberFormat('en-US', {
          style: props.type,
          maximumFractionDigits: 2,
          currency: 'USD',
        });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <div className="text-2xl font-bold">
            {formatted.format(value as any)}
          </div>
        )}
        {value === undefined && <Skeleton className="w-2/3 h-8 p-3 mb-1" />}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

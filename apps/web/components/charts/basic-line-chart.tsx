'use client';
import { AreaChart, XAxis, CartesianGrid, Area } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  Skeleton,
} from '@orc/web/ui/custom-ui';
import { useMemo } from 'react';

const chartConfig = {
  desktop: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface BasicLineChartProps {
  data: Record<string, number>;
  loading?: boolean;
  itemName?: string;
  tooltipOverride?: ReturnType<(props: any) => JSX.Element>;
}

export function BasicLineChartSkeleton() {
  return <Skeleton className="w-full h-[400px] rounded-lg"></Skeleton>;
}

export default function BasicLineChart({
  data,
  tooltipOverride,
  loading = false,
  itemName = 'orders',
}: BasicLineChartProps) {
  const processedData = useMemo(() => {
    const processed_data = [];
    Object.keys(data)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .reverse()
      .forEach((key) => {
        const value = data[key];
        processed_data.push({
          date: key,
          revenue: value,
        });
      });
    if (processed_data.length < 1) {
      processed_data.push({
        date: `No ${itemName} found`,
        revenue: 0,
      });
    }
    return processed_data;
  }, [data, itemName]);

  if (loading) return <BasicLineChartSkeleton />;

  return (
    <ChartContainer
      config={chartConfig}
      className="rounded-lg p-4 pt-5 h-[400px] w-full"
    >
      <AreaChart data={processedData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={tooltipOverride ? tooltipOverride : <CustomTooltip />}
        />
        <Area
          dataKey="revenue"
          type={'monotone'}
          stroke="hsl(var(--chart-1))"
          fill="hsl(var(--chart-2))"
          opacity={0.7}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    );
  }

  return null;
};

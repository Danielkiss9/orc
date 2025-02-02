'use client';

import { useState } from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Rectangle } from 'recharts';
import { useTheme } from 'next-themes';

interface BarChartProps {
  data: any[];
  index: string;
  categories: Array<{
    key: string;
    label: string;
  }>;
  yAxisWidth?: number;
}

export function BarChart({ data, index, categories, yAxisWidth = 50 }: BarChartProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartConfig = {
    color: theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
    background: theme === 'dark' ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
    text: theme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Cluster</span>
              <span className="font-bold">{label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{categories[0].label}</span>
              <span className="font-bold">{payload[0].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        onMouseMove={(state: any) => {
          if (state?.activeTooltipIndex) {
            setActiveIndex(state.activeTooltipIndex);
          } else {
            setActiveIndex(null);
          }
        }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <CartesianGrid vertical={false} stroke={chartConfig.background} strokeDasharray="4" />
        <XAxis
          dataKey={index}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tick={{ fill: chartConfig.text, fontSize: 12 }}
          tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
        />
        <YAxis
          width={yAxisWidth}
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartConfig.text, fontSize: 12 }}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        {categories.map((category) => (
          <Bar
            key={category.key}
            dataKey={category.key}
            name={category.label}
            fill={chartConfig.color}
            radius={[4, 4, 0, 0]}
            activeBar={(props: any) => {
              const { x, y, width, height, fill } = props;
              return (
                <Rectangle
                  {...props}
                  fill={fill}
                  fillOpacity={0.8}
                  stroke={fill}
                  strokeDasharray="4"
                  strokeDashoffset="2"
                  strokeWidth={2}
                />
              );
            }}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@orc/web/ui/custom-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@orc/web/ui/custom-ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

interface OrphanedResourceData {
  timestamp: string;
  count: number;
}

interface OrphanedResourcesChartProps {
  data: OrphanedResourceData[];
  isLoading: boolean;
  onTimeRangeChange: (range: number) => void;
}

export function OrphanedResourcesChart({ data, isLoading, onTimeRangeChange }: OrphanedResourcesChartProps) {
  const [timeRange, setTimeRange] = useState<string>('24');
  const { theme } = useTheme();

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange(Number.parseInt(value));
  };

  const chartConfig = {
    color: theme === 'dark' ? 'hsl(var(--primary))' : 'hsl(var(--primary))',
    background: theme === 'dark' ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
    text: theme === 'dark' ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))',
    gradient: {
      from: theme === 'dark' ? 'rgba(124, 58, 237, 0.12)' : 'rgba(124, 58, 237, 0.06)',
      to: theme === 'dark' ? 'rgba(124, 58, 237, 0.02)' : 'rgba(124, 58, 237, 0.01)',
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Timestamp</span>
              <span className="font-bold">{new Date(label).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">Orphaned Resources</span>
              <span className="font-bold">{payload[0].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Orphaned Resources Over Time</CardTitle>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24">Last 24 Hours</SelectItem>
            <SelectItem value="168">Last 7 Days</SelectItem>
            <SelectItem value="720">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        <div className="h-[300px]">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.gradient.from} stopOpacity={1} />
                    <stop offset="95%" stopColor={chartConfig.gradient.to} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.background} vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fill: chartConfig.text, fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartConfig.text, fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke={chartConfig.color} fillOpacity={1} fill="url(#colorCount)" strokeWidth={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

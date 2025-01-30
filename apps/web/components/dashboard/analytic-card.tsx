'use client';

import { DollarSign, Activity } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@orc/web/ui/custom-ui';
import React from 'react';

interface AnalyticCardProps {
  title: string;
  value?: number;
  subtitle: string;

  type: 'currency' | 'percent' | 'decimal';

  loading?: boolean;
}

export default function AnalyticCard(props: AnalyticCardProps) {
  const { title, value, subtitle, loading } = props;
  const Icon = props.type === 'currency' ? DollarSign : Activity;

  const formatted = new Intl.NumberFormat('en-US', {
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
        {value !== undefined && !loading && (
          <div className="text-2xl font-bold">
            {props.type !== 'currency'
              ? formatted.format(value)
              : formatted.format(value)}
          </div>
        )}
        {(value === undefined || loading) && (
          <Skeleton className="w-2/3 h-8 p-3 mb-1" />
        )}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

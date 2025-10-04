'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, PolarGrid, PolarAngleAxis, Radar, RadarChart } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

const chartConfig: ChartConfig = {
  xp: {
    label: 'XP',
    color: 'hsl(var(--accent))',
  },
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))'
  },
  failures: {
    label: 'Failures',
    color: 'hsl(var(--destructive))'
  },
  successes: {
    label: 'Successes',
    color: 'hsl(var(--accent))'
  }
};

type AnalyticsDashboardProps = {
    analyticsData: {
        xpOverTime: { date: string, XP: number }[];
        lifeMonitor: { stat: string; value: number; fullMark: number }[];
    }
}

export default function AnalyticsDashboard({ analyticsData }: AnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          <CardTitle className="font-headline text-xl">Growth Analytics</CardTitle>
        </div>
        <CardDescription>
          Your progress, visualized. Track your journey to the top 1%.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">XP Over Time</h3>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={analyticsData.xpOverTime} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="XP"
                  type="monotone"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Target className="w-4 h-4"/> Life Monitor</h3>
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <RadarChart data={analyticsData.lifeMonitor}>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
                <Radar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    stroke="hsl(var(--primary))"
                />
                </RadarChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EligibilityStats {
  period: string;
  views: number;
  accepts: number;
  conversionRate: number;
}

interface EligibilityChartProps {
  stats: EligibilityStats[];
}

export function EligibilityChart({ stats }: EligibilityChartProps) {
  const totalViews = stats.reduce((acc, curr) => acc + curr.views, 0);
  const totalAccepts = stats.reduce((acc, curr) => acc + curr.accepts, 0);
  const overallConversionRate = ((totalAccepts / totalViews) * 100).toFixed(1);

  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4'>
        <Card className='overflow-hidden'>
          <CardContent className='p-4'>
            <CardDescription className='text-sm'>Total Eligibility Views</CardDescription>
            <div className='mt-1 text-2xl font-bold'>{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className='overflow-hidden'>
          <CardContent className='p-4'>
            <CardDescription className='text-sm'>Total Accepts</CardDescription>
            <div className='mt-1 text-2xl font-bold'>{totalAccepts.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className='overflow-hidden'>
          <CardContent className='p-4'>
            <CardDescription className='text-sm'>Overall Conversion Rate</CardDescription>
            <div className='mt-1 text-2xl font-bold'>{overallConversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className='h-[300px] w-full sm:h-[400px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={stats}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='period'
              tick={{ fontSize: 12 }}
              interval={0}
              label={{
                value: 'Time Period',
                position: 'insideBottom',
                offset: -5,
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId='left'
              tick={{ fontSize: 12 }}
              label={{
                value: 'Number of Events',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              tick={{ fontSize: 12 }}
              label={{
                value: 'Conversion Rate (%)',
                angle: 90,
                position: 'insideRight',
                fontSize: 12,
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'conversionRate') {
                  return [`${value.toFixed(1)}%`, 'Conversion Rate'];
                }
                return [value.toLocaleString(), name === 'views' ? 'Eligibility Views' : 'Accepts'];
              }}
              labelStyle={{ fontWeight: 'bold' }}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: 12 }}
              formatter={(value) => {
                switch (value) {
                  case 'views':
                    return 'Eligibility Views';
                  case 'accepts':
                    return 'Accepts';
                  case 'conversionRate':
                    return 'Conversion Rate';
                  default:
                    return value;
                }
              }}
            />
            <Bar yAxisId='left' dataKey='views' name='views' fill='#2563eb' radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Bar yAxisId='left' dataKey='accepts' name='accepts' fill='#16a34a' radius={[4, 4, 0, 0]} maxBarSize={50} />
            <Bar
              yAxisId='right'
              dataKey='conversionRate'
              name='conversionRate'
              fill='#d97706'
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Time Period</TableHead>
              <TableHead className='whitespace-nowrap text-right'>Eligibility Views</TableHead>
              <TableHead className='whitespace-nowrap text-right'>Accepts</TableHead>
              <TableHead className='whitespace-nowrap text-right'>Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.period}>
                <TableCell className='whitespace-nowrap font-medium'>{stat.period}</TableCell>
                <TableCell className='whitespace-nowrap text-right'>{stat.views.toLocaleString()}</TableCell>
                <TableCell className='whitespace-nowrap text-right'>{stat.accepts.toLocaleString()}</TableCell>
                <TableCell className='whitespace-nowrap text-right'>{stat.conversionRate.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

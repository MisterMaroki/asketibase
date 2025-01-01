import { Suspense } from 'react';
import { Activity, AlertTriangle, FileText, Shield, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { columns } from './components/columns';
import { ConversionFunnel } from './components/ConversionFunnel';
import { DataTable } from './components/DataTable';
import { FinancialOverview } from './components/FinancialOverview';
import { MetricCards } from './components/MetricCard';

interface DashboardMetrics {
  totalMemberships: number;
  activeMembers: number;
  pendingMemberships: number;
  recentAlerts: number;
}

interface CurrencyTotal {
  currency: string;
  total: number;
  gbpEquivalent: number;
}

interface TaxTotal {
  currency: string;
  taxAmount: number;
  totalWithoutTax: number;
  taxRate: number;
  gbpEquivalent: number;
}

interface StatusCount {
  status: string;
  count: number;
}

interface EligibilityCheckCount {
  total: number;
  last24Hours: number;
  last7Days: number;
}

interface EligibilityStats {
  period: string;
  views: number;
  accepts: number;
  conversionRate: number;
}

interface ConversionFunnelStats {
  period: string;
  viewEligibility: number;
  acceptEligibility: number;
  draftMemberships: number;
  convertedCustomers: number;
  viewToAcceptRate: number;
  acceptToQuoteRate: number;
  quoteToCustomerRate: number;
  overallConversionRate: number;
}

export default async function AdminPage() {
  async function getGreeting() {
    const user = await getUser();
    const hour = new Date().getHours();

    if (hour < 6) {
      return `Early bird catches the worm, ${user?.first_name}!`;
    } else if (hour < 12) {
      return `Good morning, ${user?.first_name}!`;
    } else if (hour < 18) {
      return `Good afternoon, ${user?.first_name}!`;
    } else if (hour < 20) {
      return `Good evening, ${user?.first_name}!`;
    } else {
      return `Working late, ${user?.first_name}!`;
    }
  }

  const { data: memberships } = await supabaseAdminClient
    .from('memberships')
    .select(
      `
      *,
      quotes (
        *
      ),
      members (
        *
      )
      `,
    )
    .order('created_at', { ascending: false });

  // Get eligibility check events
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Format dates in ISO format with timezone for Postgres timestamp comparison
  const last24HoursISO = last24Hours.toISOString();
  const last7DaysISO = last7Days.toISOString();

  // Get view events
  const { data: allViewChecks } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'view_eligibility');

  const { data: last24HourViews } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'view_eligibility')
    .gte('timestamp', last24HoursISO);

  const { data: last7DayViews } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'view_eligibility')
    .gte('timestamp', last7DaysISO);

  // Get accept events
  const { data: allAcceptChecks } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'accept_eligibility');

  const { data: last24HourAccepts } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'accept_eligibility')
    .gte('timestamp', last24HoursISO);

  const { data: last7DayAccepts } = await supabaseAdminClient
    .from('logs')
    .select('*')
    .eq('operation', 'accept_eligibility')
    .gte('timestamp', last7DaysISO);

  const calculateConversionRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const eligibilityStats: EligibilityStats[] = [
    {
      period: 'Last 24 Hours',
      views: last24HourViews?.length || 0,
      accepts: last24HourAccepts?.length || 0,
      conversionRate: calculateConversionRate(last24HourViews?.length || 0, last24HourAccepts?.length || 0),
    },
    {
      period: 'Last 7 Days',
      views: last7DayViews?.length || 0,
      accepts: last7DayAccepts?.length || 0,
      conversionRate: calculateConversionRate(last7DayViews?.length || 0, last7DayAccepts?.length || 0),
    },
    {
      period: 'All Time',
      views: allViewChecks?.length || 0,
      accepts: allAcceptChecks?.length || 0,
      conversionRate: calculateConversionRate(allViewChecks?.length || 0, allAcceptChecks?.length || 0),
    },
  ];

  // Calculate totals by currency
  const currencyTotals: CurrencyTotal[] =
    memberships?.reduce((acc: CurrencyTotal[], membership) => {
      membership.quotes?.forEach((quote) => {
        const existingCurrency = acc.find((c) => c.currency === quote.currency);
        if (existingCurrency) {
          existingCurrency.total += quote.total_price_with_tax;
          existingCurrency.gbpEquivalent += quote.gbp_total || 0;
        } else {
          acc.push({
            currency: quote.currency,
            total: quote.total_price_with_tax,
            gbpEquivalent: quote.gbp_total || 0,
          });
        }
      });
      return acc;
    }, []) || [];

  // Calculate tax totals by currency
  const taxTotals: TaxTotal[] =
    memberships?.reduce((acc: TaxTotal[], membership) => {
      membership.quotes?.forEach((quote) => {
        const existingCurrency = acc.find((c) => c.currency === quote.currency);
        const taxRate = (quote.tax_amount / (quote.total_price_with_tax - quote.tax_amount)) * 100;
        const gbpTaxAmount = quote.gbp_total ? (quote.tax_amount / quote.total_price_with_tax) * quote.gbp_total : 0;
        const gbpTotalWithoutTax = quote.gbp_total ? quote.gbp_total - gbpTaxAmount : 0;

        if (existingCurrency) {
          existingCurrency.taxAmount += quote.tax_amount;
          existingCurrency.totalWithoutTax += quote.total_price_with_tax - quote.tax_amount;
          existingCurrency.gbpEquivalent += gbpTaxAmount;
        } else {
          acc.push({
            currency: quote.currency,
            taxAmount: quote.tax_amount,
            totalWithoutTax: quote.total_price_with_tax - quote.tax_amount,
            taxRate: taxRate,
            gbpEquivalent: gbpTaxAmount,
          });
        }
      });
      return acc;
    }, []) || [];

  // Calculate membership status counts
  const statusCounts: StatusCount[] =
    memberships?.reduce((acc: StatusCount[], membership) => {
      const status = membership.status || 'unknown';
      const existingStatus = acc.find((s) => s.status === status);
      if (existingStatus) {
        existingStatus.count += 1;
      } else {
        acc.push({ status, count: 1 });
      }
      return acc;
    }, []) || [];

  const totalMemberships = memberships?.length || 0;
  const activeMemberships = statusCounts.find((s) => s.status === 'active')?.count || 0;
  const pendingMemberships = statusCounts.find((s) => s.status === 'draft')?.count || 0;
  const recentAlerts = 0;

  // Calculate conversion funnel stats
  const getDraftMembershipsCount = (since?: string) => {
    if (!memberships) return 0;
    return memberships.filter((membership) => {
      const isDraft = membership.status === 'draft';
      if (!since) return isDraft;
      return isDraft && membership.created_at && new Date(membership.created_at) >= new Date(since);
    }).length;
  };

  const getConvertedMembershipsCount = (since?: string) => {
    if (!memberships) return 0;
    return memberships.filter((membership) => {
      const isConverted = membership.status && membership.status !== 'draft';
      if (!since) return isConverted;
      return isConverted && membership.created_at && new Date(membership.created_at) >= new Date(since);
    }).length;
  };

  const conversionFunnelStats: ConversionFunnelStats[] = [
    {
      period: 'Last 24 Hours',
      viewEligibility: last24HourViews?.length || 0,
      acceptEligibility: last24HourAccepts?.length || 0,
      draftMemberships: getDraftMembershipsCount(last24HoursISO),
      convertedCustomers: getConvertedMembershipsCount(last24HoursISO),
      viewToAcceptRate: calculateConversionRate(last24HourAccepts?.length || 0, last24HourViews?.length || 0),
      acceptToQuoteRate: calculateConversionRate(
        getDraftMembershipsCount(last24HoursISO),
        last24HourAccepts?.length || 0,
      ),
      quoteToCustomerRate: calculateConversionRate(
        getConvertedMembershipsCount(last24HoursISO),
        getDraftMembershipsCount(last24HoursISO),
      ),
      overallConversionRate: calculateConversionRate(
        getConvertedMembershipsCount(last24HoursISO),
        last24HourViews?.length || 0,
      ),
    },
    {
      period: 'Last 7 Days',
      viewEligibility: last7DayViews?.length || 0,
      acceptEligibility: last7DayAccepts?.length || 0,
      draftMemberships: getDraftMembershipsCount(last7DaysISO),
      convertedCustomers: getConvertedMembershipsCount(last7DaysISO),
      viewToAcceptRate: calculateConversionRate(last7DayAccepts?.length || 0, last7DayViews?.length || 0),
      acceptToQuoteRate: calculateConversionRate(getDraftMembershipsCount(last7DaysISO), last7DayAccepts?.length || 0),
      quoteToCustomerRate: calculateConversionRate(
        getConvertedMembershipsCount(last7DaysISO),
        getDraftMembershipsCount(last7DaysISO),
      ),
      overallConversionRate: calculateConversionRate(
        getConvertedMembershipsCount(last7DaysISO),
        last7DayViews?.length || 0,
      ),
    },
    {
      period: 'All Time',
      viewEligibility: allViewChecks?.length || 0,
      acceptEligibility: allAcceptChecks?.length || 0,
      draftMemberships: getDraftMembershipsCount(),
      convertedCustomers: getConvertedMembershipsCount(),
      viewToAcceptRate: calculateConversionRate(allAcceptChecks?.length || 0, allViewChecks?.length || 0),
      acceptToQuoteRate: calculateConversionRate(getDraftMembershipsCount(), allAcceptChecks?.length || 0),
      quoteToCustomerRate: calculateConversionRate(getConvertedMembershipsCount(), getDraftMembershipsCount()),
      overallConversionRate: calculateConversionRate(getConvertedMembershipsCount(), allViewChecks?.length || 0),
    },
  ];

  return (
    <main className='container space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6'>
      <div className='flex items-center justify-between'>
        <h1 className='flex items-center gap-2 text-2xl font-bold sm:text-3xl'>
          <Shield className='h-6 w-6 text-primary sm:h-8 sm:w-8' />
          {getGreeting()}
        </h1>
      </div>

      <Suspense fallback={<LoadingState />}>
        <MetricCards
          totalMemberships={totalMemberships}
          activeMembers={activeMemberships}
          pendingMemberships={pendingMemberships}
          recentAlerts={recentAlerts}
        />
      </Suspense>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card className='sm:col-span-2'>
          <Suspense fallback={<LoadingState />}>
            <ConversionFunnel stats={conversionFunnelStats} />
          </Suspense>
        </Card>

        <Card className='sm:col-span-2'>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialOverview currencyTotals={currencyTotals} taxTotals={taxTotals} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

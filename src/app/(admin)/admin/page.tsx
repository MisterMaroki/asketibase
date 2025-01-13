import { Suspense } from 'react';
import { Shield } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/features/membership/components/LoadingState';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { ConversionFunnel } from './components/ConversionFunnel';
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
  quotedTotal: number;
  quotedGbpEquivalent: number;
  writtenTotal: number;
  writtenGbpEquivalent: number;
  basePrice: number;
  quotedBasePrice: number;
  writtenBasePrice: number;
  medicalLoadingPrice: number;
  quotedMedicalLoadingPrice: number;
  writtenMedicalLoadingPrice: number;
  coverageLoadingPrice: number;
  quotedCoverageLoadingPrice: number;
  writtenCoverageLoadingPrice: number;
  discountAmount: number;
  quotedDiscountAmount: number;
  writtenDiscountAmount: number;
  exchange_rate: number;
}

interface TaxTotal {
  currency: string;
  taxAmount: number;
  totalWithoutTax: number;
  taxRate: number;
  gbpEquivalent: number;
  quotedTaxAmount: number;
  quotedTotalWithoutTax: number;
  quotedGbpEquivalent: number;
  writtenTaxAmount: number;
  writtenTotalWithoutTax: number;
  writtenGbpEquivalent: number;
  exchange_rate: number;
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

  // Calculate totals by currency
  const currencyTotals: CurrencyTotal[] =
    memberships?.reduce((acc: CurrencyTotal[], membership) => {
      membership.quotes?.forEach((quote) => {
        const isWrittenBusiness = membership.status !== 'draft';
        const existingCurrency = acc.find((c) => c.currency === quote.currency);
        const netAmount = quote.total_price_with_tax - quote.tax_amount;
        const gbpTotal = netAmount / (quote.exchange_rate || 1);
        // Calculate the proportion of each component in GBP
        const totalWithoutTax = quote.total_price_with_tax - quote.tax_amount;
        const basePriceRatio = quote.base_price / totalWithoutTax;
        const medicalLoadingRatio = quote.medical_loading_price / totalWithoutTax;
        const coverageLoadingRatio = quote.coverage_loading_price / totalWithoutTax;
        const discountRatio = quote.discount_amount / totalWithoutTax;

        // Calculate GBP values for each component using exchange rate
        const gbpBasePrice = quote.base_price / (quote.exchange_rate || 1);
        const gbpMedicalLoading = quote.medical_loading_price / (quote.exchange_rate || 1);
        const gbpCoverageLoading = quote.coverage_loading_price / (quote.exchange_rate || 1);
        const gbpDiscount = quote.discount_amount / (quote.exchange_rate || 1);

        if (existingCurrency) {
          existingCurrency.total += quote.total_price_with_tax;
          existingCurrency.gbpEquivalent += gbpTotal;
          existingCurrency.basePrice += quote.base_price;
          existingCurrency.medicalLoadingPrice += quote.medical_loading_price;
          existingCurrency.coverageLoadingPrice += quote.coverage_loading_price;
          existingCurrency.discountAmount += quote.discount_amount;
          existingCurrency.exchange_rate = quote.exchange_rate;

          if (isWrittenBusiness) {
            existingCurrency.writtenTotal += quote.total_price_with_tax;
            existingCurrency.writtenGbpEquivalent += gbpTotal;
            existingCurrency.writtenBasePrice += gbpBasePrice;
            existingCurrency.writtenMedicalLoadingPrice += gbpMedicalLoading;
            existingCurrency.writtenCoverageLoadingPrice += gbpCoverageLoading;
            existingCurrency.writtenDiscountAmount += gbpDiscount;
          } else {
            existingCurrency.quotedTotal += quote.total_price_with_tax;
            existingCurrency.quotedGbpEquivalent += gbpTotal;
            existingCurrency.quotedBasePrice += gbpBasePrice;
            existingCurrency.quotedMedicalLoadingPrice += gbpMedicalLoading;
            existingCurrency.quotedCoverageLoadingPrice += gbpCoverageLoading;
            existingCurrency.quotedDiscountAmount += gbpDiscount;
          }
        } else {
          acc.push({
            currency: quote.currency,
            total: quote.total_price_with_tax,
            gbpEquivalent: gbpTotal,
            quotedTotal: isWrittenBusiness ? 0 : quote.total_price_with_tax,
            quotedGbpEquivalent: isWrittenBusiness ? 0 : gbpTotal,
            writtenTotal: isWrittenBusiness ? quote.total_price_with_tax : 0,
            writtenGbpEquivalent: isWrittenBusiness ? gbpTotal : 0,
            basePrice: quote.base_price,
            quotedBasePrice: isWrittenBusiness ? 0 : gbpBasePrice,
            writtenBasePrice: isWrittenBusiness ? gbpBasePrice : 0,
            medicalLoadingPrice: quote.medical_loading_price,
            quotedMedicalLoadingPrice: isWrittenBusiness ? 0 : gbpMedicalLoading,
            writtenMedicalLoadingPrice: isWrittenBusiness ? gbpMedicalLoading : 0,
            coverageLoadingPrice: quote.coverage_loading_price,
            quotedCoverageLoadingPrice: isWrittenBusiness ? 0 : gbpCoverageLoading,
            writtenCoverageLoadingPrice: isWrittenBusiness ? gbpCoverageLoading : 0,
            discountAmount: quote.discount_amount,
            quotedDiscountAmount: isWrittenBusiness ? 0 : gbpDiscount,
            writtenDiscountAmount: isWrittenBusiness ? gbpDiscount : 0,
            exchange_rate: quote.exchange_rate,
          });
        }
      });
      return acc;
    }, []) || [];

  // Calculate tax totals by currency
  const taxTotals: TaxTotal[] =
    memberships?.reduce((acc: TaxTotal[], membership) => {
      membership.quotes?.forEach((quote) => {
        const isWrittenBusiness = membership.status !== 'draft';
        const existingCurrency = acc.find((c) => c.currency === quote.currency);
        const taxRate = (quote.tax_amount / (quote.total_price_with_tax - quote.tax_amount)) * 100;
        const gbpTaxAmount = quote.tax_amount / (quote.exchange_rate || 1);
        const gbpTotalWithoutTax = (quote.total_price_with_tax - quote.tax_amount) / (quote.exchange_rate || 1);

        if (existingCurrency) {
          existingCurrency.taxAmount += quote.tax_amount;
          existingCurrency.totalWithoutTax += quote.total_price_with_tax - quote.tax_amount;
          existingCurrency.gbpEquivalent += gbpTaxAmount;
          existingCurrency.exchange_rate = quote.exchange_rate;

          if (isWrittenBusiness) {
            existingCurrency.writtenTaxAmount += quote.tax_amount;
            existingCurrency.writtenTotalWithoutTax += quote.total_price_with_tax - quote.tax_amount;
            existingCurrency.writtenGbpEquivalent += gbpTaxAmount;
          } else {
            existingCurrency.quotedTaxAmount += quote.tax_amount;
            existingCurrency.quotedTotalWithoutTax += quote.total_price_with_tax - quote.tax_amount;
            existingCurrency.quotedGbpEquivalent += gbpTaxAmount;
          }
        } else {
          acc.push({
            currency: quote.currency,
            taxAmount: quote.tax_amount,
            totalWithoutTax: quote.total_price_with_tax - quote.tax_amount,
            taxRate: taxRate,
            gbpEquivalent: gbpTaxAmount,
            quotedTaxAmount: isWrittenBusiness ? 0 : quote.tax_amount,
            quotedTotalWithoutTax: isWrittenBusiness ? 0 : quote.total_price_with_tax - quote.tax_amount,
            quotedGbpEquivalent: isWrittenBusiness ? 0 : gbpTaxAmount,
            writtenTaxAmount: isWrittenBusiness ? quote.tax_amount : 0,
            writtenTotalWithoutTax: isWrittenBusiness ? quote.total_price_with_tax - quote.tax_amount : 0,
            writtenGbpEquivalent: isWrittenBusiness ? gbpTaxAmount : 0,
            exchange_rate: quote.exchange_rate,
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
  const activeMembers =
    memberships?.reduce(
      (acc, membership) => (membership.status === 'active' ? acc + (membership.members?.length || 0) : acc),
      0,
    ) || 0;

  // const activeMembers = statusCounts.find((s) => s.status === 'active')?.count || 0;
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
    <main className='container space-y-4 px-4 pb-4 sm:space-y-6 sm:px-6 sm:pb-6'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2 text-2xl font-bold sm:text-3xl'>
          <Shield className='h-6 w-6 text-primary sm:h-8 sm:w-8' />
          {getGreeting()}
        </h2>
      </div>

      <Suspense fallback={<LoadingState />}>
        <MetricCards
          totalMemberships={totalMemberships}
          activeMembers={activeMembers}
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

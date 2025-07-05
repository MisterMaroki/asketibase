import { Suspense } from 'react';
import { Shield } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectFilterFromParams } from '@/features/admin/get-admin-project-access';
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Get project filter from URL params
  const projectFilter = await getProjectFilterFromParams(searchParams);

  const user = await getUser();
  if (!user) return null;

  // Get membership IDs for the project filter
  const { data: membershipIds } = await supabaseAdminClient
    .from('memberships')
    .select('id')
    .in('project_code', projectFilter);

  const membershipIdsList = membershipIds?.map((m) => m.id) || [];

  // Get total memberships
  const { count: totalMemberships } = await supabaseAdminClient
    .from('memberships')
    .select('id', { count: 'exact' })
    .in('project_code', projectFilter);

  // Get active members
  const { count: activeMembers } = await supabaseAdminClient
    .from('members')
    .select('id', { count: 'exact' })
    .in('membership_id', membershipIdsList);

  // Get pending memberships
  const { count: pendingMemberships } = await supabaseAdminClient
    .from('memberships')
    .select('id', { count: 'exact' })
    .eq('status', 'paid')
    .in('project_code', projectFilter);

  const recentAlerts = 0;

  const conversionFunnelStats = await supabaseAdminClient
    .from('memberships')
    .select('status')
    .in('project_code', projectFilter);

  const funnelData = conversionFunnelStats.data?.reduce(
    (acc, membership) => {
      acc[membership.status] = (acc[membership.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const conversions = {
    draft: funnelData?.draft || 0,
    paid: funnelData?.paid || 0,
    sent: funnelData?.sent || 0,
    active: funnelData?.active || 0,
    expired: funnelData?.expired || 0,
  };

  // Create conversion funnel stats in expected format
  const conversionStats = [
    {
      period: 'All Time',
      viewEligibility: 0,
      acceptEligibility: 0,
      draftMemberships: conversions.draft,
      convertedCustomers: conversions.paid + conversions.sent + conversions.active,
      viewToAcceptRate: 0,
      acceptToQuoteRate: 0,
      quoteToCustomerRate:
        conversions.draft > 0
          ? ((conversions.paid + conversions.sent + conversions.active) / conversions.draft) * 100
          : 0,
      overallConversionRate: 0,
    },
  ];

  // Get currency totals
  const { data: quotesData } = await supabaseAdminClient
    .from('quotes')
    .select(
      'currency, base_price, total_price, gbp_total, medical_loading_price, coverage_loading_price, discount_amount, exchange_rate, membership_id',
    )
    .in('membership_id', membershipIdsList);

  const currencyTotals =
    quotesData?.reduce(
      (acc, quote) => {
        const currency = quote.currency || 'GBP';
        if (!acc[currency]) {
          acc[currency] = {
            currency,
            total: 0,
            gbpEquivalent: 0,
            quotedTotal: 0,
            quotedGbpEquivalent: 0,
            writtenTotal: 0,
            writtenGbpEquivalent: 0,
            basePrice: 0,
            quotedBasePrice: 0,
            writtenBasePrice: 0,
            medicalLoadingPrice: 0,
            quotedMedicalLoadingPrice: 0,
            writtenMedicalLoadingPrice: 0,
            coverageLoadingPrice: 0,
            quotedCoverageLoadingPrice: 0,
            writtenCoverageLoadingPrice: 0,
            discountAmount: 0,
            quotedDiscountAmount: 0,
            writtenDiscountAmount: 0,
            exchange_rate: quote.exchange_rate || 1,
          };
        }

        acc[currency].total += quote.total_price || 0;
        acc[currency].gbpEquivalent += quote.gbp_total || 0;
        acc[currency].quotedTotal += quote.total_price || 0;
        acc[currency].quotedGbpEquivalent += quote.gbp_total || 0;
        acc[currency].basePrice += quote.base_price || 0;
        acc[currency].quotedBasePrice += quote.base_price || 0;
        acc[currency].medicalLoadingPrice += quote.medical_loading_price || 0;
        acc[currency].quotedMedicalLoadingPrice += quote.medical_loading_price || 0;
        acc[currency].coverageLoadingPrice += quote.coverage_loading_price || 0;
        acc[currency].quotedCoverageLoadingPrice += quote.coverage_loading_price || 0;
        acc[currency].discountAmount += quote.discount_amount || 0;
        acc[currency].quotedDiscountAmount += quote.discount_amount || 0;

        return acc;
      },
      {} as Record<string, any>,
    ) || {};

  const { data: taxData } = await supabaseAdminClient
    .from('quotes')
    .select('tax_amount, currency, membership_id, total_price_with_tax, exchange_rate')
    .in('membership_id', membershipIdsList);

  const taxTotals =
    taxData?.reduce(
      (acc, quote) => {
        const currency = quote.currency || 'GBP';
        if (!acc[currency]) {
          acc[currency] = {
            currency,
            tax: 0,
            quotedTax: 0,
            writtenTax: 0,
          };
        }

        acc[currency].tax += quote.tax_amount || 0;
        acc[currency].quotedTax += quote.tax_amount || 0;

        return acc;
      },
      {} as Record<string, any>,
    ) || {};

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
          totalMemberships={totalMemberships || 0}
          activeMembers={activeMembers || 0}
          pendingMemberships={pendingMemberships || 0}
          recentAlerts={recentAlerts}
        />
      </Suspense>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card className='sm:col-span-2'>
          <Suspense fallback={<LoadingState />}>
            <ConversionFunnel stats={conversionStats} />
          </Suspense>
        </Card>

        <Card className='sm:col-span-2'>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialOverview currencyTotals={Object.values(currencyTotals)} taxTotals={Object.values(taxTotals)} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

'use server';

import { redirect } from 'next/navigation';

import { DURATION_TYPES } from '@/constants/membership';
import { getUser } from '@/features/membership/actions/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getURL } from '@/utils/get-url';

import { validateApplication } from '../validations/application';
import { ApplicationSchema } from '../validations/schemas';

export async function generateQuoteAction(data: ApplicationSchema) {
  const valid = validateApplication(data);
  if (!valid.success) {
    throw new Error(JSON.stringify(valid.errors));
  }
  // 1. Get the user from session
  const user = await getUser();

  if (!user) {
    return redirect(`${getURL()}/signup`);
  }

  if (!user.email) {
    throw Error('Could not get email');
  }

  // Calculate number of days based on duration type
  let numberOfDays = 0;
  switch (data.durationType) {
    case 'expat':
      numberOfDays = 365;
      break;
    case 'annual':
      numberOfDays = 45;
      break;
    case 'single':
      if (!data.startDate || !data.endDate) {
        throw new Error('Start date and end date are required for single duration');
      }
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      numberOfDays = Math.min(Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), 180);
      break;
  }

  // Get base prices for all members' countries
  const { data: countryPrices, error: countryError } = await supabaseAdminClient
    .from('country_base_prices')
    .select('*')
    .in(
      'id',
      data.members.map((m) => m.countryOfResidence)
    );

  if (countryError) throw new Error('Failed to fetch country prices');

  // Get age factors
  const { data: ageFactors, error: ageError } = await supabaseAdminClient.from('age_factors').select('*');

  if (ageError) throw new Error('Failed to fetch age factors');

  // Get coverage factors
  const { data: coverageFactors, error: coverageError } = await supabaseAdminClient
    .from('coverage_factors')
    .select('*')
    .eq('coverage_type', data.coverageType);

  if (coverageError) throw new Error('Failed to fetch coverage factors');

  // Get medical risk factors if medical state exists
  const { data: medicalFactors, error: medicalError } = await supabaseAdminClient
    .from('medical_risk_factors')
    .select('*');

  if (medicalError) throw new Error('Failed to fetch medical factors');

  // Calculate price for each member
  const memberPrices = data.members.map((member) => {
    // Get base price for member's country
    const countryPrice = countryPrices.find((cp) => cp.country === member.countryOfResidence)?.base_price || 0;

    // Calculate age factor
    const age = calculateAge(new Date(member.dateOfBirth));
    console.log('🚀 ~ memberPrices ~ age:', age);
    const ageFactor = ageFactors.find((af) => age >= af.min_age && age <= af.max_age)?.daily_rate || 0;

    // Get coverage factor
    const coverageFactor = coverageFactors[0]?.daily_rate || 0;

    if (!member.id) {
      throw new Error('Member ID is required');
    }
    // Get medical factor if applicable
    const medicalFactor = data.medicalState.completedMembers[member.id]
      ? medicalFactors.find((mf) => mf.risk_level === data.medicalState.completedMembers[member.id as string])
          ?.daily_rate || 0
      : 0;

    const dailyTotal = countryPrice + ageFactor + coverageFactor + medicalFactor;
    const memberTotal = dailyTotal * numberOfDays;

    return {
      memberId: member.id,
      countryPrice,
      ageFactor,
      name: `${member.firstName} ${member.lastName}`,
      coverageFactor,
      medicalFactor,
      dailyTotal,
      total: memberTotal,
    };
  });

  // Calculate total quote price
  const totalPrice = memberPrices.reduce((sum, mp) => sum + mp.total, 0);

  // 1. Create a new application record
  const { data: application, error: applicationError } = await supabaseAdminClient
    .from('applications')
    .insert({
      user_id: user.id,
      membership_type: data.membershipType,
      coverage_type: data.coverageType,
      duration_type: data.durationType,
      currency: data.currency,
      start_date: data.startDate,
      end_date: calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
    })
    .select()
    .single();

  if (applicationError) throw new Error('Failed to create application', applicationError);

  // Create quote record
  const { data: quote, error: quoteError } = await supabaseAdminClient
    .from('quotes')
    .insert({
      application_id: application.id,
      currency: data.currency,
      member_prices: memberPrices,
      base_price: memberPrices.reduce((sum, mp) => sum + mp.countryPrice * numberOfDays, 0),
      coverage_loading_price: memberPrices.reduce((sum, mp) => sum + mp.coverageFactor * numberOfDays, 0),
      medical_loading_price: memberPrices.reduce((sum, mp) => sum + mp.medicalFactor * numberOfDays, 0),
      total_price: totalPrice,
      discount_amount: 0,
    })
    .select()
    .single();
  console.log('🚀 ~ generateQuoteAction ~ quote:', quote);

  if (quoteError) throw new Error('Failed to create quote');

  return {
    id: quote.id,
    currency: data.currency,
    coverageType: data.coverageType,
    duration: data.durationType,
    startDate: data.startDate,
    endDate: calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
    members: memberPrices,
    totalPremium: totalPrice,
    discountApplied: 0,
    finalPremium: totalPrice,
  };
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateEndDate(startDate: string, durationType: keyof typeof DURATION_TYPES): string {
  if (durationType === 'expat_year') {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate.toISOString().split('T')[0];
  }
  return startDate;
}

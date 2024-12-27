'use server';

import { redirect } from 'next/navigation';

import { DURATION_TYPES } from '@/constants/membership';
import { getUser } from '@/features/membership/controllers/get-user';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getURL } from '@/utils/get-url';

import { createMember } from '../controllers/members';
import { validateApplication } from '../validations/membership';
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
  console.log('🚀 ~ generateQuoteAction ~ durationType:', data.durationType);
  switch (data.durationType) {
    case 'expat_year':
      numberOfDays = 365;
      break;
    case 'multi_trip':
      numberOfDays = 45;
      break;
    case 'single_trip':
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
    .in('id', Array.from(new Set(data.members.map((m) => [m.countryOfResidence, m.nationality]).flat())));

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

  // 1. Create a new membership record
  const { data: membership, error: membershipError } = await supabaseAdminClient
    .from('memberships')
    .insert({
      user_id: user.id,
      membership_type: data.membershipType,
      coverage_type: data.coverageType,
      duration_type: data.durationType as 'expat_year' | 'multi_trip' | 'single_trip',
      currency: data.currency,
      start_date: data.startDate,
      end_date: calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
    })
    .select()
    .single();

  if (membershipError) throw new Error('Failed to create membership', membershipError);

  // Calculate price for each member
  const memberPrices = data.members
    .sort((a, b) => (a.isPrimary ? -1 : 1))
    .map((member, i) => {
      // Get base price for member's country
      const countryOfRes = countryPrices.find((cp) => cp.id === member.countryOfResidence);
      const countryNationality = countryPrices.find((cp) => cp.id === member.nationality);
      const countryPrice = countryOfRes?.base_price || 0;

      // Calculate age factor
      const age = calculateAge(new Date(member.dateOfBirth));
      const ageFactor = ageFactors.find((af) => age >= af.min_age && age <= af.max_age)?.daily_rate || 0;

      // Get coverage factor
      const coverageFactor = coverageFactors[0]?.daily_rate || 0;

      if (!member.id) {
        throw new Error('Member ID is required');
      }
      const riskLevel = data.medicalState.completedMembers[member.id];
      // Get medical factor if applicable
      const medicalFactor = riskLevel ? medicalFactors.find((mf) => mf.risk_level === riskLevel)?.daily_rate || 0 : 0;

      const dailyTotal = countryPrice + ageFactor + coverageFactor + medicalFactor;
      const memberTotal = dailyTotal * numberOfDays;

      createMember({
        membership_id: membership.id,
        first_name: member.firstName,
        last_name: member.lastName,
        date_of_birth: member.dateOfBirth,
        salutation: member.salutation,
        gender: member.gender,
        email: member.email,
        contact_number: member.contactNumber,
        address: member.address,
        country_of_residence: countryOfRes?.country as string,
        country_code: member.countryCode,
        is_primary: !!member.isPrimary,
        nationality: countryNationality?.nationality as string,
        has_conditions: !!riskLevel,
      });

      return {
        memberId: member.id,
        countryPrice,
        ageFactor,
        name: `${member.firstName} ${member.lastName}`,
        coverageFactor,
        medicalFactor,
        dailyTotal,
        total: memberTotal,
        isPrimary: !!member.isPrimary,
      };
    });

  // Calculate total quote price
  const totalPrice = memberPrices.reduce((sum, mp) => sum + mp.total, 0);
  const totalTax = totalPrice * 0.2;
  const totalPriceWithTax = totalPrice + totalTax;

  // Create quote record
  const { data: quote, error: quoteError } = await supabaseAdminClient
    .from('quotes')
    .insert({
      membership_id: membership.id,
      currency: data.currency,
      member_prices: memberPrices,
      base_price: memberPrices.reduce((sum, mp) => sum + mp.countryPrice * numberOfDays, 0),
      coverage_loading_price: memberPrices.reduce((sum, mp) => sum + mp.coverageFactor * numberOfDays, 0),
      medical_loading_price: memberPrices.reduce((sum, mp) => sum + mp.medicalFactor * numberOfDays, 0),
      total_price: totalPrice,
      tax_amount: totalTax,
      total_price_with_tax: totalPriceWithTax,
      discount_amount: 0,
    })
    .select()
    .single();
  console.log('🚀 ~ generateQuoteAction ~ quote:', quote);

  if (quoteError) throw new Error('Failed to create quote');

  return {
    id: quote.id,
    membershipId: membership.id,
    currency: data.currency,
    coverageType: data.coverageType,
    duration: data.durationType,
    startDate: data.startDate,
    endDate: data.endDate || calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
    members: memberPrices,
    totalPremium: totalPrice,
    taxAmount: totalTax,
    discountApplied: 0,
    finalPremium: totalPriceWithTax,
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
  if (durationType === 'multi_trip') {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 45);
    return endDate.toISOString().split('T')[0];
  }

  return startDate;
}

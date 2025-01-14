'use server';

import { differenceInYears } from 'date-fns';

import { DURATION_TYPES } from '@/constants';
import { getExchangeRate } from '@/libs/exchange-rates/get-rate';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { Database } from '@/libs/supabase/types';

import { checkReferralCode } from '../controllers/check-referral-code';
import { getMembershipBySession } from '../controllers/manage-session';
import { createMember } from '../controllers/members';
import { validateApplication } from '../validations/membership';
import { MembershipSchema } from '../validations/schemas';

import { logOperation } from './log-action';

export async function generateQuoteAction(data: MembershipSchema & { sessionId?: string }) {
  try {
    await logOperation({
      level: 'info',
      operation: 'generate_quote_started',
      details: data,
    });
    const valid = validateApplication(data);
    if (!valid.success) {
      throw new Error(JSON.stringify(valid.errors));
    }

    // Check if there's an existing membership for this session
    let existingMembership = null;
    if (!data.sessionId) {
      throw new Error('Session ID is required');
    }
    existingMembership = await getMembershipBySession(data.sessionId);

    // Check referral code if provided
    let discountObject = null;
    if (data.referralCode && data.referralCode.length > 5) {
      const referralCode = await checkReferralCode(data.referralCode);
      logOperation({
        level: 'info',
        operation: 'check_referral_code',
        details: { referralCode },
      });
      if (!referralCode) {
        discountObject = null;
      }
      discountObject = referralCode;
    }

    // Calculate number of days based on duration type
    let numberOfDays = 0;
    switch (data.durationType) {
      case 'expat_year':
        numberOfDays = 365; // 365 - 1 day
        break;
      case 'multi_trip':
        numberOfDays = 60;
        break;
      case 'single_trip':
        if (!data.startDate || !data.endDate) {
          throw new Error('Start date and end date are required for single duration');
        }
        if (data.startDate === data.endDate) {
          throw new Error('Start date and end date cannot be the same');
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

    const declinedCountries = countryPrices?.filter((cp) => !cp.base_price);
    if (declinedCountries && declinedCountries.length > 0) {
      const areDeclinedCountriesACountryOfResidence = declinedCountries.some(
        (cp) => cp.id === data.members.find((m) => m.countryOfResidence === cp.id)?.countryOfResidence,
      );
      if (areDeclinedCountriesACountryOfResidence) {
        throw new Error(
          'Error: These countries are not supported: ' + declinedCountries.map((cp) => cp.country).join(', '),
        );
      }
    }

    if (countryError) throw new Error('Failed to fetch country prices');

    // Convert GBP amounts to chosen currency
    const exchangeRate = await getExchangeRate(data.currency);
    if (!exchangeRate) {
      throw new Error('Failed to get exchange rate for the selected currency');
    }

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

    // Create or update membership record
    const membershipData = {
      membership_type: data.membershipType,
      coverage_type: data.coverageType,
      duration_type: data.durationType as 'expat_year' | 'multi_trip' | 'single_trip',
      referral_source: data.referralSource,
      start_date: data.startDate,
      end_date: data.endDate || calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
      session_id: data.sessionId,
    };

    let membership: Database['public']['Tables']['memberships']['Row'];
    if (existingMembership) {
      const { data: updatedMembership, error: membershipError } = await supabaseAdminClient
        .from('memberships')
        .update(membershipData)
        .eq('id', existingMembership.id)
        .select()
        .single();

      if (membershipError) throw new Error('Failed to update membership');
      membership = updatedMembership;

      // Delete existing members
      await supabaseAdminClient.from('members').delete().eq('membership_id', existingMembership.id);
    } else {
      const { data: newMembership, error: membershipError } = await supabaseAdminClient
        .from('memberships')
        .insert(membershipData)
        .select()
        .single();

      if (membershipError) throw new Error('Failed to create membership');
      membership = newMembership;
    }

    // Calculate price for each member
    const memberPrices = data.members
      .sort((a, b) => (a.isPrimary ? -1 : 1))
      .map((member, i) => {
        // Get base price for member's country
        const countryOfRes = countryPrices.find((cp) => cp.id === member.countryOfResidence);
        const countryPrice = countryOfRes?.base_price || 0;
        const countryNationality = countryPrices.find((cp) => cp.id === member.nationality);

        // Calculate age factor
        const age = differenceInYears(new Date(), new Date(member.dateOfBirth));
        const ageFactor = ageFactors.find((af) => age >= af.min_age && age <= af.max_age)?.daily_rate || 0;

        // Get coverage factor
        const coverageFactor = coverageFactors[0]?.daily_rate || 0;

        if (!member.id) {
          throw new Error('Member ID is required');
        }
        const riskLevel = data.medicalState.completedMembers[member.id];
        // Get medical factor if applicable
        const medicalFactor = riskLevel ? medicalFactors.find((mf) => mf.risk_level === riskLevel)?.daily_rate || 0 : 0;

        const dailyTotal = ageFactor + coverageFactor + medicalFactor;
        const memberTotal = dailyTotal * numberOfDays + countryPrice;

        if (memberTotal > 0) {
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
            home_phone: member.landlineNumber,
            is_primary: !!member.isPrimary,
            nationality: countryNationality?.nationality as string,
            has_conditions: !!riskLevel,
          });
        }

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

    // Calculate total quote price in GBP first
    const gbpTotalPrice = memberPrices.reduce((sum, mp) => sum + mp.total, 0);
    const gbpDiscountAmount = discountObject ? (gbpTotalPrice * discountObject.discount_percent) / 100 : 0;
    const gbpPriceAfterDiscount = gbpTotalPrice - gbpDiscountAmount;
    const gbpTotalTax = gbpPriceAfterDiscount * 0.2;
    const gbpTotalPriceWithTax = gbpPriceAfterDiscount + gbpTotalTax;

    if (!gbpTotalPriceWithTax || isNaN(gbpTotalPriceWithTax) || gbpTotalPriceWithTax === 0) {
      throw new Error('Total price with tax is 0');
    }

    // Convert all amounts to chosen currency (multiply by rate since rates are GBP based)
    const totalPrice = gbpTotalPrice * exchangeRate;
    const discountAmount = gbpDiscountAmount * exchangeRate;
    const totalTax = gbpTotalTax * exchangeRate;
    const totalPriceWithTax = gbpTotalPriceWithTax * exchangeRate;
    const convertedFromGbpMemberPrices = memberPrices.map((mp) => ({
      ...mp,
      total: mp.total * exchangeRate,
      countryPrice: mp.countryPrice * exchangeRate,
      ageFactor: mp.ageFactor * exchangeRate,
      coverageFactor: mp.coverageFactor * exchangeRate,
      medicalFactor: mp.medicalFactor * exchangeRate,
      dailyTotal: mp.dailyTotal * exchangeRate,
    }));

    // Delete any existing quotes for this membership
    if (membership) {
      const { error: deleteError } = await supabaseAdminClient
        .from('quotes')
        .delete()
        .eq('membership_id', membership.id);

      if (deleteError) {
        console.error('Error deleting existing quotes:', deleteError);
      } else {
        await logOperation({
          level: 'info',
          operation: 'delete_existing_quotes',
          details: { membership_id: membership.id },
        });
      }
    }

    // Create quote record with amounts in chosen currency and GBP total
    const { data: quote, error: quoteError } = await supabaseAdminClient
      .from('quotes')
      .insert({
        membership_id: membership.id,
        currency: data.currency,
        member_prices: convertedFromGbpMemberPrices,
        base_price:
          memberPrices.reduce((sum, mp) => sum + mp.countryPrice + mp.ageFactor * numberOfDays, 0) * exchangeRate,
        coverage_loading_price:
          memberPrices.reduce((sum, mp) => sum + mp.coverageFactor * numberOfDays, 0) * exchangeRate,
        medical_loading_price:
          memberPrices.reduce((sum, mp) => sum + mp.medicalFactor * numberOfDays, 0) * exchangeRate,
        total_price: totalPrice,
        tax_amount: totalTax,
        total_price_with_tax: totalPriceWithTax,
        gbp_total: gbpTotalPriceWithTax,
        discount_amount: discountAmount,
        referral_code_id: discountObject?.id || null,
        exchange_rate: exchangeRate,
      })
      .select()
      .single();

    if (quoteError) throw new Error('Failed to create quote');

    await logOperation({
      level: 'info',
      operation: 'create_quote_success',
      details: { quote },
    });

    return {
      success: true,
      data: {
        id: quote.id,
        membershipId: membership.id,
        currency: data.currency,
        coverageType: data.coverageType,
        duration: data.durationType,
        startDate: data.startDate,
        endDate: data.endDate || calculateEndDate(data.startDate, data.durationType as keyof typeof DURATION_TYPES),
        members: convertedFromGbpMemberPrices,
        totalPremium: totalPrice,
        taxAmount: totalTax,
        discountApplied: discountAmount,
        finalPremium: totalPriceWithTax,
        referralCode: data.referralCode || '',
      },
    };
  } catch (error) {
    await logOperation({
      level: 'error',
      operation: 'generate_quote_failed',
      error: error as Error,
      details: { data },
    });
    console.error('Error generating quote:', error);
    return {
      success: false,
      error: 'Failed to generate quote',
    };
  }
}

function calculateEndDate(startDate: string, durationType: keyof typeof DURATION_TYPES): string {
  if (durationType === 'expat_year' || durationType === 'multi_trip') {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 364);
    return endDate.toISOString().split('T')[0];
  }

  return startDate;
}

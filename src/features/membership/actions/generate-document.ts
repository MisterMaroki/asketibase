'use server';

import { differenceInYears } from 'date-fns';
import { Resend } from 'resend';

import { COVERAGE_TYPES, getDurationDetails, MEMBERSHIP_TYPES } from '@/constants';
import MembershipDocumentEmail from '@/features/emails/membership-document';
import { formatDate } from '@/libs/format-date';
import { formatPriceWithCurrency } from '@/libs/membership/currency';
import { renderToBuffer } from '@react-pdf/renderer';

import { MembershipDocumentPDF } from '../../emails/MembershipDocumentPDF';
import { getMembershipMembers } from '../controllers/members';
import { getQuoteWithMembership, updateApplication } from '../controllers/quote-memberships';

import { logOperation } from './log-action';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface DocumentData {
  membership_number: string;
  members: Array<{
    salutation: string;
    first_name: string;
    last_name: string;
    age: string;
    has_declaration: string;
    address: string;
    contact_number: string;
    home_phone: string;
    email: string;
    is_primary: boolean;
  }>;
  purchase_date: string;
  membership_type: string;
  coverage_type: string;
  start_date: string;
  end_date: string;
  base_price: string;
  medical_risk_premium: string;
  discount: string;
  subtotal: string;
  tax: string;
  total_paid: string;
  currency: string;
  duration_type: string;
}

export async function generateAndSendDocument(data: DocumentData) {
  try {
    await logOperation({
      level: 'info',
      operation: 'generate_and_send_document_started',
      details: { data },
    });

    // Generate PDF buffer from the React component
    const pdfBuffer = await renderToBuffer(MembershipDocumentPDF({ data }));

    const primaryMember = data.members.find((member) => member.is_primary);

    const emailResult = await resend.emails.send({
      from: 'Asketi <no-reply@asketi.com>',
      // to: 'omar987@hotmail.co.uk',
      to: primaryMember?.email || '',
      bcc: 'gary@asketi.com',
      subject: 'Your ASKETI Membership Document',
      react: MembershipDocumentEmail(data),
      attachments: [
        {
          filename: 'ASKETI_Membership_Certificate.pdf',
          content: pdfBuffer,
        },
      ],
    });
    if (emailResult.error) {
      console.error('Error sending email:', emailResult.error);
      throw new Error('Error sending email');
    }

    await logOperation({
      level: 'info',
      operation: 'generate_and_send_document_completed',
      details: { emailResult },
    });

    return true;
  } catch (error) {
    await logOperation({
      level: 'error',
      operation: 'generate_and_send_document_failed',
      error: error as Error,
      details: { data },
    });
    throw error;
  }
}

export async function generateIfNotSent(quoteId: string, sendAgain: boolean = false) {
  await logOperation({
    level: 'info',
    operation: 'generate_if_not_sent_started',
    details: { quoteId, sendAgain },
  });
  const quote = await getQuoteWithMembership(quoteId);
  if (!quote) {
    throw Error('Could not get quote');
  }
  const members = await getMembershipMembers(quote.membership_id);

  if (quote.memberships.status === 'paid' || (sendAgain && quote.memberships.status === 'sent')) {
    // Transform members data to match DocumentData interface
    const transformedMembers =
      members
        ?.sort((a, b) => (a.is_primary ? -1 : 1))
        ?.map((member) => ({
          ...member,
          contact_number: member.country_code + member.contact_number || '',
          home_phone: member.home_phone || '',
          age: differenceInYears(new Date(), new Date(member.date_of_birth)) + '',
          has_declaration: member.has_conditions ? 'Yes' : 'No',
          address: member.address || '',
        })) || [];

    const durationDetails = getDurationDetails(quote.memberships.duration_type);

    const document = await generateAndSendDocument({
      membership_number: 'GOASK-J-98001/' + quote.memberships.membership_number,
      members: transformedMembers,
      purchase_date: formatDate(new Date(quote.memberships.created_at || '')),
      membership_type: MEMBERSHIP_TYPES[quote.memberships.membership_type as keyof typeof MEMBERSHIP_TYPES] || '',
      coverage_type: COVERAGE_TYPES[quote.memberships.coverage_type as keyof typeof COVERAGE_TYPES] || '',
      start_date: formatDate(new Date(quote.memberships.start_date || '')),
      end_date: formatDate(new Date(quote.memberships.end_date || '')),
      base_price: formatPriceWithCurrency(quote.base_price + quote.coverage_loading_price, quote.currency),
      medical_risk_premium: formatPriceWithCurrency(quote.medical_loading_price, quote.currency),
      discount: formatPriceWithCurrency(quote.discount_amount, quote.currency),
      subtotal: formatPriceWithCurrency(quote.total_price - quote.discount_amount, quote.currency),
      tax: formatPriceWithCurrency(quote.tax_amount, quote.currency),
      total_paid: formatPriceWithCurrency(quote.total_price_with_tax, quote.currency),
      currency: quote.currency,
      duration_type: durationDetails.title,
    });

    await logOperation({
      level: 'info',
      operation: 'generate_if_not_sent_completed',
      details: { document },
    });

    if (document) {
      await updateApplication(quote.memberships.id, {
        status: 'sent',
      });

      return !!document;
    }

    return false;
  } else if (quote.memberships.status === 'sent') {
    return true;
  } else {
    return false;
  }
}

'use client';

import { useEffect, useState } from 'react';
import { differenceInYears, format } from 'date-fns';
import { Calculator, Calendar, Globe2, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { checkReferralCode, ReferralCode } from '@/features/membership/controllers/check-referral-code';

import { Member, Membership, Quote } from '../types';

import { getDetails } from './actions';

type DetailsType = 'members' | 'memberships' | 'quotes';

interface DetailsPanelProps {
  type: DetailsType;
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsPanel({ type, id, open, onOpenChange }: DetailsPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Membership | null>(null);
  console.log('🚀 ~ DetailsPanel ~ data:', data);
  const [error, setError] = useState<string | null>(null);

  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);

  useEffect(() => {
    if (open && id && data?.quotes?.[0]?.referral_code_id) {
      const fetchReferralCode = async () => {
        const code = await checkReferralCode(data.quotes?.[0]?.referral_code_id || '');
        setReferralCode(code);
      };
      fetchReferralCode();
    }
  }, [open, id]);

  useEffect(() => {
    if (open && id) {
      loadDetails();
    }
  }, [open, id]);

  const loadDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const details = await getDetails(type, id);
      console.log('Loaded details:', details);
      if (!details) {
        setError('No details found');
        return;
      }
      setData(details);
    } catch (error) {
      console.error('Error loading details:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuoteBreakdown = (quote: Quote) => {
    const totalWithoutTax = quote.total_price_with_tax - quote.tax_amount;
    const basePricePercentage = (quote.base_price / totalWithoutTax) * 100;
    const medicalLoadingPercentage = (quote.medical_loading_price / totalWithoutTax) * 100;
    const coverageLoadingPercentage = (quote.coverage_loading_price / totalWithoutTax) * 100;
    const discountPercentage = (quote.discount_amount / totalWithoutTax) * 100;

    return (
      <div className='space-y-3'>
        <div className='grid gap-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Base Price</span>
            <div className='flex items-center gap-2'>
              <span>
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: quote.currency,
                }).format(quote.base_price)}
              </span>
              <span className='text-xs text-muted-foreground'>({basePricePercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Medical Loading</span>
            <div className='flex items-center gap-2'>
              <span>
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: quote.currency,
                }).format(quote.medical_loading_price)}
              </span>
              <span className='text-xs text-muted-foreground'>({medicalLoadingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Coverage Loading</span>
            <div className='flex items-center gap-2'>
              <span>
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: quote.currency,
                }).format(quote.coverage_loading_price)}
              </span>
              <span className='text-xs text-muted-foreground'>({coverageLoadingPercentage.toFixed(1)}%)</span>
            </div>
          </div>
          {quote.discount_amount > 0 && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Discount</span>
              <div className='flex items-center gap-2 text-green-600'>
                <span>
                  -
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: quote.currency,
                  }).format(quote.discount_amount)}
                </span>
                <span className='text-xs text-muted-foreground'>({discountPercentage.toFixed(1)}%)</span>
              </div>
            </div>
          )}
          <Separator className='my-1' />
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Net Amount</span>
            <span>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: quote.currency,
              }).format(totalWithoutTax)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Tax</span>
            <div className='flex items-center gap-2'>
              <span>
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: quote.currency,
                }).format(quote.tax_amount)}
              </span>
              <span className='text-xs text-muted-foreground'>
                ({((quote.tax_amount / totalWithoutTax) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
          <Separator className='my-1' />
          <div className='flex justify-between font-medium'>
            <span>Total</span>
            <span>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: quote.currency,
              }).format(quote.total_price_with_tax)}
            </span>
          </div>
          {quote.gbp_total && quote.currency !== 'GBP' && (
            <div className='flex justify-between text-sm'>
              <span className='text-teal-500'>GBP Equivalent</span>
              <div className='flex items-center gap-1'>
                <span className='text-teal-500'>
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                  }).format(quote.gbp_total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMemberList = (members: Member[]) => {
    // Sort members: primary first, then alphabetically by name
    const sortedMembers = [...members].sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });

    console.log('Member data:', sortedMembers);

    return (
      <div className='space-y-3'>
        {sortedMembers.map((member: Member) => {
          console.log('Rendering member:', member);
          const cleanPhoneNumber = member.contact_number?.replace(/\s+/g, '').replace(/^0+/, ''); // Remove leading zeros
          const formattedPhoneNumber =
            member.contact_number && member.country_code
              ? `+${member.country_code.replace(/^\++/, '')} ${cleanPhoneNumber}` // Remove any existing + signs from country code
              : member.contact_number;
          const phoneLink =
            member.country_code && cleanPhoneNumber
              ? `tel:+${member.country_code.replace(/^\++/, '')}${cleanPhoneNumber}`
              : cleanPhoneNumber
                ? `tel:${cleanPhoneNumber}`
                : undefined;

          const cleanHomePhoneNumber = member.home_phone?.replace(/\s+/g, '').replace(/^0+/, '');
          const homePhoneLink = member.home_phone ? `tel:${cleanHomePhoneNumber}` : undefined;
          return (
            <div key={member.id} className='rounded-lg border bg-muted/40 p-4'>
              <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                  <User className='h-8 w-8 shrink-0 rounded-full border p-1.5' />
                  <div className='min-w-0'>
                    <div className='truncate font-medium'>
                      {member.first_name} {member.last_name}
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Mail className='h-3.5 w-3.5 shrink-0' />
                      <a href={`mailto:${member.email}`} className='truncate hover:text-primary hover:underline'>
                        {member.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  {member.is_primary ? (
                    <Badge className='h-6 shrink-0 px-3 text-sm'>Primary</Badge>
                  ) : (
                    <Badge variant='secondary' className='h-6 shrink-0 px-3 text-sm'>
                      Dependent
                    </Badge>
                  )}
                  {member.has_conditions && (
                    <Badge variant='destructive' className='h-6 shrink-0 px-3 text-sm'>
                      Medical Conditions
                    </Badge>
                  )}
                </div>
              </div>
              <div className='grid gap-2 text-sm'>
                <div className='flex items-start gap-2'>
                  <Calendar className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                    <span className='shrink-0'>Born {format(new Date(member.date_of_birth), 'MMMM d, yyyy')}</span>
                    <span className='hidden text-muted-foreground sm:inline'>•</span>
                    <span className='text-muted-foreground'>
                      {differenceInYears(new Date(), new Date(member.date_of_birth))} years old
                    </span>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                  <div className='flex flex-col gap-1'>
                    <span>Nationality: {member.nationality}</span>
                    <span className='text-muted-foreground'>
                      Residence: {member.country_of_residence || 'Not specified'}
                    </span>
                    {member.address && <span className='text-muted-foreground'>{member.address}</span>}
                  </div>
                </div>
                {formattedPhoneNumber && (
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 shrink-0 text-muted-foreground' />
                    <a href={phoneLink} className='hover:text-primary hover:underline'>
                      {formattedPhoneNumber}
                    </a>
                  </div>
                )}
                {homePhoneLink && (
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 shrink-0 text-muted-foreground' />
                    <a href={homePhoneLink} className='hover:text-primary hover:underline'>
                      {member.home_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMembershipContent = () => {
    if (!data) return null;
    const members = (data.members || []) as Member[];
    const quote = data.quotes?.[0] as Quote | undefined;
    const riskLevel = members.some((member) => member.has_conditions) ? 1 : 0;
    const membershipNumber = String(data.membership_number).padStart(4, '0');

    return (
      <div className='space-y-6 p-4 sm:p-6'>
        <div className='space-y-4'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-xl font-bold sm:text-2xl'>{data.membership_type} Membership</h2>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'>
                <span>Created {format(new Date(data.created_at || ''), 'MMMM d, yyyy')}</span>
                <span className='hidden sm:inline'>•</span>
                <span className='font-medium'>GOASK-J-98001/{membershipNumber}</span>
                {data.user_id && (
                  <>
                    <span className='hidden sm:inline'>•</span>
                    <span>User ID: {data.user_id}</span>
                  </>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='h-6 w-fit px-3 text-sm capitalize'>
                {data.status}
              </Badge>
              <Badge variant={riskLevel === 1 ? 'destructive' : 'secondary'} className='h-6 w-fit px-3 text-sm'>
                Risk Level {riskLevel}
              </Badge>
            </div>
          </div>

          <div className='rounded-lg border bg-muted/40 p-4'>
            <div className='mb-4 flex flex-wrap gap-2'>
              <Badge variant='outline' className='h-6 px-3 text-sm'>
                {data.coverage_type}
              </Badge>
              <Badge variant='secondary' className='h-6 px-3 text-xs'>
                {data.duration_type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className='grid gap-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Membership Number</span>
                <span>GOASK-J-98001/{membershipNumber}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='capitalize'>{data.status}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Duration Type</span>
                <span className='capitalize'>{data.duration_type.replace('_', ' ')}</span>
              </div>
              {data.start_date && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Start Date</span>
                  <span>{format(new Date(data.start_date), 'PPP')}</span>
                </div>
              )}
              {data.end_date && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>End Date</span>
                  <span>{format(new Date(data.end_date), 'PPP')}</span>
                </div>
              )}
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Created At</span>
                <span>{data.created_at ? format(new Date(data.created_at), 'PPP p') : 'N/A'}</span>
              </div>
              {data.referral_source && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Referral Source</span>
                  <span>{data.referral_source}</span>
                </div>
              )}
              {quote && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Referral Code</span>
                  <span className='text-muted-foreground'>{referralCode?.code || 'N/A'}</span>
                  {referralCode && (
                    <Badge variant='secondary' className='h-6 px-3 text-xs'>
                      Applied {referralCode?.discount_percent}%
                    </Badge>
                  )}
                </div>
              )}
              {quote && (
                <>
                  <Separator className='my-1' />
                  <div className='flex justify-between font-medium'>
                    <span>Total Value</span>
                    <div className='flex flex-col items-end gap-1'>
                      <span>
                        {new Intl.NumberFormat('en-GB', {
                          style: 'currency',
                          currency: quote.currency,
                        }).format(quote.total_price_with_tax)}
                      </span>
                      {quote.currency !== 'GBP' && quote.gbp_total && (
                        <span className='text-sm text-muted-foreground'>
                          (
                          {new Intl.NumberFormat('en-GB', {
                            style: 'currency',
                            currency: 'GBP',
                          }).format(quote.gbp_total)}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <>
            <Separator />
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Members</h3>
                <Badge variant='outline'>{members.length} Total</Badge>
              </div>
              {renderMemberList(members)}
            </div>
          </>
        )}

        {quote && (
          <>
            <Separator />
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Quote Details</h3>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {format(new Date(quote.created_at), 'PPP')}
                  </Badge>
                  {quote.referral_code_id && (
                    <Badge variant='secondary' className='text-xs'>
                      Referral Applied
                    </Badge>
                  )}
                </div>
              </div>
              <div className='rounded-lg border bg-muted/40 p-4'>
                {renderQuoteBreakdown(quote)}
                <Separator className='my-3' />
                <div className='grid gap-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Quote ID</span>
                    <span className='font-mono'>{quote.id}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Created At</span>
                    <span>{format(new Date(quote.created_at), 'PPP p')}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex h-full items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      );
    }

    switch (type) {
      case 'members':
      case 'memberships':
      case 'quotes':
        return renderMembershipContent();
      // case 'quotes':
      //   return renderQuoteContent();
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full border-l sm:max-w-xl'>
        <SheetHeader className='space-y-0 pb-4'>
          <div className='flex items-center justify-between'>
            <SheetTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Details</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className='h-[calc(100vh-5rem)]'>{renderContent()}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

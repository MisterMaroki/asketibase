'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2, Mail, MapPin, Phone, User, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tables } from '@/libs/supabase/types';

import { getDetails } from './actions';

type DetailsType = 'member' | 'membership' | 'quote';

interface DetailsPanelProps {
  type: DetailsType;
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsPanel({ type, id, open, onOpenChange }: DetailsPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open && id) {
      loadDetails();
    }
  }, [open, id]);

  const loadDetails = async () => {
    try {
      setIsLoading(true);
      const details = await getDetails(type, id);
      setData(details);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMemberContent = () => {
    if (!data) return null;
    const membership = data.memberships;
    const quotes = membership?.quotes || [];

    return (
      <div className='space-y-6 p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>
                {data.first_name} {data.last_name}
              </h2>
              <p className='text-sm text-muted-foreground'>
                Member since {format(new Date(data.created_at), 'MMMM yyyy')}
              </p>
            </div>
            {data.is_primary ? (
              <Badge className='h-6 px-3 text-sm'>Primary</Badge>
            ) : (
              <Badge variant='secondary' className='h-6 px-3 text-sm'>
                Dependent
              </Badge>
            )}
          </div>

          <div className='grid gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span>{data.email}</span>
            </div>
            {data.phone && (
              <div className='flex items-center gap-2 text-sm'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span>{data.phone}</span>
              </div>
            )}
            <div className='flex items-center gap-2 text-sm'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span>Born {format(new Date(data.date_of_birth), 'MMMM d, yyyy')}</span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span>{data.nationality}</span>
            </div>
          </div>
        </div>

        <Separator />

        {membership && (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Current Membership</h3>
              <Badge variant='outline' className='capitalize'>
                {membership.status}
              </Badge>
            </div>

            <div className='rounded-lg border bg-muted/40 p-4'>
              <div className='mb-4 flex gap-2'>
                <Badge variant='outline' className='h-6 px-3 text-sm'>
                  {membership.membership_type}
                </Badge>
                <Badge variant='outline' className='h-6 px-3 text-sm'>
                  {membership.coverage_type}
                </Badge>
              </div>

              <div className='grid gap-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Start Date</span>
                  <span>{format(new Date(membership.start_date), 'PPP')}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>End Date</span>
                  <span>{format(new Date(membership.end_date), 'PPP')}</span>
                </div>
                {membership.monthly_price && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Monthly Price</span>
                    <span>
                      {membership.monthly_price} {membership.currency}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Recent Quotes</h3>
              <div className='space-y-3'>
                {quotes.map((quote: Tables<'quotes'>) => (
                  <div key={quote.id} className='rounded-lg border bg-muted/40 p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <div className='text-sm font-medium'>Quote #{quote.id.slice(0, 8)}</div>
                      <Badge variant='outline' className='capitalize'>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className='grid gap-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Base Price</span>
                        <span>
                          {quote.base_price} {quote.currency}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Tax</span>
                        <span>
                          {quote.tax} {quote.currency}
                        </span>
                      </div>
                      <Separator className='my-1' />
                      <div className='flex justify-between font-medium'>
                        <span>Total</span>
                        <span>
                          {quote.total_price_with_tax} {quote.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderMembershipContent = () => {
    if (!data) return null;
    const members = data.members || [];
    const quotes = data.quotes || [];

    return (
      <div className='space-y-6 p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>{data.membership_type} Membership</h2>
              <p className='text-sm text-muted-foreground'>
                Created {format(new Date(data.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
            <Badge variant='outline' className='h-6 px-3 text-sm capitalize'>
              {data.status}
            </Badge>
          </div>

          <div className='rounded-lg border bg-muted/40 p-4'>
            <div className='mb-4'>
              <Badge variant='outline' className='h-6 px-3 text-sm'>
                {data.coverage_type}
              </Badge>
            </div>

            <div className='grid gap-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Start Date</span>
                <span>{format(new Date(data.start_date), 'PPP')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>End Date</span>
                <span>{format(new Date(data.end_date), 'PPP')}</span>
              </div>
              {data.monthly_price && (
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Monthly Price</span>
                  <span>
                    {data.monthly_price} {data.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Members</h3>
              <div className='space-y-3'>
                {members.map((member: Tables<'members'>) => (
                  <div key={member.id} className='rounded-lg border bg-muted/40 p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <User className='h-8 w-8 rounded-full border p-1.5' />
                        <div>
                          <div className='font-medium'>
                            {member.first_name} {member.last_name}
                          </div>
                          <div className='text-sm text-muted-foreground'>{member.email}</div>
                        </div>
                      </div>
                      {member.is_primary ? (
                        <Badge className='h-6 px-3 text-sm'>Primary</Badge>
                      ) : (
                        <Badge variant='secondary' className='h-6 px-3 text-sm'>
                          Dependent
                        </Badge>
                      )}
                    </div>
                    <div className='grid gap-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <span>Born {format(new Date(member.date_of_birth), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span>{member.nationality}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {quotes.length > 0 && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Quotes History</h3>
              <div className='space-y-3'>
                {quotes.map((quote: Tables<'quotes'>) => (
                  <div key={quote.id} className='rounded-lg border bg-muted/40 p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <div>
                        <div className='text-sm font-medium'>Quote #{quote.id.slice(0, 8)}</div>
                        <div className='text-sm text-muted-foreground'>{format(new Date(quote.created_at), 'PPP')}</div>
                      </div>
                      <Badge variant='outline' className='capitalize'>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className='grid gap-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Base Price</span>
                        <span>
                          {quote.base_price} {quote.currency}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Tax</span>
                        <span>
                          {quote.tax} {quote.currency}
                        </span>
                      </div>
                      <Separator className='my-1' />
                      <div className='flex justify-between font-medium'>
                        <span>Total</span>
                        <span>
                          {quote.total_price_with_tax} {quote.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderQuoteContent = () => {
    if (!data) return null;
    const membership = data.membership;
    const members = membership?.members || [];

    return (
      <div className='space-y-6 p-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Quote #{data.id.slice(0, 8)}</h2>
              <p className='text-sm text-muted-foreground'>Created {format(new Date(data.created_at), 'PPP')}</p>
            </div>
            <Badge variant='outline' className='h-6 px-3 text-sm capitalize'>
              {data.status}
            </Badge>
          </div>

          <div className='rounded-lg border bg-muted/40 p-4'>
            <div className='grid gap-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Base Price</span>
                <span>
                  {data.base_price} {data.currency}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Tax</span>
                <span>
                  {data.tax} {data.currency}
                </span>
              </div>
              <Separator className='my-1' />
              <div className='flex justify-between font-medium'>
                <span>Total</span>
                <span>
                  {data.total_price_with_tax} {data.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {membership && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Membership Details</h3>
              <div className='rounded-lg border bg-muted/40 p-4'>
                <div className='mb-4 flex items-center justify-between'>
                  <div className='flex gap-2'>
                    <Badge variant='outline' className='h-6 px-3 text-sm'>
                      {membership.membership_type}
                    </Badge>
                    <Badge variant='outline' className='h-6 px-3 text-sm'>
                      {membership.coverage_type}
                    </Badge>
                  </div>
                  <Badge variant='outline' className='capitalize'>
                    {membership.status}
                  </Badge>
                </div>

                <div className='grid gap-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Start Date</span>
                    <span>{format(new Date(membership.start_date), 'PPP')}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>End Date</span>
                    <span>{format(new Date(membership.end_date), 'PPP')}</span>
                  </div>
                  {membership.monthly_price && (
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Monthly Price</span>
                      <span>
                        {membership.monthly_price} {membership.currency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {members.length > 0 && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Members</h3>
              <div className='space-y-3'>
                {members.map((member: Tables<'members'>) => (
                  <div key={member.id} className='rounded-lg border bg-muted/40 p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <User className='h-8 w-8 rounded-full border p-1.5' />
                        <div>
                          <div className='font-medium'>
                            {member.first_name} {member.last_name}
                          </div>
                          <div className='text-sm text-muted-foreground'>{member.email}</div>
                        </div>
                      </div>
                      {member.is_primary ? (
                        <Badge className='h-6 px-3 text-sm'>Primary</Badge>
                      ) : (
                        <Badge variant='secondary' className='h-6 px-3 text-sm'>
                          Dependent
                        </Badge>
                      )}
                    </div>
                    <div className='grid gap-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <span>Born {format(new Date(member.date_of_birth), 'MMMM d, yyyy')}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4 text-muted-foreground' />
                        <span>{member.nationality}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
      case 'member':
        return renderMemberContent();
      case 'membership':
        return renderMembershipContent();
      case 'quote':
        return renderQuoteContent();
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
            <Button variant='ghost' size='icon' onClick={() => onOpenChange(false)}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className='h-[calc(100vh-5rem)]'>{renderContent()}</ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

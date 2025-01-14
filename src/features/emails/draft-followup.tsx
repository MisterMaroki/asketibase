import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

import tailwindConfig from './tailwind.config';

interface DraftFollowupEmailProps {
  firstName: string;
  membershipNumber?: string;
}

export const DraftFollowupEmail = ({ firstName, membershipNumber }: DraftFollowupEmailProps) => {
  const quoteUrl = 'https://quote.asketi.com?code=WELCOME10';

  return (
    <Html>
      <Head />
      <Preview>Your Global Adventure Awaits with ASKETI</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className='mx-auto my-auto bg-white font-sans'>
          <Container className='mx-auto mb-10 max-w-[600px]'>
            <Container className='relative rounded-lg bg-white p-8 shadow-lg'>
              {/* Special Offer Banner */}
              <Section className='rounded-lg bg-[#72c4ac]/10 p-8 text-center'>
                <Heading className='text-[32px] font-bold text-[#72c4ac]'>Special Welcome Offer</Heading>
                {membershipNumber && <Text className='text-[16px] text-[#758388]'>Reference: {membershipNumber}</Text>}
                <Text className='text-[24px] font-bold text-[#72c4ac]'>SAVE 10% TODAY</Text>
                <Text className='mt-2 text-[18px] text-[#758388]'>
                  Use code{' '}
                  <Link href={quoteUrl} className='font-bold text-[#72c4ac] no-underline'>
                    WELCOME10
                  </Link>
                </Text>
                <Text className='mt-2 text-[14px] text-[#758388]'>Valid for the entire month of January.</Text>
              </Section>

              <Hr className='my-6 border-[#72c4ac]/20' />

              {/* Main Content */}
              <Section>
                <Text className='text-[20px] font-semibold text-[#758388]'>Hello {firstName},</Text>
                <Text className='text-[16px] leading-relaxed text-[#758388]'>
                  We noticed you started your{' '}
                  <Link href='https://www.asketi.com/membership' className='text-[#72c4ac] underline'>
                    ASKETI
                  </Link>{' '}
                  application {membershipNumber && `(${membershipNumber})`}. To help you get started with comprehensive
                  global coverage, we&apos;re offering you an exclusive 10% discount on your membership.
                </Text>
              </Section>

              {/* Benefits Section */}
              <Section className='my-8'>
                <Text className='mb-4 text-[18px] font-semibold text-[#72c4ac]'>What You&apos;ll Get:</Text>
                <div className='space-y-2 text-[16px] text-[#758388]'>
                  <Text>
                    •{' '}
                    <Link href='https://www.asketi.com/hazardous-pursuits' className='text-[#72c4ac] underline'>
                      Global medical coverage
                    </Link>{' '}
                    in 190+ countries
                  </Text>
                  <Text>
                    •{' '}
                    <Link href='https://www.asketi.com/hazardous-pursuits' className='text-[#72c4ac] underline'>
                      Adventure sports coverage
                    </Link>
                  </Text>
                  <Text>
                    •{' '}
                    <Link href='https://www.asketi.com/claim' className='text-[#72c4ac] underline'>
                      24/7 emergency assistance
                    </Link>
                  </Text>
                  <Text>
                    •{' '}
                    <Link href='https://www.asketi.com/membership' className='text-[#72c4ac] underline'>
                      Flexible plans
                    </Link>
                  </Text>
                </div>
              </Section>

              {/* CTA Section */}
              <Section className='my-8 text-center'>
                <div className='mb-6 rounded-lg bg-[#72c4ac]/10 p-4'>
                  <Text className='text-[16px] font-semibold text-[#72c4ac]'>
                    🎉 Use code WELCOME10 to save 10% on your membership
                  </Text>
                  <Text className='text-[14px] text-[#758388]'>Offer expires in 48 hours</Text>
                </div>

                <Button
                  className='rounded-full bg-[#72c4ac] px-8 py-3 text-[16px] font-semibold text-white'
                  href={quoteUrl}
                >
                  Claim Your 10% Discount
                </Button>
              </Section>

              {/* Footer */}
              <Section>
                <Text className='text-[14px] text-[#758388]'>
                  Need help?{' '}
                  <Link href='https://www.asketi.com/contact' className='text-[#72c4ac] underline'>
                    Contact our team
                  </Link>
                </Text>
                <Text className='mt-4 text-[12px] text-[#758388]'>
                  <Link href='https://www.asketi.com/privacy-policy' className='text-[#758388] underline'>
                    Privacy Policy
                  </Link>{' '}
                  •
                  <Link href='https://www.asketi.com/terms-of-use' className='ml-2 text-[#758388] underline'>
                    Terms of Service
                  </Link>
                </Text>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

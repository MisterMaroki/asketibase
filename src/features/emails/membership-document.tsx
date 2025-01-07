import * as React from 'react';

import { DocumentData } from '@/features/membership/actions/generate-document';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

import tailwindConfig from './tailwind.config';

const COLORS = {
  mint: '#9ef0e4',
  sage: '#72c4ac',
  darkGray: '#758388',
};

export const MembershipDocumentEmail = (data: DocumentData) => {
  return (
    <Html>
      <Head />
      <Preview>Your ASKETI Membership Documents</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className='mx-auto my-auto bg-white font-sans'>
          <Container className='mx-auto mb-10 max-w-[600px]'>
            <Container className='relative rounded-lg bg-white p-8 shadow-lg'>
              <Section className='rounded-lg bg-[#9ef0e4]/10 p-8 text-center'>
                <Heading className='text-[32px] font-bold text-[#72c4ac]'>Welcome to ASKETI</Heading>
              </Section>

              <Hr className='my-6 border-[#72c4ac]/20' />
              {/* Main Content */}
              <Section>
                <Text className='text-[20px] font-semibold text-[#758388]'>Hello {data.members[0].first_name},</Text>
                <Text className='text-[16px] text-[#758388]'>
                  Thank you for choosing ASKETI. Your membership documents are attached to this email.
                </Text>
              </Section>
              {/* Header */}
              <Section className='mb-8'>
                <Row>
                  <Column>
                    <Text className='text-[24px] font-medium text-[#72c4ac]'>
                      <span className='mr-2'>📋</span>
                      Membership Overview
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Coverage Details Section */}
              <Section className='mb-8'>
                <Text className='mb-4 text-[18px] font-medium text-[#758388]'>Coverage Details</Text>
                <Row className='mb-4'>
                  <Column>
                    <Text className='text-[14px] text-[#758388]/70'>Currency:</Text>
                    <Text className='text-[16px] text-[#758388]'>{data.currency}</Text>
                  </Column>
                  <Column>
                    <Text className='text-[14px] text-[#758388]/70'>Type:</Text>
                    <Text className='text-[16px] text-[#758388]'>{data.membership_type}</Text>
                  </Column>
                </Row>
                <Row className='mb-4'>
                  <Column>
                    <Text className='text-[14px] text-[#758388]/70'>Coverage:</Text>
                    <Text className='text-[16px] text-[#758388]'>{data.coverage_type}</Text>
                  </Column>
                  <Column>
                    <Text className='text-[14px] text-[#758388]/70'>Duration Type:</Text>
                    <Text className='text-[16px] text-[#758388]'>{data.duration_type}</Text>
                  </Column>
                </Row>
              </Section>

              {/* Members Section */}
              <Section className='mb-8'>
                <Row className='mb-4'>
                  <Column>
                    <Text className='flex items-center text-[18px] font-medium text-[#758388]'>
                      Members
                    </Text>
                  </Column>
                </Row>

                {/* Primary Member Box */}
                <Section className='mb-4 rounded-lg bg-[#9ef0e4]/10 p-4'>
                  <Row>
                    <Column>
                      <Text className='mb-2 inline-block rounded-full bg-[#72c4ac]/20 px-3 py-1 text-[14px] text-[#72c4ac]'>
                        Primary Member
                      </Text>
                      <Text className='mb-2 text-[16px] text-[#758388]'>
                        {data.members[0].salutation} {data.members[0].first_name} {data.members[0].last_name}
                      </Text>
                      <Text className='text-[14px] text-[#758388]/70'>Address:</Text>
                      <Text className='text-[14px] text-[#758388]'>{data.members[0].address}</Text>
                    </Column>
                  </Row>
                </Section>

                {/* Other Members */}
                <Section className='mb-8'>
                  <Row>
                    <Column>
                      <Text className='mb-4 text-[18px] font-medium text-[#758388]'>Other Members</Text>
                    </Column>
                  </Row>
                  {data.members.map(
                    (member, index) =>
                      index > 0 && (
                        <Section className='mb-4 rounded-lg bg-[#9ef0e4]/10 p-4' key={index}>
                          <Row>
                            <Column>
                              <Text className='mb-2 text-[16px] text-[#758388]'>
                                {member.salutation} {member.first_name} {member.last_name}
                              </Text>
                            </Column>
                          </Row>
                        </Section>
                      ),
                  )}
                </Section>
              </Section>

              {/* Payment Summary */}
              <Section>
                <Text className='mb-4 text-[18px] font-medium text-[#758388]'>Payment Summary</Text>
                <Section className='rounded-lg bg-[#9ef0e4]/10 p-4'>
                  <Text className='mb-2 flex justify-between text-[14px] text-[#758388]'>
                    <span>Base Price:</span>
                    <span>
                      {data.currency} {data.base_price}
                    </span>
                  </Text>
                  <Text className='mb-2 flex justify-between text-[14px] text-[#758388]'>
                    <span>Medical Risk Premium:</span>
                    <span>
                      {data.currency} {data.medical_risk_premium}
                    </span>
                  </Text>
                  <Text className='mb-2 flex justify-between text-[14px] text-[#758388]'>
                    <span>Discount:</span>
                    <span>
                      -{data.currency} {data.discount}
                    </span>
                  </Text>
                  <Text className='mb-2 flex justify-between text-[14px] text-[#758388]'>
                    <span>Subtotal:</span>
                    <span>
                      {data.currency} {data.subtotal}
                    </span>
                  </Text>
                  <Text className='mb-2 flex justify-between text-[14px] text-[#758388]'>
                    <span>Tax:</span>
                    <span>
                      {data.currency} {data.tax}
                    </span>
                  </Text>
                  <Hr className='my-2 border-[#72c4ac]/20' />
                  <Text className='flex justify-between text-[16px] font-medium text-[#758388]'>
                    <span>Total Paid:</span>
                    <span>
                      {data.currency} {data.total_paid}
                    </span>
                  </Text>
                </Section>
              </Section>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MembershipDocumentEmail;

'use client';

import { useEffect, useState } from 'react';

import { AnimatedTick, AnimatedWarning } from '@/components/ui/animated-tick';
import { Button } from '@/components/ui/button';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { generateIfNotSent } from '@/features/membership/actions/generate-document';
import { useMembershipStore } from '@/store/membership-store';
import { cn } from '@/utils/cn';

interface DocumentGeneratorProps {
  quoteId: string;
  hasSentEmail: boolean;
}

const SUCCESS_MESSAGES = [
  'Document generated successfully.',
  'Email sent to your inbox.',
  'Safe travels from ASKETI',
  "We've got your back.",
];

const ERROR_MESSAGES = [
  'There was an error generating your document.',
  'Our team has been notified.',
  'Please contact support if you need immediate assistance.',
];

export function DocumentGenerator({ quoteId, hasSentEmail }: DocumentGeneratorProps) {
  const { reset } = useMembershipStore();
  const [messages, setMessages] = useState(['Payment successful.']);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState(false);
  const [isComplete, setIsComplete] = useState(hasSentEmail);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const generateDocuments = async () => {
      try {
        setTimeout(() => {
          setMessages((prev) => [...prev, 'Generating your policy document']);
        }, 1000);

        await new Promise((resolve) => setTimeout(resolve, 6000));

        const success = await generateIfNotSent(quoteId, false);

        if (success) {
          setMessages((prev) => [prev[0], ...SUCCESS_MESSAGES]);
        } else {
          throw new Error('Failed to generate document');
        }
      } catch (err) {
        console.error('Error generating document:', err);
        setError(true);
        setMessages((prev) => [prev[0], ...ERROR_MESSAGES]);
      } finally {
        setIsGenerating(false);
        setTimeout(() => {
          setIsComplete(true);
        }, 8000);
      }
    };

    generateDocuments();
  }, [quoteId, hasSentEmail]);

  return (
    <>
      {isGenerating && !hasSentEmail ? (
        <div className='pulse-wave'>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`pulse-wave-bar ${isGenerating ? 'animate-pulse' : ''} ${error ? 'bg-red-500' : ''}`}
            />
          ))}
        </div>
      ) : error ? (
        <AnimatedWarning />
      ) : (
        <AnimatedTick />
      )}
      <div className='mt-4'>
        <TypewriterEffect messages={messages} />
      </div>
      {hasSentEmail ? (
        <Button
          value={'sexy'}
          onClick={() => {
            generateIfNotSent(quoteId, true);
          }}
        >
          <span>Send it again.</span>
        </Button>
      ) : null}
      {(isComplete || hasSentEmail) && (
        <div className='mt-8 flex flex-1 flex-col items-center justify-end space-y-2'>
          {error ? (
            <p
              className={cn(
                'mt-8 text-center text-sm text-muted-foreground transition-opacity duration-1000',
                'animate-in fade-in fill-mode-forwards',
              )}
            >
              You can email us at{' '}
              <a href='mailto:support@asketi.com' className='text-primary underline'>
                support@asketi.com
              </a>
              .
            </p>
          ) : (
            <p
              className={cn(
                'mt-8 text-center text-sm text-muted-foreground transition-opacity duration-1000',
                'animate-in fade-in fill-mode-forwards',
              )}
            >
              You can safely close this tab now. We&apos;ll email you if we need anything else.
            </p>
          )}
        </div>
      )}
    </>
  );
}

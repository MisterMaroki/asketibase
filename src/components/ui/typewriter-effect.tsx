'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

interface TypewriterEffectProps {
  messages: string[];
  className?: string;
}

export function TypewriterEffect({ messages, className }: TypewriterEffectProps) {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ellipsisCount, setEllipsisCount] = useState(0);
  const [showInitialMessage, setShowInitialMessage] = useState(false);

  // Handle initial "Payment successful" fade in
  useEffect(() => {
    if (messages.length > 0 && !showInitialMessage) {
      setTimeout(() => {
        setShowInitialMessage(true);
      }, 300);
    }
  }, [messages]);

  // Handle the generating message and ellipsis
  useEffect(() => {
    if (messages.length === 2 && !isGenerating) {
      setTimeout(() => {
        setCurrentMessage('Generating your policy document');
        setIsGenerating(true);
      }, 800);
    }
  }, [messages, isGenerating]);

  // Handle ellipsis animation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setEllipsisCount((prev) => (prev + 1) % 4);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Handle success/error messages
  useEffect(() => {
    if (messages.length > 2 && isGenerating) {
      setIsGenerating(false);
      setCurrentMessage('');
      setDisplayedMessages([messages[0]]); // Start with just the initial message
      typeNextMessage(1);
    }
  }, [messages]);

  const typeNextMessage = (startIndex: number) => {
    if (startIndex >= messages.length) return;

    const nextMessage = messages[startIndex];
    let index = 0;

    const interval = setInterval(() => {
      if (index <= nextMessage.length) {
        setCurrentMessage(nextMessage.slice(0, index));
        index++;
      } else {
        setDisplayedMessages((prev) => [...prev, nextMessage]);
        setCurrentMessage('');
        clearInterval(interval);
        // Continue with next message after delay
        setTimeout(() => typeNextMessage(startIndex + 1), 500);
      }
    }, 50);
  };

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {/* Initial message with fade in */}
      {showInitialMessage && (
        <p
          className={cn(
            'text-foreground animate-in fade-in fill-mode-forwards',
            showInitialMessage ? 'opacity-100' : 'opacity-0'
          )}
        >
          {messages[0]}
        </p>
      )}

      {/* Displayed messages (after generating) */}
      {displayedMessages.slice(1).map((message, index) => (
        <p key={`${message}-${index}`} className='text-foreground-muted transition-all'>
          {message}
        </p>
      ))}

      {/* Current typing message or generating message */}
      {currentMessage && (
        <p className='text-foreground animate-in fade-in fill-mode-forwards'>
          {isGenerating ? `${currentMessage}${'.'.repeat(ellipsisCount)}` : currentMessage}
          <span className='animate-pulse'>|</span>
        </p>
      )}
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export interface QuestionSection {
  title: string;
  items?: string[];
  subtitle?: string;
}

interface MedicalQuestionProps {
  question: string | QuestionSection[];
  onAnswer: (answer: boolean) => void;
  isVisible: boolean;
  isAnswered: boolean;
}

export function MedicalQuestion({ question, onAnswer, isVisible, isAnswered }: MedicalQuestionProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative space-y-4 py-4 transition-all duration-500',
        isAnswered ? 'opacity-50' : 'opacity-100',
        isVisible ? 'animate-slide-down' : 'hidden'
      )}
    >
      {typeof question === 'string' ? (
        <p className='font-medium'>{question}</p>
      ) : (
        <div className='space-y-4'>
          {Array.isArray(question) ? (
            question.map((section, index) => (
              <Card key={index} className='p-4'>
                <h3 className='mb-3 font-medium'>{section.title}</h3>
                {section.items && (
                  <ul className='ml-4 space-y-2'>
                    {section.items.map((item, i) => (
                      <li key={i} className='list-disc text-sm text-muted-foreground'>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {section.subtitle && <p className='mt-2 text-sm text-muted-foreground'>{section.subtitle}</p>}
              </Card>
            ))
          ) : (
            <Card className='p-4'>
              <h3 className='mb-2 font-medium'>{(question as QuestionSection).title}</h3>
              {(question as QuestionSection).subtitle && (
                <p className='text-sm text-destructive/90'>{(question as QuestionSection).subtitle}</p>
              )}
            </Card>
          )}
        </div>
      )}
      <div className='flex gap-4'>
        <Button type='button' variant='outline' className='flex-1' onClick={() => onAnswer(true)} disabled={isAnswered}>
          Yes
        </Button>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={() => onAnswer(false)}
          disabled={isAnswered}
        >
          No
        </Button>
      </div>
    </div>
  );
}

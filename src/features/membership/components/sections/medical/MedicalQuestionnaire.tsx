'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, User } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { MedicalQuestion, QuestionSection } from './MedicalQuestion';

interface MedicalQuestionnaireProps {
  memberId: string;
  memberName: string;
  onComplete: (memberId: string, riskLevel: number) => void;
}

const QUESTIONS = [
  {
    id: 'terminal',
    text: {
      title: 'Have you been diagnosed with a terminal illness?',
      subtitle: 'If you answer Yes, coverage will be declined due to Medical Risk Rating Level Two',
    },
    declineOnYes: true,
  },
  {
    id: 'travel_advice',
    text: 'Have you been advised by a medical professional not to travel?',
    declineOnYes: true,
  },
  {
    id: 'conditions',
    text: [
      {
        title: 'Have you at any point suffered from or been treated for any of the following:',
        items: [
          'Any respiratory condition (relating to the lungs or breathing)',
          'Heart Condition',
          'Stroke',
          "Crohn's disease",
          'Epilepsy',
          'Cancer',
        ],
      },
      {
        title: 'Within the last twelve months, have you:',
        items: [
          'Received surgery or in-patient treatment',
          'Had investigations in a hospital or clinic',
          'Been on a waiting list for treatment',
          'Had an undiagnosed condition',
        ],
      },
      {
        title: 'Are you taking prescribed drugs or medication?',
        subtitle: '(other than those listed as No Screen Conditions)',
      },
    ],
    riskLevelOne: true,
  },
];

export function MedicalQuestionnaire({ memberId, memberName, onComplete }: MedicalQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isDeclined, setIsDeclined] = useState(false);

  // when answers changes, scroll down a bit
  useEffect(() => {
    if (answers) {
      // Wait for next tick to ensure DOM is fully rendered
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [answers]);

  const handleAnswer = (answer: boolean) => {
    const question = QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (question.declineOnYes && answer) {
      setIsDeclined(true);
      onComplete(memberId, 2); // Risk Level 2
      return;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Determine final risk level
      const riskLevel = newAnswers[QUESTIONS[2].id] ? 1 : 0;
      onComplete(memberId, riskLevel);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5 text-primary' />
          Medical Declaration - {memberName}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <p className='text-sm text-muted-foreground'>Please answer the following questions honestly and accurately.</p>

        {isDeclined ? (
          <Alert variant='destructive'>
            <AlertTriangle className='h-4 w-4' />
            <AlertTitle>Coverage Declined</AlertTitle>
            <AlertDescription>
              Due to Medical Risk Rating Level Two, we are unable to provide coverage at this time. We recommend
              consulting with your healthcare provider before planning any travel.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {QUESTIONS.map((question, index) => (
              <MedicalQuestion
                key={question.id}
                question={question.text as QuestionSection[]}
                onAnswer={handleAnswer}
                isVisible={index <= currentQuestion}
                isAnswered={answers[question.id] !== undefined}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

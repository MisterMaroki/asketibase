'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Edit2, Trash2, User } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface MedicalQuestionnaireProps {
  memberId: string;
  memberName: string;
  onComplete: (memberId: string, riskLevel: number) => void;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  items?: string[];
  declineOnYes?: boolean;
  riskLevelOne?: boolean;
  section: 'pre_screen' | 'medical';
}

const QUESTIONS: Question[] = [
  {
    id: 'pre_existing',
    title: 'Do you have any pre-existing medical conditions?',
    subtitle: 'A pre-existing condition is any medical condition that was present before the start of your coverage.',
    section: 'pre_screen',
  },
  {
    id: 'terminal',
    title: 'Have you been diagnosed with a terminal illness?',
    subtitle: 'If you answer Yes, coverage will be declined due to Medical Risk Rating Level Two',
    declineOnYes: true,
    section: 'medical',
  },
  {
    id: 'travel_advice',
    title: 'Have you been advised by a medical professional not to travel?',
    declineOnYes: true,
    section: 'medical',
  },
  {
    id: 'medical_conditions',
    title: 'Have you at any point suffered from or been treated for any of the following conditions:',
    items: [
      'Any respiratory condition (relating to the lungs or breathing)',
      'Heart Condition',
      'Stroke',
      "Crohn's disease",
      'Epilepsy',
      'Cancer',
      'Surgery or in-patient treatment in the last 12 months',
      'Investigations in a hospital or clinic in the last 12 months',
      'Been on a waiting list for treatment in the last 12 months',
      'Had an undiagnosed condition in the last 12 months',
      'Taking prescribed drugs or medication (other than those listed as No Screen Conditions)',
    ],
    riskLevelOne: true,
    section: 'medical',
  },
];

export function MedicalQuestionnaire({ memberId, memberName, onComplete }: MedicalQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isDeclined, setIsDeclined] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showMedicalQuestions, setShowMedicalQuestions] = useState(false);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [answers]);

  const handleClear = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsDeclined(false);
    setEditingQuestion(null);
    setShowMedicalQuestions(false);
    onComplete(memberId, -1); // Use -1 to indicate no answer
  };

  const calculateRiskLevel = (newAnswers: Record<string, boolean>): number => {
    // Check for decline conditions first
    const isDeclined = QUESTIONS.some((q) => q.declineOnYes && newAnswers[q.id] === true);
    if (isDeclined) return 2;

    // Check for risk level one conditions
    const hasRiskLevelOne = QUESTIONS.some((q) => q.riskLevelOne && newAnswers[q.id] === true);
    if (hasRiskLevelOne) return 1;

    return 0;
  };

  const handleAnswer = (questionId: string, answer: boolean) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // If editing, just update the answer and recalculate risk
    if (editingQuestion) {
      setEditingQuestion(null);
      const riskLevel = calculateRiskLevel(newAnswers);
      if (riskLevel === 2) setIsDeclined(true);
      onComplete(memberId, riskLevel);
      return;
    }

    // Handle pre-screen question
    if (questionId === 'pre_existing') {
      if (answer) {
        setShowMedicalQuestions(true);
        setCurrentQuestion(1); // Start with first medical question
      } else {
        onComplete(memberId, 0); // No pre-existing conditions, risk level 0
      }
      return;
    }

    // Check if this answer leads to decline
    const question = QUESTIONS[currentQuestion];
    if (question.declineOnYes && answer) {
      setIsDeclined(true);
      onComplete(memberId, 2);
      return;
    }

    // Move to next question if available
    const medicalQuestions = QUESTIONS.filter((q) => q.section === 'medical');
    const currentMedicalIndex = medicalQuestions.findIndex((q) => q.id === questionId);

    if (currentMedicalIndex < medicalQuestions.length - 1) {
      setCurrentQuestion(QUESTIONS.findIndex((q) => q.id === medicalQuestions[currentMedicalIndex + 1].id));
    } else {
      // Calculate final risk level
      const riskLevel = calculateRiskLevel(newAnswers);
      onComplete(memberId, riskLevel);
    }
  };

  const handleEdit = (questionId: string) => {
    setEditingQuestion(questionId);
  };

  const getCurrentQuestion = () => {
    if (editingQuestion) {
      return QUESTIONS.find((q) => q.id === editingQuestion)!;
    }
    return QUESTIONS[currentQuestion];
  };

  const getAnsweredQuestions = () => {
    return Object.entries(answers)
      .map(([qId, answer]) => {
        const question = QUESTIONS.find((q) => q.id === qId);
        if (!question || qId === getCurrentQuestion().id) return null;
        return { question, answer };
      })
      .filter(Boolean);
  };

  return (
    <Card className={cn(isDeclined && 'border-destructive')}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          {isDeclined ? (
            <AlertTriangle className='h-5 w-5 text-destructive' />
          ) : (
            <User className='h-5 w-5 text-primary' />
          )}
          <div>
            Medical Declaration
            <div className='text-sm font-normal text-muted-foreground'>{memberName}</div>
          </div>
        </CardTitle>
        {Object.keys(answers).length > 0 && !isDeclined && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClear}
            className='text-destructive hover:text-destructive/90'
          >
            Clear All Answers
          </Button>
        )}
      </CardHeader>
      <CardContent className='space-y-6'>
        {isDeclined ? (
          <div className='space-y-4'>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Coverage Declined</AlertTitle>
              <AlertDescription className='space-y-2'>
                <p>
                  Due to Medical Risk Rating Level Two, we are unable to provide coverage at this time. We recommend
                  consulting with your healthcare provider before planning any travel.
                </p>
                <p className='font-medium'>
                  You must clear your answers and complete the medical screening again to proceed with the application.
                </p>
              </AlertDescription>
            </Alert>
            <div className='flex justify-end'>
              <Button variant='destructive' size='sm' onClick={handleClear} className='gap-2'>
                <Trash2 className='h-4 w-4' />
                Clear Answers
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Answered Questions History */}
            {getAnsweredQuestions().length > 0 && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-medium text-muted-foreground'>Previous Answers</h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleClear}
                    className='text-xs text-muted-foreground hover:text-foreground'
                  >
                    Clear All
                  </Button>
                </div>
                <div className='space-y-2'>
                  {getAnsweredQuestions().map(
                    (item) =>
                      item && (
                        <div
                          key={item.question.id}
                          className='flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm'
                        >
                          <div className='flex items-center gap-2'>
                            <CheckCircle className={cn('h-4 w-4', item.answer ? 'text-destructive' : 'text-primary')} />
                            <span>{item.question.title}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className={cn('font-medium', item.answer ? 'text-destructive' : 'text-primary')}>
                              {item.answer ? 'Yes' : 'No'}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleEdit(item.question.id)}
                              className='h-8 w-8 p-0'
                            >
                              <Edit2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            {/* Current Question */}
            <div className='space-y-4 rounded-lg border p-4'>
              <div className='space-y-4'>
                {(() => {
                  const question = getCurrentQuestion();
                  return (
                    <>
                      <div>
                        <h3 className='font-medium'>{question.title}</h3>
                        {question.subtitle && <p className='text-sm text-muted-foreground'>{question.subtitle}</p>}
                      </div>
                      {question.items && question.items.length > 0 && (
                        <ul className='ml-6 space-y-2 text-sm text-muted-foreground'>
                          {question.items.map((item, index) => (
                            <li key={index} className='list-disc'>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className='flex gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  className={cn(
                    'flex-1 text-foreground hover:text-foreground',
                    answers[getCurrentQuestion().id] === true &&
                      'border-2 border-primary bg-primary/10 hover:bg-primary/20',
                  )}
                  onClick={() => handleAnswer(getCurrentQuestion().id, true)}
                >
                  Yes
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className={cn(
                    'flex-1 text-foreground hover:text-foreground',
                    answers[getCurrentQuestion().id] === false &&
                      'border-2 border-primary bg-primary/10 hover:bg-primary/20',
                  )}
                  onClick={() => handleAnswer(getCurrentQuestion().id, false)}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

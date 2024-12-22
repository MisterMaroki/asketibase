import { Card } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className='container mx-auto max-w-3xl px-4 py-8'>
      <Card className='p-8'>
        <div className='flex flex-col items-center justify-center space-y-6'>
          <div className='pulse-wave'>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className='pulse-wave-bar' />
            ))}
          </div>
          <p className='animate-fade-in text-muted-foreground'>Restoring your application...</p>
        </div>
      </Card>
    </div>
  );
}

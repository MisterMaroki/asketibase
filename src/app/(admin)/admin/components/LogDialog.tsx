'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogDialogProps {
  log: {
    id: string;
    level: string;
    operation: string;
    details: Record<string, any>;
    error: string | null;
    timestamp: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDialog({ log, open, onOpenChange }: LogDialogProps) {
  if (!log) return null;

  const levelColor = log.level === 'error' ? 'bg-destructive' : log.level === 'warn' ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className={`h-2 w-2 rounded-full ${levelColor}`} />
            {log.operation}
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-semibold'>Level:</span>
            <span className='col-span-3 capitalize'>{log.level}</span>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='font-semibold'>Timestamp:</span>
            <span className='col-span-3'>{new Date(log.timestamp).toLocaleString()}</span>
          </div>
          {log.error && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='font-semibold'>Error:</span>
              <span className='col-span-3 text-destructive'>{log.error}</span>
            </div>
          )}
          <div className='grid grid-cols-4 gap-4'>
            <span className='font-semibold'>Details:</span>
            <ScrollArea className='col-span-3 h-[200px] rounded-md border p-4'>
              <pre className='text-sm'>{JSON.stringify(log.details, null, 2)}</pre>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

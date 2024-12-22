'use client';

import { Settings } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <main className='container mx-auto p-8'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5 text-primary' />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>Settings configuration coming soon.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  );
}

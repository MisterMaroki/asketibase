'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  operation: string;
  details: Record<string, any>;
  error?: Error | null;
}

export async function logOperation(entry: LogEntry) {
  const timestamp = new Date().toISOString();
  const logData = {
    ...entry,
    timestamp,
    details: maskSensitiveData(entry.details),
    error: entry.error
      ? {
          message: entry.error.message,
          stack: entry.error.stack,
        }
      : null,
  };

  // Always log to console first
  console.log('LOG:', JSON.stringify(logData, null, 2));

  try {
    const { error: dbError } = await supabaseAdminClient.from('logs').insert([
      {
        level: entry.level,
        operation: entry.operation,
        details: maskSensitiveData(entry.details),
        error: entry.error?.message || null,
        timestamp,
      },
    ]);

    if (dbError) {
      console.error('Failed to store log in database:', dbError);
    }
  } catch (error) {
    console.error('Failed to store log:', error);
  }
}

// Mask sensitive data
function maskSensitiveData(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = ['email', 'password', 'contact_number'];
  const masked = { ...data };

  for (const [key, value] of Object.entries(masked)) {
    if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else if (sensitiveFields.includes(key.toLowerCase())) {
      masked[key] = typeof value === 'string' ? `${value.slice(0, 3)}***${value.slice(-3)}` : '***';
    }
  }

  return masked;
}

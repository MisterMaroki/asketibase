'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

export function PrivacyDisclaimer() {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-start gap-3 text-sm text-muted-foreground">
        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          By submitting this form, you consent to us using your personal data to process your application
          and contact you regarding your health coverage options. We may reach out via phone, email, or text
          to discuss your quote and coverage details. Your information will be processed in accordance with our{' '}
          <Link 
            href="/privacy" 
            className="text-primary hover:underline"
            target="_blank"
          >
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}
import type { Config } from 'tailwindcss';

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: '#9ef0e4',
          sage: '#72c4ac',
          purple: '#758380',
        },
        gray: {
          500: '#6B7280',
          600: '#4B5563',
        },
      },
      fontSize: {
        '[32px]': '32px',
        '[20px]': '20px',
        '[18px]': '18px',
        '[16px]': '16px',
        '[14px]': '14px',
        '[12px]': '12px',
      },
      borderRadius: {
        lg: '0.5rem',
        full: '9999px',
      },
      boxShadow: {
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        '[600px]': '600px',
      },
    },
  },
  plugins: [],
} satisfies Config;

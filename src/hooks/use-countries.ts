import { useEffect, useState } from 'react';

import { createClient } from '@/libs/supabase/client';

interface Country {
  id: string;
  country: string;
  nationality: string | null;
  base_price: number;
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    async function loadCountries() {
      try {
        const { data, error } = await supabase.from('country_base_prices').select('*').order('country');

        if (error) throw error;

        setCountries(data);
      } catch (err) {
        console.error('Error loading countries:', err);
        setError('Failed to load countries');
      } finally {
        setIsLoading(false);
      }
    }

    loadCountries();
  }, []);

  return { countries, isLoading, error };
}

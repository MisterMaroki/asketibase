'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { logOperation } from '@/features/membership/actions/log-action';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/libs/supabase/types';

import { columns } from './columns';
import { DataTable } from './DataTable';

type CountryBasePrice = Database['public']['Tables']['country_base_prices']['Row'];

export function CountryBasePricesTable() {
  const [data, setData] = useState<CountryBasePrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    loadPrices();
  }, []);

  async function loadPrices() {
    try {
      const { data: prices, error } = await supabase.from('country_base_prices').select('*').order('country');

      if (error) throw error;
      setData(prices as CountryBasePrice[]);
    } catch (err) {
      console.error('Error loading prices:', err);
      setError('Failed to load country base prices');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (id: string, updates: Partial<CountryBasePrice>) => {
    try {
      const { error } = await supabase.from('country_base_prices').update(updates).eq('id', id);

      if (error) throw error;

      await logOperation({
        level: 'info',
        operation: 'update_country_base_price',
        details: {
          country: updates.country,
          price: updates.base_price,
        },
      });

      // Refresh data
      loadPrices();
    } catch (err) {
      console.error('Error updating price:', err);
      throw new Error('Failed to update price');
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return <DataTable columns={columns as any} data={data} onSave={handleSave} />;
}

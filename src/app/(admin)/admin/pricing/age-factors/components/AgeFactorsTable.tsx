'use client';

import { useMemo,useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { updateAgeFactor } from '../actions';

interface AgeFactor {
  id: string;
  min_age: number;
  max_age: number;
  daily_rate: number;
  created_at: string | null;
  updated_at: string | null;
}

interface AgeFactorsTableProps {
  data: AgeFactor[];
}

export function AgeFactorsTable({ data }: AgeFactorsTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    dailyRate: number;
    minAge: number;
    maxAge: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((factor) => {
      const ageRange = `${factor.min_age} to ${factor.max_age}`;
      const dailyRate = factor.daily_rate.toString();

      return (
        ageRange.toLowerCase().includes(query) ||
        dailyRate.includes(query) ||
        factor.min_age.toString().includes(query) ||
        factor.max_age.toString().includes(query)
      );
    });
  }, [data, searchQuery]);

  const handleEdit = (factor: AgeFactor) => {
    setEditingId(factor.id);
    setEditValues({
      dailyRate: factor.daily_rate,
      minAge: factor.min_age,
      maxAge: factor.max_age,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleSave = async (id: string) => {
    if (!editValues) return;

    try {
      await updateAgeFactor({
        id,
        dailyRate: editValues.dailyRate,
        minAge: editValues.minAge,
        maxAge: editValues.maxAge,
      });
      toast.success('Age factor updated successfully');
      router.refresh();
      setEditingId(null);
      setEditValues(null);
    } catch (error) {
      toast.error('Failed to update age factor');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Age Factors</h3>
        <Badge variant='secondary'>
          {filteredData.length} {filteredData.length === 1 ? 'factor' : 'factors'}
          {searchQuery && filteredData.length !== data.length && ` (filtered from ${data.length})`}
        </Badge>
      </div>

      {/* Search */}
      <div className='flex items-center space-x-2'>
        <div className='relative max-w-sm flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search age factors by range or rate...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Age Range</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell>
                    {editingId === factor.id ? (
                      <div className='flex items-center gap-2'>
                        <Input
                          type='number'
                          value={editValues?.minAge}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues!,
                              minAge: parseInt(e.target.value),
                            })
                          }
                          min='0'
                          max={editValues?.maxAge}
                          className='w-20'
                        />
                        <span>to</span>
                        <Input
                          type='number'
                          value={editValues?.maxAge}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues!,
                              maxAge: parseInt(e.target.value),
                            })
                          }
                          min={editValues?.minAge}
                          className='w-20'
                        />
                      </div>
                    ) : (
                      `${factor.min_age} to ${factor.max_age}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === factor.id ? (
                      <Input
                        type='number'
                        value={editValues?.dailyRate}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues!,
                            dailyRate: parseFloat(e.target.value),
                          })
                        }
                        step='0.01'
                        min='0'
                        className='w-32'
                      />
                    ) : (
                      factor.daily_rate
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    {editingId === factor.id ? (
                      <div className='flex justify-end gap-2'>
                        <Button variant='outline' size='sm' onClick={() => handleCancel()}>
                          Cancel
                        </Button>
                        <Button size='sm' onClick={() => handleSave(factor.id)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button variant='outline' size='sm' onClick={() => handleEdit(factor)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='h-24 text-center'>
                  {searchQuery ? 'No age factors found for your search.' : 'No age factors.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

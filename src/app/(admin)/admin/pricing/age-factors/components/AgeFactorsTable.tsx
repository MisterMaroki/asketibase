'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
          {data.map((factor) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

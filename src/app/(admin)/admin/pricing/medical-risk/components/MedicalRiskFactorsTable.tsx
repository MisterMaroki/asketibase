'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import { updateMedicalRiskFactor } from '../actions';

interface MedicalRiskFactor {
  id: string;
  risk_level: number;
  daily_rate: number;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

interface MedicalRiskFactorsTableProps {
  data: MedicalRiskFactor[];
}

export function MedicalRiskFactorsTable({ data }: MedicalRiskFactorsTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    dailyRate: number;
    description: string;
  } | null>(null);

  const handleEdit = (factor: MedicalRiskFactor) => {
    setEditingId(factor.id);
    setEditValues({
      dailyRate: factor.daily_rate,
      description: factor.description,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleSave = async (id: string) => {
    if (!editValues) return;

    try {
      await updateMedicalRiskFactor({
        id,
        dailyRate: editValues.dailyRate,
        description: editValues.description,
      });
      toast.success('Medical risk factor updated successfully');
      router.refresh();
      setEditingId(null);
      setEditValues(null);
    } catch (error) {
      toast.error('Failed to update medical risk factor');
    }
  };

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Risk Level</TableHead>
            <TableHead>Daily Rate</TableHead>
            <TableHead className='w-[500px]'>Description</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((factor) => (
            <TableRow key={factor.id}>
              <TableCell>{factor.risk_level}</TableCell>
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
              <TableCell>
                {editingId === factor.id ? (
                  <Textarea
                    value={editValues?.description}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues!,
                        description: e.target.value,
                      })
                    }
                    className='h-20'
                  />
                ) : (
                  factor.description
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

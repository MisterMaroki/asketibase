'use client';

import { useMemo,useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((factor) => {
      return (
        factor.risk_level.toString().includes(query) ||
        factor.daily_rate.toString().includes(query) ||
        factor.description.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

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
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Medical Risk Factors</h3>
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
            placeholder='Search medical factors by level, rate, or description...'
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
              <TableHead>Risk Level</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead className='w-[500px]'>Description</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((factor) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  {searchQuery ? 'No medical risk factors found for your search.' : 'No medical risk factors.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

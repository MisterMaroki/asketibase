'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, PencilIcon, Trash2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMembershipStore } from '@/store/membership-store';

import { MemberForm } from './MemberForm';

export function MemberList() {
  const { members, removeMember, medicalState } = useMembershipStore();
  const [editingMember, setEditingMember] = useState<(typeof members)[0] | null>(null);

  const isMedicalComplete = (memberId: string) => {
    return medicalState.completedMembers[memberId] !== undefined;
  };

  if (!members.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Users className='h-5 w-5 text-primary' />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {members.map((member, index) => (
            <div key={member.id} className='flex items-center justify-between py-4 first:pt-0 last:pb-0'>
              <div className='space-y-1'>
                <h4 className='flex items-center gap-2 font-medium'>
                  {member.firstName} {member.lastName}
                  {index === 0 && (
                    <Badge variant='secondary' className='font-normal'>
                      Primary Member
                    </Badge>
                  )}
                  {isMedicalComplete(member.id) && (
                    <Badge variant='outline' className='gap-1 font-normal'>
                      <CheckCircle2 className='h-3 w-3' />
                      Medical Complete
                    </Badge>
                  )}
                </h4>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p>Born: {format(member.dateOfBirth!, 'PPP')}</p>
                  <p>Gender: {member.gender}</p>
                  <p className='max-w-md truncate'>{member.address}</p>
                </div>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='hover:bg-primary/10'
                  onClick={() => setEditingMember(member)}
                >
                  <PencilIcon className='h-4 w-4' />
                </Button>
                {members.length > 1 && (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                    onClick={() => removeMember(member.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Details</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <MemberForm existingMember={editingMember as any} onSubmit={() => setEditingMember(null)} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

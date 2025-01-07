'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, PencilIcon, Trash2, Users, X } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MEMBER_LIMITS } from '@/constants';
import type { MemberSchema } from '@/features/membership/validations/schemas';
import { useMembershipStore } from '@/store/membership-store';

import { MemberForm } from './MemberForm';

export function MemberList() {
  const { members, removeMember, medicalState, membershipType, addMember } = useMembershipStore();
  const [editingMember, setEditingMember] = useState<(typeof members)[0] | null>(null);
  const [showAddForm, setShowAddForm] = useState(!members.length);
  const [addFormData, setAddFormData] = useState<Partial<MemberSchema>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  const maxMembers = membershipType ? MEMBER_LIMITS[membershipType] : 1;
  const canAddMore = members.length < maxMembers;

  const handleAddFormChange = (field: string, value: any) => {
    setAddFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFormSubmit = (data: MemberSchema) => {
    addMember(data);
    setShowAddForm(false);
    setAddFormData({});
  };

  const isMedicalComplete = (memberId: string) => {
    return medicalState.completedMembers[memberId] !== undefined;
  };

  if (!members.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Members (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <MemberForm
              onSubmit={handleAddFormSubmit}
              existingMember={addFormData as any}
              onFieldChange={handleAddFormChange}
              showSubmitButton
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const EditFormContent = () => {
    const handleSubmit = (data: MemberSchema) => {
      if (editingMember?.id) {
        setEditingMember(null);
      }
    };

    return (
      <div className={isMobile ? 'flex h-full flex-col' : undefined}>
        {isMobile ? (
          <>
            <SheetHeader className='flex-none'>
              <SheetTitle>Edit Member Details</SheetTitle>
            </SheetHeader>
            <div className='flex-1 overflow-y-auto px-1'>
              {editingMember && (
                <MemberForm
                  id='member-form'
                  existingMember={editingMember as any}
                  onSubmit={handleSubmit}
                  showSubmitButton={false}
                />
              )}
            </div>
            <div className='flex-none border-t p-4'>
              <Button type='submit' form='member-form' className='w-full'>
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit Member Details</DialogTitle>
            </DialogHeader>
            {editingMember && (
              <MemberForm existingMember={editingMember as any} onSubmit={() => setEditingMember(null)} />
            )}
          </>
        )}
      </div>
    );
  };

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
              <div className='min-w-0 flex-1 space-y-1'>
                <h4 className='flex items-center justify-start gap-2 font-medium'>
                  <div className='flex min-w-0 items-start gap-2 sm:flex-1'>
                    <span className='hidden sm:inline'>
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                  <div className='flex shrink-0 gap-2'>
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
                  </div>
                </h4>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p className='inline text-foreground sm:hidden'>
                    {member.firstName} {member.lastName}
                  </p>
                  <p>Born: {format(member.dateOfBirth ?? new Date(), 'PPP')}</p>
                  <p>Gender: {member.gender}</p>
                  <p className='truncate'>{member.address}</p>
                </div>
              </div>
              <div className='ml-4 flex shrink-0 gap-2'>
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
        {canAddMore && !showAddForm && (
          <div className='mt-4 border-t pt-4'>
            <Button className='w-full' variant='outline' onClick={() => setShowAddForm(true)}>
              <Users className='mr-2 h-4 w-4' />
              Add Another Member ({members.length + 1}/{maxMembers})
            </Button>
          </div>
        )}
        {showAddForm && (
          <div className='mt-4 space-y-4 border-t pt-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Add New Member</h3>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  setShowAddForm(false);
                  setAddFormData({});
                }}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
            <MemberForm
              onSubmit={handleAddFormSubmit}
              existingMember={addFormData as any}
              onFieldChange={handleAddFormChange}
              showSubmitButton
            />
          </div>
        )}
      </CardContent>

      {isMobile ? (
        <Sheet open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <SheetContent side='bottom' className='flex h-[90%] flex-col'>
            <EditFormContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <EditFormContent />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

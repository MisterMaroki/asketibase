import { useState } from 'react';
import { subYears } from 'date-fns';

import { BlackDOBInput } from '@/components/dob-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODES, SALUTATIONS } from '@/constants/options';
import { getAddressError } from '@/features/membership/validations/address';
import { getMemberValidationErrors, isValidCountryId } from '@/features/membership/validations/member-fields';
import { Country } from '@/hooks/use-countries';
import { cn } from '@/utils/cn';

import { AddressInput } from './AddressInput';

interface MemberFormFieldsProps {
  member?: any;
  onFieldChange?: (field: string, value: any) => void;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  countries?: Country[];
  isLoadingCountries?: boolean;
}

export function MemberFormFields({
  member,
  onFieldChange = () => {},
  showSubmitButton = false,
  onSubmit,
  countries = [],
  isLoadingCountries = false,
}: MemberFormFieldsProps) {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    onFieldChange(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitAttempted(true);
    onSubmit?.();
  };

  const errors = getMemberValidationErrors(member || {});
  const getFieldError = (field: string) =>
    errors.find((error) => {
      return error.toLowerCase().includes(field.toLowerCase());
    });

  const shouldShowError = (field: string) => {
    return (touchedFields.has(field) || isSubmitAttempted) && !!getFieldError(field);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Salutation field */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='salutation'>Salutation</Label>
          <Select
            value={member?.salutation || ''}
            onValueChange={(value) => handleFieldChange('salutation', value)}
            required
          >
            <SelectTrigger id='salutation' className={cn(shouldShowError('salutation') && 'border-destructive')}>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              {SALUTATIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {shouldShowError('salutation') && <p className='text-sm text-destructive'>{getFieldError('salutation')}</p>}
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            value={member?.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            required
            autoComplete='given-name'
            className={cn(shouldShowError('first name') && 'border-destructive')}
          />
          {shouldShowError('first name') && <p className='text-sm text-destructive'>{getFieldError('first name')}</p>}
        </div>
      </div>

      {/* Last Name field */}
      <div className='space-y-2'>
        <Label htmlFor='lastName'>Surname</Label>
        <Input
          id='lastName'
          value={member?.lastName || ''}
          onChange={(e) => handleFieldChange('lastName', e.target.value)}
          required
          autoComplete='family-name'
          className={cn(shouldShowError('last name') && 'border-destructive')}
        />
        {shouldShowError('last name') && <p className='text-sm text-destructive'>{getFieldError('last name')}</p>}
      </div>

      {/* Date of Birth and Gender fields */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='dob'>Date of Birth</Label>
          <BlackDOBInput
            value={member?.dateOfBirth || null}
            onChange={(date) => handleFieldChange('dateOfBirth', date)}
            className={cn(shouldShowError('date of birth') && 'border-destructive')}
          />
          {shouldShowError('date of birth') && (
            <p className='text-sm text-destructive'>{getFieldError('date of birth')}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>Gender on Passport</Label>
          <div className='flex space-x-4'>
            <Button
              type='button'
              variant={member?.gender === 'male' ? 'sexy' : 'outline'}
              onClick={() => handleFieldChange('gender', 'male')}
              className={cn('flex items-center space-x-2', shouldShowError('gender') && 'border-destructive')}
            >
              Male
            </Button>
            <Button
              type='button'
              variant={member?.gender === 'female' ? 'sexy' : 'outline'}
              onClick={() => handleFieldChange('gender', 'female')}
              className={cn('flex items-center space-x-2', shouldShowError('gender') && 'border-destructive')}
            >
              Female
            </Button>
          </div>
          {shouldShowError('gender') && <p className='text-sm text-destructive'>{getFieldError('gender')}</p>}
        </div>
      </div>

      {/* Nationality field */}
      <div className='space-y-2'>
        <Label htmlFor='nationality'>Nationality</Label>
        <Select
          value={member?.nationality || ''}
          onValueChange={(value) => handleFieldChange('nationality', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger id='nationality' className={cn(shouldShowError('nationality') && 'border-destructive')}>
            <SelectValue placeholder={isLoadingCountries ? 'Loading...' : 'Select nationality'} />
          </SelectTrigger>
          <SelectContent>
            {countries
              .filter((country) => country.nationality && country.nationality !== 'n/a')
              .map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.nationality}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {shouldShowError('nationality') && <p className='text-sm text-destructive'>{getFieldError('nationality')}</p>}
      </div>

      {/* Contact Information */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='countryCode'>Country Code</Label>
          <Select
            value={member?.countryCode || ''}
            onValueChange={(value) => handleFieldChange('countryCode', value)}
            required
          >
            <SelectTrigger id='countryCode' className={cn(shouldShowError('country code') && 'border-destructive')}>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_CODES.map((code) => (
                <SelectItem key={code.code} value={code.code}>
                  {code.code} ({code.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {shouldShowError('country code') && (
            <p className='text-sm text-destructive'>{getFieldError('country code')}</p>
          )}
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='contactNumber'>Contact Number</Label>
          <Input
            id='contactNumber'
            type='tel'
            value={member?.contactNumber || ''}
            onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
            required
            autoComplete='tel'
            className={cn(shouldShowError('contact number') && 'border-destructive')}
          />
          {shouldShowError('contact number') && (
            <p className='text-sm text-destructive'>{getFieldError('contact number')}</p>
          )}
        </div>
      </div>

      {/* Email field */}
      <div className='space-y-2'>
        <Label htmlFor='email'>Email Address</Label>
        <Input
          id='email'
          type='email'
          value={member?.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          required
          autoComplete='email'
          className={cn(shouldShowError('email') && 'border-destructive')}
        />
        {shouldShowError('email') && <p className='text-sm text-destructive'>{getFieldError('email')}</p>}
      </div>

      {/* Country of Residence field */}
      <div className='space-y-2'>
        <Label htmlFor='countryOfResidence'>Country of Residence</Label>
        <Select
          value={member?.countryOfResidence || ''}
          onValueChange={(value) => handleFieldChange('countryOfResidence', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger
            id='countryOfResidence'
            className={cn(shouldShowError('country of residence') && 'border-destructive')}
          >
            <SelectValue placeholder={isLoadingCountries ? 'Loading...' : 'Select country'} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {shouldShowError('country of residence') && (
          <p className='text-sm text-destructive'>{getFieldError('country of residence')}</p>
        )}
      </div>

      {/* Address field */}
      <div className='space-y-2'>
        <AddressInput
          value={member?.address || ''}
          onChange={(value) => handleFieldChange('address', value)}
          className={cn(shouldShowError('address') && 'border-destructive')}
        />
        {shouldShowError('address') && <p className='text-sm text-destructive'>{getFieldError('address')}</p>}
      </div>

      {showSubmitButton && (
        <Button type='submit' className='w-full' disabled={isLoadingCountries || errors.length > 0}>
          {member?.id ? 'Update Details' : 'Add Member'}
        </Button>
      )}
    </form>
  );
}

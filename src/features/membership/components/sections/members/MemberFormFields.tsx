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
  const MAX_AGE = 85;
  const minDate = subYears(new Date(), MAX_AGE);
  const maxDate = new Date();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  const errors = getMemberValidationErrors(member || {});
  const getFieldError = (field: string) => errors.find((error) => error.toLowerCase().includes(field.toLowerCase()));

  const isFieldInvalid = (field: string) => !!getFieldError(field);

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Salutation field */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='salutation'>Salutation</Label>
          <Select
            value={member?.salutation || ''}
            onValueChange={(value) => onFieldChange('salutation', value)}
            required
          >
            <SelectTrigger id='salutation' className={cn(isFieldInvalid('salutation') && 'border-destructive')}>
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
          {isFieldInvalid('salutation') && <p className='text-sm text-destructive'>{getFieldError('salutation')}</p>}
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            value={member?.firstName || ''}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
            autoComplete='given-name'
            className={cn(isFieldInvalid('first name') && 'border-destructive')}
          />
          {isFieldInvalid('first name') && <p className='text-sm text-destructive'>{getFieldError('first name')}</p>}
        </div>
      </div>

      {/* Last Name field */}
      <div className='space-y-2'>
        <Label htmlFor='lastName'>Surname</Label>
        <Input
          id='lastName'
          value={member?.lastName || ''}
          onChange={(e) => onFieldChange('lastName', e.target.value)}
          required
          autoComplete='family-name'
          className={cn(isFieldInvalid('last name') && 'border-destructive')}
        />
        {isFieldInvalid('last name') && <p className='text-sm text-destructive'>{getFieldError('last name')}</p>}
      </div>

      {/* Date of Birth and Gender fields */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='dob'>Date of Birth</Label>
          <BlackDOBInput
            value={member?.dateOfBirth || null}
            onChange={(date) => onFieldChange('dateOfBirth', date)}
            className={cn(isFieldInvalid('date of birth') && 'border-destructive')}
          />
          {isFieldInvalid('date of birth') && (
            <p className='text-sm text-destructive'>{getFieldError('date of birth')}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>Gender on Passport</Label>
          <div className='flex space-x-4'>
            <Button
              type='button'
              variant={member?.gender === 'male' ? 'sexy' : 'outline'}
              onClick={() => onFieldChange('gender', 'male')}
              className={cn('flex items-center space-x-2', isFieldInvalid('gender') && 'border-destructive')}
            >
              Male
            </Button>
            <Button
              type='button'
              variant={member?.gender === 'female' ? 'sexy' : 'outline'}
              onClick={() => onFieldChange('gender', 'female')}
              className={cn('flex items-center space-x-2', isFieldInvalid('gender') && 'border-destructive')}
            >
              Female
            </Button>
          </div>
          {isFieldInvalid('gender') && <p className='text-sm text-destructive'>{getFieldError('gender')}</p>}
        </div>
      </div>

      {/* Nationality field */}
      <div className='space-y-2'>
        <Label htmlFor='nationality'>Nationality</Label>
        <Select
          value={member?.nationality || ''}
          onValueChange={(value) => onFieldChange('nationality', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger id='nationality' className={cn(isFieldInvalid('nationality') && 'border-destructive')}>
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
        {isFieldInvalid('nationality') && <p className='text-sm text-destructive'>{getFieldError('nationality')}</p>}
      </div>

      {/* Contact Information */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='countryCode'>Country Code</Label>
          <Select
            value={member?.countryCode || ''}
            onValueChange={(value) => onFieldChange('countryCode', value)}
            required
          >
            <SelectTrigger id='countryCode' className={cn(isFieldInvalid('country code') && 'border-destructive')}>
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
          {isFieldInvalid('country code') && (
            <p className='text-sm text-destructive'>{getFieldError('country code')}</p>
          )}
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='contactNumber'>Contact Number</Label>
          <Input
            id='contactNumber'
            type='tel'
            value={member?.contactNumber || ''}
            onChange={(e) => onFieldChange('contactNumber', e.target.value)}
            required
            autoComplete='tel'
            className={cn(isFieldInvalid('contact number') && 'border-destructive')}
          />
          {isFieldInvalid('contact number') && (
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
          onChange={(e) => onFieldChange('email', e.target.value)}
          required
          autoComplete='email'
          className={cn(isFieldInvalid('email') && 'border-destructive')}
        />
        {isFieldInvalid('email') && <p className='text-sm text-destructive'>{getFieldError('email')}</p>}
      </div>

      {/* Country of Residence field */}
      <div className='space-y-2'>
        <Label htmlFor='countryOfResidence'>Country of Residence</Label>
        <Select
          value={member?.countryOfResidence || ''}
          onValueChange={(value) => onFieldChange('countryOfResidence', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger
            id='countryOfResidence'
            className={cn(isFieldInvalid('country of residence') && 'border-destructive')}
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
        {isFieldInvalid('country of residence') && (
          <p className='text-sm text-destructive'>{getFieldError('country of residence')}</p>
        )}
      </div>

      {/* Address field */}
      <div className='space-y-2'>
        <AddressInput
          value={member?.address || ''}
          onChange={(value) => onFieldChange('address', value)}
          className={cn(isFieldInvalid('address') && 'border-destructive')}
        />
        {isFieldInvalid('address') && <p className='text-sm text-destructive'>{getFieldError('address')}</p>}
      </div>

      {showSubmitButton && (
        <Button type='submit' className='w-full' disabled={isLoadingCountries || errors.length > 0}>
          {member?.id ? 'Update Details' : 'Add Member'}
        </Button>
      )}
    </form>
  );
}

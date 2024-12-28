import { subYears } from 'date-fns';

import { BlackDOBInput } from '@/components/dob-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODES, SALUTATIONS } from '@/constants/options';
import { isMemberValid } from '@/features/membership/validations/member-fields';
import { Country } from '@/hooks/use-countries';

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
            <SelectTrigger id='salutation'>
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
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            value={member?.firstName || ''}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
            autoComplete='given-name'
          />
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
        />
      </div>

      {/* Date of Birth and Gender fields */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='dob'>Date of Birth</Label>
          <BlackDOBInput value={member?.dateOfBirth || null} onChange={(date) => onFieldChange('dateOfBirth', date)} />
          {/* <DobSelector
            value={member?.dateOfBirth || null}
            onChange={(date) => onFieldChange('dateOfBirth', date)}
            maxDate={maxDate}
            minDate={minDate}
          /> */}
        </div>

        <div className='space-y-2'>
          <Label>Gender on Passport</Label>
          <div className='flex space-x-4'>
            <Button
              type='button'
              variant={member?.gender === 'male' ? 'sexy' : 'outline'}
              onClick={() => onFieldChange('gender', 'male')}
              className='flex items-center space-x-2'
            >
              Male
            </Button>
            <Button
              type='button'
              variant={member?.gender === 'female' ? 'sexy' : 'outline'}
              onClick={() => onFieldChange('gender', 'female')}
              className='flex items-center space-x-2'
            >
              Female
            </Button>
          </div>
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
          <SelectTrigger id='nationality'>
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
            <SelectTrigger id='countryCode'>
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
          />
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
        />
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
          <SelectTrigger id='countryOfResidence'>
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
      </div>

      {/* Address field */}
      <AddressInput value={member?.address || ''} onChange={(value) => onFieldChange('address', value)} />

      {showSubmitButton && (
        <Button type='submit' className='w-full' disabled={isLoadingCountries || !isMemberValid(member)}>
          {member?.id ? 'Update Details' : 'Add Member'}
        </Button>
      )}
    </form>
  );
}

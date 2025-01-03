import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { BlackDOBInput } from '@/components/dob-input';
import { PhoneInput } from '@/components/phone-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRY_CODES, SALUTATIONS } from '@/constants';
import { isMemberValid } from '@/features/membership/validations/member';
import { type MemberSchema, memberSchema } from '@/features/membership/validations/schemas';
import { Country } from '@/hooks/use-countries';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';

import { AddressInput } from './AddressInput';

interface MemberFormFieldsProps {
  id?: string;
  member?: MemberSchema;
  onFieldChange?: (field: string, value: any) => void;
  showSubmitButton?: boolean;
  onSubmit?: (data: MemberSchema) => void;
  countries?: Country[];
  isLoadingCountries?: boolean;
}

export function MemberFormFields({
  id,
  member,
  onFieldChange = () => {},
  showSubmitButton = false,
  onSubmit,
  countries = [],
  isLoadingCountries = false,
}: MemberFormFieldsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    getValues,
    watch,
  } = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
    defaultValues: member || {},
    mode: 'onTouched',
  });

  const handleFormSubmit = (data: MemberSchema) => {
    onSubmit?.(data);
  };

  const handleFieldUpdate = (field: keyof MemberSchema, value: any) => {
    onFieldChange(field, value);
    setValue(field, value, {
      shouldTouch: true,
    });
  };

  const handleDateChange = (date: Date | null) => {
    const isoString = date?.toISOString() || null;
    handleFieldUpdate('dateOfBirth', isoString);
  };

  const dateOfBirth = watch('dateOfBirth');
  const dateValue = dateOfBirth ? new Date(dateOfBirth) : null;

  const registerWithOnChange = (name: keyof MemberSchema) => {
    const registration = register(name);
    return {
      ...registration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        registration.onChange(e);
        onFieldChange(name, e.target.value);
      },
    };
  };

  const nationalities = useMemo(
    () =>
      Array.from(
        new Set(
          countries
            .filter((country) => country.nationality && country.nationality !== 'n/a')
            .map((country) => country.nationality),
        ),
      )
        .map((nationality) => ({
          id: countries.find((country) => country.nationality === nationality)?.id,
          name: nationality || '',
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries],
  );

  console.log(nationalities);

  console.log(nationalities);

  return (
    <form id={id} onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Salutation field */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-2'>
          <Label htmlFor='salutation'>Salutation</Label>
          <Select
            value={watch('salutation')}
            onValueChange={(value) => handleFieldUpdate('salutation', value)}
            required
          >
            <SelectTrigger
              id='salutation'
              className={cn(touchedFields.salutation && errors.salutation && 'border-destructive')}
            >
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
          {touchedFields.salutation && errors.salutation && (
            <p className='text-sm text-destructive'>{errors.salutation.message}</p>
          )}
        </div>
        <div className='space-y-2 sm:col-span-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            {...registerWithOnChange('firstName')}
            autoComplete='given-name'
            className={cn(touchedFields.firstName && errors.firstName && 'border-destructive')}
          />
          {touchedFields.firstName && errors.firstName && (
            <p className='text-sm text-destructive'>{errors.firstName.message}</p>
          )}
        </div>
      </div>

      {/* Last Name field */}
      <div className='space-y-2'>
        <Label htmlFor='lastName'>Surname</Label>
        <Input
          {...registerWithOnChange('lastName')}
          autoComplete='family-name'
          className={cn(touchedFields.lastName && errors.lastName && 'border-destructive')}
        />
        {touchedFields.lastName && errors.lastName && (
          <p className='text-sm text-destructive'>{errors.lastName.message}</p>
        )}
      </div>

      {/* Date of Birth and Gender fields */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='dob'>Date of Birth</Label>
          <BlackDOBInput
            value={dateValue}
            onChange={handleDateChange}
            className={cn(touchedFields.dateOfBirth && errors.dateOfBirth && 'border-destructive')}
          />
          {touchedFields.dateOfBirth && errors.dateOfBirth && (
            <p className='text-sm text-destructive'>{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>Gender on Passport</Label>
          <div className='flex space-x-4'>
            <Button
              type='button'
              variant={watch('gender') === 'male' ? 'sexy' : 'outline'}
              onClick={() => handleFieldUpdate('gender', 'male')}
              className={cn(
                'flex items-center space-x-2',
                touchedFields.gender && errors.gender && 'border-destructive',
              )}
            >
              Male
            </Button>
            <Button
              type='button'
              variant={watch('gender') === 'female' ? 'sexy' : 'outline'}
              onClick={() => handleFieldUpdate('gender', 'female')}
              className={cn(
                'flex items-center space-x-2',
                touchedFields.gender && errors.gender && 'border-destructive',
              )}
            >
              Female
            </Button>
          </div>
          {touchedFields.gender && errors.gender && <p className='text-sm text-destructive'>{errors.gender.message}</p>}
        </div>
      </div>

      {/* Nationality field */}
      <div className='space-y-2'>
        <Label htmlFor='nationality'>Nationality</Label>
        <Select
          value={watch('nationality')}
          onValueChange={(value) => handleFieldUpdate('nationality', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger
            id='nationality'
            className={cn(touchedFields.nationality && errors.nationality && 'border-destructive')}
          >
            <SelectValue placeholder={isLoadingCountries ? 'Loading...' : 'Select nationality'} />
          </SelectTrigger>
          <SelectContent>
            {nationalities.map((nationality) => (
              <SelectItem key={nationality.id} value={nationality.id || ''}>
                {nationality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touchedFields.nationality && errors.nationality && (
          <p className='text-sm text-destructive'>{errors.nationality.message}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className='space-y-2'>
        <Label htmlFor='contactNumber'>Mobile Number</Label>
        <PhoneInput
          countryCode={watch('countryCode')}
          onCountryCodeChange={(value) => handleFieldUpdate('countryCode', value)}
          {...registerWithOnChange('contactNumber')}
          error={touchedFields.contactNumber && !!errors.contactNumber}
          autoComplete='tel'
          placeholder='Enter your mobile number'
        />
        {touchedFields.contactNumber && errors.contactNumber && (
          <p className='text-sm text-destructive'>{errors.contactNumber.message}</p>
        )}
      </div>

      {/* Landline Number field */}
      <div className='space-y-2'>
        <Label htmlFor='landlineNumber'>Landline Number (Optional)</Label>
        <Input
          {...registerWithOnChange('landlineNumber')}
          type='tel'
          id='landlineNumber'
          autoComplete='tel'
          placeholder='Enter your landline number'
          className={cn(touchedFields.landlineNumber && errors.landlineNumber && 'border-destructive')}
        />
        {touchedFields.landlineNumber && errors.landlineNumber && (
          <p className='text-sm text-destructive'>{errors.landlineNumber.message}</p>
        )}
      </div>

      {/* Email field */}
      <div className='space-y-2'>
        <Label htmlFor='email'>Email Address</Label>
        <Input
          {...registerWithOnChange('email')}
          type='email'
          autoComplete='email'
          className={cn(touchedFields.email && errors.email && 'border-destructive')}
        />
        {touchedFields.email && errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
      </div>

      {/* Country of Residence field */}
      <div className='space-y-2'>
        <Label htmlFor='countryOfResidence'>Country of Residence</Label>
        <Select
          value={watch('countryOfResidence')}
          onValueChange={(value) => handleFieldUpdate('countryOfResidence', value)}
          disabled={isLoadingCountries}
          required
        >
          <SelectTrigger
            id='countryOfResidence'
            className={cn(touchedFields.countryOfResidence && errors.countryOfResidence && 'border-destructive')}
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
        {touchedFields.countryOfResidence && errors.countryOfResidence && (
          <p className='text-sm text-destructive'>{errors.countryOfResidence.message}</p>
        )}
      </div>

      {/* Address field */}
      <div className='space-y-2'>
        <AddressInput
          value={watch('address')}
          onChange={(value) => handleFieldUpdate('address', value)}
          className={cn(touchedFields.address && errors.address && 'border-destructive')}
        />
        {touchedFields.address && errors.address && (
          <p className='text-sm text-destructive'>{errors.address.message}</p>
        )}
      </div>

      {showSubmitButton && (
        <Button
          type='submit'
          className='w-full'
          disabled={isLoadingCountries || Object.keys(errors).length > 0 || !isMemberValid(member || getValues())}
        >
          {member?.id ? 'Update Details' : 'Confirm Add Member'}
        </Button>
      )}
    </form>
  );
}

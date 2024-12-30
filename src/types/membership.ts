export interface Member {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  countryOfResidence: string;
  address: string;
  isPrimary?: boolean;
}

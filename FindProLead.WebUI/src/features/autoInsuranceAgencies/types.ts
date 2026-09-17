export interface AutoInsuranceAgency {
  id: number;
  rowId: string;
  subsidiaryId: number;
  subsidiaryName: string;
  name: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  alternatePhone: string | null;
  transfersPerDay: number;
  linkedin: string | null;
  multiCars: boolean;
  homeOwners: boolean;
  states: string;
  verifierNotes: string | null;
  memo: string | null;
  createdOn: string;
}

export interface CreateAutoInsuranceAgencyRequest {
  subsidiaryId: number;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  transfersPerDay: number;
  linkedin?: string;
  multiCars: boolean;
  homeOwners: boolean;
  states: string;
  verifierNotes?: string;
  memo?: string;
}

export interface UpdateAutoInsuranceAgencyRequest {
  subsidiaryId: number;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  transfersPerDay: number;
  linkedin?: string;
  multiCars: boolean;
  homeOwners: boolean;
  states: string;
  verifierNotes?: string;
  memo?: string;
}

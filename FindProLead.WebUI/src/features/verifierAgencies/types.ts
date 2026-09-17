export interface VerifierAgency {
  id: number;
  rowId: string;
  name: string;
  website: string | null;
  email: string | null;
  linkedin: string | null;
  memo: string | null;
  createdOn: string;
}

export interface CreateVerifierAgencyRequest {
  name: string;
  website?: string;
  email?: string;
  linkedin?: string;
  memo?: string;
}

export interface UpdateVerifierAgencyRequest {
  name: string;
  website?: string;
  email?: string;
  linkedin?: string;
  memo?: string;
}

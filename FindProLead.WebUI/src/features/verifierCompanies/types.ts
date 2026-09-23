export interface VerifierCompany {
  id: number;
  rowId: string;
  name: string;
  website: string | null;
  email: string | null;
  linkedin: string | null;
  memo: string | null;
  createdOn: string;
}

export interface CreateVerifierCompanyRequest {
  name: string;
  website?: string;
  email?: string;
  linkedin?: string;
  memo?: string;
}

export interface UpdateVerifierCompanyRequest {
  name: string;
  website?: string;
  email?: string;
  linkedin?: string;
  memo?: string;
}

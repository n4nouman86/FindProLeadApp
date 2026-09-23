export interface SubsidiaryCompany {
  id: number;
  rowId: string;
  name: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  memo: string | null;
  createdOn: string;
}

export interface CreateSubsidiaryCompanyRequest {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  memo?: string;
}

export interface UpdateSubsidiaryCompanyRequest {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  memo?: string;
}

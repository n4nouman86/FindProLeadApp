export interface Subsidiary {
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

export interface CreateSubsidiaryRequest {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  memo?: string;
}

export interface UpdateSubsidiaryRequest {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  memo?: string;
}

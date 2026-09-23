export interface AutoLead {
  id: number;
  rowId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  dateOfBirth: string;
  autoInsuranceAgencyId: number;
  autoInsuranceAgencyName: string;
  verifierCompanyId: number | null;
  verifierCompanyName: string;
  appUserId: string;
  appUserName: string;
}

export interface CreateAutoLeadRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  autoInsuranceAgencyId: number;
  verifierCompanyId?: number;
  appUserId: string;
}

export type UpdateAutoLeadRequest = CreateAutoLeadRequest;

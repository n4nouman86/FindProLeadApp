export interface AutoInsuranceCompany {
  id: number;
  name: string;
  createdOn: string;
}

export interface CreateAutoInsuranceCompanyRequest {
  name: string;
}

export interface UpdateAutoInsuranceCompanyRequest {
  name: string;
}

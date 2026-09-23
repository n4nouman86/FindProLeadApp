export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  isLocked: boolean;
  verifierCompanyId: number | null;
  autoInsuranceAgencyId: number | null;
  role?: string | null;
  createdOn: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verifierCompanyId?: number;
  autoInsuranceAgencyId?: number;
  role?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  verifierCompanyId?: number;
  autoInsuranceAgencyId?: number;
  role?: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

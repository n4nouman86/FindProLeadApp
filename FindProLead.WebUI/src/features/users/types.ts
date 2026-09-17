export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  isLocked: boolean;
  subsidiaryId: number | null;
  verifierId: number | null;
  clientId: number | null;
  createdOn: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subsidiaryId?: number;
  verifierId?: number;
  clientId?: number;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  subsidiaryId?: number;
  verifierId?: number;
  clientId?: number;
}

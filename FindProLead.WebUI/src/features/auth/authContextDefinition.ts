import { createContext } from "react";

export interface AuthUser {
  token: string;
  expiresAt: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

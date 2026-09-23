import apiClient from "../../shared/api/apiClient";
import type { VerifierCompany, CreateVerifierCompanyRequest, UpdateVerifierCompanyRequest } from "./types";

export async function getVerifierCompanies(): Promise<VerifierCompany[]> {
  const { data } = await apiClient.get<VerifierCompany[]>("/verifier-companies");
  return data;
}

export async function createVerifierCompany(request: CreateVerifierCompanyRequest): Promise<VerifierCompany> {
  const { data } = await apiClient.post<VerifierCompany>("/verifier-companies", request);
  return data;
}

export async function updateVerifierCompany(id: number, request: UpdateVerifierCompanyRequest): Promise<VerifierCompany> {
  const { data } = await apiClient.put<VerifierCompany>(`/verifier-companies/${id}`, request);
  return data;
}

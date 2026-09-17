import apiClient from "../../shared/api/apiClient";
import type { AutoInsuranceCompany, CreateAutoInsuranceCompanyRequest, UpdateAutoInsuranceCompanyRequest } from "./types";

export async function getAutoInsuranceCompanies(): Promise<AutoInsuranceCompany[]> {
  const { data } = await apiClient.get<AutoInsuranceCompany[]>("/autoinsurancecompanies");
  return data;
}

export async function createAutoInsuranceCompany(request: CreateAutoInsuranceCompanyRequest): Promise<AutoInsuranceCompany> {
  const { data } = await apiClient.post<AutoInsuranceCompany>("/autoinsurancecompanies", request);
  return data;
}

export async function updateAutoInsuranceCompany(id: number, request: UpdateAutoInsuranceCompanyRequest): Promise<AutoInsuranceCompany> {
  const { data } = await apiClient.put<AutoInsuranceCompany>(`/autoinsurancecompanies/${id}`, request);
  return data;
}

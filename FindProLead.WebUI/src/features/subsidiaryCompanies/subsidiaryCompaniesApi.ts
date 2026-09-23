import apiClient from "../../shared/api/apiClient";
import type { SubsidiaryCompany, CreateSubsidiaryCompanyRequest, UpdateSubsidiaryCompanyRequest } from "./types";

export async function getSubsidiaryCompanies(): Promise<SubsidiaryCompany[]> {
  const { data } = await apiClient.get<SubsidiaryCompany[]>("/subsidiary-companies");
  return data;
}

export async function createSubsidiaryCompany(request: CreateSubsidiaryCompanyRequest): Promise<SubsidiaryCompany> {
  const { data } = await apiClient.post<SubsidiaryCompany>("/subsidiary-companies", request);
  return data;
}

export async function updateSubsidiaryCompany(id: number, request: UpdateSubsidiaryCompanyRequest): Promise<SubsidiaryCompany> {
  const { data } = await apiClient.put<SubsidiaryCompany>(`/subsidiary-companies/${id}`, request);
  return data;
}

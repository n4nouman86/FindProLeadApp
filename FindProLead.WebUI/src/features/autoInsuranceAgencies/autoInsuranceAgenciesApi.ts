import apiClient from "../../shared/api/apiClient";
import type { AutoInsuranceAgency, CreateAutoInsuranceAgencyRequest, UpdateAutoInsuranceAgencyRequest } from "./types";

export async function getAutoInsuranceAgencies(): Promise<AutoInsuranceAgency[]> {
  const { data } = await apiClient.get<AutoInsuranceAgency[]>("/autoinsuranceagencies");
  return data;
}

export async function createAutoInsuranceAgency(request: CreateAutoInsuranceAgencyRequest): Promise<AutoInsuranceAgency> {
  const { data } = await apiClient.post<AutoInsuranceAgency>("/autoinsuranceagencies", request);
  return data;
}

export async function updateAutoInsuranceAgency(id: number, request: UpdateAutoInsuranceAgencyRequest): Promise<AutoInsuranceAgency> {
  const { data } = await apiClient.put<AutoInsuranceAgency>(`/autoinsuranceagencies/${id}`, request);
  return data;
}

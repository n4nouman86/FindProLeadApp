import apiClient from "../../shared/api/apiClient";
import type { AutoLead, CreateAutoLeadRequest, UpdateAutoLeadRequest } from "./types";

export async function getAutoLeads(): Promise<AutoLead[]> {
  const { data } = await apiClient.get<AutoLead[]>("/autoleads");
  return data;
}

export async function createAutoLead(request: CreateAutoLeadRequest): Promise<AutoLead> {
  const { data } = await apiClient.post<AutoLead>("/autoleads", request);
  return data;
}

export async function updateAutoLead(id: number, request: UpdateAutoLeadRequest): Promise<AutoLead> {
  const { data } = await apiClient.put<AutoLead>(`/autoleads/${id}`, request);
  return data;
}

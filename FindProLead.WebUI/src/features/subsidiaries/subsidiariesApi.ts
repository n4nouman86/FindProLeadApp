import apiClient from "../../shared/api/apiClient";
import type { Subsidiary, CreateSubsidiaryRequest, UpdateSubsidiaryRequest } from "./types";

export async function getSubsidiaries(): Promise<Subsidiary[]> {
  const { data } = await apiClient.get<Subsidiary[]>("/subsidiaries");
  return data;
}

export async function createSubsidiary(request: CreateSubsidiaryRequest): Promise<Subsidiary> {
  const { data } = await apiClient.post<Subsidiary>("/subsidiaries", request);
  return data;
}

export async function updateSubsidiary(id: number, request: UpdateSubsidiaryRequest): Promise<Subsidiary> {
  const { data } = await apiClient.put<Subsidiary>(`/subsidiaries/${id}`, request);
  return data;
}

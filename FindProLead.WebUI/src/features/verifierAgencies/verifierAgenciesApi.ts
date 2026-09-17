import apiClient from "../../shared/api/apiClient";
import type { VerifierAgency, CreateVerifierAgencyRequest, UpdateVerifierAgencyRequest } from "./types";

export async function getVerifierAgencies(): Promise<VerifierAgency[]> {
  const { data } = await apiClient.get<VerifierAgency[]>("/verifieragencies");
  return data;
}

export async function createVerifierAgency(request: CreateVerifierAgencyRequest): Promise<VerifierAgency> {
  const { data } = await apiClient.post<VerifierAgency>("/verifieragencies", request);
  return data;
}

export async function updateVerifierAgency(id: number, request: UpdateVerifierAgencyRequest): Promise<VerifierAgency> {
  const { data } = await apiClient.put<VerifierAgency>(`/verifieragencies/${id}`, request);
  return data;
}

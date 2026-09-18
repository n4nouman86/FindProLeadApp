import apiClient from "../../shared/api/apiClient";
import type { VehicleMake, CreateVehicleMakeRequest, UpdateVehicleMakeRequest } from "./types";

export async function getVehicleMakes(): Promise<VehicleMake[]> {
  const { data } = await apiClient.get<VehicleMake[]>("/vehiclemakes");
  return data;
}

export async function createVehicleMake(request: CreateVehicleMakeRequest): Promise<VehicleMake> {
  const { data } = await apiClient.post<VehicleMake>("/vehiclemakes", request);
  return data;
}

export async function updateVehicleMake(id: number, request: UpdateVehicleMakeRequest): Promise<VehicleMake> {
  const { data } = await apiClient.put<VehicleMake>(`/vehiclemakes/${id}`, request);
  return data;
}

export async function deleteVehicleMake(id: number): Promise<void> {
  await apiClient.delete(`/vehiclemakes/${id}`);
}

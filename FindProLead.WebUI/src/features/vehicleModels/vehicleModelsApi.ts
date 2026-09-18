import apiClient from "../../shared/api/apiClient";
import type { VehicleModel, CreateVehicleModelRequest, UpdateVehicleModelRequest } from "./types";

export async function getVehicleModels(): Promise<VehicleModel[]> {
  const { data } = await apiClient.get<VehicleModel[]>("/vehiclemodels");
  return data;
}

export async function createVehicleModel(request: CreateVehicleModelRequest): Promise<VehicleModel> {
  const { data } = await apiClient.post<VehicleModel>("/vehiclemodels", request);
  return data;
}

export async function updateVehicleModel(id: number, request: UpdateVehicleModelRequest): Promise<VehicleModel> {
  const { data } = await apiClient.put<VehicleModel>(`/vehiclemodels/${id}`, request);
  return data;
}

export async function deleteVehicleModel(id: number): Promise<void> {
  await apiClient.delete(`/vehiclemodels/${id}`);
}

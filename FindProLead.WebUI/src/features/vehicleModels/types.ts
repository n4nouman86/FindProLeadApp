export interface VehicleModel {
  id: number;
  name: string;
  createdOn: string;
}

export interface CreateVehicleModelRequest {
  name: string;
}

export interface UpdateVehicleModelRequest {
  name: string;
}

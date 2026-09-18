export interface VehicleMake {
  id: number;
  name: string;
  createdOn: string;
}

export interface CreateVehicleMakeRequest {
  name: string;
}

export interface UpdateVehicleMakeRequest {
  name: string;
}

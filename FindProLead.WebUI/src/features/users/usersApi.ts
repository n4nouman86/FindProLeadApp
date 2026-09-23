import apiClient from "../../shared/api/apiClient";
import type { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from "./types";

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>("/users");
  return data;
}

export async function createUser(request: CreateUserRequest): Promise<User> {
  const { data } = await apiClient.post<User>("/users", request);
  return data;
}

export async function updateUser(id: string, request: UpdateUserRequest): Promise<User> {
  const { data } = await apiClient.put<User>(`/users/${id}`, request);
  return data;
}

export async function changeUserPassword(id: string, request: ChangePasswordRequest): Promise<void> {
  await apiClient.put(`/users/${id}/password`, request);
}

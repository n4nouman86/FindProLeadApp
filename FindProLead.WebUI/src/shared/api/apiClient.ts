import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5225/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ProblemDetails>(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      return Object.values(data.errors).flat().join(" ");
    }
    if (data?.title) {
      return data.title;
    }
  }
  return fallback;
}


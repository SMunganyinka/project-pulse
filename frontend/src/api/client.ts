import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://project-pulse-3.onrender.com"

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pp_access_token");
  if (token) {
    // Ensure headers is an AxiosHeaders instance
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    // Use the typed helper to set Authorization
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;
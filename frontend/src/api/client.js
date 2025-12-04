import axios, { AxiosHeaders } from "axios";
// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://project-pulse-3.onrender.com",
});
// Interceptor to attach Authorization token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("pp_access_token");
    if (token) {
        // Ensure headers is an AxiosHeaders instance
        const headers = new AxiosHeaders(config.headers);
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
    }
    return config;
});
export default api;

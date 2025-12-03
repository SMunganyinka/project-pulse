import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://project-pulse-3.onrender.com",
});
// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("pp_access_token");
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
export default api;

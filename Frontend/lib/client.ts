import axios from "axios";

const envBase: string | undefined = import.meta.env.VITE_API_BASE_URL2;
let baseURL = "/api";
if (envBase && envBase.length > 0) {
  // ensure no trailing slash
  const trimmed = envBase.replace(/\/+$/, "");
  baseURL = trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pragalbh_admin_token"); // Ensure this matches what we set on login
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

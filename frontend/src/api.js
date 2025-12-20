import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 🔐 Attach correct token (ADMIN or USER)
api.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url?.startsWith("/admin");

    const token = isAdminRoute
      ? localStorage.getItem("admin_token") // ✅ admin
      : localStorage.getItem("auth_token"); // ✅ user

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

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

// 🔒 CHECK IF USER IS BLOCKED ON API RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if user is blocked (403 status with blocked flag)
    if (error.response?.status === 403 && error.response?.data?.blocked) {
      // 🔴 USER IS BLOCKED
      const isAdminRoute = error.config?.url?.startsWith("/admin");
      
      if (!isAdminRoute) {
        // Clear user data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common.Authorization;
        
        // Set flag for blocked message
        localStorage.setItem("userBlocked", "true");
        
        // Redirect to login
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

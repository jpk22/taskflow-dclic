import axios from "axios";

// Base URL of the Laravel API. Adjust in a .env file if needed:
// VITE_API_URL=http://localhost:8000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// Attach the Sanctum token (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the API ever responds 401 (token invalid/expired), clean up and
// let the app redirect to /login on the next render.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("taskflow_token");
      localStorage.removeItem("taskflow_user");
    }
    return Promise.reject(error);
  }
);

export default api;

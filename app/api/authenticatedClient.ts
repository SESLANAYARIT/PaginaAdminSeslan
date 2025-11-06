import axios from "axios";
import { triggerExternalLogout } from "~/context/AuthContext";
import { setGlobalLoading } from "~/context/LoadingContext";
import { toast } from "sonner"; // 👈 importa tu toast

const authenticatedClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

authenticatedClient.interceptors.request.use(
  (config) => {
    setGlobalLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    setGlobalLoading(false);
    return Promise.reject(error);
  }
);

authenticatedClient.interceptors.response.use(
  (res) => {
    setGlobalLoading(false);
    return res;
  },
  async (err) => {
    setGlobalLoading(false);
    const originalRequest = err.config;

    // Errores de logout no los notificamos
    if (originalRequest?.url?.includes("/auth/logout")) {
      return Promise.reject(err);
    }

    // Expiración de token
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authenticatedClient(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.token;
        localStorage.setItem("token", newAccessToken);
        authenticatedClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return authenticatedClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        triggerExternalLogout();
        toast.error("Tu sesión ha expirado. Vuelve a iniciar sesión."); 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Forbidden
    if (err.response?.status === 403) {
      localStorage.removeItem("token");
      triggerExternalLogout();
      toast.error("No tienes permisos para realizar esta acción."); 
    }

    // Otros errores genéricos
    if (err.response?.status >= 400) {
      toast.error(
        err.response?.data?.message || "Ocurrió un error inesperado."
      ); // 👈 genérico
    } else if (!err.response) {
      toast.error("Error de conexión con el servidor."); 
    }

    return Promise.reject(err);
  }
);

export default authenticatedClient;

import axios from "axios";

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

export default publicClient;

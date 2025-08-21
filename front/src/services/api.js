import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // match backend
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

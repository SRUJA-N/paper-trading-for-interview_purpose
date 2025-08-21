import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  withCredentials: true,
});

export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Login failed" };
  }
};

export const register = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Register failed" };
  }
};

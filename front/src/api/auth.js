import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // FastAPI backend

export async function login(username, password) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  return response.data;
}

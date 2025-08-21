// front/src/api/orders.js
import api from "./api";

export const createOrder = async (symbol, quantity, side) => {
  const response = await api.post("/orders", { symbol, quantity, side });
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

import api from "./api";

export const placeTrade = (trade) => api.post("/trade", trade);
export const getTrades = () => api.get("/trade");

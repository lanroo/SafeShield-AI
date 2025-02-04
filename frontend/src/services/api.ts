import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // URL do nosso backend FastAPI
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

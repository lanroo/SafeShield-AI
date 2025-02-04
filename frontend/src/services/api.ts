import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8002",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Erro de conexão com o backend. Verifique se o servidor está rodando."
      );
    }
    return Promise.reject(error);
  }
);

export default api;

import axios, { InternalAxiosRequestConfig } from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean;
  retryCount?: number;
}

const api = axios.create({
  baseURL: "http://localhost:8002",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;

    // Se não é uma requisição que pode ser retentada
    if (!config || !config.retry) {
      console.error(
        "Erro de conexão com o backend. Verifique se o servidor está rodando."
      );
      return Promise.reject(error);
    }

    // Número de tentativas já feitas
    config.retryCount = config.retryCount || 0;

    // Se ainda não atingiu o máximo de tentativas
    if (config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;

      // Espera antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

      console.log(`Tentativa ${config.retryCount} de ${MAX_RETRIES}...`);
      return api(config);
    }

    console.error("Número máximo de tentativas atingido.");
    return Promise.reject(error);
  }
);

// Adiciona flag de retry em todas as requisições
api.interceptors.request.use((config: ExtendedAxiosRequestConfig) => {
  config.retry = true;
  return config;
});

export { api };

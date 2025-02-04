import axios, { InternalAxiosRequestConfig } from "axios";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number;
}

const api = axios.create({
  baseURL: "http://localhost:8002",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for retry logic
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  config.retry -= 1;
  if (config.retry === 0) {
    return Promise.reject(err);
  }

  console.log(`Tentativa ${3 - config.retry} de 3...`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return api(config);
});

// Add request config defaults
api.interceptors.request.use((config: CustomInternalAxiosRequestConfig) => {
  config.retry = 3;
  return config;
});

export { api };

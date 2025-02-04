import api from "./api";

export interface Log {
  id: number;
  ip_address: string;
  country: string;
  timestamp: string;
  login_attempts: number;
  transaction_value: number;
}

export const logService = {
  async getLogs() {
    const response = await api.get<Log[]>("/api/logs");
    return response.data;
  },

  async createLog(log: Omit<Log, "id" | "timestamp">) {
    const response = await api.post("/api/logs", log);
    return response.data;
  },
};

import api from "./api";

export interface Log {
  id: number;
  ip_address: string;
  country: string;
  timestamp: string;
  login_attempts: number;
  transaction_value: number;
  description: string;
  threat_score?: number;
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

  async getRecentEvents() {
    const response = await api.get<Log[]>("/api/logs?limit=5&sort=desc");
    return response.data;
  },

  async simulateEvent() {
    const response = await api.post("/api/simulate-event");
    return response.data;
  },

  async simulateMultiple(count: number = 10) {
    const response = await api.post(`/api/simulate-multiple?count=${count}`);
    return response.data;
  },
};

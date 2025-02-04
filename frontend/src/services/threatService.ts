import api from "./api";

export interface Threat {
  id: number;
  ip_address: string;
  country: string;
  timestamp: string;
  risk_level: "low" | "medium" | "high";
  description: string;
}

export const threatService = {
  async getThreats() {
    const response = await api.get<Threat[]>("/api/threats");
    return response.data;
  },
};

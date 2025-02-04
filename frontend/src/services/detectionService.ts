import api from "./api";

export interface DetectionRequest {
  ip_address: string;
  country: string;
  login_attempts: number;
  transaction_value: number;
}

export interface DetectionResponse {
  is_threat: boolean;
  risk_level: "low" | "medium" | "high";
  description: string;
}

export const detectionService = {
  async detectThreat(data: DetectionRequest) {
    const response = await api.post<DetectionResponse>("/detect", data);
    return response.data;
  },
};

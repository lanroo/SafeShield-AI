import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box } from "@mui/material";
import { MonitoringFilters } from "./MonitoringFilters";
import { EventList } from "./EventList";
import { api } from "../api/config";

interface FilterType {
  network?: string;
  asset?: string;
  criticality?: string;
  view?: string;
}

export const Dashboard: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("general");
  const [filters, setFilters] = useState<FilterType>({});

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "/api/logs";

      if (filters.network) {
        endpoint = `/api/logs/network/${filters.network}`;
      } else if (filters.asset) {
        endpoint = `/api/logs/asset/${filters.asset}`;
      } else if (filters.criticality) {
        endpoint = `/api/logs/criticality/${filters.criticality}`;
      }

      const response = await api.get(endpoint);
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentView(newFilters.view || "general");
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SafeShield - Monitoramento de Segurança
        </Typography>

        <MonitoringFilters onFilterChange={handleFilterChange} />

        {/* Título dinâmico baseado na visualização */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          {currentView === "general" && "Últimos Eventos de Segurança"}
          {currentView === "network" && "Eventos por Zona de Rede"}
          {currentView === "assets" && "Eventos por Tipo de Ativo"}
          {currentView === "criticality" && "Eventos por Nível de Criticidade"}
        </Typography>

        <EventList events={events} loading={loading} view={currentView} />
      </Box>
    </Container>
  );
};

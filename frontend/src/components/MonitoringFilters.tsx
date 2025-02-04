import React, { useState, useEffect } from "react";
import {
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Grid,
  Card,
  CardContent,
  SelectChangeEvent,
} from "@mui/material";
import { api } from "../api/config";

interface MonitoringConfig {
  network_zones: {
    id: string;
    name: string;
    description: string;
  }[];
  asset_types: {
    id: string;
    name: string;
    icon: string;
  }[];
  criticality_levels: {
    id: string;
    name: string;
    color: string;
  }[];
}

interface Stats {
  network: {
    [key: string]: number;
  };
  assets: {
    [key: string]: number;
  };
}

interface FilterType {
  network?: string;
  asset?: string;
  criticality?: string;
  view?: string;
}

interface MonitoringFiltersProps {
  onFilterChange: (filters: FilterType) => void;
}

export const MonitoringFilters: React.FC<MonitoringFiltersProps> = ({
  onFilterChange,
}) => {
  const [config, setConfig] = useState<MonitoringConfig | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedView, setSelectedView] = useState("general");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedCriticality, setSelectedCriticality] = useState("");

  useEffect(() => {
    // Carrega configurações de monitoramento
    const loadConfig = async () => {
      const response = await api.get("/api/config/monitoring");
      setConfig(response.data);
    };

    // Carrega estatísticas
    const loadStats = async () => {
      const [networkStats, assetStats] = await Promise.all([
        api.get("/api/stats/network"),
        api.get("/api/stats/assets"),
      ]);
      setStats({
        network: networkStats.data,
        assets: assetStats.data,
      });
    };

    loadConfig();
    loadStats();
  }, []);

  const handleViewChange = (event: SelectChangeEvent) => {
    const view = event.target.value;
    setSelectedView(view);

    // Reseta outros filtros
    setSelectedNetwork("");
    setSelectedAsset("");
    setSelectedCriticality("");

    onFilterChange({ view });
  };

  const handleNetworkChange = (event: SelectChangeEvent) => {
    const network = event.target.value;
    setSelectedNetwork(network);
    onFilterChange({ network });
  };

  const handleAssetChange = (event: SelectChangeEvent) => {
    const asset = event.target.value;
    setSelectedAsset(asset);
    onFilterChange({ asset });
  };

  const handleCriticalityChange = (event: SelectChangeEvent) => {
    const criticality = event.target.value;
    setSelectedCriticality(criticality);
    onFilterChange({ criticality });
  };

  if (!config || !stats) return <div>Carregando filtros...</div>;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Visualização do Monitoramento
      </Typography>

      <Grid container spacing={2}>
        {/* Seletor de Visualização */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Visualização</InputLabel>
            <Select value={selectedView} onChange={handleViewChange}>
              <MenuItem value="general">Visão Geral</MenuItem>
              <MenuItem value="network">Por Rede</MenuItem>
              <MenuItem value="assets">Por Ativos</MenuItem>
              <MenuItem value="criticality">Por Criticidade</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtros específicos baseados na visualização selecionada */}
        {selectedView === "network" && (
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Zona de Rede</InputLabel>
              <Select value={selectedNetwork} onChange={handleNetworkChange}>
                {config.network_zones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    {zone.name} ({stats.network[zone.id] || 0} eventos)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedView === "assets" && (
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Ativo</InputLabel>
              <Select value={selectedAsset} onChange={handleAssetChange}>
                {config.asset_types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.icon} {type.name} ({stats.assets[type.id] || 0}{" "}
                    eventos)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedView === "criticality" && (
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Nível de Criticidade</InputLabel>
              <Select
                value={selectedCriticality}
                onChange={handleCriticalityChange}
              >
                {config.criticality_levels.map((level) => (
                  <MenuItem
                    key={level.id}
                    value={level.id}
                    sx={{ color: level.color }}
                  >
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Cards de Estatísticas */}
      {selectedView === "general" && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Eventos por Rede</Typography>
                {Object.entries(stats.network).map(([zone, count]) => (
                  <Typography key={zone}>
                    {config.network_zones.find((z) => z.id === zone)?.name}:{" "}
                    {count}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Eventos por Tipo de Ativo</Typography>
                {Object.entries(stats.assets).map(([type, count]) => (
                  <Typography key={type}>
                    {config.asset_types.find((t) => t.id === type)?.icon}{" "}
                    {config.asset_types.find((t) => t.id === type)?.name}:{" "}
                    {count}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

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
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  alpha,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SecurityIcon from "@mui/icons-material/Security";
import RouterIcon from "@mui/icons-material/Router";
import StorageIcon from "@mui/icons-material/Storage";
import WarningIcon from "@mui/icons-material/Warning";
import { api } from "../api/config";

interface MonitoringConfig {
  network_zones: {
    id: string;
    name: string;
    description: string;
    icon?: string;
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
    icon?: string;
  }[];
  threat_types: {
    id: string;
    name: string;
    description: string;
    severity: string;
  }[];
}

interface Stats {
  network: {
    [key: string]: number;
  };
  assets: {
    [key: string]: number;
  };
  threats: {
    [key: string]: number;
  };
}

interface FilterType {
  network?: string;
  asset?: string;
  criticality?: string;
  view?: string;
  threat_type?: string;
  time_range?: string;
}

interface MonitoringFiltersProps {
  onFilterChange: (filters: FilterType) => void;
}

export const MonitoringFilters: React.FC<MonitoringFiltersProps> = ({
  onFilterChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [config, setConfig] = useState<MonitoringConfig | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedView, setSelectedView] = useState("general");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedCriticality, setSelectedCriticality] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await api.get("/api/config/monitoring");
        setConfig(response.data);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    const loadStats = async () => {
      try {
        const [networkStats, assetStats, threatStats] = await Promise.all([
          api.get("/api/stats/network"),
          api.get("/api/stats/assets"),
          api.get("/api/stats/threats"),
        ]);
        setStats({
          network: networkStats.data,
          assets: assetStats.data,
          threats: threatStats.data,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
    };

    loadConfig();
    loadStats();
  }, []);

  const handleRefresh = async () => {
    try {
      const [networkStats, assetStats, threatStats] = await Promise.all([
        api.get("/api/stats/network"),
        api.get("/api/stats/assets"),
        api.get("/api/stats/threats"),
      ]);
      setStats({
        network: networkStats.data,
        assets: assetStats.data,
        threats: threatStats.data,
      });
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
    }
  };

  const handleViewChange = (event: SelectChangeEvent) => {
    const view = event.target.value;
    setSelectedView(view);
    setSelectedNetwork("");
    setSelectedAsset("");
    setSelectedCriticality("");
    onFilterChange({ view });
  };

  const handleNetworkChange = (event: SelectChangeEvent) => {
    const network = event.target.value;
    setSelectedNetwork(network);
    onFilterChange({ network, view: selectedView });
  };

  const handleAssetChange = (event: SelectChangeEvent) => {
    const asset = event.target.value;
    setSelectedAsset(asset);
    onFilterChange({ asset, view: selectedView });
  };

  const handleCriticalityChange = (event: SelectChangeEvent) => {
    const criticality = event.target.value;
    setSelectedCriticality(criticality);
    onFilterChange({ criticality, view: selectedView });
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    const timeRange = event.target.value;
    setSelectedTimeRange(timeRange);
    onFilterChange({ time_range: timeRange, view: selectedView });
  };

  if (!config || !stats) return <div>Carregando filtros...</div>;

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: isDark
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SecurityIcon /> Monitoramento de Segurança
        </Typography>
        <Tooltip title="Atualizar estatísticas">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2} sx={{ width: "calc(100% + 369px)" }}>
        {/* Seletor de Visualização */}
        <Grid item xs={12} md={2}>
          <FormControl variant="standard" fullWidth sx={{ mb: 4 }}>
            <InputLabel
              htmlFor="visualization-select"
              sx={{
                position: "relative",
                transform: "none",
                marginBottom: "8px",
              }}
            >
              Visualização
            </InputLabel>
            <Select
              id="visualization-select"
              value={selectedView}
              onChange={handleViewChange}
              variant="outlined"
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                },
              }}
            >
              <MenuItem value="general">Visão Geral</MenuItem>
              <MenuItem value="network">Por Rede</MenuItem>
              <MenuItem value="assets">Por Ativos</MenuItem>
              <MenuItem value="criticality">Por Criticidade</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtro de Período */}
        <Grid item xs={12} md={2}>
          <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
            <InputLabel
              htmlFor="period-select"
              sx={{
                position: "relative",
                transform: "none",
                marginBottom: "8px",
              }}
            >
              Período
            </InputLabel>
            <Select
              id="period-select"
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
              variant="outlined"
            >
              <MenuItem value="1h">Última hora</MenuItem>
              <MenuItem value="24h">Últimas 24 horas</MenuItem>
              <MenuItem value="7d">Últimos 7 dias</MenuItem>
              <MenuItem value="30d">Últimos 30 dias</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Filtros específicos baseados na visualização */}
        {selectedView === "network" && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Zona de Rede</InputLabel>
              <Select
                value={selectedNetwork}
                onChange={handleNetworkChange}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                {config.network_zones.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>
                    <RouterIcon fontSize="small" />
                    {zone.name}
                    <Chip
                      size="small"
                      label={stats.network[zone.id] || 0}
                      sx={{ ml: 1 }}
                      color={stats.network[zone.id] > 0 ? "primary" : "default"}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedView === "assets" && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Ativo</InputLabel>
              <Select
                value={selectedAsset}
                onChange={handleAssetChange}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                {config.asset_types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    <StorageIcon fontSize="small" />
                    {type.name}
                    <Chip
                      size="small"
                      label={stats.assets[type.id] || 0}
                      sx={{ ml: 1 }}
                      color={stats.assets[type.id] > 0 ? "primary" : "default"}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedView === "criticality" && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Nível de Criticidade</InputLabel>
              <Select
                value={selectedCriticality}
                onChange={handleCriticalityChange}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                {config.criticality_levels.map((level) => (
                  <MenuItem
                    key={level.id}
                    value={level.id}
                    sx={{
                      color: level.color,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <WarningIcon fontSize="small" />
                    {level.name}
                    <Chip
                      size="small"
                      label={stats.threats[level.id] || 0}
                      sx={{
                        ml: 1,
                        backgroundColor: alpha(level.color, 0.1),
                        color: level.color,
                        borderColor: level.color,
                      }}
                      variant="outlined"
                    />
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
            <Card
              sx={{
                backgroundColor: isDark
                  ? alpha(theme.palette.primary.main, 0.1)
                  : alpha(theme.palette.primary.light, 0.1),
                border: `1px solid ${
                  isDark
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.light, 0.2)
                }`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <RouterIcon /> Eventos por Rede
                </Typography>
                {Object.entries(stats.network).map(([zone, count]) => (
                  <Box
                    key={zone}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      {config.network_zones.find((z) => z.id === zone)?.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={count}
                      color={count > 0 ? "primary" : "default"}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: isDark
                  ? alpha(theme.palette.secondary.main, 0.1)
                  : alpha(theme.palette.secondary.light, 0.1),
                border: `1px solid ${
                  isDark
                    ? alpha(theme.palette.secondary.main, 0.2)
                    : alpha(theme.palette.secondary.light, 0.2)
                }`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <StorageIcon /> Eventos por Tipo de Ativo
                </Typography>
                {Object.entries(stats.assets).map(([type, count]) => (
                  <Box
                    key={type}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      {config.asset_types.find((t) => t.id === type)?.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={count}
                      color={count > 0 ? "secondary" : "default"}
                      variant="outlined"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: isDark
                  ? alpha(theme.palette.error.main, 0.1)
                  : alpha(theme.palette.error.light, 0.1),
                border: `1px solid ${
                  isDark
                    ? alpha(theme.palette.error.main, 0.2)
                    : alpha(theme.palette.error.light, 0.2)
                }`,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <WarningIcon /> Eventos por Criticidade
                </Typography>
                {Object.entries(stats.threats).map(([level, count]) => {
                  const levelConfig = config.criticality_levels.find(
                    (l) => l.id === level
                  );
                  return (
                    <Box
                      key={level}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography sx={{ color: levelConfig?.color }}>
                        {levelConfig?.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={count}
                        sx={{
                          backgroundColor: alpha(
                            levelConfig?.color || theme.palette.error.main,
                            0.1
                          ),
                          color: levelConfig?.color,
                          borderColor: levelConfig?.color,
                        }}
                        variant="outlined"
                      />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

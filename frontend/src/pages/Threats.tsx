import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { api } from "../api/config";

interface Threat {
  id: number;
  timestamp: string;
  ip_address: string;
  country: string;
  description: string;
  alert_level: string;
  network_zone: string;
  asset_name: string;
  threat_score: number;
  is_internal: boolean;
  login_attempts: number;
}

export default function Threats() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/threats");
      setThreats(response.data);
    } catch (error) {
      console.error("Erro ao carregar ameaças:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
    const interval = setInterval(loadThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case "CRÍTICA":
        return theme.palette.error.main;
      case "ALTA":
        return theme.palette.warning.main;
      case "MÉDIA":
        return theme.palette.warning.light;
      default:
        return theme.palette.info.main;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: isDark
              ? theme.palette.error.light
              : theme.palette.error.dark,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberIcon /> Ameaças Detectadas
        </Typography>
        <Tooltip title="Atualizar ameaças">
          <IconButton onClick={loadThreats} color="error">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {threats.map((threat) => (
          <Grid item xs={12} key={threat.id}>
            <Card
              sx={{
                backgroundColor: isDark
                  ? alpha(getAlertColor(threat.alert_level), 0.1)
                  : alpha(getAlertColor(threat.alert_level), 0.05),
                border: `1px solid ${alpha(
                  getAlertColor(threat.alert_level),
                  0.2
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 20px ${alpha(
                    getAlertColor(threat.alert_level),
                    0.2
                  )}`,
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: getAlertColor(threat.alert_level),
                        mb: 1,
                      }}
                    >
                      {threat.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark
                          ? alpha(theme.palette.common.white, 0.7)
                          : alpha(theme.palette.common.black, 0.7),
                      }}
                    >
                      IP: {threat.ip_address} | País: {threat.country}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Chip
                        size="small"
                        label={threat.network_zone.toUpperCase()}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={threat.asset_name}
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${(threat.threat_score * 100).toFixed(
                          0
                        )}% Risco`}
                        color="error"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        label={`${threat.login_attempts} tentativas`}
                        color="warning"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "flex-start", md: "flex-end" },
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={threat.alert_level}
                      sx={{
                        backgroundColor: alpha(
                          getAlertColor(threat.alert_level),
                          0.1
                        ),
                        color: getAlertColor(threat.alert_level),
                        borderColor: getAlertColor(threat.alert_level),
                        fontWeight: "bold",
                      }}
                      variant="outlined"
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? alpha(theme.palette.common.white, 0.5)
                          : alpha(theme.palette.common.black, 0.5),
                      }}
                    >
                      Detectado em: {formatDate(threat.timestamp)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

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
  Alert,
  Snackbar,
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
  const [error, setError] = useState<string | null>(null);

  const loadThreats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/threats");
      setThreats(response.data);
    } catch (error) {
      console.error("Erro ao carregar ameaças:", error);
      setError("Erro ao carregar ameaças. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
    const interval = setInterval(loadThreats, 30000); // Aumentado para 30 segundos
    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "CRÍTICA":
        return theme.palette.error.main;
      case "ALTA":
        return theme.palette.warning.main;
      case "MÉDIA":
        return theme.palette.warning.light;
      case "BAIXA":
        return theme.palette.info.main;
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

  if (loading && !threats.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: { xs: 2, sm: 0 },
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
            fontWeight: 600,
          }}
        >
          <WarningAmberIcon /> Ameaças Detectadas
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {loading && <CircularProgress size={24} />}
          <Tooltip title="Atualizar ameaças">
            <IconButton
              onClick={loadThreats}
              disabled={loading}
              sx={{
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {threats.map((threat) => (
          <Grid item xs={12} key={threat.id}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: isDark
                  ? alpha(getAlertColor(threat.alert_level), 0.05)
                  : alpha(getAlertColor(threat.alert_level), 0.02),
                border: `1px solid ${alpha(
                  getAlertColor(threat.alert_level),
                  isDark ? 0.2 : 0.1
                )}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 20px ${alpha(
                    getAlertColor(threat.alert_level),
                    0.15
                  )}`,
                  backgroundColor: isDark
                    ? alpha(getAlertColor(threat.alert_level), 0.1)
                    : alpha(getAlertColor(threat.alert_level), 0.05),
                },
              }}
            >
              <CardContent sx={{ "&:last-child": { pb: 2 } }}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={8}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: getAlertColor(threat.alert_level),
                          fontWeight: 600,
                          fontSize: "1.1rem",
                        }}
                      >
                        {threat.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? alpha(theme.palette.common.white, 0.7)
                            : alpha(theme.palette.common.black, 0.7),
                        }}
                      >
                        <strong>IP:</strong> {threat.ip_address}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? alpha(theme.palette.common.white, 0.7)
                            : alpha(theme.palette.common.black, 0.7),
                        }}
                      >
                        <strong>País:</strong> {threat.country}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        size="small"
                        label={threat.network_zone}
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        size="small"
                        label={threat.asset_name}
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.secondary.main,
                            0.1
                          ),
                          color: theme.palette.secondary.main,
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        size="small"
                        label={`${(threat.threat_score * 100).toFixed(
                          0
                        )}% Risco`}
                        sx={{
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          fontWeight: 500,
                        }}
                      />
                      <Chip
                        size="small"
                        label={`${threat.login_attempts} tentativas`}
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.warning.main,
                            0.1
                          ),
                          color: theme.palette.warning.main,
                          fontWeight: 500,
                        }}
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
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        height: "28px",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? alpha(theme.palette.common.white, 0.5)
                          : alpha(theme.palette.common.black, 0.5),
                        fontSize: "0.75rem",
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
    </Box>
  );
}

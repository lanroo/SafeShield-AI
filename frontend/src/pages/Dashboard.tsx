import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useEffect, useState } from "react";
import AttackMap from "../components/AttackMap/AttackMap";
import { StatCardProps } from "../types/components";
import { logService, Log } from "../services/logService";
import { threatService } from "../services/threatService";
import { MonitoringFilters } from "../components/MonitoringFilters";

interface FilterType {
  network?: string;
  asset?: string;
  criticality?: string;
  view?: string;
}

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Estados para armazenar dados do backend
  const [systemStatus, setSystemStatus] = useState(0);
  const [threats, setThreats] = useState(0);
  const [logs, setLogs] = useState(0);
  const [recentEvents, setRecentEvents] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({});

  // Função para carregar dados
  useEffect(() => {
    // Moved loadDashboardData inside useEffect
    const loadDashboardData = async () => {
      try {
        let logsEndpoint = "/api/logs";

        // Aplica filtros na URL
        if (filters.network) {
          logsEndpoint = `/api/logs/network/${filters.network}`;
        } else if (filters.asset) {
          logsEndpoint = `/api/logs/asset/${filters.asset}`;
        } else if (filters.criticality) {
          logsEndpoint = `/api/logs/criticality/${filters.criticality}`;
        }

        const [threatsData, logsData, eventsData] = await Promise.all([
          threatService.getThreats().catch(() => []),
          logService.getLogs(logsEndpoint).catch(() => []),
          logService.getRecentEvents().catch(() => []),
        ]);

        if (threatsData && logsData) {
          const threatPercentage =
            (threatsData.length / (logsData.length || 1)) * 100;
          const systemStatusValue = Math.max(0, 100 - threatPercentage);
          setSystemStatus(Math.round(systemStatusValue));
          setThreats(threatsData.length);
          setLogs(logsData.length);
        }

        if (eventsData && eventsData.length > 0) {
          setRecentEvents(eventsData.slice(0, 10));
        }
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code !== "ERR_NETWORK"
        ) {
          console.error("Erro ao carregar dados do dashboard:", error);
        }
      }
    };

    const loadInitialData = async () => {
      try {
        setLoading(true);
        await logService.simulateMultiple(10);
        await loadDashboardData();
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    const dataInterval = setInterval(loadDashboardData, 5000);
    const simulationInterval = setInterval(async () => {
      try {
        await logService.simulateEvent();
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code !== "ERR_NETWORK"
        ) {
          console.error("Erro ao simular evento:", error);
        }
      }
    }, 3000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(simulationInterval);
    };
  }, [filters]); // Removed loadDashboardData from dependencies

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: alpha(color, 0.1),
        border: `1px solid ${alpha(color, 0.2)}`,
        borderLeft: `4px solid ${color}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        opacity: loading ? 0.7 : 1,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
          backgroundColor: alpha(color, 0.15),
          "& .icon": {
            transform: "scale(1.1)",
          },
        },
        "&:active": {
          transform: "translateY(-2px)",
          boxShadow: `0 2px 10px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Icon
          className="icon"
          sx={{
            fontSize: 40,
            color: color,
            filter: `drop-shadow(0 0 6px ${alpha(color, 0.6)})`,
            transition: "transform 0.3s ease",
          }}
        />
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: isDark
                ? alpha(theme.palette.common.white, 0.7)
                : "rgb(0 0 0 / 70%)",
              transition: "color 0.3s ease",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: color,
              textShadow: isDark ? `0 0 8px ${alpha(color, 0.4)}` : "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MonitoringFilters onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={SecurityIcon}
            title="Sistema Seguro"
            value={`${systemStatus}%`}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={WarningIcon}
            title="Ameaças Detectadas"
            value={threats.toString()}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={TimelineIcon}
            title="Eventos Registrados"
            value={logs.toString()}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid item xs={12}>
          <AttackMap />
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "transparent",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
              }`,
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: isDark ? theme.palette.info.main : "#1e3a5c",
                mb: 2,
              }}
            >
              Últimos Eventos
            </Typography>
            <Box
              sx={{
                "& > *:not(:last-child)": {
                  borderBottom: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
                  }`,
                  pb: 1,
                  mb: 1,
                },
              }}
            >
              {recentEvents.map((event) => {
                const eventTime = new Date(event.timestamp);
                const timeAgo = Math.floor(
                  (Date.now() - eventTime.getTime()) / 60000
                );

                return (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      backgroundColor:
                        event.login_attempts > 3
                          ? alpha(theme.palette.error.main, isDark ? 0.1 : 0.05)
                          : "transparent",
                      borderRadius: 1,
                      animation: "slideIn 0.3s ease-out",
                      "@keyframes slideIn": {
                        from: {
                          opacity: 0,
                          transform: "translateX(-20px)",
                        },
                        to: {
                          opacity: 1,
                          transform: "translateX(0)",
                        },
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            event.login_attempts > 3
                              ? theme.palette.error.main
                              : isDark
                              ? theme.palette.common.white
                              : theme.palette.common.black,
                          fontWeight: event.login_attempts > 3 ? 600 : 400,
                        }}
                      >
                        {event.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isDark
                            ? alpha(theme.palette.common.white, 0.6)
                            : alpha(theme.palette.common.black, 0.6),
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        IP: {event.ip_address} ({event.country}) -{" "}
                        {event.login_attempts} tentativas
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? alpha(theme.palette.common.white, 0.6)
                          : alpha(theme.palette.common.black, 0.6),
                        ml: 2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      há {timeAgo} min
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

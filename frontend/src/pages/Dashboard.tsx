import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import TimelineIcon from "@mui/icons-material/Timeline";
import AttackMap from "../components/AttackMap/AttackMap";
import { StatCardProps } from "../types/components";

export default function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
        <Grid item xs={12} md={4}>
          <StatCard
            icon={SecurityIcon}
            title="Sistema Seguro"
            value="100%"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={WarningIcon}
            title="Ameaças Detectadas"
            value="3"
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={TimelineIcon}
            title="Eventos Registrados"
            value="150"
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
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: theme.palette.info.main, mb: 2 }}
            >
              Últimos Eventos
            </Typography>
            <Box
              sx={{
                "& > *:not(:last-child)": {
                  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                  pb: 1,
                  mb: 1,
                },
              }}
            >
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha(theme.palette.common.white, 0.9) }}
                    >
                      Tentativa de acesso não autorizado
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha(theme.palette.common.white, 0.6) }}
                    >
                      IP: 192.168.1.{100 + i}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha(theme.palette.common.white, 0.6) }}
                  >
                    há {5 + i} minutos
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

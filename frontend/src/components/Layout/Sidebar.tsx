import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SecurityIcon from "@mui/icons-material/Security";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { alpha } from "@mui/material/styles";
import { useThemeContext } from "../../theme/hooks";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Ameaças", icon: <SecurityIcon />, path: "/threats" },
  { text: "Logs", icon: <ListAltIcon />, path: "/logs" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const getItemStyles = (isActive: boolean) => ({
    mb: 1.5,
    borderRadius: 2,
    transition: "all 0.3s ease",
    backgroundColor: isActive
      ? alpha(theme.palette.primary.main, 0.15)
      : "transparent",
    border: `1px solid ${
      isActive
        ? alpha(theme.palette.primary.main, mode === "dark" ? 0.5 : 0.3)
        : "transparent"
    }`,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      border: `1px solid ${alpha(
        theme.palette.primary.main,
        mode === "dark" ? 0.3 : 0.2
      )}`,
      transform: "translateX(6px)",
    },
    "& .MuiListItemIcon-root": {
      minWidth: 40,
      color: isActive
        ? theme.palette.primary.main
        : mode === "dark"
        ? alpha(theme.palette.common.white, 0.7)
        : alpha(theme.palette.common.black, 0.7),
      filter: isActive
        ? `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.6)})`
        : "none",
    },
    "& .MuiListItemText-primary": {
      fontWeight: isActive ? 600 : 400,
      fontSize: "0.95rem",
      color: isActive
        ? theme.palette.primary.main
        : mode === "dark"
        ? alpha(theme.palette.common.white, 0.7)
        : alpha(theme.palette.common.black, 0.7),
      textShadow: isActive
        ? `0 0 8px ${alpha(theme.palette.primary.main, 0.4)}`
        : "none",
    },
  });

  return (
    <Box>
      <Toolbar />
      <List
        sx={{
          px: 2,
          "& .MuiListItemButton-root": {
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -1,
              left: 0,
              width: "100%",
              height: "1px",
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.primary.main,
                0
              )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 50%, ${alpha(
                theme.palette.primary.main,
                0
              )} 100%)`,
            },
          },
        }}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={getItemStyles(isActive)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

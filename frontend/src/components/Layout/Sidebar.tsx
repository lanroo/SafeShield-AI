import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  Tooltip,
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

interface SidebarProps {
  isExpanded: boolean;
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeContext();

  const getItemStyles = (isActive: boolean) => ({
    mb: 1.5,
    borderRadius: 2,
    transition: "all 0.3s ease",
    minHeight: 48,
    px: isExpanded ? 2 : "auto",
    justifyContent: isExpanded ? "initial" : "center",
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
      transform: isExpanded ? "translateX(6px)" : "scale(1.1)",
    },
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      mr: isExpanded ? 2 : "auto",
      justifyContent: "center",
      color: isActive ? theme.palette.primary.main : "inherit",
    },
    "& .MuiListItemText-primary": {
      opacity: isExpanded ? 1 : 0,
      color: isActive
        ? theme.palette.primary.main
        : mode === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
      fontWeight: isActive ? 600 : 400,
    },
  });

  return (
    <>
      <Toolbar />
      <Box sx={{ px: isExpanded ? 2 : 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.text}
                title={!isExpanded ? item.text : ""}
                placement="right"
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={getItemStyles(isActive)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: isExpanded ? 1 : 0,
                      transition: "opacity 0.2s",
                      display: isExpanded ? "block" : "none",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>
    </>
  );
}

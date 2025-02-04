import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  Badge,
  Avatar,
  useTheme,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Sidebar from "./Sidebar";
import { useThemeContext } from "../../theme/hooks";
import { alpha } from "@mui/material/styles";

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
          background:
            mode === "dark"
              ? "linear-gradient(90deg, #0a192f 0%, #0f2847 100%)"
              : "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)",
          borderBottom: `1px solid ${mode === "dark" ? "#1a365d" : "#e2e8f0"}`,
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: "none" },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <SecurityIcon
              sx={{
                mr: 1,
                fontSize: 28,
                color: theme.palette.primary.main,
                filter:
                  "drop-shadow(0 0 8px " +
                  alpha(theme.palette.primary.main, 0.4) +
                  ")",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: mode === "dark" ? "#e2e8f0" : "#2d3748",
                letterSpacing: "0.5px",
              }}
            >
              SafeShield AI
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Alternar tema">
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  transition: "all 0.2s",
                  color: theme.palette.primary.main,
                  "&:hover": {
                    transform: "rotate(30deg)",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notificações">
              <IconButton
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Badge
                  badgeContent={3}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: theme.palette.error.main,
                      color: "#fff",
                      boxShadow: `0 0 0 2px ${
                        mode === "dark" ? "#0f2847" : "#ffffff"
                      }`,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                mx: 1,
                height: 24,
                borderColor: mode === "dark" ? "#1a365d" : "#e2e8f0",
              }}
            />

            <Tooltip title="Perfil do Usuário">
              <Avatar
                onClick={handleMenuOpen}
                sx={{
                  cursor: "pointer",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 0 16px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                }}
              >
                A
              </Avatar>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  backgroundColor: mode === "dark" ? "#0f2847" : "#ffffff",
                  backgroundImage: "none",
                  border: `1px solid ${
                    mode === "dark" ? "#1a365d" : "#e2e8f0"
                  }`,
                  borderRadius: 2,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiMenuItem-root": {
                    color: mode === "dark" ? "#e2e8f0" : "#2d3748",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.primary.main,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: mode === "dark" ? "#0f2847" : "#ffffff",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                    border: `1px solid ${
                      mode === "dark" ? "#1a365d" : "#e2e8f0"
                    }`,
                    borderBottom: "none",
                    borderRight: "none",
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Meu Perfil
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Configurações
              </MenuItem>
              <Divider
                sx={{ borderColor: mode === "dark" ? "#1a365d" : "#e2e8f0" }}
              />
              <MenuItem>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: mode === "dark" ? "#0f2847" : "#ffffff",
              backgroundImage: "none",
              borderRight: `1px solid ${
                mode === "dark" ? "#1a365d" : "#e2e8f0"
              }`,
            },
          }}
        >
          <Sidebar />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: mode === "dark" ? "#0f2847" : "#ffffff",
              backgroundImage: "none",
              borderRight: `1px solid ${
                mode === "dark" ? "#1a365d" : "#e2e8f0"
              }`,
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background:
            mode === "dark"
              ? "linear-gradient(135deg, #0a192f 0%, #0f2847 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

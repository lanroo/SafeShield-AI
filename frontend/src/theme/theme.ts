import { createTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#00ffff" : "#0088cc",
        light: isDark ? "#33ffff" : "#33aaff",
        dark: isDark ? "#00cccc" : "#006699",
      },
      secondary: {
        main: isDark ? "#ff3e3e" : "#dc3545",
        light: isDark ? "#ff6b6b" : "#e35d6a",
        dark: isDark ? "#cc0000" : "#b02a37",
      },
      background: {
        default: isDark ? "#1a1f2c" : "#f0f2f5",
        paper: isDark ? "#232834" : "#ffffff",
      },
      text: {
        primary: isDark ? "#ffffff" : "#1a1f2c",
        secondary: isDark ? "#a0aec0" : "#2d3748",
      },
      error: {
        main: isDark ? "#ff3e3e" : "#dc3545",
        light: isDark ? "#ff6b6b" : "#e35d6a",
        dark: isDark ? "#cc0000" : "#b02a37",
      },
      warning: {
        main: isDark ? "#ffa500" : "#ffc107",
        light: isDark ? "#ffc04d" : "#ffcd39",
        dark: isDark ? "#cc8400" : "#cc9a06",
      },
      success: {
        main: isDark ? "#4caf50" : "#198754",
        light: isDark ? "#80e27e" : "#28a745",
        dark: isDark ? "#087f23" : "#0f5132",
      },
      info: {
        main: isDark ? "#00ffff" : "#0088cc",
        light: isDark ? "#33ffff" : "#33aaff",
        dark: isDark ? "#00cccc" : "#006699",
      },
      divider: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    typography: {
      fontFamily: "'Roboto Mono', monospace",
      h1: {
        fontSize: "2.5rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      h6: {
        fontSize: "1.1rem",
        fontWeight: 600,
        letterSpacing: 0.5,
        color: isDark ? "#ffffff" : "#1a1f2c",
      },
      body1: {
        fontSize: "1rem",
        letterSpacing: 0.5,
        lineHeight: 1.5,
        color: isDark ? "#ffffff" : "#2d3748",
      },
      body2: {
        fontSize: "0.875rem",
        letterSpacing: 0.5,
        lineHeight: 1.5,
        color: isDark ? "#a0aec0" : "#4a5568",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? "#1a1f2c" : "#f0f2f5",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: isDark ? "#232834" : "#e2e8f0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: isDark ? "#394150" : "#94a3b8",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: isDark ? "#454f63" : "#64748b",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#232834" : "#ffffff",
            backgroundImage: "none",
            borderBottom: `1px solid ${
              isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
            }`,
            boxShadow: isDark
              ? "none"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? "#232834" : "#ffffff",
            backgroundImage: "none",
            borderRight: `1px solid ${
              isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
            }`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isDark ? "#232834" : "#ffffff",
            "&.MuiCard-root": {
              backgroundColor: isDark ? "#232834" : "#ffffff",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
              }`,
              borderRadius: 4,
              boxShadow: isDark
                ? "none"
                : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"
            }`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: 0.5,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: alpha(isDark ? "#00ffff" : "#0088cc", 0.15),
              "&:hover": {
                backgroundColor: alpha(isDark ? "#00ffff" : "#0088cc", 0.25),
              },
            },
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          color: isDark ? "white" : "rgb(0 0 0 / 70%)",
        },
        styleOverrides: {
          root: {
            margin: 0,
            fontSize: "0.875rem",
            letterSpacing: "0.5px",
            lineHeight: 1.5,
            fontFamily: "'Roboto Mono', monospace",
            fontWeight: 400,
            ...(isDark
              ? {
                  "&.stats-number": {
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#00ffff",
                    textShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                  },
                  "&.stats-label": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  },
                  "&.map-title": {
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: "#00ffff",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  },
                }
              : {
                  "&.stats-number": {
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#0088cc",
                    textShadow: "none",
                  },
                  "&.stats-label": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "rgb(0 0 0 / 70%)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  },
                  "&.map-title": {
                    fontSize: "1.75rem",
                    fontWeight: 600,
                    color: "#1e3a5c",
                    letterSpacing: "0.05em",
                    marginBottom: "1rem",
                  },
                }),
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:focus": {
              outline: "none",
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 4,
    },
  });
};

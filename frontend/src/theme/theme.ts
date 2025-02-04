import { createTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#00ffff",
        light: "#33ffff",
        dark: "#00cccc",
      },
      secondary: {
        main: "#ff3e3e",
        light: "#ff6b6b",
        dark: "#cc0000",
      },
      background: {
        default: "#1a1f2c",
        paper: "#232834",
      },
      text: {
        primary: "#ffffff",
        secondary: "#a0aec0",
      },
      error: {
        main: "#ff3e3e",
        light: "#ff6b6b",
        dark: "#cc0000",
      },
      warning: {
        main: "#ffa500",
        light: "#ffc04d",
        dark: "#cc8400",
      },
      success: {
        main: "#4caf50",
        light: "#80e27e",
        dark: "#087f23",
      },
      info: {
        main: "#00ffff",
        light: "#33ffff",
        dark: "#00cccc",
      },
      divider: "rgba(255, 255, 255, 0.12)",
    },
    typography: {
      fontFamily: "'Roboto Mono', monospace",
      h1: {
        fontSize: "2rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      h2: {
        fontSize: "1.75rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      h4: {
        fontSize: "1.25rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      h5: {
        fontSize: "1.1rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        letterSpacing: 0.5,
      },
      body1: {
        fontSize: "0.875rem",
        letterSpacing: 0.5,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.75rem",
        letterSpacing: 0.5,
        lineHeight: 1.5,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#1a1f2c",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#232834",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#394150",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#454f63",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#232834",
            backgroundImage: "none",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#232834",
            backgroundImage: "none",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: "#232834",
            "&.MuiCard-root": {
              backgroundColor: "#232834",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 4,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
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
              backgroundColor: alpha("#00ffff", 0.15),
              "&:hover": {
                backgroundColor: alpha("#00ffff", 0.25),
              },
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

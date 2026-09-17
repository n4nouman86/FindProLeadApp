import { createTheme, type PaletteMode } from "@mui/material/styles";

export function getTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#4f46e5" : "#818cf8",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0ea5e9",
      },
      background:
        mode === "light"
          ? { default: "#f5f6fa" }
          : { default: "#0f1117", paper: "#161923" },
      divider:
        mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.16)",
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: [
        "Inter",
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          outlined: ({ theme }) => ({
            borderColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.23)"
                : "rgba(255, 255, 255, 0.4)",
          }),
        },
      },
    },
  });
}

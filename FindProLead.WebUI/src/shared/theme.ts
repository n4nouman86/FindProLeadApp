import { alpha, createTheme, type PaletteMode } from "@mui/material/styles";

const PRIMARY_LIGHT = "#0d7a6f";
const PRIMARY_DARK = "#2dd4bf";

export function getTheme(mode: PaletteMode) {
  const isLight = mode === "light";
  const primary = isLight ? PRIMARY_LIGHT : PRIMARY_DARK;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        contrastText: isLight ? "#ffffff" : "#04211d",
      },
      secondary: {
        main: isLight ? "#d97706" : "#fbbf24",
      },
      success: { main: isLight ? "#15803d" : "#4ade80" },
      warning: { main: isLight ? "#b45309" : "#fbbf24" },
      error: { main: isLight ? "#be123c" : "#fb7185" },
      background: isLight
        ? { default: "#f4f6f5", paper: "#ffffff" }
        : { default: "#0a0f0e", paper: "#111715" },
      text: isLight
        ? { primary: "#12211d", secondary: "#5d6f6b" }
        : { primary: "#e0ebe8", secondary: "#8fa39e" },
      divider: isLight ? "rgba(18, 33, 29, 0.09)" : "rgba(143, 163, 158, 0.14)",
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontSize: 13,
      fontFamily: [
        "Inter",
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "sans-serif",
      ].join(","),
      h4: { fontWeight: 700, fontSize: "1.45rem", letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.01em" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      subtitle1: { fontWeight: 600, fontSize: "0.95rem" },
      button: { textTransform: "none", fontWeight: 600, fontSize: "0.83rem" },
      overline: {
        fontWeight: 700,
        fontSize: "0.68rem",
        letterSpacing: "0.09em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "::selection": {
            backgroundColor: alpha(primary, 0.25),
          },
          "*::-webkit-scrollbar": { width: 10, height: 10 },
          "*::-webkit-scrollbar-track": { backgroundColor: "transparent" },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: isLight
              ? "rgba(18, 33, 29, 0.2)"
              : "rgba(143, 163, 158, 0.26)",
            borderRadius: 8,
            border: "2px solid transparent",
            backgroundClip: "content-box",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: isLight
              ? "rgba(18, 33, 29, 0.35)"
              : "rgba(143, 163, 158, 0.42)",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 16,
          },
          outlined: ({ theme }) => ({
            borderColor:
              theme.palette.mode === "light"
                ? "rgba(18, 33, 29, 0.18)"
                : "rgba(143, 163, 158, 0.35)",
          }),
        },
        variants: [
          {
            props: { variant: "contained", color: "primary" },
            style: ({ theme }) => ({
              position: "relative",
              overflow: "hidden",
              backgroundImage:
                theme.palette.mode === "light"
                  ? "linear-gradient(135deg, #0d7a6f 0%, #14b8a6 100%)"
                  : "none",
              boxShadow:
                theme.palette.mode === "light"
                  ? `inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`
                  : `inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 14px ${alpha(theme.palette.primary.main, 0.22)}`,
              "&:hover": {
                backgroundImage:
                  theme.palette.mode === "light"
                    ? "linear-gradient(135deg, #0b6a60 0%, #0d9488 100%)"
                    : "none",
                boxShadow:
                  theme.palette.mode === "light"
                    ? `inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 6px 18px ${alpha(theme.palette.primary.main, 0.45)}`
                    : `inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 18px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }),
          },
        ],
      },
      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
      MuiSelect: {
        defaultProps: { size: "small" },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontSize: "0.85rem" },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: "0.85rem" },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { fontSize: "0.85rem", minHeight: 36 },
        },
      },
      MuiTableCell: {
        defaultProps: { size: "small" },
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: theme.palette.divider,
            paddingTop: 10,
            paddingBottom: 10,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: "none",
            position: "relative",
            backdropFilter: "blur(14px)",
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.78 : 0.55,
            ),
            boxShadow:
              theme.palette.mode === "light"
                ? "0 8px 24px rgba(18, 33, 29, 0.06)"
                : "0 8px 24px rgba(0, 0, 0, 0.35)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0) 45%)",
            },
          }),
          outlined: ({ theme }) => ({
            borderColor: alpha(
              theme.palette.mode === "light" ? "#ffffff" : theme.palette.divider,
              theme.palette.mode === "light" ? 0.9 : 1,
            ),
          }),
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
            backdropFilter: "blur(20px)",
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.88 : 0.72,
            ),
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: { fontWeight: 700, fontSize: "1.05rem" },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& .MuiTableCell-head": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#f8fafc"
                  : alpha(theme.palette.common.white, 0.03),
              color: theme.palette.text.secondary,
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            "&.MuiTableRow-hover:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            "&:last-child .MuiTableCell-root": { borderBottom: 0 },
          }),
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.primary.main, 0.45),
            },
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRadius: 12,
            border: `1px solid ${theme.palette.divider}`,
            marginTop: 6,
            minWidth: 220,
            backdropFilter: "blur(18px)",
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.88 : 0.78,
            ),
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 0 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "0.72rem",
            height: 22,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: "0.75rem", borderRadius: 8 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundImage: "none",
            backdropFilter: "blur(16px)",
            backgroundColor: alpha(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.7 : 0.45,
            ),
          }),
        },
      },
    },
  });
}

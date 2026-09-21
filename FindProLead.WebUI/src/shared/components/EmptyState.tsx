import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        py: 8,
        px: 3,
      }}
    >
      <Box
        sx={(theme) => ({
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: "primary.main",
          "& svg": { fontSize: 28 },
        })}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1">{title}</Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

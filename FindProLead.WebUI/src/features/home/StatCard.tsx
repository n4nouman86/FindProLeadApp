import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | undefined;
  loading: boolean;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ label, value, loading, icon, color }: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: 3,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(color, 0.12),
          color,
          "& svg": { fontSize: 26 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {loading ? (
          <Skeleton width={48} height={34} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {value ?? 0}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

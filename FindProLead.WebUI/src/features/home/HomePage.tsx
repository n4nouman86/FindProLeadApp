import { Typography } from "@mui/material";
import { useAuth } from "../auth/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Welcome, {user?.firstName}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Roles: {user?.roles?.join(", ") || "none"}
      </Typography>
    </div>
  );
}

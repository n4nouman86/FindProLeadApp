import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Alert, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAuth } from "./useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          background:
            "linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #0ea5e9 100%)",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TrendingUpIcon fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            FindProLead
          </Typography>
        </Stack>

        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Pre-qualified leads,
            <br />
            delivered instantly.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420 }}>
            Manage lead intake, qualification, and transfers to your buyers —
            all in one place.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} FindProLead. All rights reserved.
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={3}
          sx={{
            width: 460,
            p: 5,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Box>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            size="large"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <Alert severity="info" variant="outlined">
            Demo admin login — Email: <strong>admin@findprolead.com</strong>
            {" "}| Password: <strong>Admin@12345</strong>
          </Alert>
        </Paper>
      </Box>
    </Box>
  );
}

import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "./useAuth";

const features = [
  "Instant lead transfers to buyers",
  "Subsidiary & verifier management",
  "Real-time delivery tracking",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          position: "relative",
          overflow: "hidden",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          background:
            "linear-gradient(140deg, #064e46 0%, #0d7a6f 50%, #14b8a6 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 40%)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -100,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.07)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", position: "relative" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.14)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25)",
            }}
          >
            <TrendingUpIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
            FindProLead
          </Typography>
        </Stack>

        <Box sx={{ position: "relative" }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: "-0.02em" }}>
            Pre-qualified leads,
            <br />
            delivered instantly.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 440, mb: 4 }}>
            Manage lead intake, qualification, and transfers to your buyers —
            all in one place.
          </Typography>
          <Stack spacing={1.5}>
            {features.map((feature) => (
              <Stack key={feature} direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.7, position: "relative" }}>
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
          bgcolor: "background.default",
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="h5">Welcome back</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            fullWidth
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                ),
              },
            }}
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
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{ py: 1.25, fontSize: "0.95rem" }}
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

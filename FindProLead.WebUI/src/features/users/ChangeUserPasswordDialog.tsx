import { useState, type SubmitEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type { User } from "./types";
import { changeUserPassword } from "./usersApi";
import { getErrorMessage } from "../../shared/api/apiClient";
import { useNotification } from "../../shared/notifications/useNotification";

interface ChangeUserPasswordDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
}

export default function ChangeUserPasswordDialog({ open, user, onClose }: ChangeUserPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  function handleClose() {
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    onClose();
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await changeUserPassword(user.id, { newPassword: password });
      handleClose();
      notify("Password changed successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not change the password. Please check the password requirements.");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Change Password
          <IconButton onClick={handleClose} size="small" aria-label="Close change password dialog">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "20px !important" }}>
          <Alert severity="info">
            Set a new password for {user.firstName} {user.lastName}.
          </Alert>

          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((previous) => !previous)}
                    edge="end"
                    size="small"
                    aria-label={showPassword ? "Hide new password" : "Show new password"}
                  >
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                ),
              },
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword((previous) => !previous)}
                    edge="end"
                    size="small"
                    aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                ),
              },
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Change Password"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

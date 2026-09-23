import { useEffect, useState, type SubmitEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  IconButton,
  Alert,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type { User } from "./types";
import type { VerifierCompany } from "../verifierCompanies/types";
import type { AutoInsuranceAgency } from "../autoInsuranceAgencies/types";
import { createUser } from "./usersApi";
import { getErrorMessage } from "../../shared/api/apiClient";
import { useNotification } from "../../shared/notifications/useNotification";
import { getVerifierCompanies } from "../verifierCompanies/verifierCompaniesApi";
import { getAutoInsuranceAgencies } from "../autoInsuranceAgencies/autoInsuranceAgenciesApi";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (user: User) => void;
}

export default function CreateUserDialog({ open, onClose, onSaved }: CreateUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Agency Manager");
  const [verifierId, setVerifierId] = useState("");
  const [clientId, setClientId] = useState("");

  const isVerifierRole = role === "Verifier Manager";
  const isAgencyRole = role === "Agency Manager";
  const [verifiers, setVerifiers] = useState<VerifierCompany[]>([]);
  const [clients, setClients] = useState<AutoInsuranceAgency[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    if (open) {
      getVerifierCompanies().then(setVerifiers).catch(() => setVerifiers([]));
      getAutoInsuranceAgencies().then(setClients).catch(() => setClients([]));
    }
  }, [open]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await createUser({
        firstName,
        lastName,
        email,
        password,
        verifierCompanyId: verifierId ? Number(verifierId) : undefined,
        autoInsuranceAgencyId: clientId ? Number(clientId) : undefined,
        role: role || undefined,
      });
      onSaved(saved);
      onClose();
      notify("User created successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not create user. Please check the details and try again.");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Add User
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "20px !important" }}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
            fullWidth
          />

          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
            fullWidth
          />

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
            autoComplete="new-password"
            slotProps={{
              htmlInput: { maxLength: 8 },
              input: {
                endAdornment: (
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                ),
              },
            }}
            required
            fullWidth
          />

          <TextField
            select
            label="Role"
            value={role}
            onChange={(e) => {
              const nextRole = e.target.value;
              setRole(nextRole);

              if (nextRole === "Admin" || nextRole === "Verifier Manager" || nextRole === "Agency Manager") {
                setVerifierId("");
                setClientId("");
              }
            }}
            fullWidth
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Verifier Manager">Verifier Manager</MenuItem>
            <MenuItem value="Agency Manager">Agency Manager</MenuItem>
          </TextField>

          {isAgencyRole && (
            <TextField
              select
              label="Agency Name"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          {isVerifierRole && (
            <TextField
              select
                label="Verifier Company"
              value={verifierId}
              onChange={(e) => setVerifierId(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {verifiers.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

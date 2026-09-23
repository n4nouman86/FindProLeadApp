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
import type { User } from "./types";
import type { VerifierCompany } from "../verifierCompanies/types";
import type { AutoInsuranceAgency } from "../autoInsuranceAgencies/types";
import { updateUser } from "./usersApi";
import { getVerifierCompanies } from "../verifierCompanies/verifierCompaniesApi";
import { getAutoInsuranceAgencies } from "../autoInsuranceAgencies/autoInsuranceAgenciesApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";

interface EditUserDialogProps {
  open: boolean;
  user: User;
  onClose: () => void;
  onSaved: (user: User) => void;
}

export default function EditUserDialog({ open, user, onClose, onSaved }: EditUserDialogProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role ?? "Agency Manager");
  const [verifierId, setVerifierId] = useState(user.verifierCompanyId ? String(user.verifierCompanyId) : "");
  const [clientId, setClientId] = useState(user.autoInsuranceAgencyId ? String(user.autoInsuranceAgencyId) : "");

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
      const saved = await updateUser(user.id, {
        firstName,
        lastName,
        email,
        verifierCompanyId: verifierId ? Number(verifierId) : undefined,
        autoInsuranceAgencyId: clientId ? Number(clientId) : undefined,
        role: role || undefined,
      });
      onSaved(saved);
      onClose();
      notify("User updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update user. Please check the details and try again.");
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
          Edit User
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
            {saving ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

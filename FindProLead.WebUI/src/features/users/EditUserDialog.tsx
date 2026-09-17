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
import type { Subsidiary } from "../subsidiaries/types";
import type { VerifierAgency } from "../verifierAgencies/types";
import type { AutoInsuranceAgency } from "../autoInsuranceAgencies/types";
import { updateUser } from "./usersApi";
import { getSubsidiaries } from "../subsidiaries/subsidiariesApi";
import { getVerifierAgencies } from "../verifierAgencies/verifierAgenciesApi";
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
  const [subsidiaryId, setSubsidiaryId] = useState(user.subsidiaryId ? String(user.subsidiaryId) : "");
  const [verifierId, setVerifierId] = useState(user.verifierId ? String(user.verifierId) : "");
  const [clientId, setClientId] = useState(user.clientId ? String(user.clientId) : "");
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [verifiers, setVerifiers] = useState<VerifierAgency[]>([]);
  const [clients, setClients] = useState<AutoInsuranceAgency[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    if (open) {
      getSubsidiaries().then(setSubsidiaries).catch(() => setSubsidiaries([]));
      getVerifierAgencies().then(setVerifiers).catch(() => setVerifiers([]));
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
        subsidiaryId: subsidiaryId ? Number(subsidiaryId) : undefined,
        verifierId: verifierId ? Number(verifierId) : undefined,
        clientId: clientId ? Number(clientId) : undefined,
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
            label="Subsidiary"
            value={subsidiaryId}
            onChange={(e) => setSubsidiaryId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {subsidiaries.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Verifier Agency"
            value={verifierId}
            onChange={(e) => setVerifierId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {verifiers.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Client Agency"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            {clients.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

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

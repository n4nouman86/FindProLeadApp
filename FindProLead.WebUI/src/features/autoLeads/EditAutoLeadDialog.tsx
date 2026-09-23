import { useEffect, useState, type SubmitEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { AutoLead, UpdateAutoLeadRequest } from "./types";
import type { AutoInsuranceAgency } from "../autoInsuranceAgencies/types";
import type { User } from "../users/types";
import type { VerifierCompany } from "../verifierCompanies/types";
import { updateAutoLead } from "./autoLeadsApi";
import { getAutoInsuranceAgencies } from "../autoInsuranceAgencies/autoInsuranceAgenciesApi";
import { getUsers } from "../users/usersApi";
import { getVerifierCompanies } from "../verifierCompanies/verifierCompaniesApi";
import { getErrorMessage } from "../../shared/api/apiClient";
import { useNotification } from "../../shared/notifications/useNotification";

interface EditAutoLeadDialogProps {
  open: boolean;
  lead: AutoLead;
  onClose: () => void;
  onSaved: (lead: AutoLead) => void;
}

export default function EditAutoLeadDialog({ open, lead, onClose, onSaved }: EditAutoLeadDialogProps) {
  const [agencies, setAgencies] = useState<AutoInsuranceAgency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [verifierCompanies, setVerifierCompanies] = useState<VerifierCompany[]>([]);
  const [firstName, setFirstName] = useState(lead.firstName);
  const [lastName, setLastName] = useState(lead.lastName);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(lead.dateOfBirth);
  const [agencyId, setAgencyId] = useState(String(lead.autoInsuranceAgencyId));
  const [verifierCompanyId, setVerifierCompanyId] = useState(lead.verifierCompanyId ? String(lead.verifierCompanyId) : "");
  const [appUserId, setAppUserId] = useState(lead.appUserId);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();
  const agencyUsers = users.filter((user) => Number(user.autoInsuranceAgencyId) === Number(agencyId));

  useEffect(() => {
    if (open) {
      getAutoInsuranceAgencies().then(setAgencies).catch(() => setAgencies([]));
      getUsers().then(setUsers).catch(() => setUsers([]));
      getVerifierCompanies().then(setVerifierCompanies).catch(() => setVerifierCompanies([]));
    }
  }, [open]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const request: UpdateAutoLeadRequest = {
      firstName,
      lastName,
      phone,
      email: email || undefined,
      dateOfBirth,
      autoInsuranceAgencyId: Number(agencyId),
      verifierCompanyId: verifierCompanyId ? Number(verifierCompanyId) : undefined,
      appUserId,
    };

    try {
      const saved = await updateAutoLead(lead.id, request);
      onSaved(saved);
      onClose();
      notify("Auto lead updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update auto lead. Please check the details and try again.");
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
          Edit Auto Lead
          <IconButton onClick={onClose} size="small" aria-label="Close edit auto lead dialog">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: "20px !important" }}>
          <TextField label="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required fullWidth />
          <TextField label="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} required fullWidth />
          <TextField label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required fullWidth />
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} fullWidth />
          <TextField label="Date of Birth" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} required fullWidth />
          <TextField
            select
            label="Auto Insurance Agency"
            value={agencyId}
            onChange={(event) => {
              const selectedAgencyId = event.target.value;
              setAgencyId(selectedAgencyId);
              if (!users.some((user) => user.id === appUserId && Number(user.autoInsuranceAgencyId) === Number(selectedAgencyId))) {
                setAppUserId("");
              }
            }}
            required
            fullWidth
          >
            {agencies.map((agency) => <MenuItem key={agency.id} value={agency.id}>{agency.name}</MenuItem>)}
          </TextField>
          <TextField select label="Verifier Company" value={verifierCompanyId} onChange={(event) => setVerifierCompanyId(event.target.value)} fullWidth>
            <MenuItem value="">None</MenuItem>
            {verifierCompanies.map((company) => <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>)}
          </TextField>
          <TextField select label="App User" value={appUserId} onChange={(event) => setAppUserId(event.target.value)} required fullWidth disabled={!agencyId} sx={{ gridColumn: { sm: "1 / -1" } }}>
            {agencyUsers.map((user) => <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>)}
          </TextField>
          {error && <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>{error}</Alert>}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

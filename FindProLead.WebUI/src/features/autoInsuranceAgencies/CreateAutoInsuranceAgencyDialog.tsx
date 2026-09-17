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
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { AutoInsuranceAgency } from "./types";
import type { Subsidiary } from "../subsidiaries/types";
import { createAutoInsuranceAgency } from "./autoInsuranceAgenciesApi";
import { getSubsidiaries } from "../subsidiaries/subsidiariesApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";
import { US_STATES, type UsState } from "../../shared/usStates";

interface CreateAutoInsuranceAgencyDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (agency: AutoInsuranceAgency) => void;
}

export default function CreateAutoInsuranceAgencyDialog({ open, onClose, onSaved }: CreateAutoInsuranceAgencyDialogProps) {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [subsidiaryId, setSubsidiaryId] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [transfersPerDay, setTransfersPerDay] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [multiCars, setMultiCars] = useState(false);
  const [homeOwners, setHomeOwners] = useState(false);
  const [states, setStates] = useState<UsState[]>([]);
  const [verifierNotes, setVerifierNotes] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  useEffect(() => {
    if (open) {
      getSubsidiaries().then(setSubsidiaries).catch(() => setSubsidiaries([]));
    }
  }, [open]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await createAutoInsuranceAgency({
        subsidiaryId: Number(subsidiaryId),
        name,
        website: website || undefined,
        email: email || undefined,
        phone: phone || undefined,
        alternatePhone: alternatePhone || undefined,
        transfersPerDay: transfersPerDay ? Number(transfersPerDay) : 0,
        linkedin: linkedin || undefined,
        multiCars,
        homeOwners,
        states: states.map((state) => state.code).join(", "),
        verifierNotes: verifierNotes || undefined,
        memo: memo || undefined,
      });
      onSaved(saved);
      onClose();
      notify("Auto insurance agency created successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not create auto insurance agency. Please check the details and try again.");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Add Auto Insurance Agency
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            pt: "20px !important",
          }}
        >
          <TextField
            select
            label="Subsidiary"
            value={subsidiaryId}
            onChange={(e) => setSubsidiaryId(e.target.value)}
            required
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          >
            {subsidiaries.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />

          <TextField
            label="Alternate Phone"
            value={alternatePhone}
            onChange={(e) => setAlternatePhone(e.target.value)}
            fullWidth
          />

          <TextField
            label="Transfers Per Day"
            type="number"
            value={transfersPerDay}
            onChange={(e) => setTransfersPerDay(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="LinkedIn"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            fullWidth
          />

          <Autocomplete
            multiple
            options={US_STATES}
            getOptionLabel={(state) => `${state.code}, ${state.name}`}
            value={states}
            onChange={(_, value: UsState[]) => setStates(value)}
            renderInput={(params) => <TextField {...params} label="States" required={states.length === 0} />}
            fullWidth
          />

          <FormControlLabel
            control={<Checkbox checked={multiCars} onChange={(e) => setMultiCars(e.target.checked)} />}
            label="Multi Cars"
          />

          <FormControlLabel
            control={<Checkbox checked={homeOwners} onChange={(e) => setHomeOwners(e.target.checked)} />}
            label="Home Owners"
          />

          <TextField
            label="Verifier Notes"
            value={verifierNotes}
            onChange={(e) => setVerifierNotes(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            sx={{ gridColumn: "1 / -1" }}
          />

          {error && (
            <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>
              {error}
            </Alert>
          )}
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

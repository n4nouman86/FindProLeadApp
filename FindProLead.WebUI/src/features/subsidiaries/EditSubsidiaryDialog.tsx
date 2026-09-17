import { useState, type SubmitEvent } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Subsidiary } from "./types";
import { updateSubsidiary } from "./subsidiariesApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";

interface EditSubsidiaryDialogProps {
  open: boolean;
  subsidiary: Subsidiary;
  onClose: () => void;
  onSaved: (subsidiary: Subsidiary) => void;
}

export default function EditSubsidiaryDialog({ open, subsidiary, onClose, onSaved }: EditSubsidiaryDialogProps) {
  const [name, setName] = useState(subsidiary.name);
  const [website, setWebsite] = useState(subsidiary.website ?? "");
  const [email, setEmail] = useState(subsidiary.email ?? "");
  const [phone, setPhone] = useState(subsidiary.phone ?? "");
  const [linkedin, setLinkedin] = useState(subsidiary.linkedin ?? "");
  const [memo, setMemo] = useState(subsidiary.memo ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await updateSubsidiary(subsidiary.id, {
        name,
        website: website || undefined,
        email: email || undefined,
        phone: phone || undefined,
        linkedin: linkedin || undefined,
        memo: memo || undefined,
      });
      onSaved(saved);
      onClose();
      notify("Subsidiary updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update subsidiary. Please check the details and try again.");
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
          Edit Subsidiary
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "20px !important" }}>
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
            label="LinkedIn"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            fullWidth
          />

          <TextField
            label="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

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

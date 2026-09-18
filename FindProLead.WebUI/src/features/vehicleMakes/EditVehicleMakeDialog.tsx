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
import type { VehicleMake } from "./types";
import { updateVehicleMake } from "./vehicleMakesApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";

interface EditVehicleMakeDialogProps {
  open: boolean;
  make: VehicleMake;
  onClose: () => void;
  onSaved: (make: VehicleMake) => void;
}

export default function EditVehicleMakeDialog({ open, make, onClose, onSaved }: EditVehicleMakeDialogProps) {
  const [name, setName] = useState(make.name);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await updateVehicleMake(make.id, { name });
      onSaved(saved);
      onClose();
      notify("Vehicle make updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not update vehicle make. Please check the details and try again.");
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
          Edit Vehicle Make
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

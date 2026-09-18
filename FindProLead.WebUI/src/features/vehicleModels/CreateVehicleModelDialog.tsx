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
import type { VehicleModel } from "./types";
import { createVehicleModel } from "./vehicleModelsApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";

interface CreateVehicleModelDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (model: VehicleModel) => void;
}

export default function CreateVehicleModelDialog({ open, onClose, onSaved }: CreateVehicleModelDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await createVehicleModel({ name });
      onSaved(saved);
      onClose();
      notify("Vehicle model created successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not create vehicle model. Please check the details and try again.");
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
          Add Vehicle Model
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
            {saving ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

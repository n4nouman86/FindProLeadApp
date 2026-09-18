import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VehicleModel } from "./types";
import { getVehicleModels, deleteVehicleModel } from "./vehicleModelsApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";
import CreateVehicleModelDialog from "./CreateVehicleModelDialog";
import EditVehicleModelDialog from "./EditVehicleModelDialog";

export default function VehicleModelsPage() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [deletingModel, setDeletingModel] = useState<VehicleModel | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useNotification();

  const loadModels = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVehicleModels();
      setModels(data);
    } catch {
      setError("Could not load vehicle models.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadModels();
  }, [loadModels]);

  function handleSaved(saved: VehicleModel) {
    setModels((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      return exists
        ? prev.map((m) => (m.id === saved.id ? saved : m))
        : [saved, ...prev];
    });
  }

  async function handleDelete() {
    if (!deletingModel) return;
    setDeleting(true);
    try {
      await deleteVehicleModel(deletingModel.id);
      setModels((prev) => prev.filter((m) => m.id !== deletingModel.id));
      setDeletingModel(null);
      notify("Vehicle model deleted successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not delete vehicle model.");
      notify(message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Vehicle Models
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Model
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No vehicle models yet.
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow key={model.id} hover>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>
                      {new Date(model.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingModel(model)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeletingModel(model)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <CreateVehicleModelDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingModel && (
        <EditVehicleModelDialog
          key={editingModel.id}
          open={Boolean(editingModel)}
          model={editingModel}
          onClose={() => setEditingModel(null)}
          onSaved={handleSaved}
        />
      )}

      <Dialog open={Boolean(deletingModel)} onClose={() => setDeletingModel(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Vehicle Model</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deletingModel?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => setDeletingModel(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

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
import type { VehicleMake } from "./types";
import { getVehicleMakes, deleteVehicleMake } from "./vehicleMakesApi";
import { useNotification } from "../../shared/notifications/useNotification";
import { getErrorMessage } from "../../shared/api/apiClient";
import CreateVehicleMakeDialog from "./CreateVehicleMakeDialog";
import EditVehicleMakeDialog from "./EditVehicleMakeDialog";

export default function VehicleMakesPage() {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingMake, setEditingMake] = useState<VehicleMake | null>(null);
  const [deletingMake, setDeletingMake] = useState<VehicleMake | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { notify } = useNotification();

  const loadMakes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVehicleMakes();
      setMakes(data);
    } catch {
      setError("Could not load vehicle makes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadMakes();
  }, [loadMakes]);

  function handleSaved(saved: VehicleMake) {
    setMakes((prev) => {
      const exists = prev.some((m) => m.id === saved.id);
      return exists
        ? prev.map((m) => (m.id === saved.id ? saved : m))
        : [saved, ...prev];
    });
  }

  async function handleDelete() {
    if (!deletingMake) return;
    setDeleting(true);
    try {
      await deleteVehicleMake(deletingMake.id);
      setMakes((prev) => prev.filter((m) => m.id !== deletingMake.id));
      setDeletingMake(null);
      notify("Vehicle make deleted successfully.");
    } catch (err) {
      const message = getErrorMessage(err, "Could not delete vehicle make.");
      notify(message, "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Vehicle Makes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Make
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
              {makes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No vehicle makes yet.
                  </TableCell>
                </TableRow>
              ) : (
                makes.map((make) => (
                  <TableRow key={make.id} hover>
                    <TableCell>{make.name}</TableCell>
                    <TableCell>
                      {new Date(make.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingMake(make)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeletingMake(make)}>
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

      <CreateVehicleMakeDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingMake && (
        <EditVehicleMakeDialog
          key={editingMake.id}
          open={Boolean(editingMake)}
          make={editingMake}
          onClose={() => setEditingMake(null)}
          onSaved={handleSaved}
        />
      )}

      <Dialog open={Boolean(deletingMake)} onClose={() => setDeletingMake(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Vehicle Make</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deletingMake?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => setDeletingMake(null)}>
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

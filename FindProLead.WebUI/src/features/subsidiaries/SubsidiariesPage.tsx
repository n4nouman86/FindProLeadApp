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
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { Subsidiary } from "./types";
import { getSubsidiaries } from "./subsidiariesApi";
import CreateSubsidiaryDialog from "./CreateSubsidiaryDialog";
import EditSubsidiaryDialog from "./EditSubsidiaryDialog";

export default function SubsidiariesPage() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSubsidiary, setEditingSubsidiary] = useState<Subsidiary | null>(null);

  const loadSubsidiaries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSubsidiaries();
      setSubsidiaries(data);
    } catch {
      setError("Could not load subsidiaries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadSubsidiaries();
  }, [loadSubsidiaries]);

  function handleSaved(saved: Subsidiary) {
    setSubsidiaries((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists
        ? prev.map((s) => (s.id === saved.id ? saved : s))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Subsidiaries
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Subsidiary
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
                <TableCell>Website</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>LinkedIn</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subsidiaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No subsidiaries yet.
                  </TableCell>
                </TableRow>
              ) : (
                subsidiaries.map((subsidiary) => (
                  <TableRow key={subsidiary.id} hover>
                    <TableCell>{subsidiary.name}</TableCell>
                    <TableCell>
                      {subsidiary.website ? (
                        <Link href={subsidiary.website} target="_blank" rel="noopener noreferrer">
                          {subsidiary.website}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{subsidiary.email ?? "—"}</TableCell>
                    <TableCell>{subsidiary.phone ?? "—"}</TableCell>
                    <TableCell>
                      {subsidiary.linkedin ? (
                        <Link href={subsidiary.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(subsidiary.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingSubsidiary(subsidiary)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <CreateSubsidiaryDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingSubsidiary && (
        <EditSubsidiaryDialog
          key={editingSubsidiary.id}
          open={Boolean(editingSubsidiary)}
          subsidiary={editingSubsidiary}
          onClose={() => setEditingSubsidiary(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

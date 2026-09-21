import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Alert,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import type { Subsidiary } from "./types";
import { getSubsidiaries } from "./subsidiariesApi";
import CreateSubsidiaryDialog from "./CreateSubsidiaryDialog";
import EditSubsidiaryDialog from "./EditSubsidiaryDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

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
      <PageHeader
        title="Subsidiaries"
        subtitle="Manage subsidiary companies under your organization."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Subsidiary
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 900 }}>
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
          {loading ? (
            <TableSkeleton columns={7} />
          ) : (
            <TableBody>
              {subsidiaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<BusinessOutlinedIcon />}
                      title="No subsidiaries yet"
                      subtitle='Click "Add Subsidiary" to add your first subsidiary.'
                    />
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
          )}
        </Table>
      </TableContainer>

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

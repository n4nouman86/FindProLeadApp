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
import type { SubsidiaryCompany } from "./types";
import { getSubsidiaryCompanies } from "./subsidiaryCompaniesApi";
import CreateSubsidiaryCompanyDialog from "./CreateSubsidiaryCompanyDialog";
import EditSubsidiaryCompanyDialog from "./EditSubsidiaryCompanyDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function SubsidiaryCompaniesPage() {
  const [subsidiaryCompanies, setSubsidiaryCompanies] = useState<SubsidiaryCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSubsidiaryCompany, setEditingSubsidiaryCompany] = useState<SubsidiaryCompany | null>(null);

  const loadSubsidiaryCompanies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSubsidiaryCompanies();
      setSubsidiaryCompanies(data);
    } catch {
      setError("Could not load subsidiary companies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadSubsidiaryCompanies();
  }, [loadSubsidiaryCompanies]);

  function handleSaved(saved: SubsidiaryCompany) {
    setSubsidiaryCompanies((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists
        ? prev.map((s) => (s.id === saved.id ? saved : s))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Subsidiary Companies"
        subtitle="Manage subsidiary companies under your organization."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Subsidiary Company
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
              {subsidiaryCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<BusinessOutlinedIcon />}
                      title="No subsidiary companies yet"
                      subtitle='Click "Add Subsidiary Company" to add your first subsidiary company.'
                    />
                  </TableCell>
                </TableRow>
              ) : (
                subsidiaryCompanies.map((subsidiary) => (
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
                      <IconButton size="small" onClick={() => setEditingSubsidiaryCompany(subsidiary)}>
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

      <CreateSubsidiaryCompanyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingSubsidiaryCompany && (
        <EditSubsidiaryCompanyDialog
          key={editingSubsidiaryCompany.id}
          open={Boolean(editingSubsidiaryCompany)}
          subsidiary={editingSubsidiaryCompany}
          onClose={() => setEditingSubsidiaryCompany(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

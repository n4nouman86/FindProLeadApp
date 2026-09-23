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
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import type { VerifierCompany } from "./types";
import { getVerifierCompanies } from "./verifierCompaniesApi";
import CreateVerifierCompanyDialog from "./CreateVerifierCompanyDialog";
import EditVerifierCompanyDialog from "./EditVerifierCompanyDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function VerifierCompaniesPage() {
  const [companies, setCompanies] = useState<VerifierCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<VerifierCompany | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVerifierCompanies();
      setCompanies(data);
    } catch {
      setError("Could not load verifier companies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadCompanies();
  }, [loadCompanies]);

  function handleSaved(saved: VerifierCompany) {
    setCompanies((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      return exists
        ? prev.map((a) => (a.id === saved.id ? saved : a))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Verifier Companies"
        subtitle="Manage companies that verify lead details before transfer."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Verifier Company
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>LinkedIn</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton columns={6} />
          ) : (
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<VerifiedUserOutlinedIcon />}
                      title="No verifier companies yet"
                      subtitle='Click "Add Verifier Company" to add your first company.'
                    />
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((agency) => (
                  <TableRow key={agency.id} hover>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>
                      {agency.website ? (
                        <Link href={agency.website} target="_blank" rel="noopener noreferrer">
                          {agency.website}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{agency.email ?? "—"}</TableCell>
                    <TableCell>
                      {agency.linkedin ? (
                        <Link href={agency.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(agency.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingCompany(agency)}>
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

      <CreateVerifierCompanyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingCompany && (
        <EditVerifierCompanyDialog
          key={editingCompany.id}
          open={Boolean(editingCompany)}
          agency={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

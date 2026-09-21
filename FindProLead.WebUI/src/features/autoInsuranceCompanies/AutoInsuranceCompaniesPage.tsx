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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import type { AutoInsuranceCompany } from "./types";
import { getAutoInsuranceCompanies } from "./autoInsuranceCompaniesApi";
import CreateAutoInsuranceCompanyDialog from "./CreateAutoInsuranceCompanyDialog";
import EditAutoInsuranceCompanyDialog from "./EditAutoInsuranceCompanyDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function AutoInsuranceCompaniesPage() {
  const [companies, setCompanies] = useState<AutoInsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AutoInsuranceCompany | null>(null);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAutoInsuranceCompanies();
      setCompanies(data);
    } catch {
      setError("Could not load auto insurance companies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadCompanies();
  }, [loadCompanies]);

  function handleSaved(saved: AutoInsuranceCompany) {
    setCompanies((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      return exists
        ? prev.map((c) => (c.id === saved.id ? saved : c))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Auto Insurance Companies"
        subtitle="Manage insurance carriers used for auto lead matching."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Company
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton columns={3} />
          ) : (
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<ShieldOutlinedIcon />}
                      title="No companies yet"
                      subtitle='Click "Add Company" to add your first insurance company.'
                    />
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>
                      {new Date(company.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingCompany(company)}>
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

      <CreateAutoInsuranceCompanyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingCompany && (
        <EditAutoInsuranceCompanyDialog
          key={editingCompany.id}
          open={Boolean(editingCompany)}
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

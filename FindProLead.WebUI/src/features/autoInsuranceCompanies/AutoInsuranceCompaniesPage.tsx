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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { AutoInsuranceCompany } from "./types";
import { getAutoInsuranceCompanies } from "./autoInsuranceCompaniesApi";
import CreateAutoInsuranceCompanyDialog from "./CreateAutoInsuranceCompanyDialog";
import EditAutoInsuranceCompanyDialog from "./EditAutoInsuranceCompanyDialog";

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Auto Insurance Companies
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Company
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
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No auto insurance companies yet.
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
          </Table>
        )}
      </Paper>

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

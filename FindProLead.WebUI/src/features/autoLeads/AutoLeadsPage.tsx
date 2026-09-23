import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import type { AutoLead } from "./types";
import { getAutoLeads } from "./autoLeadsApi";
import CreateAutoLeadDialog from "./CreateAutoLeadDialog";
import EditAutoLeadDialog from "./EditAutoLeadDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function AutoLeadsPage() {
  const [leads, setLeads] = useState<AutoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<AutoLead | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await getAutoLeads());
    } catch {
      setError("Could not load auto leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadLeads();
  }, [loadLeads]);

  function handleSaved(saved: AutoLead) {
    setLeads((previous) => {
      const exists = previous.some((lead) => lead.id === saved.id);
      return exists ? previous.map((lead) => (lead.id === saved.id ? saved : lead)) : [saved, ...previous];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Auto Leads"
        subtitle="Manage auto leads and their assigned agencies and users."
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>Add Auto Lead</Button>}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 1050 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Agency</TableCell>
              <TableCell>Verifier Company</TableCell>
              <TableCell>App User</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton columns={8} />
          ) : (
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                    <EmptyState icon={<DirectionsCarOutlinedIcon />} title="No auto leads yet" subtitle='Click "Add Auto Lead" to create your first lead.' />
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id} hover>
                    <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.email ?? "-"}</TableCell>
                    <TableCell>{new Date(`${lead.dateOfBirth}T00:00:00`).toLocaleDateString("en-US")}</TableCell>
                    <TableCell>{lead.autoInsuranceAgencyName}</TableCell>
                    <TableCell>{lead.verifierCompanyName || "-"}</TableCell>
                    <TableCell>{lead.appUserName}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingLead(lead)} aria-label={`Edit ${lead.firstName} ${lead.lastName}`} title="Edit auto lead">
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

      <CreateAutoLeadDialog open={createOpen} onClose={() => setCreateOpen(false)} onSaved={handleSaved} />
      {editingLead && (
        <EditAutoLeadDialog
          key={editingLead.id}
          open={Boolean(editingLead)}
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

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
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import type { AutoInsuranceAgency } from "./types";
import { getAutoInsuranceAgencies } from "./autoInsuranceAgenciesApi";
import CreateAutoInsuranceAgencyDialog from "./CreateAutoInsuranceAgencyDialog";
import EditAutoInsuranceAgencyDialog from "./EditAutoInsuranceAgencyDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function AutoInsuranceAgenciesPage() {
  const [agencies, setAgencies] = useState<AutoInsuranceAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<AutoInsuranceAgency | null>(null);

  const loadAgencies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAutoInsuranceAgencies();
      setAgencies(data);
    } catch {
      setError("Could not load auto insurance agencies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadAgencies();
  }, [loadAgencies]);

  function handleSaved(saved: AutoInsuranceAgency) {
    setAgencies((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      return exists
        ? prev.map((a) => (a.id === saved.id ? saved : a))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Auto Insurance Agencies"
        subtitle="Manage buyer agencies, their daily capacity and coverage."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add Auto Insurance Agency
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 1300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subsidiary Company</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Alternate Phone</TableCell>
              <TableCell>Transfers Per Day</TableCell>
              <TableCell>LinkedIn</TableCell>
              <TableCell>States</TableCell>
              <TableCell>Multi Cars</TableCell>
              <TableCell>Home Owners</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton columns={13} />
          ) : (
            <TableBody>
              {agencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<ApartmentOutlinedIcon />}
                      title="No auto insurance agencies yet"
                      subtitle='Click "Add Auto Insurance Agency" to add your first agency.'
                    />
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
                  <TableRow key={agency.id} hover>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.subsidiaryCompanyName}</TableCell>
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
                    <TableCell>{agency.phone ?? "—"}</TableCell>
                    <TableCell>{agency.alternatePhone ?? "—"}</TableCell>
                    <TableCell>{agency.transfersPerDay ?? "—"}</TableCell>
                    <TableCell>
                      {agency.linkedin ? (
                        <Link href={agency.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </Link>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{agency.states ?? "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={agency.multiCars ? "Yes" : "No"}
                        color={agency.multiCars ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={agency.homeOwners ? "Yes" : "No"}
                        color={agency.homeOwners ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
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
                      <IconButton size="small" onClick={() => setEditingAgency(agency)}>
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

      <CreateAutoInsuranceAgencyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingAgency && (
        <EditAutoInsuranceAgencyDialog
          key={editingAgency.id}
          open={Boolean(editingAgency)}
          agency={editingAgency}
          onClose={() => setEditingAgency(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

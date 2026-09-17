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
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import type { AutoInsuranceAgency } from "./types";
import { getAutoInsuranceAgencies } from "./autoInsuranceAgenciesApi";
import CreateAutoInsuranceAgencyDialog from "./CreateAutoInsuranceAgencyDialog";
import EditAutoInsuranceAgencyDialog from "./EditAutoInsuranceAgencyDialog";

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Auto Insurance Agencies
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Auto Insurance Agency
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
                <TableCell>Subsidiary</TableCell>
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
            <TableBody>
              {agencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    No auto insurance agencies yet.
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
                  <TableRow key={agency.id} hover>
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>{agency.subsidiaryName}</TableCell>
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
          </Table>
        )}
      </Paper>

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

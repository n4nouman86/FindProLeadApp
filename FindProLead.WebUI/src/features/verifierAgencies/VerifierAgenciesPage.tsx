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
import type { VerifierAgency } from "./types";
import { getVerifierAgencies } from "./verifierAgenciesApi";
import CreateVerifierAgencyDialog from "./CreateVerifierAgencyDialog";
import EditVerifierAgencyDialog from "./EditVerifierAgencyDialog";

export default function VerifierAgenciesPage() {
  const [agencies, setAgencies] = useState<VerifierAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<VerifierAgency | null>(null);

  const loadAgencies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVerifierAgencies();
      setAgencies(data);
    } catch {
      setError("Could not load verifier agencies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadAgencies();
  }, [loadAgencies]);

  function handleSaved(saved: VerifierAgency) {
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
          Verifier Agencies
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Verifier Agency
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
                <TableCell>LinkedIn</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No verifier agencies yet.
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agency) => (
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

      <CreateVerifierAgencyDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingAgency && (
        <EditVerifierAgencyDialog
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

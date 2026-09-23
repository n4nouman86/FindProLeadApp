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
  Chip,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import type { User } from "./types";
import type { VerifierCompany } from "../verifierCompanies/types";
import type { AutoInsuranceAgency } from "../autoInsuranceAgencies/types";
import { getUsers } from "./usersApi";
import { getVerifierCompanies } from "../verifierCompanies/verifierCompaniesApi";
import { getAutoInsuranceAgencies } from "../autoInsuranceAgencies/autoInsuranceAgenciesApi";
import CreateUserDialog from "./CreateUserDialog";
import EditUserDialog from "./EditUserDialog";
import PageHeader from "../../shared/components/PageHeader";
import EmptyState from "../../shared/components/EmptyState";
import TableSkeleton from "../../shared/components/TableSkeleton";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [verifierCompanies, setVerifierCompanies] = useState<VerifierCompany[]>([]);
  const [clientAgencies, setClientAgencies] = useState<AutoInsuranceAgency[]>([]);

  const getOrganizationName = (user: User) => {
    const verifierName = verifierCompanies.find((item) => item.id === user.verifierCompanyId)?.name;
    const clientName = clientAgencies.find((item) => item.id === user.autoInsuranceAgencyId)?.name;

    if (user.role === "Admin") return "Admin";
    if (user.role === "Verifier Manager") return verifierName ? `Verifier Manager: ${verifierName}` : "Verifier Manager";
    if (user.role === "Agency Manager") return clientName ? `Agency Manager: ${clientName}` : "Agency Manager";
    if (verifierName) return `Verifier Manager: ${verifierName}`;
    if (clientName) return `Agency Manager: ${clientName}`;
    return "No Role";
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.trim()?.charAt(0)?.toUpperCase() ?? "";
    const lastInitial = lastName?.trim()?.charAt(0)?.toUpperCase() ?? "";
    return `${firstInitial}${lastInitial}` || "U";
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadUsers();
    getVerifierCompanies().then(setVerifierCompanies).catch(() => setVerifierCompanies([]));
    getAutoInsuranceAgencies().then(setClientAgencies).catch(() => setClientAgencies([]));
  }, [loadUsers]);

  function handleSaved(saved: User) {
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === saved.id);
      return exists
        ? prev.map((u) => (u.id === saved.id ? saved : u))
        : [saved, ...prev];
    });
  }

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage user accounts, roles and organization access."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            Add User
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton columns={6} />
          ) : (
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                    <EmptyState
                      icon={<PeopleAltOutlinedIcon />}
                      title="No users yet"
                      subtitle='Click "Add User" to create your first user.'
                    />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: "0.8rem",
                            bgcolor: user.role === "Admin" ? "primary.main" : user.role === "Verifier Manager" ? "secondary.main" : user.role === "Agency Manager" ? "warning.main" : "grey.500",
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>{user.firstName} {user.lastName}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getOrganizationName(user)}
                        color={
                          user.role === "Admin"
                            ? "primary"
                            : user.role === "Verifier Manager"
                              ? "secondary"
                              : user.role === "Agency Manager"
                                ? "warning"
                                : "default"
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isLocked ? "Locked" : "Active"}
                        color={user.isLocked ? "error" : "success"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdOn).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditingUser(user)}>
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

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />

      {editingUser && (
        <EditUserDialog
          key={editingUser.id}
          open={Boolean(editingUser)}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
}

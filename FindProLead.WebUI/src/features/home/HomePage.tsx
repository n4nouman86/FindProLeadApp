import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useAuth } from "../auth/useAuth";
import StatCard from "./StatCard";
import { getUsers } from "../users/usersApi";
import { getSubsidiaryCompanies } from "../subsidiaryCompanies/subsidiaryCompaniesApi";
import { getVerifierCompanies } from "../verifierCompanies/verifierCompaniesApi";
import { getAutoInsuranceAgencies } from "../autoInsuranceAgencies/autoInsuranceAgenciesApi";

interface Counts {
  users?: number;
  subsidiaries?: number;
  verifiers?: number;
  agencies?: number;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getUsers(),
      getSubsidiaryCompanies(),
      getVerifierCompanies(),
      getAutoInsuranceAgencies(),
    ]).then((results) => {
      if (cancelled) return;
      const [users, subsidiaries, verifiers, agencies] = results;
      setCounts({
        users: users.status === "fulfilled" ? users.value.length : 0,
        subsidiaries: subsidiaries.status === "fulfilled" ? subsidiaries.value.length : 0,
        verifiers: verifiers.status === "fulfilled" ? verifiers.value.length : 0,
        agencies: agencies.status === "fulfilled" ? agencies.value.length : 0,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Paper
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 4,
          color: "#fff",
          background: "linear-gradient(120deg, #065f56 0%, #0d7a6f 45%, #14b8a6 100%)",
          boxShadow: "0 12px 32px rgba(13, 122, 111, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 42%)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            right: 140,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.06)",
          }}
        />
        <Box sx={{ position: "relative" }}>
          <Typography variant="overline" sx={{ opacity: 0.85 }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {getGreeting()}, {user?.firstName}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, mt: 1, maxWidth: 520 }}>
            Here&apos;s an overview of your lead operations. Manage users, partners and
            auto lead settings from one place.
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard
          label="Users"
          value={counts.users}
          loading={loading}
          icon={<PeopleIcon />}
          color="#0d9488"
        />
        <StatCard
          label="Subsidiary Companies"
          value={counts.subsidiaries}
          loading={loading}
          icon={<BusinessIcon />}
          color="#f59e0b"
        />
        <StatCard
          label="Verifier Companies"
          value={counts.verifiers}
          loading={loading}
          icon={<VerifiedUserIcon />}
          color="#e11d48"
        />
        <StatCard
          label="Auto Insurance Agencies"
          value={counts.agencies}
          loading={loading}
          icon={<ApartmentIcon />}
          color="#0284c7"
        />
      </Box>

    </Box>
  );
}

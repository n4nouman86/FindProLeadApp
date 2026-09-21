import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ShieldIcon from "@mui/icons-material/Shield";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { alpha, type Theme } from "@mui/material/styles";
import { useAuth } from "../../features/auth/useAuth";
import { useThemeMode } from "../useThemeMode";

const DRAWER_WIDTH = 264;
const DRAWER_WIDTH_COLLAPSED = 76;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Users", path: "/users", icon: <PeopleIcon /> },
  { label: "Subsidiaries", path: "/subsidiaries", icon: <BusinessIcon /> },
  { label: "Verifier Agencies", path: "/verifier-agencies", icon: <VerifiedUserIcon /> },
  { label: "Auto Insurance Agencies", path: "/auto-insurance-agencies", icon: <ApartmentIcon /> },
];

const autoLeadSettingItems = [
  { label: "Auto Insurance Companies", path: "/auto-insurance-companies", icon: <ShieldIcon /> },
  { label: "Vehicle Makes", path: "/vehicle-makes", icon: <DirectionsCarIcon /> },
  { label: "Vehicle Models", path: "/vehicle-models", icon: <TimeToLeaveIcon /> },
];

function navButtonSx(collapsed: boolean) {
  return (theme: Theme) => ({
    position: "relative",
    borderRadius: 0,
    mb: 0.25,
    px: collapsed ? 0 : 1.25,
    py: 0.75,
    gap: collapsed ? 0 : 0.75,
    justifyContent: collapsed ? "center" : "flex-start",
    color: "text.secondary",
    transition: theme.transitions.create(["background-color", "color"], {
      duration: 150,
    }),
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      justifyContent: "center",
      color: "inherit",
      "& svg": { fontSize: 20 },
    },
    "& .MuiListItemText-primary": {
      fontSize: "0.8rem",
      fontWeight: 500,
    },
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.07),
      color: "text.primary",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: 3,
      backgroundColor: "transparent",
      transition: theme.transitions.create("background-color", { duration: 150 }),
    },
    "&.Mui-selected": {
      bgcolor: alpha(theme.palette.primary.main, 0.09),
      color: "primary.main",
      "& .MuiListItemText-primary": { fontWeight: 600 },
      "&::before": { backgroundColor: theme.palette.primary.main },
      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.13) },
    },
  });
}

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        height: 64,
        px: collapsed ? 0 : 2,
        justifyContent: collapsed ? "center" : "flex-start",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2.5,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
          color: "#fff",
          boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
        }}
      >
        <TrendingUpIcon fontSize="small" />
      </Box>
      {!collapsed && (
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            FindProLead
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1 }}>
            Lead Management
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);

  function handleLogout() {
    setAnchorEl(null);
    logout();
    navigate("/login");
  }

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;
  const currentTitle = [...navItems, ...autoLeadSettingItems].find(
    (item) => item.path === location.pathname,
  )?.label;
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        <BrandMark collapsed={collapsed} />
        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
          <List sx={{ px: collapsed ? 1 : 1.5, pt: 1.5 }}>
            {!collapsed && (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ px: 1.5, display: "block", fontSize: "0.62rem" }}
              >
                Menu
              </Typography>
            )}
            {navItems.map((item) => (
              <Tooltip
                key={item.path}
                title={collapsed ? item.label : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={navButtonSx(collapsed)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            ))}

            {!collapsed && (
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ px: 1.5, mt: 1.5, display: "block", fontSize: "0.62rem" }}
              >
                Auto Lead Setting
              </Typography>
            )}
            <Tooltip title={collapsed ? "Auto Lead Setting" : ""} placement="right" arrow>
              <ListItemButton
                selected={autoLeadSettingItems.some((item) => item.path === location.pathname)}
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false);
                    setSettingsOpen(true);
                  } else {
                    setSettingsOpen((prev) => !prev);
                  }
                }}
                sx={navButtonSx(collapsed)}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Auto Lead Setting" />}
                {!collapsed &&
                  (settingsOpen ? (
                    <ExpandLessIcon fontSize="small" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" />
                  ))}
              </ListItemButton>
            </Tooltip>

            <Collapse in={settingsOpen && !collapsed} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {autoLeadSettingItems.map((item) => (
                  <ListItemButton
                    key={item.path}
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={[navButtonSx(false), { pl: 2 }]}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "fixed",
            top: -140,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(20, 184, 166, 0) 65%)",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "fixed",
            bottom: -180,
            left: 220,
            width: 380,
            height: 380,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, rgba(245, 158, 11, 0) 65%)",
          }}
        />
        <AppBar
          position="sticky"
          elevation={0}
          sx={(theme) => ({
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: alpha(theme.palette.background.default, 0.65),
            backdropFilter: "blur(18px) saturate(1.6)",
            WebkitBackdropFilter: "blur(18px) saturate(1.6)",
            color: "text.primary",
          })}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <IconButton onClick={() => setCollapsed((prev) => !prev)}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              {currentTitle && (
                <Typography
                  variant="h6"
                  sx={{ ml: 0.5, fontWeight: 700, display: { xs: "none", sm: "block" } }}
                >
                  {currentTitle}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                <IconButton onClick={toggleMode}>
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <Button
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ textTransform: "none", borderRadius: 3, px: 1, py: 0.5, gap: 1.25 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: 14,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #0d7a6f, #f59e0b)",
                  }}
                >
                  {initials}
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left" }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {user?.roles?.[0] ?? "User"}
                  </Typography>
                </Box>
              </Button>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 15,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #0d7a6f, #f59e0b)",
                  }}
                >
                  {initials}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "error.main",
                  mx: 0.5,
                  borderRadius: 2,
                  "& .MuiListItemIcon-root": { color: "error.main" },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 3.5 }, position: "relative", zIndex: 1 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

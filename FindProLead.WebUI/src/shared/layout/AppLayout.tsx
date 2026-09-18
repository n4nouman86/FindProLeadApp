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
import { useAuth } from "../../features/auth/useAuth";
import { useThemeMode } from "../useThemeMode";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

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
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <TrendingUpIcon color="primary" />
          {!collapsed && (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              FindProLead
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, pt: 1 }}>
          {navItems.map((item) => (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ""}
              placement="right"
            >
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 2, mb: 0.5, justifyContent: collapsed ? "center" : "flex-start" }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          ))}

          <Tooltip title={collapsed ? "Auto Lead Setting" : ""} placement="right">
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
              sx={{ borderRadius: 2, mb: 0.5, justifyContent: collapsed ? "center" : "flex-start" }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: "center" }}>
                <SettingsIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Auto Lead Setting" />}
              {!collapsed && (settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </Tooltip>

          <Collapse in={settingsOpen && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {autoLeadSettingItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 2, mb: 0.5, pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 40, justifyContent: "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
            <IconButton onClick={() => setCollapsed((prev) => !prev)}>
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={toggleMode}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                  {user?.firstName?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>
                {user?.firstName} {user?.lastName}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

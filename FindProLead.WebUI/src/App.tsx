import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import HomePage from "./features/home/HomePage";
import UsersPage from "./features/users/UsersPage";
import SubsidiaryCompaniesPage from "./features/subsidiaryCompanies/SubsidiaryCompaniesPage";
import VerifierCompaniesPage from "./features/verifierCompanies/VerifierCompaniesPage";
import AutoInsuranceAgenciesPage from "./features/autoInsuranceAgencies/AutoInsuranceAgenciesPage";
import AutoLeadsPage from "./features/autoLeads/AutoLeadsPage";
import AppLayout from "./shared/layout/AppLayout";
import { NotificationProvider } from "./shared/notifications/NotificationProvider";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/subsidiary-companies" element={<SubsidiaryCompaniesPage />} />
              <Route path="/verifier-companies" element={<VerifierCompaniesPage />} />
              <Route path="/auto-insurance-agencies" element={<AutoInsuranceAgenciesPage />} />
              <Route path="/auto-leads" element={<AutoLeadsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

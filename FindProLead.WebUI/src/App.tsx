import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import HomePage from "./features/home/HomePage";
import UsersPage from "./features/users/UsersPage";
import SubsidiariesPage from "./features/subsidiaries/SubsidiariesPage";
import VerifierAgenciesPage from "./features/verifierAgencies/VerifierAgenciesPage";
import AutoInsuranceAgenciesPage from "./features/autoInsuranceAgencies/AutoInsuranceAgenciesPage";
import AutoInsuranceCompaniesPage from "./features/autoInsuranceCompanies/AutoInsuranceCompaniesPage";
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
              <Route path="/subsidiaries" element={<SubsidiariesPage />} />
              <Route path="/verifier-agencies" element={<VerifierAgenciesPage />} />
              <Route path="/auto-insurance-agencies" element={<AutoInsuranceAgenciesPage />} />
              <Route path="/auto-insurance-companies" element={<AutoInsuranceCompaniesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

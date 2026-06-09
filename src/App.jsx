import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import AppLayout from './components/Layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import StartupDashboard from './pages/dashboard/StartupDashboard';
import InvestorDashboard from './pages/dashboard/InvestorDashboard';
import PartnerDashboard from './pages/dashboard/PartnerDashboard';
import OpportunityList from './pages/opportunities/OpportunityList';
import OpportunityDetail from './pages/opportunities/OpportunityDetail';
import CreateOpportunity from './pages/opportunities/CreateOpportunity';
import Wallet from './pages/Wallet';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function DashboardRouter() {
  const { user } = useAuthStore();
  switch (user?.type) {
    case 'investor': return <InvestorDashboard />;
    case 'partner': return <PartnerDashboard />;
    default: return <StartupDashboard />;
  }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected routes with app layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/opportunities" element={<OpportunityList />} />
          <Route path="/opportunities/create" element={<CreateOpportunity />} />
          <Route path="/opportunities/:id" element={<OpportunityDetail />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

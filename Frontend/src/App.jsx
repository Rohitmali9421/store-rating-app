import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import UpdatePasswordPage from './pages/UpdatePasswordPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DashboardStats from './components/admin/DashboardStats.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import StoreManagement from './components/admin/StoreManagement.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update-password"
              element={<ProtectedRoute><UpdatePasswordPage /></ProtectedRoute>}
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardStats />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="stores" element={<StoreManagement />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
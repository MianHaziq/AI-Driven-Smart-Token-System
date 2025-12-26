import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import {
  Landing,
  Login,
  Register,
  ForgotPassword,
  About,
  Contact,
  Services,
} from './pages/public';

// Customer Pages
import {
  BookToken,
  MyTokens,
  History,
  Profile as CustomerProfile,
  TokenDetails,
} from './pages/customer';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  ManageQueue,
  Analytics,
  Services as AdminServices,
  Counters,
  Users,
  Settings as AdminSettings,
  Tokens,
} from './pages/admin';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && restricted) {
    // Redirect based on role
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Customers go to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1a1a1a',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#01411C',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-token" element={<BookToken />} />

          {/* Customer Routes - Same layout as public pages */}
          <Route
            path="/customer/my-tokens"
            element={
              <ProtectedRoute allowedRoles={['user', 'customer']}>
                <MyTokens />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/history"
            element={
              <ProtectedRoute allowedRoles={['user', 'customer']}>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'customer']}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/token/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'customer']}>
                <TokenDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute restricted>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute restricted>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute restricted>
                <ForgotPassword />
              </PublicRoute>
            }
          />
        </Route>

        {/* Redirect old customer dashboard to home */}
        <Route path="/customer/dashboard" element={<Navigate to="/" replace />} />

        {/* Admin Routes with AdminLayout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tokens" element={<Tokens />} />
          <Route path="/admin/queue" element={<ManageQueue />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/counters" element={<Counters />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

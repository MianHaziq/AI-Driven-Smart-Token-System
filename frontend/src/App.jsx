import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import {
  Landing,
  Login,
  Register,
  ForgotPassword,
  About,
  Contact,
} from './pages/public';

// Customer Pages
import {
  Dashboard as CustomerDashboard,
  Services,
  BookToken,
  MyTokens,
  Profile as CustomerProfile,
  TokenDetails,
} from './pages/customer';

// Admin Pages
import {
  Dashboard as AdminDashboard,
  ManageQueue,
  Analytics,
} from './pages/admin';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  // TODO: Replace with actual auth check from Zustand store
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'customer';

  // TEMPORARY: Bypass auth for development - remove when backend is ready
  const BYPASS_AUTH = true;
  if (BYPASS_AUTH) {
    return children;
  }
  // END TEMPORARY

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children, restricted = false }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'customer';

  if (isAuthenticated && restricted) {
    // Redirect based on role
    if (userRole === 'admin' || userRole === 'superadmin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

function App() {
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
          <Route path="/contact" element={<Contact />} />
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

        {/* Customer Routes with CustomerLayout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/services" element={<Services />} />
          <Route path="/customer/book-token" element={<BookToken />} />
          <Route path="/customer/my-tokens" element={<MyTokens />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/token/:id" element={<TokenDetails />} />
        </Route>

        {/* Admin Routes with AdminLayout */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/queue" element={<ManageQueue />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHelpCircle,
  FiX,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiUsers,
  FiActivity,
} from 'react-icons/fi';
import { Sidebar } from '../components/common';
import { ROUTES } from '../utils/constants';
import useAuthStore from '../store/authStore';
import useTokenStore from '../store/tokenStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { dashboardStats, fetchDashboardStats } = useTokenStore();

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard stats on mount and every 30 seconds
  useEffect(() => {
    fetchDashboardStats();
    const statsTimer = setInterval(() => fetchDashboardStats(), 30000);
    return () => clearInterval(statsTimer);
  }, [fetchDashboardStats]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Mock notifications - would come from API in production
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Token Completed',
      message: 'Token A-045 has been completed successfully',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Queue Alert',
      message: 'Queue is getting longer. Consider opening more counters.',
      time: '15 min ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'New User Registered',
      message: 'Ali Hassan has registered as a new customer',
      time: '1 hour ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <FiClock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="px-4 lg:px-6">
              <div className="flex items-center justify-between h-16">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiMenu className="w-6 h-6" />
                  </button>

                  {/* Search - Desktop */}
                  <div className="hidden md:block w-72 lg:w-80">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tokens, users, services..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pakistan-green/20 focus:border-pakistan-green focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Search - Mobile */}
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Quick Stats - Desktop Only */}
                  <div className="hidden xl:flex items-center gap-6 pr-4 mr-2 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-pakistan-green/10 flex items-center justify-center">
                        <FiActivity className="w-4 h-4 text-pakistan-green" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Today</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {dashboardStats?.totalToday || 0} tokens
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FiUsers className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">In Queue</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {dashboardStats?.waiting || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date/Time - Desktop */}
                  <div className="hidden lg:block text-right pr-2 mr-2 border-r border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{formatTime(currentTime)}</p>
                    <p className="text-xs text-gray-500">{formatDate(currentTime)}</p>
                  </div>

                  {/* Help */}
                  <button className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiHelpCircle className="w-5 h-5" />
                  </button>

                  {/* Notifications */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiBell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <button className="text-xs text-pakistan-green hover:underline font-medium">
                              Mark all read
                            </button>
                          </div>
                          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.read ? 'bg-pakistan-green/5' : ''
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-pakistan-green rounded-full flex-shrink-0 mt-2" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <Link
                              to="/admin/notifications"
                              className="block w-full text-center text-sm text-pakistan-green font-medium hover:underline"
                            >
                              View all notifications
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative ml-1" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pakistan-green to-green-700 flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {user?.fullName?.split(' ')[0] || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize leading-tight">
                          {user?.role || 'Admin'}
                        </p>
                      </div>
                      <FiChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                        >
                          <div className="px-4 py-4 bg-gradient-to-br from-pakistan-green to-green-700">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {user?.fullName || 'Admin User'}
                                </p>
                                <p className="text-white/70 text-sm">
                                  {user?.email || 'admin@sqp.gov.pk'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="py-2">
                            <Link
                              to="/admin/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiUser className="w-4 h-4 text-gray-400" />
                              My Profile
                            </Link>
                            <Link
                              to="/admin/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiSettings className="w-4 h-4 text-gray-400" />
                              Settings
                            </Link>
                            <Link
                              to="/admin/help"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <FiHelpCircle className="w-4 h-4 text-gray-400" />
                              Help & Support
                            </Link>
                          </div>
                          <div className="py-2 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <FiLogOut className="w-4 h-4" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Mobile Search Bar */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden py-3 border-t border-gray-100"
                  >
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        autoFocus
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pakistan-green/20 focus:border-pakistan-green"
                      />
                      <button
                        onClick={() => setShowSearch(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <p className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Smart Queue Pakistan</span>
                <span className="text-gray-300">|</span>
                Admin Panel v1.0.0
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  System Online
                </span>
                <span className="text-gray-300">|</span>
                <span>{formatDate(new Date())} {formatTime(new Date())}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiList,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiLayers,
  FiMonitor,
  FiFileText,
  FiLogOut,
  FiX,
  FiGrid,
  FiClock,
  FiChevronDown,
  FiZap,
} from 'react-icons/fi';
import { ROUTES, APP_NAME } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [expandedGroups, setExpandedGroups] = useState(['main', 'management']);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  // Admin navigation with groups
  const adminNavGroups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: FiHome },
        { path: ROUTES.ANALYTICS, label: 'Analytics', icon: FiBarChart2 },
      ],
    },
    {
      id: 'queue',
      label: 'Queue Operations',
      items: [
        { path: ROUTES.MANAGE_TOKENS, label: 'All Tokens', icon: FiFileText },
        { path: ROUTES.MANAGE_QUEUE, label: 'Queue Management', icon: FiList },
        { path: ROUTES.MANAGE_COUNTERS, label: 'Counters', icon: FiMonitor },
      ],
    },
    {
      id: 'management',
      label: 'Management',
      items: [
        { path: ROUTES.MANAGE_SERVICES, label: 'Services', icon: FiGrid },
        { path: ROUTES.USER_MANAGEMENT, label: 'Users', icon: FiUsers },
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { path: ROUTES.SYSTEM_SETTINGS, label: 'Settings', icon: FiSettings },
      ],
    },
  ];

  // Customer navigation links
  const customerLinks = [
    { path: ROUTES.CUSTOMER_DASHBOARD, label: 'Dashboard', icon: FiHome },
    { path: ROUTES.BOOK_TOKEN, label: 'Book Token', icon: FiLayers },
    { path: ROUTES.MY_TOKENS, label: 'My Tokens', icon: FiList },
    { path: ROUTES.TOKEN_HISTORY, label: 'History', icon: FiClock },
    { path: ROUTES.PROFILE, label: 'Profile', icon: FiUsers },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px]
          bg-white shadow-2xl lg:shadow-none border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pakistan-green to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-pakistan-green/20">
              <FiZap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">
                SQP
              </span>
              <span className="text-lg font-bold text-pakistan-green ml-1">
                Admin
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {isAdmin ? (
            // Admin grouped navigation
            <div className="space-y-1">
              {adminNavGroups.map((group) => (
                <div key={group.id}>
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
                  >
                    {group.label}
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedGroups.includes(group.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Group Items */}
                  <AnimatePresence initial={false}>
                    {expandedGroups.includes(group.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pb-2">
                          {group.items.map((link) => (
                            <Link
                              key={link.path}
                              to={link.path}
                              onClick={onClose}
                              className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${isActive(link.path)
                                  ? 'bg-pakistan-green text-white shadow-md shadow-pakistan-green/20'
                                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                              `}
                            >
                              <link.icon className={`w-5 h-5 ${isActive(link.path) ? '' : 'text-gray-400'}`} />
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            // Customer simple navigation
            <div className="space-y-1">
              {customerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(link.path)
                      ? 'bg-pakistan-green text-white shadow-md shadow-pakistan-green/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <link.icon className={`w-5 h-5 ${isActive(link.path) ? '' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-100">
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pakistan-green to-green-700 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

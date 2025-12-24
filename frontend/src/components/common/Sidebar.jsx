import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'react-icons/fi';
import { ROUTES, APP_NAME } from '../../utils/constants';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const adminLinks = [
    { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: FiHome },
    { path: ROUTES.MANAGE_TOKENS, label: 'Tokens', icon: FiFileText },
    { path: ROUTES.USER_MANAGEMENT, label: 'Users', icon: FiUsers },
    { path: ROUTES.ANALYTICS, label: 'Analytics', icon: FiBarChart2 },
    { path: ROUTES.SYSTEM_SETTINGS, label: 'Settings', icon: FiSettings },
  ];

  const customerLinks = [
    { path: ROUTES.CUSTOMER_DASHBOARD, label: 'Dashboard', icon: FiHome },
    { path: ROUTES.BOOK_TOKEN, label: 'Book Token', icon: FiLayers },
    { path: ROUTES.MY_TOKENS, label: 'My Tokens', icon: FiList },
    { path: ROUTES.PROFILE, label: 'Profile', icon: FiUsers },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: FiSettings },
  ];

  const links = user?.role === 'admin' || user?.role === 'superadmin'
    ? adminLinks
    : customerLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px]
          bg-white shadow-xl border-r border-gray-100
          lg:relative lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between !p-4 border-b border-gray-100">
          <Link to={ROUTES.HOME} className="flex items-center !space-x-3">
            <div className="w-10 h-10 bg-gradient-pakistan rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SQ</span>
            </div>
            <div>
              <span className="text-lg font-bold text-pakistan-green">
                {APP_NAME.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden !p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="!p-4 border-b border-gray-100">
            <div className="flex items-center !space-x-3">
              <div className="w-10 h-10 rounded-full bg-pakistan-green-50 flex items-center justify-center">
                <span className="text-pakistan-green font-semibold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="!p-4 !space-y-1 flex-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`
                flex items-center !px-4 !py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(link.path)
                  ? 'bg-pakistan-green text-white shadow-md'
                  : 'text-gray-600 hover:bg-pakistan-green-50 hover:text-pakistan-green'
                }
              `}
            >
              <link.icon className="w-5 h-5 !mr-3" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="!p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center w-full !px-4 !py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5 !mr-3" />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;

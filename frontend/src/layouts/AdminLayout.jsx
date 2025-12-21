import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { Sidebar, SearchBar } from '../components/common';
import { ROUTES } from '../utils/constants';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-100 !px-4 !py-3 lg:!px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center !space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden !p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <FiMenu className="w-6 h-6" />
                </button>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:block w-64 lg:w-96">
                  <SearchBar placeholder="Search tokens, users..." />
                </div>
              </div>

              <div className="flex items-center !space-x-3">
                {/* Notifications */}
                <button className="!p-2 text-gray-500 hover:text-pakistan-green hover:bg-gray-100 rounded-lg relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Info */}
                <div className="flex items-center !space-x-3 !pl-3 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.fullName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'Administrator'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-pakistan-green flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.fullName?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto !p-4 lg:!p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

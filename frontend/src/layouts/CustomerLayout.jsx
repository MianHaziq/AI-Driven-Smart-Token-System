import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { Sidebar } from '../components/common';
import { ROUTES } from '../utils/constants';

const CustomerLayout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-100 !px-4 !py-3 lg:!px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden !p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="lg:hidden" />
              <div className="flex items-center !space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'Customer'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-pakistan-green-50 flex items-center justify-center">
                  <span className="text-pakistan-green font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
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

export default CustomerLayout;

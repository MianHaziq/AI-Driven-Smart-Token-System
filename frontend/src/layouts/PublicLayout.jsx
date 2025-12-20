import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/common';

const PublicLayout = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

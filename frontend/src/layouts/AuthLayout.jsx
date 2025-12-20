import { Outlet, Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../utils/constants';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center !py-12 !px-4 sm:!px-6 lg:!px-20 xl:!px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center !space-x-3 !mb-8">
            <div className="w-12 h-12 bg-gradient-pakistan rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">SQ</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-pakistan-green">
                {APP_NAME}
              </span>
              <p className="text-sm text-gray-500">Apki Baari, Apka Waqt</p>
            </div>
          </Link>

          {/* Form Content */}
          <Outlet />
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-pakistan">
          <div className="absolute inset-0 pattern-grid opacity-10" />
          <div className="h-full flex flex-col items-center justify-center !p-12 text-white">
            <div className="max-w-md text-center">
              {/* Illustration */}
              <div className="!mb-8">
                <svg
                  className="w-64 h-64 mx-auto opacity-90"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Queue illustration */}
                  <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.1" />
                  <circle cx="100" cy="100" r="60" fill="white" fillOpacity="0.1" />
                  <circle cx="100" cy="100" r="40" fill="white" fillOpacity="0.15" />

                  {/* People icons */}
                  <circle cx="60" cy="80" r="12" fill="white" fillOpacity="0.9" />
                  <rect x="50" y="95" width="20" height="25" rx="3" fill="white" fillOpacity="0.9" />

                  <circle cx="100" cy="70" r="14" fill="#D4AF37" />
                  <rect x="88" y="87" width="24" height="30" rx="3" fill="#D4AF37" />

                  <circle cx="140" cy="80" r="12" fill="white" fillOpacity="0.9" />
                  <rect x="130" y="95" width="20" height="25" rx="3" fill="white" fillOpacity="0.9" />

                  {/* Counter desk */}
                  <rect x="40" y="140" width="120" height="10" rx="2" fill="white" fillOpacity="0.3" />
                  <rect x="60" y="130" width="80" height="12" rx="2" fill="white" fillOpacity="0.5" />

                  {/* Token display */}
                  <rect x="80" y="40" width="40" height="20" rx="4" fill="white" fillOpacity="0.9" />
                  <text x="100" y="54" textAnchor="middle" fill="#01411C" fontSize="10" fontWeight="bold">A-001</text>
                </svg>
              </div>

              <h2 className="text-3xl font-bold !mb-4">
                Skip the Queue, Save Your Time
              </h2>
              <p className="text-lg text-white/80 !mb-8">
                Book your token online, track your position in real-time, and
                arrive just when it's your turn.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 !gap-4 text-left">
                <div className="bg-white/10 rounded-lg !p-4">
                  <div className="text-2xl !mb-2">🎯</div>
                  <h4 className="font-semibold">AI Predictions</h4>
                  <p className="text-sm text-white/70">Accurate wait times</p>
                </div>
                <div className="bg-white/10 rounded-lg !p-4">
                  <div className="text-2xl !mb-2">📍</div>
                  <h4 className="font-semibold">Live Tracking</h4>
                  <p className="text-sm text-white/70">Real-time updates</p>
                </div>
                <div className="bg-white/10 rounded-lg !p-4">
                  <div className="text-2xl !mb-2">🔔</div>
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="text-sm text-white/70">Never miss your turn</p>
                </div>
                <div className="bg-white/10 rounded-lg !p-4">
                  <div className="text-2xl !mb-2">🏛️</div>
                  <h4 className="font-semibold">All Services</h4>
                  <p className="text-sm text-white/70">NADRA, Banks & more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

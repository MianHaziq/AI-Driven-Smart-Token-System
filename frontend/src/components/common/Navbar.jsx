import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiBell,
  FiHome,
  FiInfo,
  FiMail,
  FiGrid,
  FiCreditCard,
  FiGlobe,
  FiTruck,
  FiZap,
  FiThermometer,
  FiDollarSign,
  FiClock,
  FiList,
} from 'react-icons/fi';
import { ROUTES, APP_NAME, SERVICES } from '../../utils/constants';
import useAuthStore from '../../store/authStore';

// Icon mapping for services
const serviceIconMap = {
  FiCreditCard: FiCreditCard,
  FiGlobe: FiGlobe,
  FiTruck: FiTruck,
  FiZap: FiZap,
  FiThermometer: FiThermometer,
  FiDollarSign: FiDollarSign,
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [mobileServiceExpanded, setMobileServiceExpanded] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const publicLinks = [
    { path: ROUTES.HOME, label: 'Home', icon: FiHome },
    { path: ROUTES.ABOUT, label: 'About', icon: FiInfo },
    { path: ROUTES.CONTACT, label: 'Contact', icon: FiMail },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSubServiceClick = (service, subService) => {
    setIsServicesOpen(false);
    setActiveService(null);
    setIsMenuOpen(false);
    navigate(ROUTES.BOOK_TOKEN, {
      state: {
        serviceId: service.id,
        serviceName: service.name,
        subServiceId: subService.id,
        subServiceName: subService.name,
        duration: subService.duration,
        fee: subService.fee,
      },
    });
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex items-center !space-x-3">
              <div className="w-10 h-10 bg-gradient-pakistan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SQ</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-pakistan-green">
                  {APP_NAME}
                </span>
                <p className="text-xs text-gray-500 !-mt-1">
                  Apki Baari, Apka Waqt
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center !space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  !px-4 !py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.path)
                    ? 'bg-pakistan-green !text-white'
                    : 'text-gray-600 hover:text-pakistan-green hover:bg-pakistan-green-50'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => {
                setIsServicesOpen(false);
                setActiveService(null);
              }}
            >
              <button
                className={`
                  flex items-center !px-4 !py-2 rounded-lg text-sm font-medium transition-colors
                  ${isServicesOpen
                    ? 'bg-pakistan-green !text-white'
                    : 'text-gray-600 hover:text-pakistan-green hover:bg-pakistan-green-50'
                  }
                `}
              >
                <FiGrid className="w-4 h-4 !mr-2" />
                Services
                <FiChevronDown
                  className={`w-4 h-4 !ml-1 transition-transform ${isServicesOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {/* Services Mega Menu */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 !mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="flex">
                      {/* Services List */}
                      <div className="w-1/2 !p-2 border-r border-gray-100 bg-gray-50">
                        <p className="!px-3 !py-2 text-xs font-semibold text-gray-400 uppercase">
                          Services
                        </p>
                        {SERVICES.map((service) => {
                          const IconComponent = serviceIconMap[service.icon] || FiGrid;
                          return (
                            <div
                              key={service.id}
                              onMouseEnter={() => setActiveService(service)}
                              className={`
                                flex items-center !px-3 !py-2.5 rounded-lg cursor-pointer transition-colors
                                ${activeService?.id === service.id
                                  ? 'bg-pakistan-green text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                                }
                              `}
                            >
                              <div
                                className={`
                                  w-8 h-8 rounded-lg flex items-center justify-center !mr-3
                                  ${activeService?.id === service.id
                                    ? 'bg-white/20'
                                    : service.color
                                  }
                                `}
                              >
                                <IconComponent
                                  className={`w-4 h-4 ${activeService?.id === service.id
                                      ? 'text-white'
                                      : 'text-white'
                                    }`}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{service.name}</p>
                              </div>
                              <FiChevronRight className="w-4 h-4 opacity-50" />
                            </div>
                          );
                        })}
                      </div>

                      {/* Sub-Services List */}
                      <div className="w-1/2 !p-2">
                        {activeService ? (
                          <>
                            <p className="!px-3 !py-2 text-xs font-semibold text-gray-400 uppercase">
                              {activeService.name}
                            </p>
                            <div className="!space-y-1">
                              {activeService.subServices.map((subService) => (
                                <div
                                  key={subService.id}
                                  onClick={() => handleSubServiceClick(activeService, subService)}
                                  className="!px-3 !py-2.5 rounded-lg cursor-pointer hover:bg-pakistan-green-50 transition-colors group"
                                >
                                  <p className="text-sm font-medium text-gray-700 group-hover:text-pakistan-green">
                                    {subService.name}
                                  </p>
                                  <p className="text-xs text-gray-400 flex items-center !mt-0.5">
                                    <FiClock className="w-3 h-3 !mr-1" />
                                    ~{subService.duration} mins
                                    {subService.fee > 0 && (
                                      <span className="!ml-2">
                                        Rs. {subService.fee.toLocaleString()}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            <p>Hover over a service to see options</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View All Link */}
                    <div className="border-t border-gray-100 !p-3 bg-gray-50">
                      <Link
                        to={ROUTES.SERVICES}
                        onClick={() => setIsServicesOpen(false)}
                        className="flex items-center justify-center text-sm text-pakistan-green font-medium hover:underline"
                      >
                        View All Services
                        <FiChevronRight className="w-4 h-4 !ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center !space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="!p-2 text-gray-500 hover:text-pakistan-green hover:bg-gray-100 rounded-lg relative">
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center !space-x-2 !p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-pakistan-green-50 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-pakistan-green" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.fullName?.split(' ')[0]}
                    </span>
                    <FiChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 !mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 !py-2"
                      >
                        <div className="!px-4 !py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          to={ROUTES.PROFILE}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="w-4 h-4 !mr-3" />
                          Profile
                        </Link>
                        <Link
                          to={ROUTES.MY_TOKENS}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiList className="w-4 h-4 !mr-3" />
                          My Tokens
                        </Link>
                        <Link
                          to={ROUTES.TOKEN_HISTORY}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiClock className="w-4 h-4 !mr-3" />
                          History
                        </Link>
                        <Link
                          to={ROUTES.SETTINGS}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center !px-4 !py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiSettings className="w-4 h-4 !mr-3" />
                          Settings
                        </Link>
                        <hr className="!my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full !px-4 !py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut className="w-4 h-4 !mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center !space-x-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="!px-4 !py-2 text-sm font-medium text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="!px-4 !py-2 text-sm font-medium text-white bg-pakistan-green hover:bg-pakistan-green-light rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden !p-2 text-gray-500 hover:text-pakistan-green hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="!px-4 !py-4 !space-y-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    flex items-center !px-4 !py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive(link.path)
                      ? 'bg-pakistan-green text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <link.icon className="w-5 h-5 !mr-3" />
                  {link.label}
                </Link>
              ))}

              {/* Mobile Services Section */}
              <div className="!pt-2 border-t border-gray-100">
                <p className="!px-4 !py-2 text-xs font-semibold text-gray-400 uppercase">
                  Services
                </p>
                {SERVICES.map((service) => {
                  const IconComponent = serviceIconMap[service.icon] || FiGrid;
                  const isExpanded = mobileServiceExpanded === service.id;
                  return (
                    <div key={service.id}>
                      <button
                        onClick={() =>
                          setMobileServiceExpanded(isExpanded ? null : service.id)
                        }
                        className="flex items-center justify-between w-full !px-4 !py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 ${service.color} rounded-lg flex items-center justify-center !mr-3`}
                          >
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          {service.name}
                        </div>
                        <FiChevronDown
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      {/* Sub-services */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="!ml-11 !space-y-1 !pb-2"
                          >
                            {service.subServices.map((subService) => (
                              <button
                                key={subService.id}
                                onClick={() =>
                                  handleSubServiceClick(service, subService)
                                }
                                className="block w-full text-left !px-4 !py-2 text-sm text-gray-600 hover:text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                              >
                                <p className="font-medium">{subService.name}</p>
                                <p className="text-xs text-gray-400">
                                  ~{subService.duration} mins
                                  {subService.fee > 0 &&
                                    ` • Rs. ${subService.fee.toLocaleString()}`}
                                </p>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* View All Services Link */}
                <Link
                  to={ROUTES.SERVICES}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center !px-4 !py-3 text-sm font-medium text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                >
                  <FiGrid className="w-5 h-5 !mr-3" />
                  View All Services
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

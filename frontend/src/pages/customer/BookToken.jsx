import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiPhone,
  FiNavigation,
  FiCalendar,
  FiShield,
  FiStar,
  FiZap,
  FiCreditCard,
  FiGlobe,
  FiTruck,
  FiThermometer,
  FiDollarSign,
  FiGrid,
} from 'react-icons/fi';
import { Button, Card, Badge, SearchBar } from '../../components/common';
import { ROUTES, SERVICES } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';
import centersData from '../../data/centers.json';
import useAuthStore from '../../store/authStore';
import useTokenStore from '../../store/tokenStore';
import toast from 'react-hot-toast';

// Cities for selection
const CITIES = [
  { id: 'lahore', name: 'Lahore', province: 'Punjab' },
  { id: 'karachi', name: 'Karachi', province: 'Sindh' },
  { id: 'islamabad', name: 'Islamabad', province: 'ICT' },
];

// Icon mapping for services
const serviceIconMap = {
  FiCreditCard: FiCreditCard,
  FiGlobe: FiGlobe,
  FiTruck: FiTruck,
  FiZap: FiZap,
  FiThermometer: FiThermometer,
  FiDollarSign: FiDollarSign,
};

const BookToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { bookToken } = useTokenStore();

  const preSelectedService = location.state;

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubService, setSelectedSubService] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [enableLocation, setEnableLocation] = useState(true);

  // Load centers and add dynamic data
  useEffect(() => {
    const loadedCenters = centersData.centers.map(center => ({
      ...center,
      queueLength: Math.floor(Math.random() * 30) + 5,
      avgWaitTime: Math.floor(Math.random() * 50) + 15,
      distance: (Math.random() * 10 + 1).toFixed(1),
      isOpen: true,
      rating: (Math.random() * 1 + 4).toFixed(1),
    }));
    setCenters(loadedCenters);
  }, []);

  // Handle pre-selected service from navigation
  useEffect(() => {
    if (preSelectedService?.serviceId && !preSelectedService.resumeBooking) {
      const service = SERVICES.find(s => s.id === preSelectedService.serviceId);
      if (service) {
        setSelectedService(service);
        if (preSelectedService.subServiceId) {
          const subService = service.subServices.find(
            ss => ss.id === preSelectedService.subServiceId
          );
          if (subService) {
            setSelectedSubService(subService);
            setStep(3); // Go to city selection
          } else {
            setStep(2); // Go to sub-service selection
          }
        } else {
          setStep(2);
        }
      }
    }
  }, [preSelectedService]);

  // Handle resume booking after login
  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking && isAuthenticated && location.state?.resumeBooking) {
      const booking = JSON.parse(pendingBooking);
      setSelectedService(booking.service);
      setSelectedSubService(booking.subService);
      setSelectedCity(booking.city);
      setSelectedCenter(booking.center);
      setStep(5);
      localStorage.removeItem('pendingBooking');
      toast.success('Welcome back! Complete your booking below.');
    }
  }, [isAuthenticated, location.state]);

  // Filter centers by city and service category
  const filteredCenters = centers.filter((center) => {
    const matchesCity = selectedCity ?
      center.city.toLowerCase() === selectedCity.name.toLowerCase() : true;
    const matchesService = selectedService ?
      center.serviceCategory === selectedService.id : true;
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesService && matchesSearch;
  });

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSelectedSubService(null);
    setSelectedCity(null);
    setSelectedCenter(null);
    setStep(2);
  };

  const handleSelectSubService = (subService) => {
    setSelectedSubService(subService);
    setStep(3);
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSelectedCenter(null);
    setStep(4);
  };

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    setStep(5);
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Clear location state after initial load
  useEffect(() => {
    if (location.state && !location.state.resumeBooking) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms of service');
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem('pendingBooking', JSON.stringify({
        service: selectedService,
        subService: selectedSubService,
        city: selectedCity,
        center: selectedCenter,
      }));

      toast('Please login to complete your booking', { icon: '🔐' });

      navigate(ROUTES.LOGIN, {
        state: {
          from: ROUTES.BOOK_TOKEN,
          message: 'Login required to book token'
        }
      });
      return;
    }

    setLoading(true);
    try {
      // Call the API to book token
      const result = await bookToken(selectedSubService.id, 'normal');

      if (result.success) {
        // Combine API response with local selection data for display
        const bookedTokenData = {
          ...result.token,
          tokenNumber: result.token?.tokenNumber || `${selectedService.id.charAt(0).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
          position: result.token?.position || Math.floor(Math.random() * 10) + 1,
          estimatedWait: result.token?.estimatedWaitTime || selectedSubService.duration,
          service: selectedService,
          subService: selectedSubService,
          city: selectedCity,
          center: selectedCenter,
          bookedAt: result.token?.createdAt || new Date(),
        };

        setBookedToken(bookedTokenData);
        setStep(6);
        toast.success('Token booked successfully!');
      } else {
        toast.error(result.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Service', icon: FiGrid },
    { num: 2, label: 'Type', icon: FiZap },
    { num: 3, label: 'City', icon: FiMapPin },
    { num: 4, label: 'Center', icon: FiNavigation },
    { num: 5, label: 'Confirm', icon: FiShield },
    { num: 6, label: 'Done', icon: FiCheck },
  ];

  const getWaitTimeColor = (waitTime) => {
    if (waitTime <= 15) return 'text-green-600 bg-green-50';
    if (waitTime <= 30) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-pakistan">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-4">
              <FiZap className="w-4 h-4 mr-2 text-gold" />
              Quick & Easy Token Booking
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Book Your Token
            </h1>
            <p className="text-white/80 max-w-md mx-auto">
              Skip the queue and save time with our smart booking system
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center">
              {steps.slice(0, 5).map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: step >= s.num ? 1 : 0.9 }}
                    className="relative"
                  >
                    <div
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-300
                        ${step >= s.num
                          ? 'bg-white text-pakistan-green shadow-lg shadow-white/20'
                          : 'bg-white/10 text-white/50'
                        }
                        ${step === s.num ? 'ring-4 ring-gold/50' : ''}
                      `}
                    >
                      {step > s.num ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    {step === s.num && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full"
                      />
                    )}
                  </motion.div>
                  {index < 4 && (
                    <div className="relative w-8 sm:w-16 lg:w-20 mx-1">
                      <div className="h-1 bg-white/20 rounded-full" />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: step > s.num ? '100%' : '0%' }}
                        className="absolute top-0 left-0 h-1 bg-white rounded-full"
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 px-2 sm:px-0 max-w-lg mx-auto">
              {steps.slice(0, 5).map((s) => (
                <span
                  key={s.num}
                  className={`text-xs sm:text-sm transition-all ${
                    step >= s.num ? 'text-white font-medium' : 'text-white/50'
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <Card.Header border={false}>
                  <Card.Title subtitle="What service do you need?">
                    <span className="flex items-center gap-2">
                      <FiGrid className="w-5 h-5 text-pakistan-green" />
                      Select Service
                    </span>
                  </Card.Title>
                </Card.Header>

                <div className="grid gap-4 sm:grid-cols-2">
                  {SERVICES.map((service, index) => {
                    const IconComponent = serviceIconMap[service.icon] || FiGrid;
                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectService(service)}
                        className={`
                          group relative p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
                          hover:shadow-lg hover:shadow-pakistan-green/10
                          ${selectedService?.id === service.id
                            ? 'border-pakistan-green bg-pakistan-green-50/50'
                            : 'border-gray-100 hover:border-pakistan-green/50 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{service.emoji}</span>
                              <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                                {service.name}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {service.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {service.subServices.length} services available
                            </p>
                          </div>
                          <div className="flex-shrink-0 self-center">
                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Select Sub-Service */}
          {step === 2 && selectedService && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <Card.Header border={false}>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FiArrowLeft}
                      onClick={handleGoBack}
                      className="!p-2"
                    />
                    <Card.Title subtitle={selectedService.name}>
                      <span className="flex items-center gap-2">
                        <FiZap className="w-5 h-5 text-pakistan-green" />
                        Select Service Type
                      </span>
                    </Card.Title>
                  </div>
                </Card.Header>

                {/* Selected Service Banner */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className={`w-10 h-10 ${selectedService.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{selectedService.emoji}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedService.name}</p>
                    <p className="text-sm text-gray-500">{selectedService.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedService.subServices.map((subService, index) => (
                    <motion.div
                      key={subService.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectSubService(subService)}
                      className={`
                        group p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
                        hover:shadow-md
                        ${selectedSubService?.id === subService.id
                          ? 'border-pakistan-green bg-pakistan-green-50/50'
                          : 'border-gray-100 hover:border-pakistan-green/50 bg-white'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 group-hover:text-pakistan-green">
                          {subService.name}
                        </h3>
                        {subService.fee > 0 && (
                          <Badge variant="info" size="sm">
                            Rs. {subService.fee.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          ~{subService.duration} mins
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Select City */}
          {step === 3 && selectedSubService && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <Card.Header border={false}>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FiArrowLeft}
                      onClick={handleGoBack}
                      className="!p-2"
                    />
                    <Card.Title subtitle="Where are you located?">
                      <span className="flex items-center gap-2">
                        <FiMapPin className="w-5 h-5 text-pakistan-green" />
                        Select City
                      </span>
                    </Card.Title>
                  </div>
                </Card.Header>

                {/* Selected Service Summary */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className={`w-10 h-10 ${selectedService.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{selectedService.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedSubService.name}</p>
                    <p className="text-sm text-gray-500">{selectedService.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">~{selectedSubService.duration} mins</p>
                    {selectedSubService.fee > 0 && (
                      <p className="font-medium text-pakistan-green">Rs. {selectedSubService.fee.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {CITIES.map((city, index) => (
                    <motion.div
                      key={city.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSelectCity(city)}
                      className={`
                        group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300
                        hover:shadow-lg text-center
                        ${selectedCity?.id === city.id
                          ? 'border-pakistan-green bg-pakistan-green-50/50'
                          : 'border-gray-100 hover:border-pakistan-green/50 bg-white'
                        }
                      `}
                    >
                      <div className={`
                        w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all
                        ${selectedCity?.id === city.id
                          ? 'bg-pakistan-green text-white'
                          : 'bg-pakistan-green-50 text-pakistan-green group-hover:bg-pakistan-green group-hover:text-white'
                        }
                      `}>
                        <FiMapPin className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-pakistan-green">
                        {city.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{city.province}</p>

                      {/* Center count */}
                      <p className="text-xs text-gray-400 mt-3">
                        {centers.filter(c =>
                          c.city.toLowerCase() === city.name.toLowerCase() &&
                          c.serviceCategory === selectedService.id
                        ).length} centers available
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Select Service Center */}
          {step === 4 && selectedCity && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <Card.Header border={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={FiArrowLeft}
                        onClick={handleGoBack}
                        className="!p-2"
                      />
                      <Card.Title subtitle={`${selectedService.name} in ${selectedCity.name}`}>
                        <span className="flex items-center gap-2">
                          <FiNavigation className="w-5 h-5 text-pakistan-green" />
                          Select Center
                        </span>
                      </Card.Title>
                    </div>
                    <Badge variant="info" className="hidden sm:flex">
                      {filteredCenters.length} Centers
                    </Badge>
                  </div>
                </Card.Header>

                {/* Selection Summary */}
                <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-xl mb-6">
                  <Badge variant="success" className="flex items-center gap-1">
                    <span>{selectedService.emoji}</span> {selectedService.name}
                  </Badge>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                  <Badge variant="info">{selectedSubService.name}</Badge>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                  <Badge variant="warning" className="flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" /> {selectedCity.name}
                  </Badge>
                </div>

                <SearchBar
                  placeholder="Search by center name or location..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="mb-6"
                />

                <div className="space-y-4">
                  {filteredCenters.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No centers found in {selectedCity.name}</p>
                      <p className="text-sm text-gray-400 mt-1">Try selecting a different city</p>
                    </div>
                  ) : (
                    filteredCenters.map((center, index) => (
                      <motion.div
                        key={center.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectCenter(center)}
                        className={`
                          group relative p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
                          hover:shadow-lg hover:shadow-pakistan-green/10
                          ${selectedCenter?.id === center.id
                            ? 'border-pakistan-green bg-pakistan-green-50/50'
                            : 'border-gray-100 hover:border-pakistan-green/50 bg-white'
                          }
                        `}
                      >
                        {/* Status indicator */}
                        <div className="absolute top-4 right-4">
                          <Badge variant={center.isOpen ? 'success' : 'danger'} dot>
                            {center.isOpen ? 'Open Now' : 'Closed'}
                          </Badge>
                        </div>

                        <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            <div className={`
                              w-14 h-14 rounded-xl flex items-center justify-center transition-all
                              ${selectedCenter?.id === center.id
                                ? 'bg-pakistan-green text-white'
                                : 'bg-pakistan-green-50 text-pakistan-green group-hover:bg-pakistan-green group-hover:text-white'
                              }
                            `}>
                              <FiMapPin className="w-6 h-6" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-pakistan-green transition-colors">
                                  {center.name}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <FiNavigation className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                  <span className="truncate">{center.address}</span>
                                </p>
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <FiUsers className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">{center.queueLength} in queue</span>
                              </div>
                              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${getWaitTimeColor(center.avgWaitTime)}`}>
                                <FiClock className="w-4 h-4" />
                                <span className="text-sm font-medium">~{center.avgWaitTime} min</span>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                <FiStar className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700">{center.rating}</span>
                              </div>
                            </div>

                            {/* Contact Info */}
                            {(center.phone || center.hours) && (
                              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                                {center.phone && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FiPhone className="w-3.5 h-3.5 mr-1.5" />
                                    {center.phone}
                                  </span>
                                )}
                                {center.hours && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FiClock className="w-3.5 h-3.5 mr-1.5" />
                                    {center.hours}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 self-center">
                            <div className={`
                              w-10 h-10 rounded-xl flex items-center justify-center transition-all
                              ${selectedCenter?.id === center.id
                                ? 'bg-pakistan-green text-white'
                                : 'bg-gray-100 text-gray-400 group-hover:bg-pakistan-green group-hover:text-white'
                              }
                            `}>
                              <FiArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Confirm Booking */}
          {step === 5 && selectedCenter && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <Card.Header border={false}>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={FiArrowLeft}
                      onClick={handleGoBack}
                      className="!p-2"
                    />
                    <Card.Title>
                      <span className="flex items-center gap-2">
                        <FiShield className="w-5 h-5 text-pakistan-green" />
                        Confirm Booking
                      </span>
                    </Card.Title>
                  </div>
                </Card.Header>

                <div className="space-y-6">
                  {/* Booking Summary Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pakistan-green/5 rounded-full blur-2xl" />

                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <FiCalendar className="w-5 h-5 text-pakistan-green" />
                      Booking Summary
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${selectedService.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-lg">{selectedService.emoji}</span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                            <p className="font-medium text-gray-900">{selectedService.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center">
                            <FiZap className="w-5 h-5 text-pakistan-green" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Type</p>
                            <p className="font-medium text-gray-900">{selectedSubService.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FiMapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">City</p>
                            <p className="font-medium text-gray-900">{selectedCity.name}, {selectedCity.province}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center">
                            <FiNavigation className="w-5 h-5 text-pakistan-green" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Center</p>
                            <p className="font-medium text-gray-900">{selectedCenter.name}</p>
                            <p className="text-sm text-gray-500">{selectedCenter.address}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <FiClock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Wait</p>
                            <p className="font-medium text-amber-600">~{formatDuration(selectedCenter.avgWaitTime)}</p>
                          </div>
                        </div>
                      </div>

                      {selectedSubService.fee > 0 && (
                        <div className="flex items-center justify-between py-4 bg-pakistan-green-50/50 rounded-xl px-4 -mx-2">
                          <span className="font-medium text-gray-700">Service Fee</span>
                          <span className="text-2xl font-bold text-pakistan-green">
                            Rs. {selectedSubService.fee.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={enableLocation}
                        onChange={(e) => setEnableLocation(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-pakistan-green border-gray-300 rounded focus:ring-pakistan-green"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Enable Location Tracking</p>
                        <p className="text-sm text-gray-600">
                          Get real-time updates about when to arrive based on your distance from the center
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-pakistan-green border-gray-300 rounded focus:ring-pakistan-green"
                      />
                      <div>
                        <p className="font-medium text-gray-900">I agree to the terms of service</p>
                        <p className="text-sm text-gray-600">
                          I understand that my token will be cancelled if I don't arrive within 5 minutes of being called
                        </p>
                      </div>
                    </label>
                  </div>

                  <Button
                    fullWidth
                    size="lg"
                    loading={loading}
                    onClick={handleConfirmBooking}
                    icon={FiCheck}
                    disabled={!agreedToTerms}
                    className="!py-4 text-lg"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 6: Booking Confirmed */}
          {step === 6 && bookedToken && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="text-center py-8">
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
                    className="relative w-24 h-24 mx-auto mb-6"
                  >
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                      <FiCheck className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Token Booked Successfully!
                    </h2>
                    <p className="text-gray-600 mb-8">
                      Your token has been confirmed. Please arrive on time.
                    </p>
                  </motion.div>

                  {/* Token Display */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative bg-gradient-pakistan rounded-3xl p-8 mx-4 sm:mx-auto sm:max-w-sm mb-8 overflow-hidden"
                  >
                    <div className="absolute inset-0 pattern-grid opacity-10" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                    <div className="relative">
                      <p className="text-white/70 mb-2 text-sm uppercase tracking-wide">Your Token Number</p>
                      <motion.p
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-5xl sm:text-6xl font-bold text-white mb-6"
                      >
                        {bookedToken.tokenNumber}
                      </motion.p>

                      <div className="flex justify-center gap-8">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">{bookedToken.position}</p>
                          <p className="text-white/70 text-sm">Position</p>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">~{bookedToken.estimatedWait}m</p>
                          <p className="text-white/70 text-sm">Est. Wait</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Booking Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 rounded-2xl p-5 mx-4 sm:mx-auto sm:max-w-md mb-8 text-left space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${bookedToken.service.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-lg">{bookedToken.service.emoji}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                        <p className="font-medium text-gray-900">{bookedToken.subService.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pakistan-green rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="font-medium text-gray-900">{bookedToken.center.name}</p>
                        <p className="text-sm text-gray-500">{bookedToken.city.name}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 px-4 sm:px-0 sm:max-w-md mx-auto"
                  >
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
                      className="!py-3"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => navigate(ROUTES.MY_TOKENS)}
                      icon={FiArrowRight}
                      iconPosition="right"
                      className="!py-3"
                    >
                      Track Token
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookToken;

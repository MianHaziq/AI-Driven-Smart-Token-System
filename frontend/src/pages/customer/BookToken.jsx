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
} from 'react-icons/fi';
import { Button, Card, Badge, SearchBar } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';
import centersData from '../../data/centers.json';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const BookToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const preSelectedService = location.state;

  const [step, setStep] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [enableLocation, setEnableLocation] = useState(true);

  useEffect(() => {
    const loadedCenters = centersData.centers.map(center => ({
      ...center,
      queueLength: Math.floor(Math.random() * 30) + 5,
      avgWaitTime: Math.floor(Math.random() * 50) + 15,
      distance: (Math.random() * 10 + 1).toFixed(1),
      isOpen: true,
      rating: (Math.random() * 1 + 4).toFixed(1),
      type: getTypeFromCategory(center.serviceCategory),
    }));
    setCenters(loadedCenters);
  }, []);

  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking && isAuthenticated && location.state?.resumeBooking) {
      const booking = JSON.parse(pendingBooking);
      setSelectedCenter(booking.center);
      setSelectedService(booking.service);
      setStep(3);
      localStorage.removeItem('pendingBooking');
      toast.success('Welcome back! Complete your booking below.');
    }
  }, [isAuthenticated, location.state]);

  const getTypeFromCategory = (category) => {
    const categoryMapping = {
      'nadra': 'government',
      'passport': 'government',
      'excise': 'government',
      'banks': 'bank',
      'utilities': 'utility',
      'hospitals': 'hospital',
    };
    return categoryMapping[category] || 'other';
  };

  const servicesByCategory = {
    'nadra': [
      { id: 'cnic-new', name: 'New CNIC', nameUrdu: 'نیا شناختی کارڈ', avgTime: 15, currentWait: 25, fee: 400 },
      { id: 'cnic-renewal', name: 'CNIC Renewal', nameUrdu: 'شناختی کارڈ کی تجدید', avgTime: 10, currentWait: 20, fee: 400 },
      { id: 'cnic-modification', name: 'CNIC Modification', nameUrdu: 'شناختی کارڈ میں تبدیلی', avgTime: 15, currentWait: 30, fee: 500 },
      { id: 'family-registration', name: 'Family Registration Certificate', nameUrdu: 'خاندانی رجسٹریشن سرٹیفکیٹ', avgTime: 20, currentWait: 35, fee: 600 },
      { id: 'nicop', name: 'NICOP Application', nameUrdu: 'نائیکوپ درخواست', avgTime: 20, currentWait: 40, fee: 3000 },
      { id: 'poc', name: 'Pakistan Origin Card', nameUrdu: 'پاکستان اوریجن کارڈ', avgTime: 25, currentWait: 45, fee: 5000 },
    ],
    'passport': [
      { id: 'passport-new', name: 'New Passport', nameUrdu: 'نیا پاسپورٹ', avgTime: 30, currentWait: 45, fee: 3500 },
      { id: 'passport-renewal', name: 'Passport Renewal', nameUrdu: 'پاسپورٹ کی تجدید', avgTime: 25, currentWait: 35, fee: 3500 },
      { id: 'passport-urgent', name: 'Urgent Passport', nameUrdu: 'فوری پاسپورٹ', avgTime: 20, currentWait: 30, fee: 9000 },
      { id: 'passport-lost', name: 'Lost Passport Replacement', nameUrdu: 'گمشدہ پاسپورٹ', avgTime: 30, currentWait: 50, fee: 5000 },
      { id: 'child-passport', name: 'Child Passport', nameUrdu: 'بچوں کا پاسپورٹ', avgTime: 25, currentWait: 40, fee: 2500 },
    ],
    'excise': [
      { id: 'vehicle-registration', name: 'Vehicle Registration', nameUrdu: 'گاڑی کی رجسٹریشن', avgTime: 45, currentWait: 60, fee: 2000 },
      { id: 'vehicle-transfer', name: 'Vehicle Transfer', nameUrdu: 'گاڑی کی منتقلی', avgTime: 40, currentWait: 55, fee: 1500 },
      { id: 'driving-license-new', name: 'New Driving License', nameUrdu: 'نیا ڈرائیونگ لائسنس', avgTime: 30, currentWait: 45, fee: 1200 },
      { id: 'driving-license-renewal', name: 'Driving License Renewal', nameUrdu: 'ڈرائیونگ لائسنس کی تجدید', avgTime: 20, currentWait: 30, fee: 800 },
      { id: 'property-tax', name: 'Property Tax Payment', nameUrdu: 'پراپرٹی ٹیکس', avgTime: 15, currentWait: 20, fee: 0 },
    ],
    'electricity': [
      { id: 'new-connection', name: 'New Connection', nameUrdu: 'نیا کنکشن', avgTime: 30, currentWait: 40, fee: 5000 },
      { id: 'meter-change', name: 'Meter Change Request', nameUrdu: 'میٹر تبدیلی', avgTime: 20, currentWait: 25, fee: 1000 },
      { id: 'load-extension', name: 'Load Extension', nameUrdu: 'لوڈ ایکسٹینشن', avgTime: 25, currentWait: 35, fee: 3000 },
      { id: 'billing-complaint', name: 'Billing Complaint', nameUrdu: 'بل کی شکایت', avgTime: 15, currentWait: 20, fee: 0 },
      { id: 'connection-transfer', name: 'Connection Transfer', nameUrdu: 'کنکشن منتقلی', avgTime: 20, currentWait: 30, fee: 500 },
    ],
    'sui-gas': [
      { id: 'gas-new-connection', name: 'New Gas Connection', nameUrdu: 'نیا گیس کنکشن', avgTime: 35, currentWait: 45, fee: 8000 },
      { id: 'gas-meter-change', name: 'Meter Replacement', nameUrdu: 'میٹر تبدیلی', avgTime: 20, currentWait: 25, fee: 1500 },
      { id: 'gas-complaint', name: 'Gas Leakage Complaint', nameUrdu: 'گیس لیکیج شکایت', avgTime: 10, currentWait: 15, fee: 0 },
      { id: 'gas-bill-correction', name: 'Bill Correction', nameUrdu: 'بل کی درستی', avgTime: 15, currentWait: 20, fee: 0 },
    ],
    'banks': [
      { id: 'account-opening', name: 'Account Opening', nameUrdu: 'اکاؤنٹ کھولنا', avgTime: 30, currentWait: 20, fee: 0 },
      { id: 'atm-card', name: 'ATM/Debit Card Issuance', nameUrdu: 'اے ٹی ایم کارڈ', avgTime: 15, currentWait: 12, fee: 500 },
      { id: 'cheque-book', name: 'Cheque Book Request', nameUrdu: 'چیک بک', avgTime: 10, currentWait: 10, fee: 300 },
      { id: 'bank-statement', name: 'Bank Statement', nameUrdu: 'بینک اسٹیٹمنٹ', avgTime: 10, currentWait: 8, fee: 200 },
      { id: 'loan-inquiry', name: 'Loan Inquiry', nameUrdu: 'قرض کی معلومات', avgTime: 25, currentWait: 30, fee: 0 },
    ],
  };

  const filteredCenters = centers.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (preSelectedService?.serviceId) {
      return matchesSearch && center.serviceCategory === preSelectedService.serviceId;
    }

    return matchesSearch;
  });

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);

    if (preSelectedService?.subServiceId) {
      const categoryServices = servicesByCategory[center.serviceCategory] || [];
      const preSelected = categoryServices.find(s => s.id === preSelectedService.subServiceId);
      if (preSelected) {
        setSelectedService(preSelected);
        setStep(3);
        return;
      }
    }

    setStep(2);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep(3);
  };

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
        center: selectedCenter,
        service: selectedService,
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const token = {
        id: Math.random().toString(36).substr(2, 9),
        tokenNumber: `A-${Math.floor(Math.random() * 900) + 100}`,
        position: Math.floor(Math.random() * 10) + 1,
        estimatedWait: selectedService.currentWait,
        serviceCenter: selectedCenter,
        service: selectedService,
        bookedAt: new Date(),
      };

      setBookedToken(token);
      setStep(4);
      toast.success('Token booked successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Center', icon: FiMapPin },
    { num: 2, label: 'Choose Service', icon: FiZap },
    { num: 3, label: 'Confirm', icon: FiShield },
    { num: 4, label: 'Done', icon: FiCheck },
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
              {steps.map((s, index) => (
                <div key={s.num} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: step >= s.num ? 1 : 0.9 }}
                    className="relative"
                  >
                    <div
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-semibold transition-all duration-300
                        ${step >= s.num
                          ? 'bg-white text-pakistan-green shadow-lg shadow-white/20'
                          : 'bg-white/10 text-white/50'
                        }
                        ${step === s.num ? 'ring-4 ring-gold/50' : ''}
                      `}
                    >
                      {step > s.num ? (
                        <FiCheck className="w-6 h-6" />
                      ) : (
                        <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    {step === s.num && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full"
                      />
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="relative w-12 sm:w-20 lg:w-28 mx-1 sm:mx-2">
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
            <div className="flex justify-between mt-3 px-2 sm:px-0">
              {steps.map((s) => (
                <span
                  key={s.num}
                  className={`text-xs sm:text-sm transition-all ${
                    step >= s.num ? 'text-white font-medium' : 'text-white/50'
                  }`}
                  style={{ width: '25%', textAlign: 'center' }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6 pb-12 ">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Service Center */}
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
                  <div className="flex items-center justify-between">
                    <Card.Title subtitle="Choose a service center near you">
                      <span className="flex items-center gap-2">
                        <FiMapPin className="w-5 h-5 text-pakistan-green" />
                        Select Service Center
                      </span>
                    </Card.Title>
                    <Badge variant="info" className="hidden sm:flex">
                      {filteredCenters.length} Centers Available
                    </Badge>
                  </div>
                </Card.Header>

                {/* Pre-selected service banner */}
                {preSelectedService && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-pakistan-green-50 to-green-50 border border-pakistan-green/20 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pakistan-green rounded-xl flex items-center justify-center">
                        <FiCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pre-selected Service</p>
                        <p className="font-semibold text-pakistan-green">
                          {preSelectedService.serviceName} - {preSelectedService.subServiceName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Est. {preSelectedService.duration} mins</p>
                        {preSelectedService.fee > 0 && (
                          <p className="font-semibold text-pakistan-green">Rs. {preSelectedService.fee.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      <p className="text-gray-500">No centers found matching your search</p>
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
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <FiMapPin className="w-3.5 h-3.5" />
                                {center.distance} km
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

          {/* Step 2: Select Service */}
          {step === 2 && selectedCenter && (
            <motion.div
              key="step2"
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
                        onClick={() => setStep(1)}
                        className="!p-2"
                      />
                      <Card.Title subtitle={selectedCenter.name}>
                        <span className="flex items-center gap-2">
                          <FiZap className="w-5 h-5 text-pakistan-green" />
                          Choose Service
                        </span>
                      </Card.Title>
                    </div>
                  </div>
                </Card.Header>

                {/* Selected Center Summary */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className="w-10 h-10 bg-pakistan-green rounded-lg flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedCenter.name}</p>
                    <p className="text-sm text-gray-500">{selectedCenter.address}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${getWaitTimeColor(selectedCenter.avgWaitTime)}`}>
                    <span className="text-sm font-medium">~{selectedCenter.avgWaitTime} min wait</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {servicesByCategory[selectedCenter.serviceCategory]?.map((service, index) => (
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
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-urdu mt-0.5">
                            {service.nameUrdu}
                          </p>
                        </div>
                        {service.fee > 0 && (
                          <span className="text-lg font-bold text-pakistan-green">
                            Rs. {service.fee.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <FiClock className="w-4 h-4 text-pakistan-green" />
                          ~{service.avgTime} min service
                        </div>
                        <div className={`flex items-center gap-1.5 text-sm px-2 py-0.5 rounded ${getWaitTimeColor(service.currentWait)}`}>
                          <span className="font-medium">Wait: {formatDuration(service.currentWait)}</span>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      <div className={`
                        absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${selectedService?.id === service.id
                          ? 'border-pakistan-green bg-pakistan-green'
                          : 'border-gray-300 group-hover:border-pakistan-green'
                        }
                      `}>
                        {selectedService?.id === service.id && (
                          <FiCheck className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Confirm Booking */}
          {step === 3 && selectedCenter && selectedService && (
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
                      onClick={() => setStep(2)}
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
                          <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center">
                            <FiMapPin className="w-5 h-5 text-pakistan-green" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service Center</p>
                            <p className="font-medium text-gray-900">{selectedCenter.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center">
                            <FiNavigation className="w-5 h-5 text-pakistan-green" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                            <p className="font-medium text-gray-900">{selectedCenter.address}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center">
                            <FiZap className="w-5 h-5 text-pakistan-green" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                            <p className="font-medium text-gray-900">{selectedService.name}</p>
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
                            <p className="font-medium text-amber-600">~{formatDuration(selectedService.currentWait)}</p>
                          </div>
                        </div>
                      </div>

                      {selectedService.fee > 0 && (
                        <div className="flex items-center justify-between py-4 bg-pakistan-green-50/50 rounded-xl px-4 -mx-2">
                          <span className="font-medium text-gray-700">Service Fee</span>
                          <span className="text-2xl font-bold text-pakistan-green">
                            Rs. {selectedService.fee.toLocaleString()}
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

          {/* Step 4: Booking Confirmed */}
          {step === 4 && bookedToken && (
            <motion.div
              key="step4"
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

                  {/* Center Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 rounded-2xl p-5 mx-4 sm:mx-auto sm:max-w-md mb-8 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pakistan-green rounded-xl flex items-center justify-center">
                        <FiMapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service Center</p>
                        <p className="font-semibold text-gray-900">{selectedCenter.name}</p>
                        <p className="text-sm text-gray-500">{selectedCenter.address}</p>
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
                      onClick={() => navigate(`/token/${bookedToken.id}`)}
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

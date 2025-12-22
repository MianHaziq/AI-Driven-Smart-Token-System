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
  FiSearch,
  FiPhone,
} from 'react-icons/fi';
import { Button, Card, Badge, SearchBar, Alert } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { formatDuration } from '../../utils/helpers';
import centersData from '../../data/centers.json';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const BookToken = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Get pre-selected service from Services page navigation
  const preSelectedService = location.state;

  const [step, setStep] = useState(1);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    // Load centers from JSON and add dynamic queue data
    const loadedCenters = centersData.centers.map(center => ({
      ...center,
      queueLength: Math.floor(Math.random() * 30) + 5,
      avgWaitTime: Math.floor(Math.random() * 50) + 15,
      distance: (Math.random() * 10 + 1).toFixed(1),
      isOpen: true,
      type: getTypeFromCategory(center.serviceCategory),
    }));
    setCenters(loadedCenters);
  }, []);

  // Check for pending booking on return from login
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

  // Helper function to determine type from serviceCategory
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

  // Services by category (serviceCategory)
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

  // Filter centers based on search and pre-selected service
  const filteredCenters = centers.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());

    // If coming from Services page with pre-selected service, filter by category
    if (preSelectedService?.serviceId) {
      return matchesSearch && center.serviceCategory === preSelectedService.serviceId;
    }

    return matchesSearch;
  });

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);

    // If coming from Services page with pre-selected sub-service, auto-select it
    if (preSelectedService?.subServiceId) {
      const categoryServices = servicesByCategory[center.serviceCategory] || [];
      const preSelected = categoryServices.find(s => s.id === preSelectedService.subServiceId);
      if (preSelected) {
        setSelectedService(preSelected);
        setStep(3); // Skip to confirm step
        return;
      }
    }

    setStep(2);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep(3);
  };

  // Clear location state to prevent persistence issues on navigation
  useEffect(() => {
    if (location.state && !location.state.resumeBooking) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const handleConfirmBooking = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Save booking details to localStorage for resuming after login
      localStorage.setItem('pendingBooking', JSON.stringify({
        center: selectedCenter,
        service: selectedService,
      }));

      toast.info('Please login to complete your booking');

      // Redirect to login with return information
      navigate(ROUTES.LOGIN, {
        state: {
          from: ROUTES.BOOK_TOKEN,
          message: 'Login required to book token'
        }
      });
      return;
    }

    // User is authenticated - proceed with booking
    setLoading(true);
    try {
      // Simulate API call
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
    } catch (err) {
      console.error(err);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Center' },
    { num: 2, label: 'Choose Service' },
    { num: 3, label: 'Confirm' },
    { num: 4, label: 'Done' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="!mb-8">
        <div className="!flex !items-center !justify-center">
          {steps.map((s, index) => (
            <div key={s.num} className="!flex !items-center">
              <div
                className={`
                  w-10 h-10 rounded-full !flex !items-center !justify-center font-semibold
                  ${step >= s.num
                    ? 'bg-pakistan-green text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step > s.num ? <FiCheck className="w-5 h-5" /> : s.num}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    hidden sm:block w-20 lg:w-32 h-1 !mx-2
                    ${step > s.num ? 'bg-pakistan-green' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
        <div className="  !flex !justify-between !mt-2">
          {steps.map((s) => (
            <span
              key={s.num}
              className={`text-xs sm:text-sm ${step >= s.num ? 'text-pakistan-green font-medium' : 'text-gray-500'
                }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Service Center */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <Card.Header>
                <Card.Title subtitle="Choose a service center near you">
                  Select Service Center
                </Card.Title>
              </Card.Header>

              {/* Pre-selected service banner */}
              {preSelectedService && (
                <div className="bg-pakistan-green-50 border border-pakistan-green/20 rounded-lg !p-4 !mb-6">
                  <p className="text-sm text-gray-600 !mb-1">Selected Service</p>
                  <p className="font-semibold text-pakistan-green">
                    {preSelectedService.serviceName} - {preSelectedService.subServiceName}
                  </p>
                  <p className="text-sm text-gray-500 !mt-1">
                    Est. duration: ~{preSelectedService.duration} mins
                    {preSelectedService.fee > 0 && ` | Fee: Rs. ${preSelectedService.fee.toLocaleString()}`}
                  </p>
                </div>
              )}

              <SearchBar
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="!mb-6"
              />

              <div className="!space-y-4">
                {filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    onClick={() => handleSelectCenter(center)}
                    className={`
                      !p-4 border rounded-xl cursor-pointer transition-all
                      hover:border-pakistan-green hover:shadow-md
                      ${selectedCenter?.id === center.id
                        ? 'border-pakistan-green bg-pakistan-green-50'
                        : 'border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {center.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center !mt-1">
                          <FiMapPin className="w-4 h-4 !mr-1" />
                          {center.address}
                        </p>
                      </div>
                      <Badge variant={center.isOpen ? 'open' : 'closed'}>
                        {center.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                    <div className="flex items-center !gap-4 !mt-3 text-sm">
                      <span className="flex items-center text-gray-600">
                        <FiUsers className="w-4 h-4 !mr-1" />
                        {center.queueLength} in queue
                      </span>
                      <span className="flex items-center text-gray-600">
                        <FiClock className="w-4 h-4 !mr-1" />
                        ~{center.avgWaitTime} min wait
                      </span>
                      <span className="text-gray-500">
                        {center.distance} km away
                      </span>
                    </div>
                    {center.phone && (
                      <p className="text-xs text-gray-500 !mt-2 flex items-center">
                        <FiPhone className="w-3 h-3 !mr-1" />
                        {center.phone}
                      </p>
                    )}
                    {center.hours && (
                      <p className="text-xs text-gray-500 !mt-1 flex items-center">
                        <FiClock className="w-3 h-3 !mr-1" />
                        {center.hours}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && selectedCenter && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title subtitle={selectedCenter.name}>
                    Choose Service
                  </Card.Title>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={FiArrowLeft}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                </div>
              </Card.Header>

              <div className="!space-y-4">
                {servicesByCategory[selectedCenter.serviceCategory]?.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className={`
                      !p-4 border rounded-xl cursor-pointer transition-all
                      hover:border-pakistan-green hover:shadow-md
                      ${selectedService?.id === service.id
                        ? 'border-pakistan-green bg-pakistan-green-50'
                        : 'border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-urdu">
                          {service.nameUrdu}
                        </p>
                      </div>
                      {service.fee > 0 && (
                        <span className="text-pakistan-green font-semibold">
                          Rs. {service.fee}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center !gap-4 !mt-3 text-sm">
                      <span className="flex items-center text-gray-600">
                        <FiClock className="w-4 h-4 !mr-1" />
                        ~{service.avgTime} min service
                      </span>
                      <span className="text-amber-600 font-medium">
                        Current wait: {formatDuration(service.currentWait)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Confirm Booking */}
        {step === 3 && selectedCenter && selectedService && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>Confirm Booking</Card.Title>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={FiArrowLeft}
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                </div>
              </Card.Header>

              <div className="!space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 rounded-xl !p-6">
                  <h3 className="font-semibold text-gray-900 !mb-4">
                    Booking Summary
                  </h3>
                  <div className="!space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Center</span>
                      <span className="font-medium">{selectedCenter.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{selectedCenter.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Wait</span>
                      <span className="font-medium text-amber-600">
                        ~{formatDuration(selectedService.currentWait)}
                      </span>
                    </div>
                    {selectedService.fee > 0 && (
                      <div className="flex justify-between !pt-3 border-t">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-semibold text-pakistan-green">
                          Rs. {selectedService.fee}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Permission */}
                <Alert variant="info">
                  <strong>Enable Location</strong> to get real-time updates about
                  when to arrive based on your distance from the center.
                </Alert>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="location"
                    className="w-4 h-4 !mt-1 text-pakistan-green border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="location" className="!ml-2 text-sm text-gray-600">
                    Allow location tracking for smart arrival notifications
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 !mt-1 text-pakistan-green border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="!ml-2 text-sm text-gray-600">
                    I agree to the terms of service. I understand that my token
                    will be cancelled if I don't arrive within 5 minutes of being
                    called.
                  </label>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  loading={loading}
                  onClick={handleConfirmBooking}
                  icon={FiCheck}
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
          >
            <Card className="text-center">
              <div className="!py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto !mb-6"
                >
                  <FiCheck className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 !mb-2">
                  Token Booked Successfully!
                </h2>
                <p className="text-gray-600 !mb-8">
                  Your token has been confirmed. Please arrive on time.
                </p>

                <div className="bg-gradient-pakistan rounded-2xl !p-8 text-white !mb-8">
                  <p className="text-white/70 !mb-2">Your Token Number</p>
                  <p className="text-5xl font-bold !mb-4">
                    {bookedToken.tokenNumber}
                  </p>
                  <div className="flex justify-center !gap-8">
                    <div>
                      <p className="text-2xl font-bold">
                        {bookedToken.position}
                      </p>
                      <p className="text-white/70 text-sm">Position</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        ~{bookedToken.estimatedWait} min
                      </p>
                      <p className="text-white/70 text-sm">Est. Wait</p>
                    </div>
                  </div>
                </div>

                <div className="text-left bg-gray-50 rounded-xl !p-4 !mb-6">
                  <p className="text-sm text-gray-500 !mb-1">Service Center</p>
                  <p className="font-medium">{selectedCenter.name}</p>
                  <p className="text-sm text-gray-500">{selectedCenter.address}</p>
                </div>

                <div className="flex !gap-4">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => navigate(`/token/${bookedToken.id}`)}
                    icon={FiArrowRight}
                    iconPosition="right"
                  >
                    Track Token
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookToken;

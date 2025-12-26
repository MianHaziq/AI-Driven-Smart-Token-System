import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPlay,
  FiRefreshCw,
  FiChevronRight,
  FiMonitor,
  FiArrowLeft,
  FiMapPin,
  FiGrid,
  FiCreditCard,
  FiGlobe,
  FiTruck,
  FiZap,
  FiThermometer,
  FiDollarSign,
  FiNavigation,
  FiCoffee,
  FiActivity,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  ConfirmDialog,
  SearchBar,
  Loader,
} from '../../components/common';
import { SERVICES } from '../../utils/constants';
import centersData from '../../data/centers.json';
import useTokenStore from '../../store/tokenStore';
import useCounterStore from '../../store/counterStore';
import toast from 'react-hot-toast';

// Icon mapping for services
const serviceIconMap = {
  FiCreditCard: FiCreditCard,
  FiGlobe: FiGlobe,
  FiTruck: FiTruck,
  FiZap: FiZap,
  FiThermometer: FiThermometer,
  FiDollarSign: FiDollarSign,
};

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [step, setStep] = useState(1); // 1: Service, 2: City, 3: Center, 4: Queue Dashboard
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [localCenters, setLocalCenters] = useState([]);

  // Stores
  const {
    tokens,
    queueStats,
    isLoading: tokensLoading,
    fetchTokens,
    callNextToken,
    completeToken,
    markNoShow,
  } = useTokenStore();

  const {
    counters,
    isLoading: countersLoading,
    fetchCounters,
    updateCounterStatus,
  } = useCounterStore();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load local centers data
  useEffect(() => {
    const loadedCenters = centersData.centers.map(center => ({
      ...center,
      queueLength: Math.floor(Math.random() * 30) + 5,
      avgWaitTime: Math.floor(Math.random() * 50) + 15,
      isOpen: true,
    }));
    setLocalCenters(loadedCenters);
  }, []);

  // Fetch data when center is selected
  useEffect(() => {
    if (selectedCenter && selectedService) {
      // Pass filters for service and center
      fetchTokens({
        service: selectedService.id,
        city: selectedCenter.city,
        serviceCenter: selectedCenter.name
      });
      fetchCounters();
    }
  }, [selectedCenter, selectedService, fetchTokens, fetchCounters]);

  // Get unique cities for selected service
  const availableCities = [...new Set(
    localCenters
      .filter(c => selectedService ? c.serviceCategory === selectedService.id : true)
      .map(c => c.city)
  )].sort();

  // Filter centers by selected service and city
  const filteredCenters = localCenters.filter((center) => {
    const matchesService = selectedService ? center.serviceCategory === selectedService.id : true;
    const matchesCity = selectedCity ? center.city === selectedCity : true;
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesCity && matchesSearch;
  });

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep(2); // Go to city selection
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setStep(3); // Go to center selection
  };

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    setStep(4); // Go to queue dashboard
  };

  const handleGoBack = () => {
    if (step === 4) {
      setSelectedCenter(null);
      setStep(3);
    } else if (step === 3) {
      setSelectedCity(null);
      setStep(2);
    } else if (step === 2) {
      setSelectedService(null);
      setStep(1);
    }
  };

  const handleAction = (action, token = null, counterId = null) => {
    setSelectedToken({ ...token, counterId });
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const executeAction = async () => {
    setShowConfirm(false);

    // Prepare filters for refreshing tokens
    const filters = {
      service: selectedService?.id,
      city: selectedCenter?.city,
      serviceCenter: selectedCenter?.name
    };

    try {
      if (confirmAction === 'call') {
        const counterId = selectedToken?.counterId;
        const counter = counters.find(c => c._id === counterId || c.id === counterId);

        // Call next token - pass counter if available, and also pass center/city filters
        const result = await callNextToken(
          counter?._id || counter?.id || null,
          selectedCenter?.name || null,
          selectedCenter?.city || null
        );

        if (result.success) {
          const counterName = result.data?.counter?.name || counter?.name || 'Counter';
          toast.success(`Token ${result.data?.token?.tokenNumber} called to ${counterName}`);
          fetchTokens(filters);
          fetchCounters();
        } else {
          toast.error(result.message || 'Failed to call token');
        }
      } else if (confirmAction === 'complete') {
        const tokenId = selectedToken?._id || selectedToken?.id;
        if (tokenId) {
          const result = await completeToken(tokenId);
          if (result.success) {
            toast.success('Token completed successfully');
            fetchTokens(filters);
            fetchCounters();
          } else {
            toast.error(result.message || 'Failed to complete token');
          }
        }
      } else if (confirmAction === 'noshow') {
        const tokenId = selectedToken?._id || selectedToken?.id;
        if (tokenId) {
          const result = await markNoShow(tokenId);
          if (result.success) {
            toast.error('Token marked as no-show');
            fetchTokens(filters);
            fetchCounters();
          } else {
            toast.error(result.message || 'Failed to mark as no-show');
          }
        }
      } else if (confirmAction === 'break') {
        const counterId = selectedToken?.counterId;
        const counter = counters.find(c => c._id === counterId || c.id === counterId);

        if (counter) {
          const newStatus = counter.status === 'break' ? 'available' : 'break';
          const result = await updateCounterStatus(counter._id || counter.id, newStatus);
          if (result.success) {
            toast.success('Counter status updated');
            fetchCounters();
          } else {
            toast.error(result.message || 'Failed to update status');
          }
        }
      }
    } catch (error) {
      toast.error('Action failed');
    }

    setSelectedToken(null);
    setConfirmAction(null);
  };

  const handleRefresh = async () => {
    if (selectedCenter && selectedService) {
      await Promise.all([
        fetchTokens({
          service: selectedService.id,
          city: selectedCenter.city,
          serviceCenter: selectedCenter.name
        }),
        fetchCounters()
      ]);
    }
    toast.success('Dashboard refreshed');
  };

  const getPriorityConfig = (priority) => {
    const config = {
      normal: { color: 'bg-gray-100 text-gray-700', label: 'Normal' },
      senior: { color: 'bg-purple-100 text-purple-700', label: 'Senior' },
      disabled: { color: 'bg-blue-100 text-blue-700', label: 'PWD' },
      pwd: { color: 'bg-blue-100 text-blue-700', label: 'PWD' },
      vip: { color: 'bg-amber-100 text-amber-700', label: 'VIP' },
    };
    return config[priority] || config.normal;
  };

  const getCounterStatusConfig = (status) => {
    const config = {
      serving: { color: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-700', bg: 'bg-green-50', label: 'Serving' },
      available: { color: 'bg-blue-500', ring: 'ring-blue-200', text: 'text-blue-700', bg: 'bg-blue-50', label: 'Available' },
      break: { color: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', label: 'On Break' },
      offline: { color: 'bg-gray-400', ring: 'ring-gray-200', text: 'text-gray-500', bg: 'bg-gray-50', label: 'Offline' },
    };
    return config[status] || config.offline;
  };

  // Get waiting tokens
  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servingTokens = tokens.filter(t => t.status === 'serving');

  // Calculate stats
  const stats = {
    totalToday: queueStats?.total || tokens.length,
    currentlyWaiting: queueStats?.waiting || waitingTokens.length,
    serving: queueStats?.serving || servingTokens.length,
    completed: queueStats?.completed || 0,
  };

  // Use real counters or fallback
  const displayCounters = counters.length > 0 ? counters : [
    { id: 1, _id: '1', name: 'Counter 1', status: 'available', currentToken: null, operator: { name: 'Operator 1' }, tokensServed: 0 },
    { id: 2, _id: '2', name: 'Counter 2', status: 'available', currentToken: null, operator: { name: 'Operator 2' }, tokensServed: 0 },
  ];

  const isLoading = tokensLoading || countersLoading;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <Badge variant="success" dot>Live</Badge>
                </div>
                <p className="text-gray-600">Select a service to manage queues</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-lg font-semibold text-pakistan-green">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Service Grid */}
            <Card className="shadow-xl border-0">
              <Card.Header border={false}>
                <Card.Title subtitle="Choose a service category to manage">
                  <span className="flex items-center gap-2">
                    <FiGrid className="w-5 h-5 text-pakistan-green" />
                    Select Service
                  </span>
                </Card.Title>
              </Card.Header>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map((service, index) => {
                  const IconComponent = serviceIconMap[service.icon] || FiGrid;
                  const centerCount = localCenters.filter(c => c.serviceCategory === service.id).length;

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectService(service)}
                      className="group relative p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-pakistan-green/10 border-gray-100 hover:border-pakistan-green/50 bg-white"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{service.emoji}</span>
                            <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                              {service.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {service.subServices.length} services • {centerCount} centers
                          </p>
                        </div>
                        <div className="shrink-0 self-center">
                          <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Select City */}
        {step === 2 && selectedService && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                icon={FiArrowLeft}
                onClick={handleGoBack}
                className="!p-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedService.name}</h1>
                  <span className="text-2xl">{selectedService.emoji}</span>
                </div>
                <p className="text-gray-600">Select a city</p>
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <Card.Header border={false}>
                <Card.Title subtitle={`${availableCities.length} cities available`}>
                  <span className="flex items-center gap-2">
                    <FiMapPin className="w-5 h-5 text-pakistan-green" />
                    Select City
                  </span>
                </Card.Title>
              </Card.Header>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableCities.map((city, index) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectCity(city)}
                    className="group p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-100 hover:border-pakistan-green/50 bg-white text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-pakistan-green-50 text-pakistan-green group-hover:bg-pakistan-green group-hover:text-white transition-all">
                      <FiMapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                      {city}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {localCenters.filter(c => c.city === city && c.serviceCategory === selectedService.id).length} centers
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Select Center */}
        {step === 3 && selectedService && selectedCity && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                icon={FiArrowLeft}
                onClick={handleGoBack}
                className="!p-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedService.name}</h1>
                  <span className="text-2xl">{selectedService.emoji}</span>
                  <Badge variant="info">{selectedCity}</Badge>
                </div>
                <p className="text-gray-600">Select a center to manage queue</p>
              </div>
            </div>

            <Card className="shadow-xl border-0">
              <Card.Header border={false}>
                <div className="flex items-center justify-between">
                  <Card.Title subtitle={`${filteredCenters.length} centers available`}>
                    <span className="flex items-center gap-2">
                      <FiMapPin className="w-5 h-5 text-pakistan-green" />
                      Select Center
                    </span>
                  </Card.Title>
                </div>
              </Card.Header>

              <SearchBar
                placeholder="Search by center name, city..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="mb-6"
              />

              <div className="space-y-4">
                {filteredCenters.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No centers found for this service</p>
                  </div>
                ) : (
                  filteredCenters.map((center, index) => (
                    <motion.div
                      key={center.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectCenter(center)}
                      className="group relative p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-100 hover:border-pakistan-green/50 bg-white"
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-pakistan-green-50 text-pakistan-green group-hover:bg-pakistan-green group-hover:text-white transition-all">
                            <FiMapPin className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-pakistan-green transition-colors">
                              {center.name}
                            </h3>
                            <Badge variant={center.isOpen ? 'success' : 'danger'} dot size="sm">
                              {center.isOpen ? 'Open' : 'Closed'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center">
                            <FiNavigation className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                            {center.address}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                              <FiUsers className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{center.queueLength} in queue</span>
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">
                              <FiClock className="w-4 h-4" />
                              <span className="font-medium">~{center.avgWaitTime} min</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                              <FiMapPin className="w-3.5 h-3.5" />
                              {center.city}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 self-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 group-hover:bg-pakistan-green group-hover:text-white transition-all">
                            <FiChevronRight className="w-5 h-5" />
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

        {/* Step 4: Queue Dashboard */}
        {step === 4 && selectedCenter && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={FiArrowLeft}
                  onClick={handleGoBack}
                  className="!p-2"
                />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-gray-900">{selectedCenter.name}</h1>
                    <Badge variant="success" dot>Live</Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-lg">{selectedService.emoji}</span>
                    {selectedService.name} • {selectedCenter.city}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  icon={FiRefreshCw}
                  onClick={handleRefresh}
                  loading={isLoading}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {isLoading && tokens.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-pakistan-green-50 rounded-xl flex items-center justify-center">
                        <FiUsers className="w-5 h-5 text-pakistan-green" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
                    <p className="text-sm text-gray-500">Total Today</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                        <FiClock className="w-5 h-5 text-amber-600" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-amber-500 rounded-full"
                      />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentlyWaiting}</p>
                    <p className="text-sm text-gray-500">Waiting</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FiActivity className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.serving}</p>
                    <p className="text-sm text-gray-500">Serving</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </motion.div>
                </div>

                {/* Counters */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {displayCounters.map((counter, idx) => {
                    const statusConfig = getCounterStatusConfig(counter.status);
                    const counterId = counter._id || counter.id;

                    return (
                      <motion.div
                        key={counterId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <Card className={`overflow-hidden border-2 ${counter.status === 'serving' ? 'border-green-200' : counter.status === 'break' ? 'border-amber-200' : 'border-gray-100'} shadow-lg`}>
                          {/* Counter Header */}
                          <div className={`${statusConfig.bg} p-4 border-b ${counter.status === 'serving' ? 'border-green-200' : 'border-gray-100'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${statusConfig.color} ring-4 ${statusConfig.ring}`} />
                                <div>
                                  <h3 className="font-bold text-gray-900">{counter.name}</h3>
                                  <p className="text-xs text-gray-500">{counter.operator?.name || 'No operator'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={counter.status === 'serving' ? 'success' : counter.status === 'break' ? 'warning' : 'info'}>
                                  {statusConfig.label}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={counter.status === 'break' ? FiPlay : FiCoffee}
                                  onClick={() => handleAction('break', null, counterId)}
                                  className="!p-2"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Counter Body */}
                          <div className="p-5">
                            {counter.currentToken ? (
                              // Currently Serving
                              <div className="space-y-4">
                                <div className="text-center py-4">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Now Serving</p>
                                  <p className="text-4xl font-bold text-pakistan-green">
                                    {counter.currentToken.tokenNumber}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {counter.currentToken.customer?.fullName || 'Customer'}
                                  </p>
                                  <p className="text-xs text-gray-500">{counter.currentToken.serviceName}</p>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    fullWidth
                                    icon={FiCheckCircle}
                                    onClick={() => handleAction('complete', counter.currentToken, counterId)}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outline"
                                    icon={FiAlertCircle}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleAction('noshow', counter.currentToken, counterId)}
                                  >
                                    No Show
                                  </Button>
                                </div>
                              </div>
                            ) : counter.status === 'break' ? (
                              // On Break
                              <div className="text-center py-8">
                                <FiCoffee className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                                <p className="text-gray-600">Counter is on break</p>
                                <Button
                                  variant="outline"
                                  className="mt-4"
                                  icon={FiPlay}
                                  onClick={() => handleAction('break', null, counterId)}
                                >
                                  Resume Counter
                                </Button>
                              </div>
                            ) : (
                              // Available - Show Call Next
                              <div className="space-y-4">
                                <div className="text-center py-4">
                                  <FiMonitor className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500">No token being served</p>
                                  {waitingTokens.length > 0 && (
                                    <p className="text-sm text-pakistan-green mt-1">
                                      Next: {waitingTokens[0].tokenNumber}
                                    </p>
                                  )}
                                </div>

                                <Button
                                  fullWidth
                                  size="lg"
                                  icon={FiPlay}
                                  onClick={() => handleAction('call', null, counterId)}
                                  disabled={waitingTokens.length === 0}
                                >
                                  Call Next Token
                                </Button>
                              </div>
                            )}

                            {/* Counter Stats */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                              <span className="text-gray-500">Tokens served today</span>
                              <span className="font-semibold text-gray-900">{counter.tokensServed || 0}</span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Queue List */}
                <Card className="border-0 shadow-lg">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <Card.Title subtitle={`${waitingTokens.length} customers waiting`}>
                        <span className="flex items-center gap-2">
                          <FiUsers className="w-5 h-5 text-pakistan-green" />
                          Queue
                        </span>
                      </Card.Title>
                    </div>
                  </Card.Header>

                  <div className="space-y-3">
                    {waitingTokens.length === 0 ? (
                      <div className="text-center py-12">
                        <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No customers waiting</p>
                      </div>
                    ) : (
                      waitingTokens.map((item, index) => (
                        <motion.div
                          key={item._id || item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className={`
                            group flex items-center justify-between p-4 rounded-xl border-2 transition-all
                            ${index === 0
                              ? 'bg-pakistan-green-50 border-pakistan-green/30'
                              : 'bg-white border-gray-100 hover:border-gray-200'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm
                              ${index === 0
                                ? 'bg-pakistan-green text-white shadow-lg shadow-pakistan-green/30'
                                : 'bg-gray-100 text-pakistan-green'
                              }
                            `}>
                              {item.tokenNumber}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">
                                  {item.customer?.fullName || 'Customer'}
                                </p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityConfig(item.priority).color}`}>
                                  {getPriorityConfig(item.priority).label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">{item.serviceName || 'Service'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{item.estimatedWaitTime || '-'}m</p>
                              <p className="text-xs text-gray-500">est. wait</p>
                            </div>
                            {index === 0 && displayCounters.length > 0 && (
                              <div className="flex gap-2">
                                {displayCounters.slice(0, 2).map((counter, cIdx) => (
                                  <Button
                                    key={counter._id || counter.id}
                                    size="sm"
                                    variant={cIdx === 0 ? 'primary' : 'outline'}
                                    icon={FiPlay}
                                    onClick={() => handleAction('call', item, counter._id || counter.id)}
                                    disabled={counter.status !== 'available'}
                                  >
                                    C{cIdx + 1}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeAction}
        title={
          confirmAction === 'call' ? 'Call Token' :
          confirmAction === 'complete' ? 'Complete Token' :
          confirmAction === 'noshow' ? 'Mark as No Show' :
          confirmAction === 'break' ? 'Counter Break' :
          'Confirm Action'
        }
        message={
          confirmAction === 'call' ? 'Call next token to this counter?' :
          confirmAction === 'complete' ? 'Mark the current token as completed?' :
          confirmAction === 'noshow' ? 'Mark the current token as no-show? This action cannot be undone.' :
          confirmAction === 'break' ? 'Toggle counter break status?' :
          'Are you sure?'
        }
        confirmText={
          confirmAction === 'call' ? 'Call' :
          confirmAction === 'complete' ? 'Complete' :
          confirmAction === 'noshow' ? 'Mark No Show' :
          confirmAction === 'break' ? 'Confirm' :
          'Confirm'
        }
        variant={confirmAction === 'noshow' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default AdminDashboard;

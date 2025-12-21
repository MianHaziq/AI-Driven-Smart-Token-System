import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronRight,
  FiArrowLeft,
  FiClock,
  FiDollarSign as FiFee,
  FiCheckCircle,
} from 'react-icons/fi';
import { Card, Button } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import servicesData from '../../data/services.json';

const Services = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Load services from JSON
    setServices(servicesData.services);
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleSubServiceClick = (subService) => {
    // Navigate to book token with selected service info
    navigate(ROUTES.BOOK_TOKEN, {
      state: {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        subServiceId: subService.id,
        subServiceName: subService.name,
        duration: subService.duration,
        fee: subService.fee,
      },
    });
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex items-center !gap-4">
        <AnimatePresence>
          {selectedService && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedService ? selectedService.name : 'Our Services'}
          </h1>
          <p className="text-gray-600">
            {selectedService
              ? 'Choose a sub-service to proceed with booking'
              : 'Browse government and utility services available for booking'}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center !gap-2 text-sm text-gray-500"
        >
          <button onClick={handleBack} className="hover:text-pakistan-green">
            Services
          </button>
          <FiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{selectedService.name}</span>
        </motion.div>
      )}

      {/* Services Grid or Sub-Services */}
      <AnimatePresence mode="wait">
        {!selectedService ? (
          // Main Services Grid - 2 COLUMNS
          <motion.div
            key="services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  onClick={() => handleServiceClick(service)}
                  className="relative cursor-pointer group overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-transparent shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${service.color.replace('bg-gradient-to-br', '').trim()})`,
                  }}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm group-hover:bg-white/80 transition-all duration-300" />

                  {/* Content */}
                  <div className="relative !p-8">
                    <div className="flex items-start justify-between !gap-4">
                      {/* Icon and Info */}
                      <div className="flex items-start !gap-4 flex-1">
                        {/* 3D Emoji Icon */}
                        <div className="relative">
                          <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                            {service.icon}
                          </div>
                          {/* Glow effect */}
                          <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                            style={{ background: service.color.replace('bg-gradient-to-br', 'linear-gradient(135deg,').replace('from-', '').replace('to-', ',') + ')' }}>
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl font-bold text-gray-900 !mb-2 group-hover:text-black group-hover:bg-clip-text group-hover:bg-gradient-to-r"
                            style={{ backgroundImage: selectedService?.id === service.id ? service.color.replace('bg-gradient-to-br', 'linear-gradient(to right,') : undefined }}>
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600 !mb-4 line-clamp-2">
                            {service.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center !gap-4 text-sm">
                            <div className="flex items-center !gap-1.5 !px-3 !py-1.5 bg-pakistan-green-50 rounded-lg">
                              <FiCheckCircle className="w-4 h-4 text-pakistan-green" />
                              <span className="font-semibold text-pakistan-green">
                                {service.subServices.length} Services
                              </span>
                            </div>
                            <div className="flex items-center !gap-1.5 text-gray-500">
                              <FiClock className="w-4 h-4" />
                              <span>Quick Booking</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-pakistan-green-50 group-hover:bg-pakistan-green flex items-center justify-center transition-all duration-300">
                          <FiChevronRight className="w-5 h-5 text-pakistan-green group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: service.color.replace('bg-gradient-to-br', 'linear-gradient(to right,') }}>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Sub-Services List
          <motion.div
            key="subservices"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="!space-y-4"
          >
            {/* Service Info Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
              style={{ background: selectedService.color.replace('bg-gradient-to-br', 'linear-gradient(135deg,') }}
            >
              <div className="!p-8 text-white">
                <div className="flex items-center !gap-6">
                  {/* Icon */}
                  <div className="text-7xl drop-shadow-2xl">
                    {selectedService.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold !mb-2">{selectedService.name}</h2>
                    <p className="text-white/90 text-lg">{selectedService.description}</p>
                    <div className="!mt-4 flex items-center !gap-2">
                      <div className="!px-4 !py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <span className="font-semibold">{selectedService.subServices.length} Available Services</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </motion.div>

            {/* Sub-Services Grid */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
              {selectedService.subServices.map((subService, index) => (
                <motion.div
                  key={subService.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <div
                    onClick={() => handleSubServiceClick(subService)}
                    className="group cursor-pointer bg-white border border-gray-200 rounded-xl !p-6 hover:border-pakistan-green hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between !gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors !mb-2">
                          {subService.name}
                        </h3>
                        <p className="text-sm text-gray-600 !mb-4 line-clamp-2">
                          {subService.description}
                        </p>

                        {/* Details */}
                        <div className="flex items-center !gap-4 text-sm">
                          <div className="flex items-center !gap-1.5 text-gray-600">
                            <FiClock className="w-4 h-4 text-pakistan-green" />
                            <span className="font-medium">~{subService.duration} mins</span>
                          </div>
                          <div className="flex items-center !gap-1.5 text-gray-600">
                            <FiFee className="w-4 h-4 text-pakistan-green" />
                            <span className="font-medium">
                              {subService.fee > 0 ? `Rs. ${subService.fee.toLocaleString()}` : 'Free'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-pakistan-green flex items-center justify-center transition-all duration-300">
                          <FiChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;

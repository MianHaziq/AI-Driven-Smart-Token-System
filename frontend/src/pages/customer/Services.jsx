import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCreditCard,
  FiGlobe,
  FiTruck,
  FiZap,
  FiThermometer,
  FiDollarSign,
  FiChevronRight,
  FiArrowLeft,
  FiClock,
  FiDollarSign as FiFee,
} from 'react-icons/fi';
import { Card, Button } from '../../components/common';
import { SERVICES, ROUTES } from '../../utils/constants';

// Icon mapping for services
const iconMap = {
  FiCreditCard: FiCreditCard,
  FiGlobe: FiGlobe,
  FiTruck: FiTruck,
  FiZap: FiZap,
  FiThermometer: FiThermometer,
  FiDollarSign: FiDollarSign,
};

const Services = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

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
            {selectedService ? selectedService.name : 'Select a Service'}
          </h1>
          <p className="text-gray-600">
            {selectedService
              ? 'Choose a sub-service to proceed with booking'
              : 'Browse government and utility services'}
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
          // Main Services Grid
          <motion.div
            key="services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 !gap-4"
          >
            {SERVICES.map((service, index) => {
              const IconComponent = iconMap[service.icon] || FiCreditCard;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    className="cursor-pointer group"
                    onClick={() => handleServiceClick(service)}
                  >
                    <div className="flex items-start !gap-4">
                      <div
                        className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 !mt-1 line-clamp-2">
                          {service.description}
                        </p>
                        <p className="text-xs text-pakistan-green !mt-2">
                          {service.subServices.length} services available
                        </p>
                      </div>
                      <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pakistan-green group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          // Sub-Services List
          <motion.div
            key="subservices"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="!space-y-3"
          >
            {/* Service Info Card */}
            <Card className={`${selectedService.color} text-white`}>
              <div className="flex items-center !gap-4">
                {(() => {
                  const IconComponent = iconMap[selectedService.icon] || FiCreditCard;
                  return (
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-xl font-bold">{selectedService.name}</h2>
                  <p className="text-white/80">{selectedService.description}</p>
                </div>
              </div>
            </Card>

            {/* Sub-Services */}
            <div className="!space-y-3">
              {selectedService.subServices.map((subService, index) => (
                <motion.div
                  key={subService.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    hover
                    className="cursor-pointer group"
                    onClick={() => handleSubServiceClick(subService)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-pakistan-green transition-colors">
                          {subService.name}
                        </h3>
                        <div className="flex items-center !gap-4 !mt-2 text-sm text-gray-500">
                          <span className="flex items-center !gap-1">
                            <FiClock className="w-4 h-4" />
                            ~{subService.duration} mins
                          </span>
                          <span className="flex items-center !gap-1">
                            <FiFee className="w-4 h-4" />
                            {subService.fee > 0 ? `Rs. ${subService.fee.toLocaleString()}` : 'Free'}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        icon={FiChevronRight}
                        iconPosition="right"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Select
                      </Button>
                    </div>
                  </Card>
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

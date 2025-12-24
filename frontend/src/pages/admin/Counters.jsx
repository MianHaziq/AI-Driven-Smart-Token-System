import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMonitor,
  FiUser,
  FiClock,
  FiActivity,
  FiPause,
  FiPlay,
  FiPower,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  Modal,
  Input,
  Select,
  ConfirmDialog,
} from '../../components/common';
import toast from 'react-hot-toast';

const Counters = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const [counters, setCounters] = useState([
    {
      id: '1',
      name: 'Counter 1',
      status: 'serving',
      currentToken: 'A-096',
      operator: { id: 'op1', name: 'Ahmad Khan', avatar: 'AK' },
      tokensServed: 42,
      avgServiceTime: 12,
      services: ['nadra', 'passport'],
      startedAt: new Date(Date.now() - 3600000 * 4),
    },
    {
      id: '2',
      name: 'Counter 2',
      status: 'available',
      currentToken: null,
      operator: { id: 'op2', name: 'Fatima Ali', avatar: 'FA' },
      tokensServed: 38,
      avgServiceTime: 10,
      services: ['nadra'],
      startedAt: new Date(Date.now() - 3600000 * 3),
    },
    {
      id: '3',
      name: 'Counter 3',
      status: 'break',
      currentToken: null,
      operator: { id: 'op3', name: 'Bilal Ahmed', avatar: 'BA' },
      tokensServed: 35,
      avgServiceTime: 14,
      services: ['excise', 'banks'],
      startedAt: new Date(Date.now() - 3600000 * 5),
    },
    {
      id: '4',
      name: 'Counter 4',
      status: 'offline',
      currentToken: null,
      operator: null,
      tokensServed: 0,
      avgServiceTime: 0,
      services: ['nadra', 'passport', 'excise'],
      startedAt: null,
    },
    {
      id: '5',
      name: 'Counter 5',
      status: 'serving',
      currentToken: 'A-097',
      operator: { id: 'op4', name: 'Zainab Hassan', avatar: 'ZH' },
      tokensServed: 28,
      avgServiceTime: 15,
      services: ['passport'],
      startedAt: new Date(Date.now() - 3600000 * 2),
    },
  ]);

  const operators = [
    { value: 'op1', label: 'Ahmad Khan' },
    { value: 'op2', label: 'Fatima Ali' },
    { value: 'op3', label: 'Bilal Ahmed' },
    { value: 'op4', label: 'Zainab Hassan' },
    { value: 'op5', label: 'Usman Malik' },
  ];

  const serviceOptions = [
    { value: 'nadra', label: 'NADRA' },
    { value: 'passport', label: 'Passport' },
    { value: 'excise', label: 'Excise' },
    { value: 'banks', label: 'Banks' },
  ];

  const getStatusConfig = (status) => {
    const config = {
      serving: {
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        ring: 'ring-green-200',
        label: 'Serving',
        icon: FiActivity,
      },
      available: {
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        ring: 'ring-blue-200',
        label: 'Available',
        icon: FiCheckCircle,
      },
      break: {
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        ring: 'ring-amber-200',
        label: 'On Break',
        icon: FiPause,
      },
      offline: {
        color: 'bg-gray-400',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-500',
        ring: 'ring-gray-200',
        label: 'Offline',
        icon: FiPower,
      },
    };
    return config[status] || config.offline;
  };

  const handleAddCounter = () => {
    setSelectedCounter(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCounter = (counter) => {
    setSelectedCounter(counter);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteCounter = (counter) => {
    setSelectedCounter(counter);
    setShowDeleteConfirm(true);
  };

  const handleStatusChange = (counter, newStatus) => {
    setCounters(counters.map(c =>
      c.id === counter.id ? { ...c, status: newStatus } : c
    ));
    toast.success(`${counter.name} is now ${getStatusConfig(newStatus).label.toLowerCase()}`);
  };

  const handleSaveCounter = (formData) => {
    if (isEditing) {
      setCounters(counters.map(c =>
        c.id === selectedCounter.id ? { ...c, ...formData } : c
      ));
      toast.success('Counter updated successfully');
    } else {
      const newCounter = {
        id: Date.now().toString(),
        ...formData,
        status: 'offline',
        currentToken: null,
        tokensServed: 0,
        avgServiceTime: 0,
        startedAt: null,
      };
      setCounters([...counters, newCounter]);
      toast.success('Counter added successfully');
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    setCounters(counters.filter(c => c.id !== selectedCounter.id));
    toast.success('Counter deleted successfully');
    setShowDeleteConfirm(false);
    setSelectedCounter(null);
  };

  const stats = {
    total: counters.length,
    active: counters.filter(c => c.status === 'serving' || c.status === 'available').length,
    serving: counters.filter(c => c.status === 'serving').length,
    totalServed: counters.reduce((sum, c) => sum + c.tokensServed, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Counter Management</h1>
          <p className="text-gray-600">Manage service counters and operator assignments</p>
        </div>
        <Button icon={FiPlus} onClick={handleAddCounter}>
          Add Counter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pakistan-green-50 rounded-xl flex items-center justify-center">
              <FiMonitor className="w-6 h-6 text-pakistan-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Counters</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.serving}</p>
              <p className="text-sm text-gray-500">Currently Serving</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active Counters</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiUser className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServed}</p>
              <p className="text-sm text-gray-500">Tokens Served Today</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Counters Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {counters.map((counter, index) => {
          const statusConfig = getStatusConfig(counter.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={counter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                {/* Status Header */}
                <div className={`${statusConfig.bgColor} px-6 py-4 -mx-6 -mt-6 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusConfig.color} ring-4 ${statusConfig.ring}`} />
                      <h3 className="font-bold text-gray-900 text-lg">{counter.name}</h3>
                    </div>
                    <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Current Token */}
                {counter.currentToken && (
                  <div className="bg-gradient-pakistan rounded-xl p-4 mb-4 text-center">
                    <p className="text-white/70 text-xs uppercase tracking-wide">Now Serving</p>
                    <p className="text-3xl font-bold text-white">{counter.currentToken}</p>
                  </div>
                )}

                {/* Operator */}
                <div className="flex items-center gap-3 mb-4">
                  {counter.operator ? (
                    <>
                      <div className="w-10 h-10 bg-pakistan-green rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{counter.operator.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{counter.operator.name}</p>
                        <p className="text-xs text-gray-500">Operator</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <span className="text-sm">No operator assigned</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-pakistan-green">{counter.tokensServed}</p>
                    <p className="text-xs text-gray-500">Served Today</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-gray-900">{counter.avgServiceTime}m</p>
                    <p className="text-xs text-gray-500">Avg. Service</p>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {counter.services.map(service => (
                    <span
                      key={service}
                      className="px-2 py-1 bg-pakistan-green-50 text-pakistan-green text-xs font-medium rounded-full capitalize"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-1">
                    {counter.status === 'offline' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={FiPlay}
                        onClick={() => handleStatusChange(counter, 'available')}
                        className="text-green-600 hover:bg-green-50"
                      >
                        Start
                      </Button>
                    )}
                    {counter.status === 'available' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={FiPause}
                        onClick={() => handleStatusChange(counter, 'break')}
                        className="text-amber-600 hover:bg-amber-50"
                      >
                        Break
                      </Button>
                    )}
                    {counter.status === 'break' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={FiPlay}
                        onClick={() => handleStatusChange(counter, 'available')}
                        className="text-green-600 hover:bg-green-50"
                      >
                        Resume
                      </Button>
                    )}
                    {(counter.status === 'serving' || counter.status === 'available' || counter.status === 'break') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={FiPower}
                        onClick={() => handleStatusChange(counter, 'offline')}
                        className="text-gray-600 hover:bg-gray-100"
                      >
                        Stop
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCounter(counter)}
                      className="p-2 text-gray-400 hover:text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCounter(counter)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <CounterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCounter}
        counter={selectedCounter}
        isEditing={isEditing}
        operators={operators}
        serviceOptions={serviceOptions}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Counter"
        message={`Are you sure you want to delete "${selectedCounter?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// Counter Modal Component
const CounterModal = ({ isOpen, onClose, onSave, counter, isEditing, operators, serviceOptions }) => {
  const [formData, setFormData] = useState({
    name: '',
    operator: null,
    services: [],
  });

  useState(() => {
    if (counter) {
      setFormData({
        name: counter.name,
        operator: counter.operator,
        services: counter.services,
      });
    }
  }, [counter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Counter' : 'Add New Counter'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Counter Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Counter 1"
          required
        />

        <Select
          label="Assign Operator"
          options={[{ value: '', label: 'Select Operator' }, ...operators]}
          value={formData.operator?.id || ''}
          onChange={(e) => {
            const op = operators.find(o => o.value === e.target.value);
            setFormData({ ...formData, operator: op ? { id: op.value, name: op.label, avatar: op.label.split(' ').map(n => n[0]).join('') } : null });
          }}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Services
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map(service => (
              <button
                key={service.value}
                type="button"
                onClick={() => handleServiceToggle(service.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.services.includes(service.value)
                    ? 'bg-pakistan-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth>
            {isEditing ? 'Update Counter' : 'Add Counter'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Counters;

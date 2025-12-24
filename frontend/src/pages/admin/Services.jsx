import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiDollarSign,
  FiLayers,
  FiToggleLeft,
  FiToggleRight,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  Card,
  Button,
  SearchBar,
  Modal,
  Input,
  Select,
  ConfirmDialog,
  Loader,
} from '../../components/common';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nadra', label: 'NADRA' },
    { value: 'passport', label: 'Passport Office' },
    { value: 'excise', label: 'Excise & Taxation' },
    { value: 'banks', label: 'Banks' },
    { value: 'utilities', label: 'Utilities' },
  ];

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/service/read');
      setServices(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getCategoryConfig = (category) => {
    const config = {
      nadra: { color: 'bg-green-100 text-green-700', icon: '🪪' },
      passport: { color: 'bg-blue-100 text-blue-700', icon: '📘' },
      excise: { color: 'bg-purple-100 text-purple-700', icon: '🚗' },
      banks: { color: 'bg-amber-100 text-amber-700', icon: '🏦' },
      utilities: { color: 'bg-cyan-100 text-cyan-700', icon: '💡' },
    };
    return config[category] || { color: 'bg-gray-100 text-gray-700', icon: '📋' };
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nameUrdu?.includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddService = () => {
    setSelectedService(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteConfirm(true);
  };

  const handleToggleStatus = async (service) => {
    try {
      await api.patch(`/service/toggle/${service._id}`);
      toast.success(`${service.name} ${service.isActive ? 'disabled' : 'enabled'}`);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSaveService = async (formData) => {
    try {
      setSaving(true);
      if (isEditing) {
        await api.patch(`/service/update/${selectedService._id}`, formData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/service/create', formData);
        toast.success('Service added successfully');
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/service/delete/${selectedService._id}`);
      toast.success('Service deleted successfully');
      setShowDeleteConfirm(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    totalTokensToday: services.reduce((sum, s) => sum + (s.tokensToday || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600">Manage all available services and their configurations</p>
        </div>
        <Button icon={FiPlus} onClick={handleAddService}>
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pakistan-green-50 rounded-xl flex items-center justify-center">
              <FiLayers className="w-6 h-6 text-pakistan-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
              <p className="text-sm text-gray-500">Total Services</p>
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
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
              <p className="text-sm text-gray-500">Active Services</p>
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
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTokensToday}</p>
              <p className="text-sm text-gray-500">Tokens Today</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search services..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={categories}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service, index) => {
          const categoryConfig = getCategoryConfig(service.category);
          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`border-0 shadow-lg h-full ${!service.isActive ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{categoryConfig.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500 font-urdu">{service.nameUrdu}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(service)}
                      className={`p-1 rounded-lg transition-colors ${
                        service.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {service.isActive ? (
                        <FiToggleRight className="w-6 h-6" />
                      ) : (
                        <FiToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{service.avgTime} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiDollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {service.fee > 0 ? `Rs. ${service.fee}` : 'Free'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Today:</span>
                      <span className="ml-1 font-semibold text-pakistan-green">{service.tokensToday || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-semibold text-gray-900">{service.totalTokens || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 text-gray-400 hover:text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
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

      {filteredServices.length === 0 && (
        <Card className="border-0 shadow-lg text-center py-12">
          <FiLayers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No services found</p>
          <Button variant="outline" className="mt-4" onClick={handleAddService}>
            Add your first service
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <ServiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveService}
        service={selectedService}
        isEditing={isEditing}
        categories={categories.filter(c => c.value !== 'all')}
        saving={saving}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// Service Modal Component
const ServiceModal = ({ isOpen, onClose, onSave, service, isEditing, categories, saving }) => {
  const [formData, setFormData] = useState({
    name: '',
    nameUrdu: '',
    category: 'nadra',
    avgTime: 15,
    fee: 0,
    description: '',
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        nameUrdu: service.nameUrdu || '',
        category: service.category || 'nadra',
        avgTime: service.avgTime || 15,
        fee: service.fee || 0,
        description: service.description || '',
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        nameUrdu: '',
        category: 'nadra',
        avgTime: 15,
        fee: 0,
        description: '',
        isActive: true,
      });
    }
  }, [service, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Service' : 'Add New Service'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Service Name (English)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Service Name (Urdu)"
          value={formData.nameUrdu}
          onChange={(e) => setFormData({ ...formData, nameUrdu: e.target.value })}
          className="font-urdu"
        />
        <Select
          label="Category"
          options={categories}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Avg. Time (minutes)"
            type="number"
            value={formData.avgTime}
            onChange={(e) => setFormData({ ...formData, avgTime: parseInt(e.target.value) || 0 })}
            min="1"
          />
          <Input
            label="Fee (Rs.)"
            type="number"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pakistan-green/20 focus:border-pakistan-green transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-pakistan-green rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Service is active
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={saving}>
            {isEditing ? 'Update Service' : 'Add Service'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Services;

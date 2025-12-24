import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiSearch,
  FiUser,
  FiPhone,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  SearchBar,
  Select,
  Modal,
  Pagination,
  Loader,
} from '../../components/common';
import { formatDate, formatTime } from '../../utils/helpers';
import { SERVICES } from '../../utils/constants';
import useTokenStore from '../../store/tokenStore';
import toast from 'react-hot-toast';

const Tokens = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { tokens, isLoading, fetchTokens, fetchQueueStats, queueStats } = useTokenStore();

  // Fetch tokens on mount
  useEffect(() => {
    fetchTokens();
    fetchQueueStats();
  }, [fetchTokens, fetchQueueStats]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'serving', label: 'Serving' },
    { value: 'completed', label: 'Completed' },
    { value: 'no-show', label: 'No Show' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    ...SERVICES.map(s => ({ value: s.id, label: s.name })),
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const filteredTokens = tokens.filter((token) => {
    const tokenNumber = token.tokenNumber || '';
    const customerName = token.customer?.fullName || '';
    const phone = token.customer?.phoneNumber || '';
    const serviceName = token.serviceName || '';

    const matchesSearch =
      tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || token.status === statusFilter;
    const matchesService = serviceFilter === 'all' || token.service?.category === serviceFilter;

    // Date filter
    const now = new Date();
    const tokenDate = new Date(token.createdAt);
    let matchesDate = true;

    if (dateFilter === 'today') {
      matchesDate = tokenDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      matchesDate = tokenDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = tokenDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = tokenDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status) => {
    const config = {
      waiting: { variant: 'warning', icon: FiClock, label: 'Waiting' },
      serving: { variant: 'info', icon: FiRefreshCw, label: 'Serving' },
      completed: { variant: 'success', icon: FiCheckCircle, label: 'Completed' },
      'no-show': { variant: 'danger', icon: FiXCircle, label: 'No Show' },
      cancelled: { variant: 'default', icon: FiAlertCircle, label: 'Cancelled' },
    };
    return config[status] || config.waiting;
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

  const handleViewToken = (token) => {
    setSelectedToken(token);
    setShowDetailModal(true);
  };

  const handleRefresh = async () => {
    await fetchTokens();
    await fetchQueueStats();
    toast.success('Tokens refreshed');
  };

  // Stats from API or calculated
  const stats = {
    total: queueStats?.total || tokens.length,
    waiting: queueStats?.waiting || tokens.filter(t => t.status === 'waiting').length,
    serving: queueStats?.serving || tokens.filter(t => t.status === 'serving').length,
    completed: queueStats?.completed || tokens.filter(t => t.status === 'completed').length,
    noShow: tokens.filter(t => t.status === 'no-show').length,
  };

  if (isLoading && tokens.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Token Management</h1>
          <p className="text-gray-600">View and manage all tokens</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={FiDownload}>
            Export
          </Button>
          <Button icon={FiRefreshCw} onClick={handleRefresh} loading={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Tokens</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-amber-50 rounded-2xl p-5 border border-amber-100"
        >
          <p className="text-2xl font-bold text-amber-700">{stats.waiting}</p>
          <p className="text-sm text-amber-600">Waiting</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-2xl p-5 border border-blue-100"
        >
          <p className="text-2xl font-bold text-blue-700">{stats.serving}</p>
          <p className="text-sm text-blue-600">Serving</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-green-50 rounded-2xl p-5 border border-green-100"
        >
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-sm text-green-600">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 rounded-2xl p-5 border border-red-100"
        >
          <p className="text-2xl font-bold text-red-700">{stats.noShow}</p>
          <p className="text-sm text-red-600">No Show</p>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by token, customer, phone..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-36"
            />
            <Select
              options={serviceOptions}
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-36"
            />
            <Select
              options={dateOptions}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-36"
            />
          </div>
        </div>
      </Card>

      {/* Tokens Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Token</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Service</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600">Time</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTokens.map((token, index) => {
                const statusConfig = getStatusConfig(token.status);
                const StatusIcon = statusConfig.icon;
                const priorityConfig = getPriorityConfig(token.priority);

                return (
                  <motion.tr
                    key={token._id || token.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-pakistan-green rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{token.tokenNumber}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {token.customer?.fullName || 'Customer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {token.customer?.phoneNumber || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {token.serviceName || 'Service'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {token.service?.category || '-'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </Badge>
                      {token.counter && (
                        <p className="text-xs text-gray-500 mt-1">
                          Counter {token.counter.name || token.counter}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatDate(token.createdAt)}
                      </div>
                      <p className="text-xs text-gray-400">{formatTime(token.createdAt)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleViewToken(token)}
                          className="p-2 text-gray-400 hover:text-pakistan-green hover:bg-pakistan-green-50 rounded-lg transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tokens found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTokens.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Token Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Token Details"
        size="md"
      >
        {selectedToken && (
          <div className="space-y-6">
            {/* Token Header */}
            <div className="text-center p-6 bg-gradient-pakistan rounded-2xl text-white">
              <p className="text-white/70 text-sm mb-1">Token Number</p>
              <p className="text-4xl font-bold">{selectedToken.tokenNumber}</p>
              <div className="mt-3">
                <Badge variant={getStatusConfig(selectedToken.status).variant} className="inline-flex">
                  {getStatusConfig(selectedToken.status).label}
                </Badge>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Customer Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Name</p>
                    <p className="font-medium">{selectedToken.customer?.fullName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phone</p>
                    <p className="font-medium">{selectedToken.customer?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Priority</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityConfig(selectedToken.priority).color}`}>
                    {getPriorityConfig(selectedToken.priority).label}
                  </span>
                </div>
                {selectedToken.position && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Position</p>
                    <p className="font-medium">#{selectedToken.position}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Service Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Service</p>
                  <p className="font-medium">{selectedToken.serviceName || 'N/A'}</p>
                </div>
                {selectedToken.counter && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Counter</p>
                    <p className="font-medium">{selectedToken.counter.name || `Counter ${selectedToken.counter}`}</p>
                  </div>
                )}
                {selectedToken.estimatedWaitTime && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Est. Wait Time</p>
                    <p className="font-medium">{selectedToken.estimatedWaitTime} min</p>
                  </div>
                )}
                {selectedToken.actualWaitTime && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Actual Wait</p>
                    <p className="font-medium">{selectedToken.actualWaitTime} min</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiClock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Booked</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(selectedToken.createdAt)} at {formatTime(selectedToken.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedToken.calledAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <FiRefreshCw className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Called to Counter</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedToken.calledAt)} at {formatTime(selectedToken.calledAt)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedToken.serviceStartTime && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiRefreshCw className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Service Started</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedToken.serviceStartTime)} at {formatTime(selectedToken.serviceStartTime)}
                      </p>
                    </div>
                  </div>
                )}

                {selectedToken.completedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedToken.completedAt)} at {formatTime(selectedToken.completedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button fullWidth variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tokens;

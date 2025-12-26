import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiXCircle,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  SearchBar,
  Select,
  ConfirmDialog,
  Loader,
} from '../../components/common';
import { formatDuration } from '../../utils/helpers';
import useTokenStore from '../../store/tokenStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageQueue = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [counters, setCounters] = useState([]);
  const [loadingCounters, setLoadingCounters] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const { tokens, queueStats, isLoading, fetchTokens } = useTokenStore();

  // Fetch data on mount
  useEffect(() => {
    fetchTokens();
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      setLoadingCounters(true);
      const response = await api.get('/counter/read');
      setCounters(response.data || []);
    } catch (error) {
      console.error('Failed to fetch counters:', error);
    } finally {
      setLoadingCounters(false);
    }
  };

  const handleRefresh = async () => {
    await fetchTokens();
    await fetchCounters();
    toast.success('Queue refreshed');
  };

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'normal', label: 'Normal' },
    { value: 'senior', label: 'Senior Citizen' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'vip', label: 'VIP' },
  ];

  // Filter tokens
  const waitingQueue = tokens
    .filter(t => t.status === 'waiting')
    .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
    .filter(t => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        t.tokenNumber?.toLowerCase().includes(query) ||
        t.customerName?.toLowerCase().includes(query) ||
        t.customer?.fullName?.toLowerCase().includes(query)
      );
    });

  const servingTokens = tokens.filter(t => t.status === 'serving');
  const completedToday = tokens.filter(t => t.status === 'completed').slice(0, 5);

  const handleAction = (action, token) => {
    setSelectedToken(token);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const executeAction = async () => {
    if (!selectedToken) return;

    setActionLoading(true);
    try {
      if (confirmAction === 'call') {
        await api.post('/token/call-next');
        toast.success(`Token ${selectedToken.tokenNumber} called`);
      } else if (confirmAction === 'complete') {
        await api.patch(`/token/complete/${selectedToken._id}`);
        toast.success(`Token ${selectedToken.tokenNumber} completed`);
      } else if (confirmAction === 'noshow') {
        await api.patch(`/token/no-show/${selectedToken._id}`);
        toast.success(`Token ${selectedToken.tokenNumber} marked as no-show`);
      }

      // Refresh data
      await fetchTokens();
      await fetchCounters();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
      setShowConfirm(false);
      setSelectedToken(null);
      setConfirmAction(null);
    }
  };

  const handleCallNext = async () => {
    try {
      setActionLoading(true);
      const response = await api.post('/token/call-next');
      toast.success(`Token ${response.data.token?.tokenNumber} called to ${response.data.counter?.name}`);
      await fetchTokens();
      await fetchCounters();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to call next token');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (token) => {
    try {
      setActionLoading(true);
      await api.patch(`/token/complete/${token._id}`);
      toast.success(`Token ${token.tokenNumber} completed`);
      await fetchTokens();
      await fetchCounters();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete token');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNoShow = async (token) => {
    try {
      setActionLoading(true);
      await api.patch(`/token/no-show/${token._id}`);
      toast.success(`Token ${token.tokenNumber} marked as no-show`);
      await fetchTokens();
      await fetchCounters();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark no-show');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      normal: 'default',
      senior: 'warning',
      disabled: 'info',
      pwd: 'info',
      vip: 'gold',
    };
    return variants[priority] || 'default';
  };

  const getCounterStatusColor = (status) => {
    switch (status) {
      case 'serving': return 'border-green-200 bg-green-50';
      case 'available': return 'border-blue-200 bg-blue-50';
      case 'break': return 'border-amber-200 bg-amber-50';
      case 'offline': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Queue</h1>
          <p className="text-gray-600">
            {queueStats?.waiting || waitingQueue.length} waiting • {servingTokens.length} serving • {queueStats?.completed || completedToday.length} completed today
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={FiRefreshCw} onClick={handleRefresh} loading={isLoading}>
            Refresh
          </Button>
          <Button icon={FiPlay} onClick={handleCallNext} loading={actionLoading} disabled={waitingQueue.length === 0}>
            Call Next
          </Button>
        </div>
      </div>

      {/* Counter Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loadingCounters ? (
          <div className="col-span-3 flex justify-center py-8">
            <Loader />
          </div>
        ) : counters.length > 0 ? (
          counters.map((counter) => (
            <Card key={counter._id} className={getCounterStatusColor(counter.status)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{counter.name}</p>
                  <p className="text-sm text-gray-500">{counter.operator?.name || 'No operator'}</p>
                </div>
                <div className="text-right">
                  <Badge variant={counter.status === 'serving' ? 'success' : counter.status === 'available' ? 'info' : 'warning'} size="sm">
                    {counter.status}
                  </Badge>
                  {counter.currentToken && (
                    <p className="text-lg font-bold text-pakistan-green mt-1">
                      {counter.currentToken?.tokenNumber || counter.currentToken}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Tokens served today: <span className="font-medium">{counter.tokensServed || 0}</span>
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No counters configured. Add counters in Counter Management.
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by token number or customer name..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Main Queue */}
      <Card>
        <Card.Header>
          <Card.Title subtitle={`${waitingQueue.length} customers waiting`}>
            Waiting Queue
          </Card.Title>
        </Card.Header>

        <div className="space-y-3">
          {waitingQueue.length > 0 ? (
            waitingQueue.map((token, index) => (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all ${
                  index === 0 ? 'bg-pakistan-green-50 border-pakistan-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                      index === 0 ? 'bg-pakistan-green text-white' : 'bg-gray-100 text-pakistan-green'
                    }`}>
                      {token.tokenNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {token.customerName || token.customer?.fullName || 'Customer'}
                        </p>
                        <Badge variant={getPriorityBadge(token.priority)} size="sm">
                          {token.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{token.serviceName}</p>
                      <p className="text-xs text-gray-400">
                        {token.customerPhone || token.customer?.phoneNumber || ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <FiClock className="w-4 h-4 mr-1" />
                        {formatDuration(token.estimatedWaitTime || 0)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        icon={FiPlay}
                        onClick={() => handleAction('call', token)}
                        disabled={actionLoading}
                      >
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={FiXCircle}
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleAction('noshow', token)}
                        disabled={actionLoading}
                      >
                        No Show
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tokens in queue
            </div>
          )}
        </div>
      </Card>

      {/* Currently Serving */}
      {servingTokens.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Currently Serving</Card.Title>
          </Card.Header>

          <div className="space-y-3">
            {servingTokens.map((token) => (
              <div
                key={token._id}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {token.tokenNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {token.customerName || token.customer?.fullName || 'Customer'}
                    </p>
                    <p className="text-sm text-gray-500">{token.serviceName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon={FiCheckCircle}
                    onClick={() => handleComplete(token)}
                    loading={actionLoading}
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={FiXCircle}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleNoShow(token)}
                    disabled={actionLoading}
                  >
                    No Show
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title subtitle={`${completedToday.length} tokens completed`}>
              Recently Completed
            </Card.Title>
          </Card.Header>

          <div className="space-y-2">
            {completedToday.map((token) => (
              <div
                key={token._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">{token.tokenNumber}</span>
                  <span className="text-gray-500">
                    {token.customerName || token.customer?.fullName || 'Customer'}
                  </span>
                  <span className="text-sm text-gray-400">{token.serviceName}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {token.actualWaitTime && (
                    <span>Service time: {token.actualWaitTime}m</span>
                  )}
                  <Badge variant="success" size="sm">Completed</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeAction}
        title={
          confirmAction === 'call' ? 'Call Token' :
          confirmAction === 'complete' ? 'Complete Token' :
          'Mark as No Show'
        }
        message={
          confirmAction === 'call' ? `Call ${selectedToken?.tokenNumber} to the counter?` :
          confirmAction === 'complete' ? `Mark ${selectedToken?.tokenNumber} as completed?` :
          `Mark ${selectedToken?.tokenNumber} as no-show? This action cannot be undone.`
        }
        confirmText={
          confirmAction === 'call' ? 'Call' :
          confirmAction === 'complete' ? 'Complete' :
          'Mark No Show'
        }
        variant={confirmAction === 'noshow' ? 'danger' : 'warning'}
        loading={actionLoading}
      />
    </div>
  );
};

export default ManageQueue;

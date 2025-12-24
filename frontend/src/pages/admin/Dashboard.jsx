import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiPlay,
  FiSkipForward,
  FiActivity,
  FiZap,
  FiTarget,
  FiAward,
  FiRefreshCw,
  FiChevronRight,
  FiMonitor,
  FiBell,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  ConfirmDialog,
} from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const stats = {
    totalToday: 156,
    currentlyWaiting: 23,
    avgWaitTime: 18,
    noShows: 5,
    completed: 128,
    efficiency: 94,
  };

  const currentServing = {
    tokenNumber: 'A-096',
    customerName: 'Muhammad Ali',
    service: 'CNIC Renewal',
    counter: 1,
    startedAt: new Date(Date.now() - 300000),
    phone: '0300-1234567',
    priority: 'normal',
  };

  const queue = [
    { id: '1', tokenNumber: 'A-097', customerName: 'Fatima Hassan', service: 'CNIC - New', waitTime: 15, priority: 'normal' },
    { id: '2', tokenNumber: 'A-098', customerName: 'Ahmed Raza', service: 'CNIC Renewal', waitTime: 12, priority: 'senior' },
    { id: '3', tokenNumber: 'A-099', customerName: 'Sara Khan', service: 'CNIC Modification', waitTime: 10, priority: 'normal' },
    { id: '4', tokenNumber: 'A-100', customerName: 'Usman Ali', service: 'CNIC - New', waitTime: 8, priority: 'disabled' },
    { id: '5', tokenNumber: 'A-101', customerName: 'Ayesha Malik', service: 'CNIC Renewal', waitTime: 5, priority: 'normal' },
  ];

  const recentActivity = [
    { id: '1', action: 'Token A-096 called to Counter 1', time: new Date(Date.now() - 300000), type: 'called', user: 'Admin 1' },
    { id: '2', action: 'Token A-095 completed successfully', time: new Date(Date.now() - 600000), type: 'completed', user: 'Admin 2' },
    { id: '3', action: 'Token A-094 marked as no-show', time: new Date(Date.now() - 900000), type: 'no-show', user: 'Admin 1' },
    { id: '4', action: 'Token A-093 completed successfully', time: new Date(Date.now() - 1200000), type: 'completed', user: 'Admin 3' },
    { id: '5', action: 'New token A-102 issued', time: new Date(Date.now() - 1500000), type: 'issued', user: 'System' },
  ];

  const counters = [
    { id: '1', name: 'Counter 1', status: 'serving', currentToken: 'A-096', operator: 'Admin 1', tokensToday: 42 },
    { id: '2', name: 'Counter 2', status: 'available', currentToken: null, operator: 'Admin 2', tokensToday: 38 },
    { id: '3', name: 'Counter 3', status: 'break', currentToken: null, operator: 'Admin 3', tokensToday: 35 },
    { id: '4', name: 'Counter 4', status: 'offline', currentToken: null, operator: 'Unassigned', tokensToday: 0 },
  ];

  const getPriorityConfig = (priority) => {
    const config = {
      normal: { color: 'bg-gray-100 text-gray-700', label: 'Normal' },
      senior: { color: 'bg-purple-100 text-purple-700', label: 'Senior' },
      disabled: { color: 'bg-blue-100 text-blue-700', label: 'PWD' },
      vip: { color: 'bg-amber-100 text-amber-700', label: 'VIP' },
    };
    return config[priority] || config.normal;
  };

  const getCounterStatusConfig = (status) => {
    const config = {
      serving: { color: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-700', bg: 'bg-green-50' },
      available: { color: 'bg-blue-500', ring: 'ring-blue-200', text: 'text-blue-700', bg: 'bg-blue-50' },
      break: { color: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
      offline: { color: 'bg-gray-400', ring: 'ring-gray-200', text: 'text-gray-500', bg: 'bg-gray-50' },
    };
    return config[status] || config.offline;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'called': return <FiPlay className="w-4 h-4 text-blue-500" />;
      case 'completed': return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'no-show': return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      case 'issued': return <FiZap className="w-4 h-4 text-purple-500" />;
      default: return <FiActivity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAction = (action, token = null) => {
    setSelectedToken(token);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const executeAction = async () => {
    setShowConfirm(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (confirmAction === 'call') {
      toast.success(`Token ${selectedToken?.tokenNumber || 'A-097'} called to counter`);
    } else if (confirmAction === 'complete') {
      toast.success('Token completed successfully');
    } else if (confirmAction === 'noshow') {
      toast.error('Token marked as no-show');
    }

    setSelectedToken(null);
    setConfirmAction(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Badge variant="success" dot>Live</Badge>
          </div>
          <p className="text-gray-600">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            <span className="mx-2">•</span>
            <span className="font-medium text-pakistan-green">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={FiRefreshCw}
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            Refresh
          </Button>
          <Button
            icon={FiPlay}
            size="lg"
            onClick={() => handleAction('call', queue[0])}
          >
            Call Next Token
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-pakistan-green-50 rounded-xl flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-pakistan-green" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
          <p className="text-sm text-gray-500">Total Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
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
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgWaitTime}m</p>
          <p className="text-sm text-gray-500">Avg Wait</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.noShows}</p>
          <p className="text-sm text-gray-500">No Shows</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiAward className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.efficiency}%</p>
          <p className="text-sm text-gray-500">Efficiency</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Now Serving Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-pakistan p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-sm">Now Serving at Counter {currentServing.counter}</span>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                    </div>
                    <p className="text-5xl font-bold text-white">{currentServing.tokenNumber}</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <FiActivity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wide">Customer</p>
                    <p className="text-white font-medium">{currentServing.customerName}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wide">Service</p>
                    <p className="text-white font-medium">{currentServing.service}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wide">Duration</p>
                    <p className="text-white font-medium">
                      {Math.floor((Date.now() - currentServing.startedAt.getTime()) / 60000)}m
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="gold"
                    className="flex-1"
                    icon={FiCheckCircle}
                    onClick={() => handleAction('complete')}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    icon={FiAlertCircle}
                    onClick={() => handleAction('noshow')}
                  >
                    No Show
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    icon={FiSkipForward}
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Queue List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title subtitle={`${queue.length} customers waiting`}>
                    <span className="flex items-center gap-2">
                      <FiUsers className="w-5 h-5 text-pakistan-green" />
                      Queue
                    </span>
                  </Card.Title>
                  <Link to={ROUTES.MANAGE_QUEUE}>
                    <Button variant="ghost" size="sm" icon={FiChevronRight} iconPosition="right">
                      View All
                    </Button>
                  </Link>
                </div>
              </Card.Header>

              <div className="space-y-3">
                {queue.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className={`
                      group flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${index === 0
                        ? 'bg-pakistan-green-50 border-pakistan-green/30 hover:border-pakistan-green'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
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
                          <p className="font-semibold text-gray-900">{item.customerName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityConfig(item.priority).color}`}>
                            {getPriorityConfig(item.priority).label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{item.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.waitTime}m</p>
                        <p className="text-xs text-gray-500">waiting</p>
                      </div>
                      {index === 0 && (
                        <Button
                          size="sm"
                          icon={FiPlay}
                          onClick={() => handleAction('call', item)}
                        >
                          Call
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Counter Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Header>
                <Card.Title>
                  <span className="flex items-center gap-2">
                    <FiMonitor className="w-5 h-5 text-pakistan-green" />
                    Counter Status
                  </span>
                </Card.Title>
              </Card.Header>
              <div className="space-y-3">
                {counters.map((counter) => {
                  const statusConfig = getCounterStatusConfig(counter.status);
                  return (
                    <div
                      key={counter.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${statusConfig.bg} transition-all hover:scale-[1.02]`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusConfig.color} ring-4 ${statusConfig.ring}`} />
                        <div>
                          <p className="font-semibold text-gray-900">{counter.name}</p>
                          <p className="text-xs text-gray-500">{counter.operator}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium ${statusConfig.text} capitalize`}>
                          {counter.status}
                        </span>
                        {counter.currentToken && (
                          <p className="text-lg font-bold text-pakistan-green">{counter.currentToken}</p>
                        )}
                        {!counter.currentToken && counter.status !== 'offline' && (
                          <p className="text-xs text-gray-500">{counter.tokensToday} served</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to={ROUTES.MANAGE_COUNTERS}>
                  <Button variant="outline" fullWidth icon={FiChevronRight} iconPosition="right">
                    Manage Counters
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Header>
                <Card.Title>
                  <span className="flex items-center gap-2">
                    <FiBell className="w-5 h-5 text-pakistan-green" />
                    Recent Activity
                  </span>
                </Card.Title>
              </Card.Header>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">{formatTime(activity.time)}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-pakistan-green to-pakistan-green-light text-white border-0 shadow-lg overflow-hidden">
              <div className="relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative text-center py-2">
                  <FiTrendingUp className="w-10 h-10 mx-auto mb-3 opacity-80" />
                  <p className="text-white/70 text-sm mb-1">Peak Hour Today</p>
                  <p className="text-3xl font-bold">12:00 PM</p>
                  <p className="text-sm text-white/70 mt-1">42 tokens/hour</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <Link to={ROUTES.ANALYTICS}>
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        fullWidth
                      >
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

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
          confirmAction === 'call' ? `Call ${selectedToken?.tokenNumber} to your counter?` :
          confirmAction === 'complete' ? 'Mark the current token as completed?' :
          'Mark the current token as no-show? This action cannot be undone.'
        }
        confirmText={
          confirmAction === 'call' ? 'Call' :
          confirmAction === 'complete' ? 'Complete' :
          'Mark No Show'
        }
        variant={confirmAction === 'noshow' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default AdminDashboard;

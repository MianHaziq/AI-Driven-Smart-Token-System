import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiSkipForward,
  FiXCircle,
  FiRefreshCw,
  FiMapPin,
  FiClock,
  FiFilter,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  SearchBar,
  Select,
  ConfirmDialog,
} from '../../components/common';
import { formatDuration } from '../../utils/helpers';

const ManageQueue = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const counters = [
    { id: '1', name: 'Counter 1', status: 'serving', currentToken: 'A-096', operator: 'Admin 1', tokensServed: 24 },
    { id: '2', name: 'Counter 2', status: 'open', currentToken: null, operator: 'Admin 2', tokensServed: 18 },
    { id: '3', name: 'Counter 3', status: 'break', currentToken: null, operator: 'Admin 3', tokensServed: 21 },
  ];

  const waitingQueue = [
    { id: '1', tokenNumber: 'A-097', customerName: 'Fatima Hassan', phone: '0300-1234567', service: 'CNIC - New', waitTime: 25, priority: 'normal', hasLocation: true, distance: 0.5 },
    { id: '2', tokenNumber: 'A-098', customerName: 'Ahmed Raza', phone: '0301-2345678', service: 'CNIC Renewal', waitTime: 22, priority: 'senior', hasLocation: true, distance: 2.1 },
    { id: '3', tokenNumber: 'A-099', customerName: 'Sara Khan', phone: '0302-3456789', service: 'CNIC Modification', waitTime: 18, priority: 'normal', hasLocation: false, distance: null },
    { id: '4', tokenNumber: 'A-100', customerName: 'Usman Ali', phone: '0303-4567890', service: 'CNIC - New', waitTime: 15, priority: 'disabled', hasLocation: true, distance: 1.2 },
    { id: '5', tokenNumber: 'A-101', customerName: 'Ayesha Malik', phone: '0304-5678901', service: 'CNIC Renewal', waitTime: 12, priority: 'normal', hasLocation: true, distance: 0.8 },
  ];

  const calledTokens = [
    { id: '6', tokenNumber: 'A-096', customerName: 'Muhammad Ali', service: 'CNIC Renewal', counter: 1, calledAt: new Date(Date.now() - 120000), status: 'serving' },
  ];

  const completedToday = [
    { id: '7', tokenNumber: 'A-095', customerName: 'Zainab Ahmed', service: 'CNIC - New', completedAt: new Date(Date.now() - 300000), serviceTime: 12 },
    { id: '8', tokenNumber: 'A-094', customerName: 'Bilal Khan', service: 'CNIC Renewal', completedAt: new Date(Date.now() - 600000), serviceTime: 8 },
    { id: '9', tokenNumber: 'A-093', customerName: 'Hina Malik', service: 'CNIC Modification', completedAt: new Date(Date.now() - 900000), serviceTime: 15 },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'normal', label: 'Normal' },
    { value: 'senior', label: 'Senior Citizen' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'vip', label: 'VIP' },
  ];

  const handleAction = (action, token) => {
    setSelectedToken(token);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const executeAction = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowConfirm(false);
    setSelectedToken(null);
    setConfirmAction(null);
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      normal: 'default',
      senior: 'warning',
      disabled: 'info',
      vip: 'gold',
    };
    return variants[priority] || 'default';
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Queue</h1>
          <p className="text-gray-600">
            {waitingQueue.length} waiting • {calledTokens.length} called • {completedToday.length} completed today
          </p>
        </div>
        <div className="flex !gap-2">
          <Button variant="outline" icon={FiRefreshCw}>
            Refresh
          </Button>
          <Button icon={FiPlay}>
            Call Next
          </Button>
        </div>
      </div>

      {/* Counter Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 !gap-4">
        {counters.map((counter) => (
          <Card
            key={counter.id}
            className={`
              ${counter.status === 'serving' ? 'border-green-200 bg-green-50' : ''}
              ${counter.status === 'open' ? 'border-blue-200 bg-blue-50' : ''}
              ${counter.status === 'break' ? 'border-amber-200 bg-amber-50' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{counter.name}</p>
                <p className="text-sm text-gray-500">{counter.operator}</p>
              </div>
              <div className="text-right">
                <Badge variant={counter.status} size="sm">
                  {counter.status}
                </Badge>
                {counter.currentToken && (
                  <p className="text-lg font-bold text-pakistan-green !mt-1">
                    {counter.currentToken}
                  </p>
                )}
              </div>
            </div>
            <div className="!mt-3 !pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Tokens served today: <span className="font-medium">{counter.tokensServed}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row !gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by token number or customer name..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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

        <div className="!space-y-3">
          {waitingQueue.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                !p-4 rounded-xl border transition-all
                ${index === 0 ? 'bg-pakistan-green-50 border-pakistan-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between !gap-4">
                <div className="flex items-start !gap-4">
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold
                    ${index === 0 ? 'bg-pakistan-green text-white' : 'bg-gray-100 text-pakistan-green'}
                  `}>
                    {token.tokenNumber}
                  </div>
                  <div>
                    <div className="flex items-center !gap-2">
                      <p className="font-semibold text-gray-900">{token.customerName}</p>
                      <Badge variant={getPriorityBadge(token.priority)} size="sm">
                        {token.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{token.service}</p>
                    <p className="text-xs text-gray-400">{token.phone}</p>
                  </div>
                </div>

                <div className="flex items-center !gap-6">
                  <div className="flex items-center !gap-4 text-sm">
                    <span className="flex items-center text-gray-600">
                      <FiClock className="w-4 h-4 !mr-1" />
                      {formatDuration(token.waitTime)}
                    </span>
                    {token.hasLocation ? (
                      <span className="flex items-center text-green-600">
                        <FiMapPin className="w-4 h-4 !mr-1" />
                        {token.distance} km
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-400">
                        <FiMapPin className="w-4 h-4 !mr-1" />
                        No location
                      </span>
                    )}
                  </div>

                  <div className="flex !gap-2">
                    <Button
                      size="sm"
                      icon={FiPlay}
                      onClick={() => handleAction('call', token)}
                    >
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={FiSkipForward}
                      onClick={() => handleAction('skip', token)}
                    >
                      Skip
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={FiXCircle}
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleAction('noshow', token)}
                    >
                      No Show
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Called Tokens */}
      {calledTokens.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Called Tokens</Card.Title>
          </Card.Header>

          <div className="!space-y-3">
            {calledTokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between !p-4 bg-blue-50 rounded-xl border border-blue-200"
              >
                <div className="flex items-center !gap-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {token.tokenNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{token.customerName}</p>
                    <p className="text-sm text-gray-500">{token.service}</p>
                    <p className="text-xs text-blue-600">At Counter {token.counter}</p>
                  </div>
                </div>
                <div className="flex !gap-2">
                  <Button size="sm" icon={FiCheckCircle}>
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={FiXCircle}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    No Show
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Completed Today - Collapsible */}
      <Card>
        <Card.Header>
          <Card.Title subtitle={`${completedToday.length} tokens completed`}>
            Completed Today
          </Card.Title>
        </Card.Header>

        <div className="!space-y-2">
          {completedToday.slice(0, 5).map((token) => (
            <div
              key={token.id}
              className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center !gap-3">
                <span className="font-medium text-gray-700">{token.tokenNumber}</span>
                <span className="text-gray-500">{token.customerName}</span>
                <span className="text-sm text-gray-400">{token.service}</span>
              </div>
              <div className="flex items-center !gap-4 text-sm text-gray-500">
                <span>Service time: {token.serviceTime}m</span>
                <Badge variant="completed" size="sm">Completed</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeAction}
        title={
          confirmAction === 'call' ? 'Call Token' :
          confirmAction === 'skip' ? 'Skip Token' :
          'Mark as No Show'
        }
        message={
          confirmAction === 'call' ? `Call ${selectedToken?.tokenNumber} to the counter?` :
          confirmAction === 'skip' ? `Skip ${selectedToken?.tokenNumber} and move to end of queue?` :
          `Mark ${selectedToken?.tokenNumber} as no-show? This action cannot be undone.`
        }
        confirmText={
          confirmAction === 'call' ? 'Call' :
          confirmAction === 'skip' ? 'Skip' :
          'Mark No Show'
        }
        variant={confirmAction === 'noshow' ? 'danger' : 'warning'}
      />
    </div>
  );
};

export default ManageQueue;

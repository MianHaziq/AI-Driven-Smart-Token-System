import { motion } from 'framer-motion';
import {
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiPlay,
  FiSkipForward,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  StatCard,
} from '../../components/common';
import { formatTime, getOrdinalSuffix } from '../../utils/helpers';

const AdminDashboard = ({ user }) => {
  // Mock data
  const stats = {
    totalToday: 156,
    currentlyWaiting: 23,
    avgWaitTime: 18,
    noShows: 5,
    completed: 128,
  };

  const currentServing = {
    tokenNumber: 'A-096',
    customerName: 'Muhammad Ali',
    service: 'CNIC Renewal',
    counter: 1,
    startedAt: new Date(Date.now() - 300000),
  };

  const queue = [
    { id: '1', tokenNumber: 'A-097', customerName: 'Fatima Hassan', service: 'CNIC - New', waitTime: 15, priority: 'normal' },
    { id: '2', tokenNumber: 'A-098', customerName: 'Ahmed Raza', service: 'CNIC Renewal', waitTime: 12, priority: 'senior' },
    { id: '3', tokenNumber: 'A-099', customerName: 'Sara Khan', service: 'CNIC Modification', waitTime: 10, priority: 'normal' },
    { id: '4', tokenNumber: 'A-100', customerName: 'Usman Ali', service: 'CNIC - New', waitTime: 8, priority: 'disabled' },
    { id: '5', tokenNumber: 'A-101', customerName: 'Ayesha Malik', service: 'CNIC Renewal', waitTime: 5, priority: 'normal' },
  ];

  const recentActivity = [
    { id: '1', action: 'Token A-096 called to Counter 1', time: new Date(Date.now() - 300000), type: 'called' },
    { id: '2', action: 'Token A-095 completed', time: new Date(Date.now() - 600000), type: 'completed' },
    { id: '3', action: 'Token A-094 marked as no-show', time: new Date(Date.now() - 900000), type: 'no-show' },
    { id: '4', action: 'Token A-093 completed', time: new Date(Date.now() - 1200000), type: 'completed' },
  ];

  const counters = [
    { id: '1', name: 'Counter 1', status: 'serving', currentToken: 'A-096', operator: 'Admin 1' },
    { id: '2', name: 'Counter 2', status: 'open', currentToken: null, operator: 'Admin 2' },
    { id: '3', name: 'Counter 3', status: 'break', currentToken: null, operator: 'Admin 3' },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-700',
      senior: 'bg-purple-100 text-purple-700',
      disabled: 'bg-blue-100 text-blue-700',
      vip: 'bg-amber-100 text-amber-700',
    };
    return colors[priority] || colors.normal;
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button icon={FiPlay} size="lg">
          Call Next Token
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 !gap-4">
        <StatCard
          title="Total Today"
          value={stats.totalToday}
          icon={FiUsers}
          change="+12% from yesterday"
          changeType="positive"
        />
        <StatCard
          title="Waiting"
          value={stats.currentlyWaiting}
          icon={FiClock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Avg Wait"
          value={`${stats.avgWaitTime}m`}
          icon={FiClock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="No Shows"
          value={stats.noShows}
          icon={FiAlertCircle}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 !gap-6">
        {/* Currently Serving */}
        <div className="lg:col-span-2 !space-y-6">
          {/* Now Serving Card */}
          <Card className="bg-gradient-pakistan text-white">
            <div className="flex items-center justify-between !mb-4">
              <div>
                <p className="text-white/70 text-sm">Now Serving at Counter {currentServing.counter}</p>
                <p className="text-4xl font-bold !mt-1">{currentServing.tokenNumber}</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Serving
              </Badge>
            </div>
            <div className="grid grid-cols-2 !gap-4 !mb-4">
              <div>
                <p className="text-white/70 text-sm">Customer</p>
                <p className="font-medium">{currentServing.customerName}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Service</p>
                <p className="font-medium">{currentServing.service}</p>
              </div>
            </div>
            <div className="flex !gap-3">
              <Button
                variant="gold"
                className="flex-1"
                icon={FiCheckCircle}
              >
                Complete
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-pakistan-green"
                icon={FiAlertCircle}
              >
                No Show
              </Button>
            </div>
          </Card>

          {/* Queue List */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title subtitle={`${queue.length} people waiting`}>
                  Queue
                </Card.Title>
                <Button variant="ghost" size="sm" icon={FiSkipForward}>
                  Skip
                </Button>
              </div>
            </Card.Header>

            <div className="!space-y-3">
              {queue.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center justify-between !p-4 rounded-lg border
                    ${index === 0 ? 'bg-pakistan-green-50 border-pakistan-green-200' : 'bg-gray-50 border-gray-100'}
                  `}
                >
                  <div className="flex items-center !gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="font-bold text-pakistan-green text-sm">
                        {item.tokenNumber}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.customerName}</p>
                      <p className="text-sm text-gray-500">{item.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center !gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.waitTime}m
                    </span>
                    {index === 0 && (
                      <Button size="sm" icon={FiPlay}>
                        Call
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="!space-y-6">
          {/* Counter Status */}
          <Card>
            <Card.Header>
              <Card.Title>Counter Status</Card.Title>
            </Card.Header>
            <div className="!space-y-3">
              {counters.map((counter) => (
                <div
                  key={counter.id}
                  className="flex items-center justify-between !p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{counter.name}</p>
                    <p className="text-xs text-gray-500">{counter.operator}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={counter.status}
                      size="sm"
                    >
                      {counter.status}
                    </Badge>
                    {counter.currentToken && (
                      <p className="text-xs text-gray-500 !mt-1">
                        {counter.currentToken}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
            </Card.Header>
            <div className="!space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start !gap-3">
                  <div
                    className={`
                      w-2 h-2 rounded-full mt-2
                      ${activity.type === 'completed' ? 'bg-green-500' : ''}
                      ${activity.type === 'called' ? 'bg-blue-500' : ''}
                      ${activity.type === 'no-show' ? 'bg-red-500' : ''}
                    `}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {formatTime(activity.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-pakistan-light text-white">
            <div className="text-center">
              <FiTrendingUp className="w-8 h-8 mx-auto mb-2 opacity-70" />
              <p className="text-white/70 text-sm">Peak Hour Today</p>
              <p className="text-2xl font-bold">11:00 AM</p>
              <p className="text-sm text-white/70 !mt-1">42 tokens/hour</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

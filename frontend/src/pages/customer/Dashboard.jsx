import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiList,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiGrid,
} from 'react-icons/fi';
import { Button, Card, Badge, StatCard, EmptyState } from '../../components/common';
import { ROUTES } from '../../utils/constants';
import { getGreeting, formatTime, getOrdinalSuffix } from '../../utils/helpers';

const Dashboard = ({ user }) => {
  // Mock data - will be replaced with real data from API
  const stats = {
    activeTokens: 1,
    completedToday: 3,
    avgWaitTime: '25 mins',
  };

  const activeToken = {
    id: '1',
    tokenNumber: 'A-042',
    serviceName: 'CNIC Renewal',
    serviceCenter: 'NADRA Office, Islamabad',
    position: 3,
    estimatedWait: 15,
    status: 'waiting',
    bookedAt: new Date(),
  };

  const recentTokens = [
    {
      id: '2',
      tokenNumber: 'B-128',
      serviceName: 'Passport Application',
      serviceCenter: 'Passport Office, Rawalpindi',
      status: 'completed',
      completedAt: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      tokenNumber: 'A-089',
      serviceName: 'Bank Account Opening',
      serviceCenter: 'HBL, F-10 Branch',
      status: 'completed',
      completedAt: new Date(Date.now() - 86400000),
    },
  ];

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tokens today.
          </p>
        </div>
        <Link to={ROUTES.BOOK_TOKEN}>
          <Button icon={FiPlus}>Book New Token</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 !gap-4">
        <StatCard
          title="Active Tokens"
          value={stats.activeTokens}
          icon={FiClock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={FiCheckCircle}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Avg. Wait Time"
          value={stats.avgWaitTime}
          icon={FiClock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Active Token */}
      {activeToken ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-pakistan text-white overflow-hidden relative">
            <div className="absolute inset-0 pattern-grid opacity-10" />
            <div className="relative">
              <div className="flex items-start justify-between !mb-4">
                <div>
                  <p className="text-white/70 text-sm !mb-1">Your Active Token</p>
                  <p className="text-4xl font-bold">{activeToken.tokenNumber}</p>
                </div>
                <Badge variant="waiting" className="bg-white/20 border-white/30 text-white">
                  Waiting
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 !gap-6 !mb-6">
                <div>
                  <p className="text-white/70 text-sm !mb-1">Service</p>
                  <p className="font-medium">{activeToken.serviceName}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm !mb-1">Location</p>
                  <p className="font-medium flex items-center">
                    <FiMapPin className="!mr-1" />
                    {activeToken.serviceCenter}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl !p-4 !mb-6">
                <div className="grid grid-cols-2 !gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">
                      {getOrdinalSuffix(activeToken.position)}
                    </p>
                    <p className="text-white/70 text-sm">Position in Queue</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">~{activeToken.estimatedWait} min</p>
                    <p className="text-white/70 text-sm">Estimated Wait</p>
                  </div>
                </div>
              </div>

              <div className="flex !gap-3">
                <Link to={`/token/${activeToken.id}`} className="flex-1">
                  <Button
                    fullWidth
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-pakistan-green"
                    icon={FiArrowRight}
                    iconPosition="right"
                  >
                    Track Live
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <EmptyState
            icon={FiList}
            title="No Active Tokens"
            description="You don't have any active tokens. Book a new token to get started."
            action={() => {}}
            actionLabel="Book Token"
          />
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 !gap-4">
        <Link to={ROUTES.SERVICES}>
          <Card hover className="flex items-center !space-x-4">
            <div className="w-12 h-12 bg-pakistan-green-50 rounded-xl flex items-center justify-center">
              <FiGrid className="w-6 h-6 text-pakistan-green" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Services</h3>
              <p className="text-sm text-gray-500">Browse all</p>
            </div>
          </Card>
        </Link>
        <Link to={ROUTES.BOOK_TOKEN}>
          <Card hover className="flex items-center !space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FiPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Book Token</h3>
              <p className="text-sm text-gray-500">New appointment</p>
            </div>
          </Card>
        </Link>
        <Link to={ROUTES.MY_TOKENS}>
          <Card hover className="flex items-center !space-x-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FiList className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Tokens</h3>
              <p className="text-sm text-gray-500">View all tokens</p>
            </div>
          </Card>
        </Link>
        <Link to={ROUTES.PROFILE}>
          <Card hover className="flex items-center !space-x-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <FiClock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">History</h3>
              <p className="text-sm text-gray-500">Past visits</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Tokens */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Recent Tokens</Card.Title>
            <Link
              to={ROUTES.MY_TOKENS}
              className="text-sm text-pakistan-green hover:underline"
            >
              View All
            </Link>
          </div>
        </Card.Header>

        {recentTokens.length > 0 ? (
          <div className="!space-y-4">
            {recentTokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between !p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center !space-x-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="font-bold text-pakistan-green">
                      {token.tokenNumber}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{token.serviceName}</p>
                    <p className="text-sm text-gray-500">{token.serviceCenter}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={token.status} size="sm">
                    {token.status}
                  </Badge>
                  <p className="text-xs text-gray-500 !mt-1">
                    {formatTime(token.completedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 !py-8">No recent tokens</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;

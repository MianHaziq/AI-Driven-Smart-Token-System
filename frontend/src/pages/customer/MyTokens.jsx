import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiFilter,
  FiCalendar,
  FiEye,
  FiX,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  SearchBar,
  Select,
  EmptyState,
  Pagination,
} from '../../components/common';
import { formatDate, formatTime } from '../../utils/helpers';
import { TOKEN_STATUS_LABELS } from '../../utils/constants';

const MyTokens = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const tokens = [
    {
      id: '1',
      tokenNumber: 'A-042',
      serviceName: 'CNIC Renewal',
      serviceCenter: 'NADRA Office, Islamabad',
      status: 'waiting',
      position: 3,
      estimatedWait: 15,
      bookedAt: new Date(),
    },
    {
      id: '2',
      tokenNumber: 'B-128',
      serviceName: 'Passport Application',
      serviceCenter: 'Passport Office, Rawalpindi',
      status: 'completed',
      completedAt: new Date(Date.now() - 3600000),
      bookedAt: new Date(Date.now() - 7200000),
    },
    {
      id: '3',
      tokenNumber: 'A-089',
      serviceName: 'Bank Account Opening',
      serviceCenter: 'HBL, F-10 Branch',
      status: 'completed',
      completedAt: new Date(Date.now() - 86400000),
      bookedAt: new Date(Date.now() - 90000000),
    },
    {
      id: '4',
      tokenNumber: 'C-056',
      serviceName: 'OPD - General',
      serviceCenter: 'PIMS Hospital',
      status: 'no-show',
      bookedAt: new Date(Date.now() - 172800000),
    },
    {
      id: '5',
      tokenNumber: 'A-234',
      serviceName: 'CNIC - New',
      serviceCenter: 'NADRA Office, Lahore',
      status: 'cancelled',
      bookedAt: new Date(Date.now() - 259200000),
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'called', label: 'Called' },
    { value: 'serving', label: 'Serving' },
    { value: 'completed', label: 'Completed' },
    { value: 'no-show', label: 'No Show' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.serviceCenter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || token.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      waiting: 'bg-amber-100 text-amber-800',
      called: 'bg-blue-100 text-blue-800',
      serving: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      'no-show': 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.waiting;
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tokens</h1>
        <p className="text-gray-600">View and manage all your tokens</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row !gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by token number, service, or location..."
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

      {/* Active Token Banner */}
      {tokens.some((t) => ['waiting', 'called', 'serving'].includes(t.status)) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-pakistan-green-50 border-pakistan-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center !space-x-4">
                <div className="w-12 h-12 bg-pakistan-green rounded-lg flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-pakistan-green">Active Token</p>
                  <p className="text-xl font-bold text-pakistan-green">
                    {tokens.find((t) => t.status === 'waiting')?.tokenNumber}
                  </p>
                </div>
              </div>
              <Link to="/token/1">
                <Button size="sm" icon={FiEye}>
                  Track Live
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Token List */}
      {filteredTokens.length > 0 ? (
        <div className="!space-y-4">
          {filteredTokens.map((token, index) => (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between !gap-4">
                  <div className="flex items-start sm:items-center !gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-pakistan-green">
                        {token.tokenNumber}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {token.serviceName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <FiMapPin className="w-4 h-4 !mr-1" />
                        {token.serviceCenter}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center !mt-1">
                        <FiCalendar className="w-3 h-3 !mr-1" />
                        {formatDate(token.bookedAt)} at {formatTime(token.bookedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end !gap-2">
                    <Badge variant={token.status}>
                      {TOKEN_STATUS_LABELS[token.status]}
                    </Badge>

                    {token.status === 'waiting' && (
                      <div className="text-sm">
                        <span className="text-gray-500">Position: </span>
                        <span className="font-medium">{token.position}</span>
                        <span className="text-gray-400 !mx-2">•</span>
                        <span className="text-amber-600">
                          ~{token.estimatedWait} min wait
                        </span>
                      </div>
                    )}

                    {token.status === 'completed' && (
                      <p className="text-sm text-gray-500">
                        Completed at {formatTime(token.completedAt)}
                      </p>
                    )}

                    <div className="flex !gap-2">
                      <Link to={`/token/${token.id}`}>
                        <Button variant="outline" size="sm" icon={FiEye}>
                          View
                        </Button>
                      </Link>
                      {token.status === 'waiting' && (
                        <Button variant="ghost" size="sm" icon={FiX}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            totalItems={filteredTokens.length}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={FiClock}
            title="No Tokens Found"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No tokens match your search criteria.'
                : "You haven't booked any tokens yet."
            }
          />
        </Card>
      )}
    </div>
  );
};

export default MyTokens;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowLeft,
} from 'react-icons/fi';
import {
  Card,
  Badge,
  Button,
  SearchBar,
  Select,
  EmptyState,
  Pagination,
  Loader,
} from '../../components/common';
import { formatDate, formatTime } from '../../utils/helpers';
import { TOKEN_STATUS_LABELS, ROUTES } from '../../utils/constants';
import useTokenStore from '../../store/tokenStore';
import toast from 'react-hot-toast';

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { tokenHistory, isLoading, fetchTokenHistory } = useTokenStore();

  // Fetch token history on mount
  useEffect(() => {
    fetchTokenHistory();
  }, [fetchTokenHistory]);

  const handleRefresh = () => {
    fetchTokenHistory();
    toast.success('History refreshed');
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' },
  ];

  const filteredTokens = tokenHistory.filter((token) => {
    const tokenNumber = token.tokenNumber || '';
    const serviceName = token.serviceName || token.service?.name || '';
    const serviceCenter = token.serviceCenter || 'Service Center';

    const matchesSearch =
      tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceCenter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || token.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);
  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return FiCheckCircle;
      case 'cancelled':
        return FiXCircle;
      case 'no-show':
        return FiAlertCircle;
      default:
        return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      case 'no-show':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading && tokenHistory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.MY_TOKENS}>
            <Button variant="ghost" size="sm" icon={FiArrowLeft} className="!p-2" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Token History</h1>
            <p className="text-gray-600">View your past tokens</p>
          </div>
        </div>
        <Button
          variant="outline"
          icon={FiRefreshCw}
          onClick={handleRefresh}
          loading={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-2xl p-5 border border-green-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">
                {tokenHistory.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
              <FiXCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-700">
                {tokenHistory.filter(t => t.status === 'cancelled').length}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 rounded-2xl p-5 border border-red-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">
                {tokenHistory.filter(t => t.status === 'no-show').length}
              </p>
              <p className="text-sm text-red-600">No Show</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Token History List */}
      {paginatedTokens.length > 0 ? (
        <div className="space-y-4">
          {paginatedTokens.map((token, index) => {
            const StatusIcon = getStatusIcon(token.status);
            return (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="opacity-90">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${getStatusColor(token.status)}`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-700">
                            {token.tokenNumber}
                          </span>
                          <Badge variant={token.status}>
                            {TOKEN_STATUS_LABELS[token.status] || token.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mt-1">
                          {token.serviceName || token.service?.name || 'Service'}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <FiMapPin className="w-4 h-4 mr-1" />
                          {token.serviceCenter || 'Service Center'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {formatDate(token.createdAt)}
                      </p>

                      {token.status === 'completed' && token.completedAt && (
                        <p className="text-sm text-green-600">
                          Completed at {formatTime(token.completedAt)}
                        </p>
                      )}

                      {token.status === 'cancelled' && (
                        <p className="text-sm text-gray-500">
                          Cancelled
                        </p>
                      )}

                      {token.status === 'no-show' && (
                        <p className="text-sm text-red-600">
                          Marked as no-show
                        </p>
                      )}

                      <Link to={`/token/${token._id}`}>
                        <Button variant="outline" size="sm" icon={FiEye}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTokens.length}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={FiClock}
            title="No History Found"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No tokens match your search criteria.'
                : "You don't have any completed tokens yet."
            }
            action={
              !searchQuery && statusFilter === 'all' && (
                <Link to={ROUTES.BOOK_TOKEN}>
                  <Button>Book Your First Token</Button>
                </Link>
              )
            }
          />
        </Card>
      )}
    </div>
  );
};

export default History;

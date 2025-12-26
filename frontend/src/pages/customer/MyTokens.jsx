import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiX,
  FiRefreshCw,
  FiList,
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

const MyTokens = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { myTokens, isLoading, fetchMyTokens, cancelToken } = useTokenStore();

  // Fetch tokens on mount
  useEffect(() => {
    fetchMyTokens();
  }, [fetchMyTokens]);

  const handleRefresh = () => {
    fetchMyTokens();
    toast.success('Tokens refreshed');
  };

  const handleCancelToken = async (tokenId) => {
    const result = await cancelToken(tokenId);
    if (result.success) {
      toast.success('Token cancelled successfully', {
        icon: '❌',
        duration: 3000,
      });
    } else {
      toast.error(result.message || 'Failed to cancel token');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'called', label: 'Called' },
    { value: 'serving', label: 'Serving' },
  ];

  const filteredTokens = myTokens.filter((token) => {
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

  // Find active token
  const activeToken = myTokens.find((t) =>
    ['waiting', 'called', 'serving'].includes(t.status)
  );

  if (isLoading && myTokens.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tokens</h1>
          <p className="text-gray-600">Your current active tokens</p>
        </div>
        <div className="flex gap-3">
          <Link to={ROUTES.TOKEN_HISTORY}>
            <Button variant="outline" icon={FiList}>
              View History
            </Button>
          </Link>
          <Button
            variant="outline"
            icon={FiRefreshCw}
            onClick={handleRefresh}
            loading={isLoading}
          >
            Refresh
          </Button>
        </div>
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
      {activeToken && (
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
                    {activeToken.tokenNumber}
                  </p>
                </div>
                {activeToken.position && (
                  <div className="!ml-6">
                    <p className="text-sm text-pakistan-green">Position</p>
                    <p className="text-xl font-bold text-pakistan-green">
                      #{activeToken.position}
                    </p>
                  </div>
                )}
              </div>
              <Link to={`/token/${activeToken._id}`}>
                <Button size="sm" icon={FiEye}>
                  Track Live
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Token List */}
      {paginatedTokens.length > 0 ? (
        <div className="!space-y-4">
          {paginatedTokens.map((token, index) => (
            <motion.div
              key={token._id}
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
                        {token.serviceName || token.service?.name || 'Service'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <FiMapPin className="w-4 h-4 !mr-1" />
                        {token.serviceCenter || 'Service Center'}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center !mt-1">
                        <FiCalendar className="w-3 h-3 !mr-1" />
                        {formatDate(token.createdAt)} at {formatTime(token.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end !gap-2">
                    <Badge variant={token.status}>
                      {TOKEN_STATUS_LABELS[token.status] || token.status}
                    </Badge>

                    {token.status === 'waiting' && (
                      <div className="text-sm">
                        <span className="text-gray-500">Position: </span>
                        <span className="font-medium">{token.position || '-'}</span>
                        {token.estimatedWaitTime && (
                          <>
                            <span className="text-gray-400 !mx-2">•</span>
                            <span className="text-amber-600">
                              ~{token.estimatedWaitTime} min wait
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {token.status === 'serving' && (
                      <div className="text-sm">
                        <span className="text-green-600 font-medium">
                          Currently being served
                        </span>
                        {token.counter && (
                          <span className="text-gray-500 !ml-2">
                            at Counter {token.counter.name || token.counter}
                          </span>
                        )}
                      </div>
                    )}

                    {token.status === 'completed' && token.completedAt && (
                      <p className="text-sm text-gray-500">
                        Completed at {formatTime(token.completedAt)}
                      </p>
                    )}

                    <div className="flex !gap-2">
                      <Link to={`/token/${token._id}`}>
                        <Button variant="outline" size="sm" icon={FiEye}>
                          View
                        </Button>
                      </Link>
                      {token.status === 'waiting' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={FiX}
                          onClick={() => handleCancelToken(token._id)}
                        >
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
            title="No Active Tokens"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No tokens match your search criteria.'
                : "You don't have any active tokens right now."
            }
            action={
              !searchQuery && statusFilter === 'all' && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to={ROUTES.BOOK_TOKEN}>
                    <Button>Book a Token</Button>
                  </Link>
                  <Link to={ROUTES.TOKEN_HISTORY}>
                    <Button variant="outline" icon={FiList}>View History</Button>
                  </Link>
                </div>
              )
            }
          />
        </Card>
      )}
    </div>
  );
};

export default MyTokens;

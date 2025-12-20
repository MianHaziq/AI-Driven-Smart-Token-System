import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiNavigation,
  FiShare2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
} from 'react-icons/fi';
import { Card, Badge, Button, Alert } from '../../components/common';
import { formatDate, formatTime, formatDuration } from '../../utils/helpers';

const TokenDetails = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    setTimeout(() => {
      setToken({
        id,
        tokenNumber: 'A-042',
        serviceName: 'CNIC Renewal',
        serviceCenter: {
          name: 'NADRA Office, F-6 Islamabad',
          address: 'Plot 42, F-6 Markaz, Islamabad',
          phone: '051-1234567',
          coordinates: [33.7294, 73.0931],
        },
        status: 'waiting',
        position: 3,
        totalInQueue: 15,
        estimatedWait: 18,
        bookedAt: new Date(Date.now() - 1800000),
        expectedServiceTime: new Date(Date.now() + 1080000),
        customerLocation: {
          lat: 33.7200,
          lng: 73.0800,
          distance: 2.5,
          lastUpdated: new Date(),
        },
        timeline: [
          { status: 'booked', time: new Date(Date.now() - 1800000), completed: true },
          { status: 'position_5', time: new Date(Date.now() - 1200000), completed: true },
          { status: 'position_3', time: new Date(Date.now() - 300000), completed: true },
          { status: 'called', time: null, completed: false },
          { status: 'serving', time: null, completed: false },
          { status: 'completed', time: null, completed: false },
        ],
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusBadge = (status) => {
    const variants = {
      waiting: 'warning',
      called: 'info',
      serving: 'serving',
      completed: 'success',
      'no-show': 'danger',
      cancelled: 'default',
    };
    return variants[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      waiting: 'Waiting in Queue',
      called: 'Your Turn - Go to Counter',
      serving: 'Being Served',
      completed: 'Service Completed',
      'no-show': 'Marked as No Show',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const getTimelineLabel = (status) => {
    const labels = {
      booked: 'Token Booked',
      position_5: 'Position 5 in Queue',
      position_3: 'Position 3 in Queue',
      called: 'Called to Counter',
      serving: 'Service Started',
      completed: 'Service Completed',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pakistan-green border-t-transparent"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Token Not Found</h2>
        <p className="text-gray-600 mb-4">The token you're looking for doesn't exist.</p>
        <Link to="/customer/my-tokens">
          <Button icon={FiArrowLeft}>Back to My Tokens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex items-center !gap-4">
        <Link to="/customer/my-tokens">
          <Button variant="ghost" icon={FiArrowLeft} size="sm">
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Token Status</h1>
          <p className="text-gray-600">Track your queue position in real-time</p>
        </div>
      </div>

      {/* Alert for called status */}
      {token.status === 'called' && (
        <Alert variant="success" icon={FiCheckCircle}>
          <strong>It's Your Turn!</strong> Please proceed to the counter immediately.
        </Alert>
      )}

      {/* Main Token Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-pakistan-green to-pakistan-green-light text-white">
          <div className="text-center !py-6">
            <p className="text-white/80 text-sm !mb-2">Your Token Number</p>
            <p className="text-5xl font-bold !mb-4">{token.tokenNumber}</p>
            <Badge variant={getStatusBadge(token.status)} size="lg">
              {getStatusText(token.status)}
            </Badge>
          </div>

          {token.status === 'waiting' && (
            <div className="!mt-6 !pt-6 border-t border-white/20">
              <div className="grid grid-cols-3 !gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">{token.position}</p>
                  <p className="text-white/70 text-sm">Position</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{token.position - 1}</p>
                  <p className="text-white/70 text-sm">People Ahead</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">~{token.estimatedWait}</p>
                  <p className="text-white/70 text-sm">Min Wait</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="!mt-6">
                <div className="flex justify-between text-sm text-white/70 !mb-2">
                  <span>Queue Progress</span>
                  <span>{Math.round(((token.totalInQueue - token.position + 1) / token.totalInQueue) * 100)}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((token.totalInQueue - token.position + 1) / token.totalInQueue) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 !gap-6">
        {/* Service Details */}
        <Card>
          <Card.Header>
            <Card.Title>Service Details</Card.Title>
          </Card.Header>
          <div className="!space-y-4">
            <div className="flex items-start !gap-3">
              <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-5 h-5 text-pakistan-green" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold text-gray-900">{token.serviceName}</p>
              </div>
            </div>
            <div className="flex items-start !gap-3">
              <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-5 h-5 text-pakistan-green" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Center</p>
                <p className="font-semibold text-gray-900">{token.serviceCenter.name}</p>
                <p className="text-sm text-gray-500">{token.serviceCenter.address}</p>
              </div>
            </div>
            <div className="flex items-start !gap-3">
              <div className="w-10 h-10 bg-pakistan-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiClock className="w-5 h-5 text-pakistan-green" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Booked At</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(token.bookedAt)} at {formatTime(token.bookedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start !gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiClock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Service Time</p>
                <p className="font-semibold text-amber-600">
                  {formatTime(token.expectedServiceTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
            <Button variant="outline" icon={FiPhone} fullWidth>
              Call Center
            </Button>
            <Button variant="outline" icon={FiNavigation} fullWidth>
              Directions
            </Button>
          </div>
        </Card>

        {/* Location & Timeline */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <Card.Header>
              <Card.Title>Your Location</Card.Title>
            </Card.Header>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${locationEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-gray-600">
                    {locationEnabled ? 'Location sharing enabled' : 'Location sharing disabled'}
                  </span>
                </div>
                <button
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    locationEnabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {locationEnabled ? 'On' : 'Off'}
                </button>
              </div>

              {locationEnabled && token.customerLocation && (
                <>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Distance from center</p>
                        <p className="text-2xl font-bold text-pakistan-green">
                          {token.customerLocation.distance} km
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ETA if you leave now</p>
                        <p className="text-lg font-semibold text-gray-900">~8 min</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Last updated: {formatTime(token.customerLocation.lastUpdated)}
                  </p>
                </>
              )}

              {!locationEnabled && (
                <Alert variant="warning">
                  Enable location sharing for accurate wait time predictions and to avoid being marked as no-show.
                </Alert>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <Card.Header>
              <Card.Title>Timeline</Card.Title>
            </Card.Header>
            <div className="relative">
              {token.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 pb-6 last:pb-0">
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-pakistan-green'
                          : 'bg-gray-200'
                      }`}
                    >
                      {item.completed && (
                        <FiCheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {index < token.timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          item.completed ? 'bg-pakistan-green' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 -mt-1">
                    <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {getTimelineLabel(item.status)}
                    </p>
                    {item.time && (
                      <p className="text-sm text-gray-500">{formatTime(item.time)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      {token.status === 'waiting' && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">Need to cancel?</p>
                <p className="text-sm text-gray-600">
                  You can cancel your token if you can't make it
                </p>
              </div>
            </div>
            <Button variant="danger" icon={FiX}>
              Cancel Token
            </Button>
          </div>
        </Card>
      )}

      {/* Share */}
      <div className="text-center">
        <Button variant="ghost" icon={FiShare2}>
          Share Token Status
        </Button>
      </div>
    </div>
  );
};

export default TokenDetails;

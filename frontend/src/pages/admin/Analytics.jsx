import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Button, Select, StatCard, Loader } from '../../components/common';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/token/analytics?range=${dateRange}`);
      setData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const hourlyData = data?.hourlyData || [];
  const weeklyData = data?.weeklyData || [];
  const serviceDistribution = data?.serviceDistribution || [];
  const waitTimeDistribution = data?.waitTimeDistribution || [];
  const servicePerformance = data?.servicePerformance || [];
  const peakHourInsight = data?.peakHourInsight || { hour: 'N/A', tokens: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Button variant="outline" icon={FiRefreshCw} onClick={fetchAnalytics}>
            Refresh
          </Button>
          <Button variant="outline" icon={FiDownload}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tokens"
          value={stats.totalTokens || 0}
          icon={FiUsers}
          trend={stats.totalChange >= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.totalChange || 0)}%`}
          color="green"
        />
        <StatCard
          title="Avg Wait Time"
          value={`${stats.avgWaitTime || 0} min`}
          icon={FiClock}
          trend={stats.waitChange <= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.waitChange || 0)}%`}
          color="blue"
        />
        <StatCard
          title="No-Show Rate"
          value={`${stats.noShowRate || 0}%`}
          icon={FiAlertCircle}
          trend={stats.noShowChange <= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.noShowChange || 0)}%`}
          color="amber"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
          icon={FiCheckCircle}
          color="emerald"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hourly Token Distribution */}
        <Card>
          <Card.Header>
            <Card.Title subtitle="Token volume by hour">
              Hourly Distribution
            </Card.Title>
          </Card.Header>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="tokens" fill="#01411C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Wait Time Trend */}
        <Card>
          <Card.Header>
            <Card.Title subtitle="Average wait time throughout the day">
              Wait Time Trend
            </Card.Title>
          </Card.Header>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} unit=" min" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgWait"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ fill: '#D4AF37', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Service Distribution</Card.Title>
          </Card.Header>
          <div className="h-64">
            {serviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {serviceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Comparison */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title subtitle="Tokens served vs no-shows">
              Weekly Performance
            </Card.Title>
          </Card.Header>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="noShow" name="No Show" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Wait Time Distribution */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Distribution of customer wait times">
            Wait Time Distribution
          </Card.Title>
        </Card.Header>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waitTimeDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis dataKey="range" type="category" stroke="#6b7280" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Service Performance Table */}
      <Card>
        <Card.Header>
          <Card.Title subtitle="Performance metrics by service type">
            Service Performance
          </Card.Title>
        </Card.Header>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Service</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Tokens</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Avg Wait</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Avg Service</th>
              </tr>
            </thead>
            <tbody>
              {servicePerformance.length > 0 ? (
                servicePerformance.map((service, index) => (
                  <motion.tr
                    key={service.service}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{service.service}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-700">{service.tokens}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`font-medium ${service.avgWait > 20 ? 'text-amber-600' : 'text-green-600'}`}>
                        {service.avgWait} min
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-700">{service.avgService} min</span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No service data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Peak Hours Insight */}
      <Card className="bg-gradient-to-r from-pakistan-green-50 to-emerald-50 border-pakistan-green-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pakistan-green rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Peak Hour Insight</h3>
              <p className="text-gray-600">
                Busiest time was <span className="font-bold text-pakistan-green">{peakHourInsight.hour}</span> with {peakHourInsight.tokens} tokens
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Recommendation</p>
            <p className="text-pakistan-green font-medium">
              {peakHourInsight.tokens > 30
                ? 'Consider adding an extra counter during peak hours'
                : 'Current counter capacity is sufficient'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

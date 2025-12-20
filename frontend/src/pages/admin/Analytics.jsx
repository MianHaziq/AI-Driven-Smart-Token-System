import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
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
import { Card, Button, Select, StatCard } from '../../components/common';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('today');

  // Mock data for charts
  const hourlyData = [
    { hour: '9AM', tokens: 12, avgWait: 15 },
    { hour: '10AM', tokens: 28, avgWait: 22 },
    { hour: '11AM', tokens: 35, avgWait: 28 },
    { hour: '12PM', tokens: 42, avgWait: 35 },
    { hour: '1PM', tokens: 18, avgWait: 20 },
    { hour: '2PM', tokens: 32, avgWait: 25 },
    { hour: '3PM', tokens: 38, avgWait: 30 },
    { hour: '4PM', tokens: 25, avgWait: 18 },
    { hour: '5PM', tokens: 15, avgWait: 12 },
  ];

  const weeklyData = [
    { day: 'Mon', tokens: 145, completed: 138, noShow: 7 },
    { day: 'Tue', tokens: 168, completed: 160, noShow: 8 },
    { day: 'Wed', tokens: 152, completed: 145, noShow: 7 },
    { day: 'Thu', tokens: 178, completed: 170, noShow: 8 },
    { day: 'Fri', tokens: 190, completed: 182, noShow: 8 },
    { day: 'Sat', tokens: 85, completed: 80, noShow: 5 },
    { day: 'Sun', tokens: 0, completed: 0, noShow: 0 },
  ];

  const serviceDistribution = [
    { name: 'CNIC Renewal', value: 35, color: '#01411C' },
    { name: 'CNIC New', value: 28, color: '#006400' },
    { name: 'CNIC Modification', value: 18, color: '#D4AF37' },
    { name: 'Family Registration', value: 12, color: '#3B82F6' },
    { name: 'Other', value: 7, color: '#6B7280' },
  ];

  const waitTimeDistribution = [
    { range: '0-10 min', count: 45 },
    { range: '10-20 min', count: 78 },
    { range: '20-30 min', count: 52 },
    { range: '30-45 min', count: 28 },
    { range: '45+ min', count: 12 },
  ];

  const servicePerformance = [
    { service: 'CNIC Renewal', tokens: 89, avgWait: 18, avgService: 12, satisfaction: 4.5 },
    { service: 'CNIC New', tokens: 72, avgWait: 25, avgService: 18, satisfaction: 4.2 },
    { service: 'CNIC Modification', tokens: 45, avgWait: 15, avgService: 10, satisfaction: 4.6 },
    { service: 'Family Registration', tokens: 32, avgWait: 22, avgService: 15, satisfaction: 4.3 },
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  const stats = {
    totalTokens: 245,
    totalChange: 12,
    avgWaitTime: 22,
    waitChange: -8,
    peakHour: '12:00 PM',
    noShowRate: 4.2,
    noShowChange: -1.5,
    satisfaction: 4.4,
  };

  return (
    <div className="!space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between !gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>
        <div className="flex !gap-3">
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Button variant="outline" icon={FiDownload}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 !gap-4">
        <StatCard
          title="Total Tokens"
          value={stats.totalTokens}
          icon={FiUsers}
          trend={stats.totalChange > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.totalChange)}%`}
          color="green"
        />
        <StatCard
          title="Avg Wait Time"
          value={`${stats.avgWaitTime} min`}
          icon={FiClock}
          trend={stats.waitChange < 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.waitChange)}%`}
          color="blue"
        />
        <StatCard
          title="No-Show Rate"
          value={`${stats.noShowRate}%`}
          icon={FiAlertCircle}
          trend={stats.noShowChange < 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(stats.noShowChange)}%`}
          color="amber"
        />
        <StatCard
          title="Satisfaction"
          value={`${stats.satisfaction}/5`}
          icon={FiCheckCircle}
          color="emerald"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 !gap-6">
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
      <div className="grid lg:grid-cols-3 !gap-6">
        {/* Service Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Service Distribution</Card.Title>
          </Card.Header>
          <div className="h-64">
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
          </div>
          <div className="!mt-4 !space-y-2">
            {serviceDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center !gap-2">
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
                <th className="text-left !py-3 !px-4 font-semibold text-gray-600">Service</th>
                <th className="text-center !py-3 !px-4 font-semibold text-gray-600">Tokens</th>
                <th className="text-center !py-3 !px-4 font-semibold text-gray-600">Avg Wait</th>
                <th className="text-center !py-3 !px-4 font-semibold text-gray-600">Avg Service</th>
                <th className="text-center !py-3 !px-4 font-semibold text-gray-600">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {servicePerformance.map((service, index) => (
                <motion.tr
                  key={service.service}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="!py-4 !px-4">
                    <span className="font-medium text-gray-900">{service.service}</span>
                  </td>
                  <td className="!py-4 !px-4 text-center">
                    <span className="text-gray-700">{service.tokens}</span>
                  </td>
                  <td className="!py-4 !px-4 text-center">
                    <span className={`font-medium ${service.avgWait > 20 ? 'text-amber-600' : 'text-green-600'}`}>
                      {service.avgWait} min
                    </span>
                  </td>
                  <td className="!py-4 !px-4 text-center">
                    <span className="text-gray-700">{service.avgService} min</span>
                  </td>
                  <td className="!py-4 !px-4 text-center">
                    <div className="flex items-center justify-center !gap-1">
                      <span className="text-amber-500">★</span>
                      <span className="font-medium text-gray-900">{service.satisfaction}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Peak Hours Insight */}
      <Card className="bg-gradient-to-r from-pakistan-green-50 to-emerald-50 border-pakistan-green-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between !gap-4">
          <div className="flex items-center !gap-4">
            <div className="w-12 h-12 bg-pakistan-green rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Peak Hour Insight</h3>
              <p className="text-gray-600">
                Busiest time today was <span className="font-bold text-pakistan-green">12:00 PM - 1:00 PM</span> with 42 tokens
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Recommendation</p>
            <p className="text-pakistan-green font-medium">
              Consider adding an extra counter during lunch hours
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;

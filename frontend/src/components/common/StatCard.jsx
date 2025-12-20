import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  subtitle,
  className = '',
  iconBg = 'bg-pakistan-green-50',
  iconColor = 'text-pakistan-green',
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-xl !p-6 shadow-sm border border-gray-100
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 !mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 !mt-1">{subtitle}</p>
          )}
          {change && (
            <div className="!mt-3">
              <span
                className={`
                  inline-flex items-center !px-2 !py-1 rounded-full text-xs font-medium
                  ${changeColors[changeType]}
                `}
              >
                {changeType === 'positive' && '↑ '}
                {changeType === 'negative' && '↓ '}
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`!p-3 rounded-xl ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;

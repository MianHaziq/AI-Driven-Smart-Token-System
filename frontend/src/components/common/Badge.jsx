const variants = {
  // Status variants
  waiting: 'bg-amber-100 text-amber-800 border-amber-200',
  called: 'bg-blue-100 text-blue-800 border-blue-200',
  serving: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'no-show': 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',

  // General variants
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-pakistan-green-50 text-pakistan-green border-pakistan-green-100',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  gold: 'bg-amber-50 text-amber-700 border-amber-200',

  // Priority variants
  normal: 'bg-gray-100 text-gray-700 border-gray-200',
  senior: 'bg-purple-100 text-purple-800 border-purple-200',
  disabled: 'bg-blue-100 text-blue-800 border-blue-200',
  vip: 'bg-amber-100 text-amber-800 border-amber-200',

  // Counter status
  open: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
  break: 'bg-amber-100 text-amber-800 border-amber-200',
};

const sizes = {
  sm: '!px-2 !py-0.5 text-xs',
  md: '!px-2.5 !py-1 text-sm',
  lg: '!px-3 !py-1.5 text-base',
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full !mr-1.5
            ${variant === 'waiting' ? 'bg-amber-500' : ''}
            ${variant === 'called' ? 'bg-blue-500' : ''}
            ${variant === 'serving' ? 'bg-green-500' : ''}
            ${variant === 'completed' ? 'bg-emerald-500' : ''}
            ${variant === 'no-show' || variant === 'danger' ? 'bg-red-500' : ''}
            ${variant === 'cancelled' || variant === 'default' ? 'bg-gray-500' : ''}
            ${variant === 'primary' ? 'bg-pakistan-green' : ''}
            ${variant === 'success' || variant === 'open' ? 'bg-green-500' : ''}
            ${variant === 'warning' || variant === 'break' ? 'bg-amber-500' : ''}
            ${variant === 'info' ? 'bg-blue-500' : ''}
            ${variant === 'closed' ? 'bg-red-500' : ''}
          `}
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 !mr-1" />}
      {children}
    </span>
  );
};

export default Badge;

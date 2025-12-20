import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: '!p-4',
    md: '!p-6',
    lg: '!p-8',
  };

  const baseClasses = `
    bg-white rounded-xl shadow-sm border border-gray-100
    ${paddingClasses[padding] || paddingClasses.md}
    ${hover ? 'card-hover cursor-pointer' : ''}
    ${className}
  `;

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
Card.Header = ({ children, className = '', border = true }) => (
  <div
    className={`
      ${border ? 'border-b border-gray-100 !pb-4 !mb-4' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

// Card Title Component
Card.Title = ({ children, className = '', subtitle }) => (
  <div className={className}>
    <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
    {subtitle && <p className="text-sm text-gray-500 !mt-1">{subtitle}</p>}
  </div>
);

// Card Body Component
Card.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

// Card Footer Component
Card.Footer = ({ children, className = '', border = true }) => (
  <div
    className={`
      ${border ? 'border-t border-gray-100 !pt-4 !mt-4' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

export default Card;

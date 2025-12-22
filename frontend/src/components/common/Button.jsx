import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: '!bg-pakistan-green hover:bg-pakistan-green-light text-white',
  secondary: '!bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: '!border-2 border-pakistan-green text-pakistan-green hover:bg-pakistan-green hover:text-white',
  ghost: 'text-pakistan-green hover:bg-pakistan-green-50',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  gold: 'bg-gold hover:bg-gold-dark text-white',
};

const sizes = {
  sm: '!px-3 !py-1.5 text-sm',
  md: '!px-4 !py-2 text-base',
  lg: '!px-6 !py-3 text-lg',
  xl: '!px-8 !py-4 text-xl',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pakistan-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;
    const widthClasses = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin !-ml-1 !mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="!mr-2 h-5 w-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="!ml-2 h-5 w-5" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

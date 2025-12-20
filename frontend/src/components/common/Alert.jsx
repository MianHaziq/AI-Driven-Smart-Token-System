import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: FiCheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: FiAlertCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: FiAlertTriangle,
    iconColor: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: FiInfo,
    iconColor: 'text-blue-500',
  },
};

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  show = true,
}) => {
  const styles = variants[variant] || variants.info;
  const Icon = styles.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`
            rounded-lg border !p-4
            ${styles.bg} ${styles.border}
            ${className}
          `}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <div className="!ml-3 flex-1">
              {title && (
                <h3 className={`text-sm font-medium ${styles.text}`}>{title}</h3>
              )}
              {children && (
                <div className={`${title ? '!mt-1' : ''} text-sm ${styles.text}`}>
                  {children}
                </div>
              )}
            </div>
            {onClose && (
              <div className="flex-shrink-0 !ml-3">
                <button
                  onClick={onClose}
                  className={`
                    inline-flex rounded-md !p-1.5
                    ${styles.text} hover:bg-black/5
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                  `}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;

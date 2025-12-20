import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  footer,
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full !mx-4',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleOverlayClick}
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={handleOverlayClick}
          >
            <div className="flex min-h-full items-center justify-center !p-4">
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={`
                  w-full ${sizes[size] || sizes.md}
                  bg-white rounded-2xl shadow-xl
                  ${className}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                {(title || showClose) && (
                  <div className="flex items-center justify-between !p-6 border-b border-gray-100">
                    {title && (
                      <h3 className="text-xl font-semibold text-gray-900">
                        {title}
                      </h3>
                    )}
                    {showClose && (
                      <button
                        onClick={onClose}
                        className="!p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="!p-6">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex items-center justify-end !gap-3 !p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    {footer}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;

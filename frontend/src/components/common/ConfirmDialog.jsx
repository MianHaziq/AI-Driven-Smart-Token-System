import Modal from './Modal';
import Button from './Button';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const icons = {
    danger: FiTrash2,
    warning: FiAlertTriangle,
  };

  const iconBgs = {
    danger: 'bg-red-100',
    warning: 'bg-amber-100',
  };

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-amber-600',
  };

  const Icon = icons[variant] || icons.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center">
        <div
          className={`
            mx-auto w-14 h-14 rounded-full flex items-center justify-center !mb-4
            ${iconBgs[variant]}
          `}
        >
          <Icon className={`w-7 h-7 ${iconColors[variant]}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 !mb-2">{title}</h3>
        <p className="text-gray-500 !mb-6">{message}</p>
        <div className="flex !gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            icon={FiX}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

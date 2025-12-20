import { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      hint,
      icon: Icon,
      className = '',
      containerClassName = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`!mb-4 ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 !mb-1.5">
            {label}
            {required && <span className="text-red-500 !ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 !pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`
              block w-full rounded-lg border transition-all duration-200
              ${Icon ? '!pl-10' : '!pl-4'}
              ${isPassword ? '!pr-10' : '!pr-4'}
              !py-2.5
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-pakistan-green focus:ring-pakistan-green'
              }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-opacity-20
              placeholder:text-gray-400
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 !pr-3 flex items-center"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
        {error && <p className="!mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="!mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

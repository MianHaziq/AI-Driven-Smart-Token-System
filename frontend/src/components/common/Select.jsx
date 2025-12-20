import { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      hint,
      placeholder = 'Select an option',
      className = '',
      containerClassName = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`!mb-4 ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 !mb-1.5">
            {label}
            {required && <span className="text-red-500 !ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={`
              block w-full rounded-lg border transition-all duration-200
              !pl-4 !pr-10 !py-2.5 appearance-none
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-pakistan-green focus:ring-pakistan-green'
              }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-opacity-20
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center !pr-3 pointer-events-none">
            <FiChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {error && <p className="!mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="!mt-1.5 text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

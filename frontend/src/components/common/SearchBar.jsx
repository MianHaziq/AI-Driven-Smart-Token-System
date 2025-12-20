import { useState, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  debounceMs = 300,
  className = '',
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (onSearch) onSearch(searchValue);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 !pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          block w-full !pl-10 !pr-10 !py-2.5
          border border-gray-300 rounded-lg
          focus:border-pakistan-green focus:ring-pakistan-green
          focus:outline-none focus:ring-2 focus:ring-opacity-20
          placeholder:text-gray-400
          transition-all duration-200
        "
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 !pr-3 flex items-center"
        >
          <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

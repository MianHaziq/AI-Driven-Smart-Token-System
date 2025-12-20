import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Skeleton } from './Loader';

const Table = ({
  columns,
  data,
  loading = false,
  sortBy,
  sortOrder = 'asc',
  onSort,
  emptyMessage = 'No data available',
  className = '',
}) => {
  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;

    const newOrder =
      sortBy === column.key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newOrder);
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;

    if (sortBy === column.key) {
      return sortOrder === 'asc' ? (
        <FiChevronUp className="w-4 h-4 !ml-1" />
      ) : (
        <FiChevronDown className="w-4 h-4 !ml-1" />
      );
    }

    return (
      <div className="w-4 h-4 !ml-1 opacity-0 group-hover:opacity-50">
        <FiChevronUp className="w-4 h-4" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="!px-6 !py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {columns.map((column) => (
                    <td key={column.key} className="!px-6 !py-4">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="!px-6 !py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div className="!py-12 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column)}
                  className={`
                    !px-6 !py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 group' : ''}
                    ${column.className || ''}
                  `}
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`!px-6 !py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
          <Link
            to="/admin/dashboard"
            className="flex items-center hover:text-pakistan-green transition-colors"
          >
            <FiHome className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <FiChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-pakistan-green transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-pakistan-green/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-pakistan-green" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

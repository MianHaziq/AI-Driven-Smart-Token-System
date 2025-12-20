const Loader = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-pakistan-green',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  const spinner = (
    <div
      className={`
        ${sizes[size] || sizes.md}
        ${colors[color] || colors.primary}
        border-t-transparent
        rounded-full animate-spin
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        {spinner}
        {text && (
          <p className="!mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center !p-4">
      {spinner}
      {text && <p className="!mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

// Skeleton Loader
export const Skeleton = ({ className = '', variant = 'rect', ...props }) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${variants[variant] || variants.rect}
        ${className}
      `}
      {...props}
    />
  );
};

// Page Loader
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-pakistan-green border-t-transparent rounded-full animate-spin" />
    <p className="!mt-4 text-gray-500 font-medium">{message}</p>
  </div>
);

// Inline Loader
export const InlineLoader = ({ size = 'sm' }) => {
  const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
  };

  return (
    <div
      className={`
        ${sizes[size] || sizes.sm}
        border-current border-t-transparent
        rounded-full animate-spin inline-block
      `}
    />
  );
};

export default Loader;

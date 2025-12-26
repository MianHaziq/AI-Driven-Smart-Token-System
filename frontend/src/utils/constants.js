// App Constants
export const APP_NAME = 'Smart Queue Pakistan';
export const APP_TAGLINE = 'Apki Baari, Apka Waqt';
export const APP_DESCRIPTION = 'AI-Driven Smart Token System with Predictive Queue Management';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Token Status
export const TOKEN_STATUS = {
  WAITING: 'waiting',
  CALLED: 'called',
  SERVING: 'serving',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
  CANCELLED: 'cancelled',
};

// Token Status Labels
export const TOKEN_STATUS_LABELS = {
  [TOKEN_STATUS.WAITING]: 'Waiting',
  [TOKEN_STATUS.CALLED]: 'Called',
  [TOKEN_STATUS.SERVING]: 'Serving',
  [TOKEN_STATUS.COMPLETED]: 'Completed',
  [TOKEN_STATUS.NO_SHOW]: 'No Show',
  [TOKEN_STATUS.CANCELLED]: 'Cancelled',
};

// Token Status Colors
export const TOKEN_STATUS_COLORS = {
  [TOKEN_STATUS.WAITING]: 'bg-waiting text-white',
  [TOKEN_STATUS.CALLED]: 'bg-called text-white',
  [TOKEN_STATUS.SERVING]: 'bg-serving text-white',
  [TOKEN_STATUS.COMPLETED]: 'bg-completed text-white',
  [TOKEN_STATUS.NO_SHOW]: 'bg-noshow text-white',
  [TOKEN_STATUS.CANCELLED]: 'bg-cancelled text-white',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
};

// Service Center Types
export const SERVICE_CENTER_TYPES = {
  GOVERNMENT: 'government',
  BANK: 'bank',
  HOSPITAL: 'hospital',
  UTILITY: 'utility',
  OTHER: 'other',
};

// Service Center Type Labels
export const SERVICE_CENTER_TYPE_LABELS = {
  [SERVICE_CENTER_TYPES.GOVERNMENT]: 'Government Office',
  [SERVICE_CENTER_TYPES.BANK]: 'Bank',
  [SERVICE_CENTER_TYPES.HOSPITAL]: 'Hospital',
  [SERVICE_CENTER_TYPES.UTILITY]: 'Utility Center',
  [SERVICE_CENTER_TYPES.OTHER]: 'Other',
};

// Priority Types
export const PRIORITY_TYPES = {
  NORMAL: 'normal',
  SENIOR: 'senior',
  DISABLED: 'disabled',
  VIP: 'vip',
};

// Priority Labels
export const PRIORITY_LABELS = {
  [PRIORITY_TYPES.NORMAL]: 'Normal',
  [PRIORITY_TYPES.SENIOR]: 'Senior Citizen',
  [PRIORITY_TYPES.DISABLED]: 'Disabled',
  [PRIORITY_TYPES.VIP]: 'VIP',
};

// Counter Status
export const COUNTER_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  BREAK: 'break',
};

// Counter Status Labels
export const COUNTER_STATUS_LABELS = {
  [COUNTER_STATUS.OPEN]: 'Open',
  [COUNTER_STATUS.CLOSED]: 'Closed',
  [COUNTER_STATUS.BREAK]: 'On Break',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  TOKEN_BOOKED: 'token_booked',
  POSITION_UPDATE: 'position_update',
  ALMOST_TURN: 'almost_turn',
  YOUR_TURN: 'your_turn',
  NO_SHOW_WARNING: 'no_show_warning',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Days of Week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Pakistani Cities
export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
];

// Pakistani Provinces
export const PAKISTANI_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Kashmir',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'hh:mm A';
export const DATETIME_FORMAT = 'DD/MM/YYYY hh:mm A';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sqp_auth_token',
  USER_DATA: 'sqp_user_data',
  THEME: 'sqp_theme',
  LANGUAGE: 'sqp_language',
};

// Services Data with Sub-Services
export const SERVICES = [
  {
    id: 'nadra',
    name: 'NADRA',
    description: 'National Database & Registration Authority',
    icon: 'FiCreditCard',
    emoji: '🪪',
    color: 'bg-blue-500',
    subServices: [
      { id: 'cnic-new', name: 'New CNIC', duration: 15, fee: 400 },
      { id: 'cnic-renewal', name: 'CNIC Renewal', duration: 10, fee: 400 },
      { id: 'cnic-modification', name: 'CNIC Modification', duration: 15, fee: 500 },
      { id: 'family-registration', name: 'Family Registration Certificate', duration: 20, fee: 600 },
      { id: 'nicop', name: 'NICOP Application', duration: 20, fee: 3000 },
      { id: 'poc', name: 'Pakistan Origin Card', duration: 25, fee: 5000 },
    ],
  },
  {
    id: 'passport',
    name: 'Passport Office',
    description: 'Directorate General of Immigration & Passports',
    icon: 'FiGlobe',
    emoji: '📘',
    color: 'bg-green-600',
    subServices: [
      { id: 'passport-new', name: 'New Passport', duration: 30, fee: 3500 },
      { id: 'passport-renewal', name: 'Passport Renewal', duration: 25, fee: 3500 },
      { id: 'passport-urgent', name: 'Urgent Passport', duration: 20, fee: 9000 },
      { id: 'passport-lost', name: 'Lost Passport Replacement', duration: 30, fee: 5000 },
      { id: 'child-passport', name: 'Child Passport', duration: 25, fee: 2500 },
    ],
  },
  {
    id: 'excise',
    name: 'Excise & Taxation',
    description: 'Vehicle Registration & Property Tax',
    icon: 'FiTruck',
    emoji: '🚗',
    color: 'bg-amber-500',
    subServices: [
      { id: 'vehicle-registration', name: 'Vehicle Registration', duration: 45, fee: 2000 },
      { id: 'vehicle-transfer', name: 'Vehicle Transfer', duration: 40, fee: 1500 },
      { id: 'driving-license-new', name: 'New Driving License', duration: 30, fee: 1200 },
      { id: 'driving-license-renewal', name: 'Driving License Renewal', duration: 20, fee: 800 },
      { id: 'property-tax', name: 'Property Tax Payment', duration: 15, fee: 0 },
    ],
  },
  {
    id: 'electricity',
    name: 'Electricity (WAPDA/LESCO)',
    description: 'Electricity Connection & Billing',
    icon: 'FiZap',
    emoji: '💡',
    color: 'bg-yellow-500',
    subServices: [
      { id: 'new-connection', name: 'New Connection', duration: 30, fee: 5000 },
      { id: 'meter-change', name: 'Meter Change Request', duration: 20, fee: 1000 },
      { id: 'load-extension', name: 'Load Extension', duration: 25, fee: 3000 },
      { id: 'billing-complaint', name: 'Billing Complaint', duration: 15, fee: 0 },
      { id: 'connection-transfer', name: 'Connection Transfer', duration: 20, fee: 500 },
    ],
  },
  {
    id: 'sui-gas',
    name: 'Sui Gas',
    description: 'Gas Connection & Services',
    icon: 'FiThermometer',
    emoji: '🌡️',
    color: 'bg-orange-500',
    subServices: [
      { id: 'gas-new-connection', name: 'New Gas Connection', duration: 35, fee: 8000 },
      { id: 'gas-meter-change', name: 'Meter Replacement', duration: 20, fee: 1500 },
      { id: 'gas-complaint', name: 'Gas Leakage Complaint', duration: 10, fee: 0 },
      { id: 'gas-bill-correction', name: 'Bill Correction', duration: 15, fee: 0 },
    ],
  },
  {
    id: 'banks',
    name: 'Banks',
    description: 'Banking Services',
    icon: 'FiDollarSign',
    emoji: '🏦',
    color: 'bg-indigo-500',
    subServices: [
      { id: 'account-opening', name: 'Account Opening', duration: 30, fee: 0 },
      { id: 'atm-card', name: 'ATM/Debit Card Issuance', duration: 15, fee: 500 },
      { id: 'cheque-book', name: 'Cheque Book Request', duration: 10, fee: 300 },
      { id: 'bank-statement', name: 'Bank Statement', duration: 10, fee: 200 },
      { id: 'loan-inquiry', name: 'Loan Inquiry', duration: 25, fee: 0 },
    ],
  },
];

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',

  // Public token routes (for quick access without full layout)
  BOOK_TOKEN: '/book-token',

  // Customer routes (protected, with CustomerLayout)
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  MY_TOKENS: '/customer/my-tokens',
  TOKEN_HISTORY: '/customer/history',
  CUSTOMER_PROFILE: '/customer/profile',
  TOKEN_DETAILS: '/token/:id',
  LIVE_TRACKING: '/track/:id',

  // Legacy routes (for backwards compatibility)
  PROFILE: '/customer/profile',
  SETTINGS: '/customer/profile',

  // Admin routes (protected, with AdminLayout)
  ADMIN_DASHBOARD: '/admin/dashboard',
  MANAGE_QUEUE: '/admin/queue',
  MANAGE_SERVICES: '/admin/services',
  MANAGE_COUNTERS: '/admin/counters',
  MANAGE_TOKENS: '/admin/tokens',
  ANALYTICS: '/admin/analytics',
  USER_MANAGEMENT: '/admin/users',
  SYSTEM_SETTINGS: '/admin/settings',
  AUDIT_LOGS: '/admin/logs',
};

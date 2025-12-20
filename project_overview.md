# Smart Queue Pakistan - Complete Project Documentation

## AI-Driven Smart Token System with Predictive Queue Management

### University Final Year Project
**University of Central Punjab**
**Group ID:** F25SE061

---

## Project Identity

### Name: **Smart Queue Pakistan** (SQP)
### Tagline: "Apki Baari, Apka Waqt" (Your Turn, Your Time)

### Color Palette (Pakistan Flag Theme)

```css
/* Primary Colors */
--pakistan-green: #01411C;       /* Dark Green - Primary */
--pakistan-green-light: #006400; /* Light Green - Hover */
--pakistan-white: #FFFFFF;       /* White - Background */

/* Secondary Colors */
--accent-gold: #D4AF37;          /* Gold - Highlights */
--text-dark: #1a1a1a;            /* Dark Text */
--text-gray: #4a5568;            /* Secondary Text */
--border-gray: #e2e8f0;          /* Borders */
--background-gray: #f7fafc;      /* Light Background */

/* Status Colors */
--status-waiting: #F59E0B;       /* Orange - Waiting */
--status-called: #3B82F6;        /* Blue - Called */
--status-serving: #01411C;       /* Green - Serving */
--status-completed: #10B981;     /* Emerald - Completed */
--status-noshow: #EF4444;        /* Red - No Show */
```

### Design Style
- **Government Official Look** - Clean, trustworthy, professional
- **Pakistani Identity** - Green and white dominant colors
- **Crescent & Star motifs** - Subtle decorative elements
- **Urdu/English** - Bilingual support (English primary)

---

## Complete System Overview

### What We Are Building

A **web-based intelligent queue management system** for Pakistani government offices, banks, hospitals, and service centers that:

1. **Eliminates Physical Waiting** - Book tokens remotely
2. **Predicts Wait Times** - AI-powered accurate estimates
3. **Tracks in Real-Time** - Live queue position updates
4. **Smart Reordering** - Dynamic queue based on customer arrival
5. **Handles No-Shows** - Automatic detection and queue adjustment
6. **Provides Analytics** - Data-driven insights for management

### Target Users
- **Citizens** - Book tokens, track queue, receive notifications
- **Counter Staff (Admin)** - Manage queue, call tokens, mark complete
- **Management (Super Admin)** - Analytics, configuration, oversight

### Target Venues
- NADRA Offices
- Passport Offices
- Banks (HBL, UBL, MCB, etc.)
- Government Hospitals (OPD)
- Utility Bill Centers (WAPDA, Sui Gas)
- Vehicle Registration (Excise)

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SMART QUEUE PAKISTAN                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React + Tailwind)                   │  │
│  │                    Pakistani Government Theme                    │  │
│  ├─────────────────┬─────────────────┬─────────────────────────────┤  │
│  │  Public Portal  │ Citizen Portal  │      Admin Dashboard        │  │
│  │  ─────────────  │ ──────────────  │      ────────────────       │  │
│  │  • Landing      │ • Dashboard     │  • Queue Management         │  │
│  │  • Login        │ • Book Token    │  • Call/Skip/Complete       │  │
│  │  • Register     │ • My Tokens     │  • Service Config           │  │
│  │  • About        │ • Track Status  │  • Analytics                │  │
│  │  • Contact      │ • Profile       │  • User Management          │  │
│  └─────────────────┴─────────────────┴─────────────────────────────┘  │
│                              │                                         │
│                              ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   BACKEND (Node.js + Express)                    │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │  Auth API  │ Token API │ Queue API │ Analytics │ Notification   │  │
│  │  (JWT)     │ (CRUD)    │ (Real-time)│ (Reports) │ (Email/Push)  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                              │                                         │
│          ┌───────────────────┼───────────────────┐                    │
│          ▼                   ▼                   ▼                    │
│   ┌────────────┐     ┌────────────┐      ┌────────────┐              │
│   │  MongoDB   │     │ Socket.IO  │      │  AI/ML     │              │
│   │  Database  │     │ Real-time  │      │ Prediction │              │
│   └────────────┘     └────────────┘      └────────────┘              │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Complete Project Structure

### Frontend Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.png                    # Pakistan themed logo
│   └── manifest.json
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── hero-bg.jpg
│   │   │   ├── pakistan-pattern.svg
│   │   │   └── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Top navigation with logo
│   │   │   ├── Sidebar.jsx         # Side navigation for dashboard
│   │   │   ├── Footer.jsx          # Footer with govt style
│   │   │   ├── Button.jsx          # Green themed buttons
│   │   │   ├── Input.jsx           # Form inputs
│   │   │   ├── Select.jsx          # Dropdown select
│   │   │   ├── Modal.jsx           # Popup modals
│   │   │   ├── Card.jsx            # Content cards
│   │   │   ├── Badge.jsx           # Status badges
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── Alert.jsx           # Alert messages
│   │   │   ├── Table.jsx           # Data tables
│   │   │   ├── Pagination.jsx      # Table pagination
│   │   │   ├── SearchBar.jsx       # Search input
│   │   │   ├── StatCard.jsx        # Statistics card
│   │   │   ├── EmptyState.jsx      # Empty state placeholder
│   │   │   └── ConfirmDialog.jsx   # Confirmation popup
│   │   │
│   │   ├── customer/
│   │   │   ├── TokenCard.jsx       # Display single token info
│   │   │   ├── TokenList.jsx       # List of user's tokens
│   │   │   ├── QueuePosition.jsx   # Current position display
│   │   │   ├── WaitTimeDisplay.jsx # Estimated wait time
│   │   │   ├── ServiceCard.jsx     # Service selection card
│   │   │   ├── ServiceCenterCard.jsx # Service center card
│   │   │   ├── LiveQueueView.jsx   # Real-time queue display
│   │   │   ├── LocationSharing.jsx # GPS location component
│   │   │   └── NotificationBell.jsx # Notification dropdown
│   │   │
│   │   └── admin/
│   │       ├── QueuePanel.jsx      # Main queue management
│   │       ├── TokenItem.jsx       # Single token in queue
│   │       ├── CallNextButton.jsx  # Call next token button
│   │       ├── QueueStats.jsx      # Quick stats display
│   │       ├── ServiceForm.jsx     # Add/edit service form
│   │       ├── CounterDisplay.jsx  # Current serving display
│   │       ├── AnalyticsChart.jsx  # Charts component
│   │       ├── RecentActivity.jsx  # Activity feed
│   │       └── QuickActions.jsx    # Quick action buttons
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Landing.jsx         # Homepage
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Registration page
│   │   │   ├── ForgotPassword.jsx  # Password reset
│   │   │   ├── About.jsx           # About the system
│   │   │   └── Contact.jsx         # Contact information
│   │   │
│   │   ├── customer/
│   │   │   ├── Dashboard.jsx       # Customer home
│   │   │   ├── BookToken.jsx       # Book new token
│   │   │   ├── SelectService.jsx   # Service selection step
│   │   │   ├── ConfirmBooking.jsx  # Booking confirmation
│   │   │   ├── MyTokens.jsx        # All tokens history
│   │   │   ├── TokenDetails.jsx    # Single token details
│   │   │   ├── LiveTracking.jsx    # Real-time tracking
│   │   │   ├── Profile.jsx         # User profile
│   │   │   └── Settings.jsx        # User settings
│   │   │
│   │   └── admin/
│   │       ├── Dashboard.jsx       # Admin home
│   │       ├── ManageQueue.jsx     # Queue management
│   │       ├── ManageServices.jsx  # Services CRUD
│   │       ├── ManageCounters.jsx  # Counter management
│   │       ├── Analytics.jsx       # Reports & analytics
│   │       ├── UserManagement.jsx  # Manage users (super admin)
│   │       ├── SystemSettings.jsx  # System configuration
│   │       └── AuditLogs.jsx       # Activity logs
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx        # Layout for public pages
│   │   ├── CustomerLayout.jsx      # Layout for customer pages
│   │   ├── AdminLayout.jsx         # Layout for admin pages
│   │   └── AuthLayout.jsx          # Layout for auth pages
│   │
│   ├── store/
│   │   ├── authStore.js            # Authentication state
│   │   ├── tokenStore.js           # Token/queue state
│   │   ├── uiStore.js              # UI state (modals, etc.)
│   │   └── notificationStore.js    # Notifications state
│   │
│   ├── services/
│   │   ├── api.js                  # Axios instance
│   │   ├── authService.js          # Auth API calls
│   │   ├── tokenService.js         # Token API calls
│   │   ├── serviceService.js       # Service API calls
│   │   ├── queueService.js         # Queue API calls
│   │   ├── analyticsService.js     # Analytics API calls
│   │   └── socketService.js        # Socket.IO connection
│   │
│   ├── hooks/
│   │   ├── useAuth.js              # Auth hook
│   │   ├── useSocket.js            # Socket.IO hook
│   │   ├── useGeolocation.js       # GPS location hook
│   │   ├── useNotification.js      # Browser notifications
│   │   └── useCountdown.js         # Timer countdown hook
│   │
│   ├── utils/
│   │   ├── constants.js            # App constants
│   │   ├── helpers.js              # Helper functions
│   │   ├── validators.js           # Form validation
│   │   ├── formatters.js           # Date/number formatters
│   │   └── storage.js              # Local storage helpers
│   │
│   ├── styles/
│   │   └── globals.css             # Global styles
│   │
│   ├── App.jsx                     # Main app with routes
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind imports
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env
```

### Backend Structure

```
backend/
├── config/
│   ├── db.js                       # MongoDB connection
│   ├── socket.js                   # Socket.IO config
│   └── email.js                    # Email configuration
│
├── models/
│   ├── User.js                     # User schema
│   ├── ServiceCenter.js            # Service center schema
│   ├── Service.js                  # Service schema
│   ├── Token.js                    # Token schema
│   ├── Counter.js                  # Counter/window schema
│   ├── QueueRecord.js              # Queue history schema
│   ├── Notification.js             # Notification schema
│   └── AuditLog.js                 # Audit log schema
│
├── controllers/
│   ├── authController.js           # Auth logic
│   ├── userController.js           # User management
│   ├── serviceCenterController.js  # Service center CRUD
│   ├── serviceController.js        # Service CRUD
│   ├── tokenController.js          # Token operations
│   ├── queueController.js          # Queue management
│   ├── counterController.js        # Counter operations
│   ├── analyticsController.js      # Reports & stats
│   └── notificationController.js   # Notification handling
│
├── routes/
│   ├── index.js                    # Route aggregator
│   ├── authRoutes.js               # /api/auth/*
│   ├── userRoutes.js               # /api/users/*
│   ├── serviceCenterRoutes.js      # /api/service-centers/*
│   ├── serviceRoutes.js            # /api/services/*
│   ├── tokenRoutes.js              # /api/tokens/*
│   ├── queueRoutes.js              # /api/queue/*
│   ├── counterRoutes.js            # /api/counters/*
│   └── analyticsRoutes.js          # /api/analytics/*
│
├── middleware/
│   ├── auth.js                     # JWT verification
│   ├── roleCheck.js                # Role-based access
│   ├── errorHandler.js             # Global error handler
│   ├── validator.js                # Request validation
│   └── rateLimiter.js              # Rate limiting
│
├── services/
│   ├── queueService.js             # Queue logic
│   ├── predictionService.js        # AI wait time prediction
│   ├── notificationService.js      # Send notifications
│   ├── emailService.js             # Email sending
│   └── locationService.js          # ETA calculations
│
├── socket/
│   ├── index.js                    # Socket.IO setup
│   ├── queueHandlers.js            # Queue socket events
│   └── notificationHandlers.js     # Notification events
│
├── utils/
│   ├── helpers.js                  # Utility functions
│   ├── tokenGenerator.js           # Generate token numbers
│   ├── validators.js               # Validation helpers
│   └── logger.js                   # Logging utility
│
├── .env                            # Environment variables
├── .env.example                    # Example env file
├── index.js                        # Server entry point
└── package.json
```

---

## Database Models (Detailed)

### 1. User Model

```javascript
{
  _id: ObjectId,
  name: String,                    // "Ahmed Khan"
  email: String,                   // unique, indexed
  password: String,                // bcrypt hashed
  phone: String,                   // "+92 300 1234567"
  cnic: String,                    // "35201-1234567-1" (optional)
  role: {
    type: String,
    enum: ['customer', 'admin', 'superadmin'],
    default: 'customer'
  },
  serviceCenterId: ObjectId,       // For admin users
  avatar: String,                  // Profile picture URL
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. ServiceCenter Model

```javascript
{
  _id: ObjectId,
  name: String,                    // "NADRA Office Lahore"
  code: String,                    // "NADRA-LHR-01"
  type: {
    type: String,
    enum: ['government', 'bank', 'hospital', 'utility', 'other']
  },
  address: {
    street: String,
    city: String,
    province: String,
    postalCode: String
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]          // [longitude, latitude]
  },
  contactNumber: String,
  email: String,
  workingHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    // ... other days
  },
  counters: Number,                // Number of service counters
  maxQueueCapacity: Number,        // Maximum tokens per day
  currentQueueCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Service Model

```javascript
{
  _id: ObjectId,
  serviceCenterId: ObjectId,       // Reference
  name: String,                    // "CNIC Renewal"
  nameUrdu: String,                // "شناختی کارڈ کی تجدید"
  description: String,
  code: String,                    // "CNIC-REN"
  category: String,                // "Identity Documents"
  avgServiceTime: Number,          // In minutes (e.g., 15)
  requiredDocuments: [String],     // List of required docs
  fee: Number,                     // Service fee if any
  priority: Number,                // Display order
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Token Model

```javascript
{
  _id: ObjectId,
  tokenNumber: String,             // "A-001", "B-042"
  displayNumber: String,           // For display boards
  userId: ObjectId,                // Customer reference
  serviceCenterId: ObjectId,
  serviceId: ObjectId,
  counterId: ObjectId,             // Assigned counter (when called)

  status: {
    type: String,
    enum: ['waiting', 'called', 'serving', 'completed', 'no-show', 'cancelled'],
    default: 'waiting'
  },

  // Queue Information
  position: Number,                // Current position in queue
  initialPosition: Number,         // Position when booked

  // Time Tracking
  estimatedWaitTime: Number,       // In minutes
  predictedServiceTime: Date,      // When service expected
  bookedAt: Date,
  calledAt: Date,
  serviceStartedAt: Date,
  completedAt: Date,

  // Location Tracking
  customerLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  lastLocationUpdate: Date,
  estimatedArrival: Date,
  distanceFromCenter: Number,      // In kilometers

  // Additional Info
  notes: String,                   // Admin notes
  priority: {
    type: String,
    enum: ['normal', 'senior', 'disabled', 'vip'],
    default: 'normal'
  },

  // Feedback
  rating: Number,                  // 1-5 stars
  feedback: String,

  createdAt: Date,
  updatedAt: Date
}

// Indexes
tokenSchema.index({ serviceCenterId: 1, status: 1 });
tokenSchema.index({ userId: 1, createdAt: -1 });
tokenSchema.index({ tokenNumber: 1, serviceCenterId: 1 });
```

### 5. Counter Model

```javascript
{
  _id: ObjectId,
  serviceCenterId: ObjectId,
  counterNumber: Number,           // 1, 2, 3...
  name: String,                    // "Counter 1" or "Window A"
  services: [ObjectId],            // Services this counter handles
  currentToken: ObjectId,          // Currently serving token
  operatorId: ObjectId,            // Admin user assigned
  status: {
    type: String,
    enum: ['open', 'closed', 'break'],
    default: 'closed'
  },
  tokensServedToday: Number,
  avgServiceTime: Number,          // Running average
  isActive: Boolean,
  createdAt: Date
}
```

### 6. QueueRecord Model (Historical Data for AI)

```javascript
{
  _id: ObjectId,
  tokenId: ObjectId,
  serviceCenterId: ObjectId,
  serviceId: ObjectId,

  // Time Data
  dayOfWeek: Number,               // 0-6
  hourOfDay: Number,               // 0-23
  date: Date,

  // Queue Metrics
  positionAtBooking: Number,
  finalPosition: Number,

  // Duration Metrics (in minutes)
  estimatedWaitTime: Number,
  actualWaitTime: Number,
  serviceTime: Number,

  // Outcome
  wasNoShow: Boolean,
  wasCancelled: Boolean,

  // Used for ML training
  queueLengthAtBooking: Number,
  activeCounters: Number,

  createdAt: Date
}
```

### 7. Notification Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  tokenId: ObjectId,

  type: {
    type: String,
    enum: ['token_booked', 'position_update', 'almost_turn',
           'your_turn', 'no_show_warning', 'completed', 'cancelled']
  },

  title: String,
  message: String,

  channels: {
    inApp: Boolean,
    email: Boolean,
    push: Boolean
  },

  isRead: Boolean,
  readAt: Date,
  sentAt: Date,

  createdAt: Date
}
```

---

## API Endpoints (Complete)

### Authentication APIs

```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
POST   /api/auth/verify-email      # Verify email address
PUT    /api/auth/change-password   # Change password
```

### User APIs

```
GET    /api/users                  # List users (admin)
GET    /api/users/:id              # Get user details
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user (admin)
PUT    /api/users/profile          # Update own profile
```

### Service Center APIs

```
GET    /api/service-centers                  # List all centers
GET    /api/service-centers/:id              # Get center details
POST   /api/service-centers                  # Create center (superadmin)
PUT    /api/service-centers/:id              # Update center
DELETE /api/service-centers/:id              # Delete center
GET    /api/service-centers/:id/services     # Get services of a center
GET    /api/service-centers/:id/queue        # Get current queue
GET    /api/service-centers/:id/stats        # Get center stats
GET    /api/service-centers/nearby           # Find nearby centers (GPS)
```

### Service APIs

```
GET    /api/services                         # List all services
GET    /api/services/:id                     # Get service details
POST   /api/services                         # Create service (admin)
PUT    /api/services/:id                     # Update service
DELETE /api/services/:id                     # Delete service
```

### Token APIs

```
POST   /api/tokens/book                      # Book new token
GET    /api/tokens/my-tokens                 # Get user's tokens
GET    /api/tokens/:id                       # Get token details
GET    /api/tokens/:id/status                # Get live status
PATCH  /api/tokens/:id/cancel                # Cancel token
PATCH  /api/tokens/:id/location              # Update customer location
POST   /api/tokens/:id/feedback              # Submit feedback
```

### Queue APIs (Admin)

```
GET    /api/queue/:serviceCenterId           # Get current queue
GET    /api/queue/:serviceCenterId/waiting   # Get waiting tokens
POST   /api/queue/call-next                  # Call next token
PATCH  /api/queue/:tokenId/call              # Call specific token
PATCH  /api/queue/:tokenId/serving           # Start serving
PATCH  /api/queue/:tokenId/complete          # Mark complete
PATCH  /api/queue/:tokenId/no-show           # Mark no-show
PATCH  /api/queue/:tokenId/recall            # Recall token
POST   /api/queue/reorder                    # Reorder queue
```

### Counter APIs

```
GET    /api/counters/:serviceCenterId        # List counters
POST   /api/counters                         # Create counter
PUT    /api/counters/:id                     # Update counter
PATCH  /api/counters/:id/status              # Change counter status
DELETE /api/counters/:id                     # Delete counter
```

### Analytics APIs

```
GET    /api/analytics/overview               # Dashboard overview
GET    /api/analytics/wait-times             # Wait time analysis
GET    /api/analytics/peak-hours             # Peak hours analysis
GET    /api/analytics/service-performance    # Service performance
GET    /api/analytics/no-show-rate           # No-show statistics
GET    /api/analytics/daily-report           # Daily report
GET    /api/analytics/export                 # Export data
```

### Notification APIs

```
GET    /api/notifications                    # Get user notifications
PATCH  /api/notifications/:id/read           # Mark as read
PATCH  /api/notifications/read-all           # Mark all as read
DELETE /api/notifications/:id                # Delete notification
```

---

## Frontend Pages (Detailed)

### Public Pages

#### 1. Landing Page (Landing.jsx)

```
Sections:
├── Hero Section
│   ├── Pakistani flag themed gradient background
│   ├── Main heading: "Smart Queue Pakistan"
│   ├── Subheading: "Apki Baari, Apka Waqt"
│   ├── CTA buttons: "Book Token" | "Track Token"
│   └── Hero image/illustration
│
├── Features Section
│   ├── AI Wait Time Prediction
│   ├── Real-time Queue Tracking
│   ├── No More Physical Waiting
│   └── Smart Notifications
│
├── How It Works
│   ├── Step 1: Select Service Center
│   ├── Step 2: Choose Service
│   ├── Step 3: Get Token & Wait Time
│   └── Step 4: Get Notified When Ready
│
├── Supported Services
│   ├── NADRA
│   ├── Passport Office
│   ├── Banks
│   └── Hospitals
│
├── Statistics
│   ├── "100,000+ Tokens Served"
│   ├── "50+ Service Centers"
│   └── "95% Customer Satisfaction"
│
└── Footer
    ├── Government of Pakistan branding
    ├── Quick links
    └── Contact information
```

#### 2. Login Page (Login.jsx)

```
Layout:
├── Split screen (image | form)
├── Pakistan themed illustration
├── Logo at top
├── Form:
│   ├── Email input
│   ├── Password input
│   ├── Remember me checkbox
│   ├── Forgot password link
│   └── Login button (green)
├── Register link
└── Back to home link
```

#### 3. Register Page (Register.jsx)

```
Form Fields:
├── Full Name
├── Email Address
├── Phone Number (+92)
├── CNIC (optional)
├── Password
├── Confirm Password
├── Terms checkbox
└── Register button
```

### Customer Pages

#### 4. Customer Dashboard (customer/Dashboard.jsx)

```
Layout:
├── Welcome message with name
├── Quick Stats Cards:
│   ├── Active Tokens
│   ├── Completed Today
│   └── Average Wait Time
│
├── Active Token Card (if any)
│   ├── Token Number (large)
│   ├── Service Name
│   ├── Position in Queue
│   ├── Estimated Wait Time
│   ├── Progress bar
│   └── Track button
│
├── Quick Actions
│   ├── Book New Token
│   ├── View All Tokens
│   └── Update Profile
│
└── Recent Tokens List
```

#### 5. Book Token Page (customer/BookToken.jsx)

```
Multi-step Form:

Step 1: Select Location
├── Search box
├── List of service centers
├── Map view (Leaflet)
└── Each card shows:
    ├── Center name
    ├── Address
    ├── Current queue length
    └── Select button

Step 2: Select Service
├── List of services at selected center
├── Each service shows:
│   ├── Service name (English + Urdu)
│   ├── Average time
│   ├── Current wait estimate
│   └── Required documents
└── Select button

Step 3: Confirm Booking
├── Summary card:
│   ├── Service Center
│   ├── Service
│   ├── Estimated Wait Time
│   └── Expected Service Time
├── Enable location checkbox
├── Terms checkbox
└── Confirm Booking button

Step 4: Booking Confirmed
├── Success animation
├── Token Number (large, prominent)
├── QR Code
├── Add to Calendar option
└── Track Token button
```

#### 6. Token Status Page (customer/TokenDetails.jsx)

```
Layout:
├── Token Header
│   ├── Token Number (A-001)
│   ├── Status Badge
│   └── Service Center Name
│
├── Queue Progress
│   ├── Visual progress indicator
│   ├── Current Position: "5th in queue"
│   ├── Estimated Wait: "~25 minutes"
│   └── People ahead: 4
│
├── Live Queue View
│   ├── Now Serving: A-096
│   ├── Your Token: A-001
│   └── Queue visualization
│
├── Location Section
│   ├── Map showing:
│   │   ├── Service center location
│   │   └── Your current location
│   ├── Distance: 2.5 km
│   ├── ETA if you leave now: 10 mins
│   └── Share Location toggle
│
├── Timeline
│   ├── ✓ Token Booked - 10:00 AM
│   ├── ○ Position Updated - 10:15 AM
│   ├── ○ Your Turn Soon
│   └── ○ Service Complete
│
└── Actions
    ├── Cancel Token
    └── Get Directions
```

### Admin Pages

#### 7. Admin Dashboard (admin/Dashboard.jsx)

```
Layout:
├── Header with date/time
├── Stats Row:
│   ├── Total Tokens Today
│   ├── Currently Waiting
│   ├── Avg Wait Time
│   ├── No-Shows
│   └── Completed
│
├── Current Queue Panel
│   ├── Now Serving: A-096 at Counter 1
│   ├── Next: A-097
│   └── Call Next Button
│
├── Queue Chart (hourly distribution)
│
├── Recent Activity Feed
│   ├── Token A-096 called
│   ├── Token A-095 completed
│   └── etc.
│
└── Quick Actions
    ├── Call Next Token
    ├── Add Service
    └── View Analytics
```

#### 8. Manage Queue Page (admin/ManageQueue.jsx)

```
Layout:
├── Queue Header
│   ├── Service Center Name
│   ├── Total in Queue: 25
│   └── Refresh button
│
├── Counter Status Bar
│   ├── Counter 1: Serving A-096
│   ├── Counter 2: Open
│   └── Counter 3: Break
│
├── Main Queue List
│   Each token card shows:
│   ├── Token Number
│   ├── Customer Name
│   ├── Service Type
│   ├── Wait Time
│   ├── Location Status (icon)
│   ├── Priority Badge
│   └── Actions:
│       ├── Call
│       ├── Skip
│       └── Mark No-Show
│
├── Called Tokens Section
│   └── List of called but not served
│
└── Completed Today Section
    └── Collapsible list
```

#### 9. Analytics Page (admin/Analytics.jsx)

```
Layout:
├── Date Range Selector
│
├── Key Metrics Cards
│   ├── Total Tokens
│   ├── Avg Wait Time
│   ├── Peak Hour
│   └── No-Show Rate
│
├── Charts Section
│   ├── Tokens by Hour (Bar chart)
│   ├── Wait Time Trend (Line chart)
│   ├── Services Distribution (Pie chart)
│   └── Weekly Comparison (Bar chart)
│
├── Service Performance Table
│   ├── Service Name
│   ├── Tokens Served
│   ├── Avg Time
│   └── Satisfaction
│
└── Export Button
```

---

## Real-time Features (Socket.IO Events)

### Client to Server Events

```javascript
// Customer Events
'customer:join-queue'          // Join queue room for updates
'customer:leave-queue'         // Leave queue room
'customer:update-location'     // Send GPS coordinates

// Admin Events
'admin:join-center'            // Join service center room
'admin:call-next'              // Call next token
'admin:update-token-status'    // Update token status
```

### Server to Client Events

```javascript
// Queue Updates
'queue:updated'                // Queue order changed
'queue:token-called'           // A token was called
'queue:token-completed'        // A token completed service
'queue:position-update'        // Your position changed

// Notifications
'notification:new'             // New notification
'notification:your-turn'       // It's your turn
'notification:almost-turn'     // 2 people ahead

// Stats Updates
'stats:updated'                // Dashboard stats changed
```

---

## AI/ML Prediction System

### Wait Time Prediction Algorithm

```javascript
function predictWaitTime(serviceCenterId, serviceId) {
  // Factors considered:
  // 1. Current queue length
  // 2. Average service time for this service
  // 3. Number of active counters
  // 4. Historical data for this hour/day
  // 5. Current completion rate

  const queueLength = getCurrentQueueLength();
  const avgServiceTime = getAvgServiceTime(serviceId);
  const activeCounters = getActiveCounters(serviceCenterId);
  const historicalMultiplier = getHistoricalMultiplier(hour, dayOfWeek);

  const baseWait = (queueLength / activeCounters) * avgServiceTime;
  const predictedWait = baseWait * historicalMultiplier;

  return Math.round(predictedWait);
}
```

### No-Show Prediction

```javascript
function predictNoShow(token) {
  // Factors:
  // 1. Customer's no-show history
  // 2. Distance from center
  // 3. Time since last location update
  // 4. Current wait time vs initial estimate

  let noShowProbability = 0;

  if (token.lastLocationUpdate > 15 minutes ago) {
    noShowProbability += 0.3;
  }

  if (token.distanceFromCenter > 10 km) {
    noShowProbability += 0.2;
  }

  // ... more factors

  return noShowProbability > 0.7;
}
```

---

## Implementation Order

### Phase 1: Frontend Foundation (Current)
1. Install dependencies
2. Set up routing
3. Create layouts
4. Build common components
5. Build all pages (UI only, mock data)

### Phase 2: Backend Foundation
1. Server setup & MongoDB connection
2. User model & auth APIs
3. Service center & service models/APIs
4. Token model & booking APIs

### Phase 3: Queue System
1. Queue management APIs
2. Counter management
3. Socket.IO integration
4. Connect frontend to backend

### Phase 4: Advanced Features
1. Location tracking
2. Wait time prediction
3. Notifications
4. Analytics

### Phase 5: Polish
1. Testing
2. Error handling
3. Performance optimization
4. Deployment

---

## Tech Stack Summary

| Component | Technology | Why |
|-----------|------------|-----|
| Frontend | React 19 + Vite | Fast, modern, great DX |
| Styling | Tailwind CSS | Rapid UI development |
| State | Zustand | Simple, lightweight |
| Routing | React Router v6 | Standard for React |
| Backend | Node.js + Express | JavaScript full-stack |
| Database | MongoDB | Flexible schema, free tier |
| Real-time | Socket.IO | Bi-directional events |
| Maps | Leaflet + OSM | Completely free |
| Charts | Recharts | React-native charts |
| Icons | React Icons | Large icon library |
| Animations | Framer Motion | Smooth animations |
| HTTP | Axios | Better than fetch |
| Forms | React Hook Form | Performance |
| Notifications | Browser API + Toast | Free |

---

## UI Components to Build First

1. Button (primary, secondary, outline, danger)
2. Input (text, email, password, with icon)
3. Card (basic, with header, with footer)
4. Modal (basic, confirm dialog)
5. Badge (status badges)
6. Navbar (with logo, nav items, user menu)
7. Sidebar (admin navigation)
8. Table (with sorting, pagination)
9. Loader (spinner, skeleton)
10. Alert (success, error, warning, info)

---

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Smart Queue Pakistan
```

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

---

## Ready to Implement

### First Action: Install Frontend Dependencies

```bash
cd frontend
npm install react-router-dom axios zustand react-icons framer-motion recharts react-hook-form react-hot-toast socket.io-client leaflet react-leaflet
```

### Then Start Frontend Phase 1:
1. Setup Tailwind with Pakistan colors
2. Create project structure (folders)
3. Build common components
4. Build all pages

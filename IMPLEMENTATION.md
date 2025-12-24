# Smart Queue Pakistan (SQP) - Implementation Documentation

## Project Overview

Smart Queue Pakistan (SQP) is an AI-driven smart token system with predictive queue management for service centers in Pakistan. This document outlines the complete backend and frontend implementation.

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.0.1
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: Bcrypt v6.0.0
- **Environment Variables**: dotenv

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.2.4
- **Routing**: React Router DOM v7.10.1
- **State Management**: Zustand v5.0.9
- **HTTP Client**: Axios v1.13.2
- **Styling**: Tailwind CSS v4.1.17
- **Animations**: Framer Motion v12.23.25
- **Icons**: React Icons v5.5.0
- **Forms**: React Hook Form v7.68.0
- **Notifications**: React Hot Toast v2.6.0

---

## Backend Implementation

### Database Models

#### 1. User Model (`backend/models/user.js`)
```javascript
{
  fullName: String (required),
  phoneNumber: String (required, unique),
  cnic: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ["user", "admin"] (default: "user"),
  timestamps: true
}
```

#### 2. Service Model (`backend/models/service.js`)
```javascript
{
  name: String (required),
  nameUrdu: String,
  category: Enum ["nadra", "passport", "excise", "banks", "utilities"],
  avgTime: Number (default: 15),
  fee: Number (default: 0),
  isActive: Boolean (default: true),
  description: String,
  tokensToday: Number (default: 0),
  totalTokens: Number (default: 0),
  timestamps: true
}
```

#### 3. Counter Model (`backend/models/counter.js`)
```javascript
{
  name: String (required),
  status: Enum ["serving", "available", "break", "offline"] (default: "offline"),
  currentToken: String,
  operator: {
    id: ObjectId (ref: User),
    name: String,
    avatar: String
  },
  tokensServed: Number (default: 0),
  avgServiceTime: Number (default: 0),
  services: [String] (enum values),
  startedAt: Date,
  timestamps: true
}
```

#### 4. Token Model (`backend/models/token.js`)
```javascript
{
  tokenNumber: String (required, unique),
  customer: ObjectId (ref: User, required),
  service: ObjectId (ref: Service, required),
  serviceName: String (required),
  status: Enum ["waiting", "serving", "completed", "no-show", "cancelled"],
  priority: Enum ["normal", "senior", "pwd", "vip"] (default: "normal"),
  position: Number (required),
  counter: ObjectId (ref: Counter),
  estimatedWaitTime: Number,
  actualWaitTime: Number,
  serviceStartTime: Date,
  serviceEndTime: Date,
  calledAt: Date,
  completedAt: Date,
  feedback: { rating: Number, comment: String },
  timestamps: true
}
```

#### 5. Settings Model (`backend/models/settings.js`)
```javascript
{
  // General Settings
  centerName: String,
  centerCode: String,
  address: String,
  phone: String,
  email: String,
  timezone: String,
  language: String,

  // Queue Settings
  maxQueueSize: Number (default: 200),
  avgServiceTime: Number (default: 15),
  tokenPrefix: String (default: "A"),
  autoCallEnabled: Boolean (default: true),
  noShowTimeout: Number (default: 5),
  priorityEnabled: Boolean (default: true),

  // Notifications
  smsEnabled: Boolean,
  emailEnabled: Boolean,
  pushEnabled: Boolean,
  notifyBefore: Number,
  reminderInterval: Number,

  // Operating Hours
  openTime: String,
  closeTime: String,
  breakStart: String,
  breakEnd: String,
  workDays: [String],

  // Display
  displayLanguage: String,
  showEstimatedWait: Boolean,
  showQueuePosition: Boolean,
  announcementVolume: Number,
  darkMode: Boolean,

  // Token Counter
  dailyTokenCounter: Number,
  lastTokenDate: Date
}
```

---

### API Endpoints

#### Authentication (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user, returns JWT |

#### Users (`/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/create` | Create new user (admin) |
| GET | `/user/read` | Get all users |
| GET | `/user/read/:id` | Get user by ID |
| PATCH | `/user/update/:id` | Update user |
| DELETE | `/user/delete/:id` | Delete user |

#### Services (`/service`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/service/create` | Create new service |
| GET | `/service/read` | Get all services |
| GET | `/service/stats` | Get service statistics |
| GET | `/service/read/:id` | Get service by ID |
| PATCH | `/service/update/:id` | Update service |
| PATCH | `/service/toggle/:id` | Toggle service active status |
| DELETE | `/service/delete/:id` | Delete service |

#### Counters (`/counter`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/counter/create` | Create new counter |
| GET | `/counter/read` | Get all counters |
| GET | `/counter/stats` | Get counter statistics |
| GET | `/counter/operators` | Get available operators |
| GET | `/counter/read/:id` | Get counter by ID |
| PATCH | `/counter/update/:id` | Update counter |
| PATCH | `/counter/status/:id` | Update counter status |
| DELETE | `/counter/delete/:id` | Delete counter |

#### Tokens (`/token`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/token/queue` | Get current queue status |
| GET | `/token/stats` | Get dashboard statistics |
| GET | `/token/number/:tokenNumber` | Get token by number |
| POST | `/token/book` | Book new token (auth required) |
| GET | `/token/my-tokens` | Get user's tokens (auth required) |
| GET | `/token/:id` | Get token by ID (auth required) |
| PATCH | `/token/cancel/:tokenId` | Cancel token (auth required) |
| POST | `/token/call-next` | Call next token (admin) |
| PATCH | `/token/complete/:tokenId` | Complete token (admin) |
| PATCH | `/token/no-show/:tokenId` | Mark as no-show (admin) |

#### Settings (`/settings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get all settings |
| PUT | `/settings` | Update all settings |
| PATCH | `/settings/general` | Update general settings |
| PATCH | `/settings/queue` | Update queue settings |
| PATCH | `/settings/notifications` | Update notification settings |
| PATCH | `/settings/hours` | Update operating hours |
| PATCH | `/settings/display` | Update display settings |
| POST | `/settings/reset-counter` | Reset daily token counter |

---

### Controllers

#### Service Controller (`backend/controller/serviceController.js`)
- `createService` - Create new service
- `readServices` - Get all services with filtering
- `readServiceById` - Get single service
- `updateService` - Update service details
- `deleteService` - Delete service
- `toggleServiceStatus` - Enable/disable service
- `getServiceStats` - Get aggregated statistics

#### Counter Controller (`backend/controller/counterController.js`)
- `createCounter` - Create new counter
- `readCounters` - Get all counters
- `readCounterById` - Get single counter
- `updateCounter` - Update counter details
- `deleteCounter` - Delete counter
- `updateCounterStatus` - Change counter status (serving/available/break/offline)
- `getCounterStats` - Get aggregated statistics
- `getOperators` - Get list of users who can be operators

#### Token Controller (`backend/controller/tokenController.js`)
- `bookToken` - Book new token with auto-generated number
- `getQueueStatus` - Get current queue with waiting/serving tokens
- `callNextToken` - Call next token to a counter
- `completeToken` - Mark token as completed
- `markNoShow` - Mark token as no-show
- `getTokenById` - Get token details
- `getMyTokens` - Get authenticated user's tokens
- `getTokenByNumber` - Get token by display number
- `getDashboardStats` - Get admin dashboard statistics
- `cancelToken` - Cancel a waiting token

#### Settings Controller (`backend/controller/settingsController.js`)
- `getSettings` - Get or create default settings
- `updateSettings` - Update all settings at once
- `updateGeneralSettings` - Update general section
- `updateQueueSettings` - Update queue section
- `updateNotificationSettings` - Update notifications section
- `updateOperatingHours` - Update hours section
- `updateDisplaySettings` - Update display section
- `resetDailyCounter` - Reset token counter for new day

---

## Frontend Implementation

### Project Structure
```
frontend/src/
├── components/common/     # Reusable UI components
├── layouts/              # Page layouts
├── pages/
│   ├── admin/           # Admin dashboard pages
│   ├── customer/        # Customer-facing pages
│   └── public/          # Public pages (login, register)
├── store/               # Zustand state management
├── utils/               # API client, helpers, constants
└── App.jsx              # Main app with routing
```

### Admin Pages (Integrated with Backend)

#### 1. Users Management (`frontend/src/pages/admin/Users.jsx`)
- List all users with search and role filtering
- Create new users with role assignment
- Edit user details (name, email, phone, CNIC, role)
- Delete users
- Stats display (total, active, admins, operators)

#### 2. Services Management (`frontend/src/pages/admin/Services.jsx`)
- List services in card grid view
- Filter by category and search
- Create/Edit services with full details
- Toggle service active status
- Delete services
- Display token statistics (today/total)

#### 3. Counters Management (`frontend/src/pages/admin/Counters.jsx`)
- Display counters with status indicators
- Assign operators to counters
- Change counter status (Start/Break/Resume/Stop)
- Create/Edit counter details
- Assign services to counters
- Delete counters
- Stats display (total, serving, active, tokens served)

#### 4. Settings Page (`frontend/src/pages/admin/Settings.jsx`)
- Tabbed interface with 5 sections:
  - **General**: Center name, code, address, contact, timezone, language
  - **Queue Settings**: Max size, service time, token prefix, auto-call, no-show timeout, priority
  - **Notifications**: SMS, email, push toggles, notify before, reminder interval
  - **Operating Hours**: Open/close time, break times, working days
  - **Display**: Language, show wait time, show position, dark mode, volume
- All settings persist to database

### API Integration

#### API Client (`frontend/src/utils/api.js`)
```javascript
- Base URL: http://localhost:3003
- Auto-adds Authorization header with JWT token
- Auto-redirects to login on 401 errors
```

### State Management

#### Auth Store (`frontend/src/store/authStore.js`)
- `user` - Current user data
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state
- `error` - Error messages
- `initialize()` - Load auth from localStorage
- `login()` - Authenticate user
- `register()` - Create new account
- `logout()` - Clear auth data
- `clearError()` - Clear error state

---

## How to Run

### Prerequisites
- Node.js v18+
- MongoDB running locally or connection string

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# PORT=3003
# DB_URL=mongodb://localhost:27017/sqp
# secret=your_jwt_secret
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:3003

---

## Features Summary

### Implemented
- User authentication (JWT-based)
- User management (CRUD)
- Service management (CRUD + toggle)
- Counter management (CRUD + status)
- Token/Queue management
- System settings (persistent)
- Role-based access control
- Search and filtering
- Responsive UI design
- Loading states and error handling
- Toast notifications

### Ready for Extension
- Real-time updates (Socket.io ready)
- SMS/Email notifications (service hooks in place)
- Analytics dashboard
- Customer mobile app
- AI wait-time prediction

---

## Database Schema Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │     │   Service    │     │   Counter    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ _id          │     │ _id          │     │ _id          │
│ fullName     │     │ name         │     │ name         │
│ email        │     │ nameUrdu     │     │ status       │
│ phoneNumber  │     │ category     │     │ currentToken │
│ cnic         │     │ avgTime      │     │ operator     │──┐
│ password     │     │ fee          │     │ services[]   │  │
│ role         │     │ isActive     │     │ tokensServed │  │
└──────────────┘     │ description  │     │ avgServiceTime│  │
       │             │ tokensToday  │     └──────────────┘  │
       │             │ totalTokens  │            │          │
       │             └──────────────┘            │          │
       │                    │                    │          │
       │                    │                    │          │
       ▼                    ▼                    ▼          │
┌──────────────────────────────────────────────────────────┐│
│                        Token                              ││
├──────────────────────────────────────────────────────────┤│
│ _id          │ tokenNumber    │ status      │ priority   ││
│ customer ────┼────────────────┼─────────────┼────────────┤│
│ service  ────┤ position       │ counter ────┼────────────┘│
│ serviceName  │ estimatedWait  │ calledAt    │ completedAt │
│ actualWait   │ serviceStart   │ serviceEnd  │ feedback    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                       Settings                            │
├──────────────────────────────────────────────────────────┤
│ General: centerName, centerCode, address, phone, email   │
│ Queue: maxQueueSize, avgServiceTime, tokenPrefix, etc.   │
│ Notifications: smsEnabled, emailEnabled, pushEnabled     │
│ Hours: openTime, closeTime, breakStart, breakEnd, days   │
│ Display: language, showWait, showPosition, volume, dark  │
└──────────────────────────────────────────────────────────┘
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial implementation with full CRUD for all modules |

---

## Contributors

- Development Team
- Generated with Claude Code

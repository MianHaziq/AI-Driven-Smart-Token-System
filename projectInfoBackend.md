# Backend Project Documentation

## Smart Queue Pakistan (SQP) - Backend

A Node.js/Express REST API for queue management system with MongoDB database.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 5.2.1 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 9.0.1 | ODM |
| JWT | 9.0.3 | Authentication |
| bcrypt | 6.0.0 | Password Hashing |
| cors | 2.8.5 | Cross-Origin Requests |
| dotenv | 17.2.3 | Environment Variables |
| nodemon | 3.1.11 | Development Auto-reload |

---

## Project Structure

```
backend/
├── controller/               # Business logic
│   ├── auth.js              # Authentication
│   ├── userController.js    # User CRUD
│   ├── tokenController.js   # Token/Queue management
│   ├── counterController.js # Counter management
│   ├── serviceController.js # Service management
│   └── settingsController.js # Settings management
├── middleware/              # Request middleware
│   ├── authorization.js     # JWT verification
│   ├── isAdmin.js          # Admin role check
│   └── validators.js       # Input validation
├── models/                  # MongoDB schemas
│   ├── user.js             # User model
│   ├── token.js            # Token model
│   ├── counter.js          # Counter model
│   ├── service.js          # Service model
│   └── settings.js         # Settings model
├── routes/                  # API routes
│   ├── auth.js             # Auth endpoints
│   ├── user.js             # User endpoints
│   ├── token.js            # Token endpoints
│   ├── counter.js          # Counter endpoints
│   ├── service.js          # Service endpoints
│   └── settings.js         # Settings endpoints
├── index.js                 # Entry point
├── seedServices.js          # Service seeder
├── seedCounters.js          # Counter seeder
├── fixIndexes.js           # Database index fixer
├── .env                     # Environment variables
├── .env.example            # Env template
└── package.json            # Dependencies
```

---

## Entry Point

### `index.js`
**Purpose**: Main server file

```javascript
// Key responsibilities:
// 1. Initialize Express app
// 2. Configure middleware (CORS, JSON parser, sanitization)
// 3. Connect to MongoDB
// 4. Mount route handlers
// 5. Global error handling
```

**Route Mounting**:
```javascript
app.use('/auth', authRouter);      // Authentication
app.use('/user', userRouter);      // User management
app.use('/service', serviceRouter); // Services
app.use('/counter', counterRouter); // Counters
app.use('/token', tokenRouter);     // Tokens/Queue
app.use('/settings', settingsRouter); // Settings
```

---

## Models (`models/`)

### `user.js` - User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | User's full name |
| phoneNumber | String | Yes | Unique phone number |
| cnic | String | Yes | Unique CNIC (12345-1234567-1) |
| email | String | Yes | Unique email address |
| password | String | Yes | Bcrypt hashed password |
| role | Enum | No | user, admin, superadmin, operator |
| timestamps | - | Auto | createdAt, updatedAt |

**Role Values**:
- `user` (default) - Regular customer
- `admin` - Full admin access
- `superadmin` - Same as admin
- `operator` - Counter operator

---

### `token.js` - Token Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tokenNumber | String | Yes | Token display number (A-001) |
| tokenDate | Date | Yes | Date for daily uniqueness |
| customer | ObjectId | Yes | Reference to User |
| service | ObjectId | Yes | Reference to Service |
| serviceName | String | Yes | Service name snapshot |
| serviceCenter | String | No | Center name |
| city | String | No | City name |
| status | Enum | No | Token status |
| priority | Enum | No | Priority level |
| position | Number | Yes | Queue position |
| counter | ObjectId | No | Assigned counter |
| estimatedWaitTime | Number | No | Estimated wait (minutes) |
| actualWaitTime | Number | No | Actual wait (minutes) |
| serviceStartTime | Date | No | When serving started |
| serviceEndTime | Date | No | When completed |
| calledAt | Date | No | When called |
| completedAt | Date | No | When completed |
| feedback.rating | Number | No | 1-5 rating |
| feedback.comment | String | No | Feedback text |

**Status Values**:
- `waiting` - In queue
- `serving` - Being served
- `completed` - Service done
- `no-show` - Customer didn't appear
- `cancelled` - Cancelled by customer

**Priority Values**:
- `normal` (default)
- `senior` - Senior citizens
- `disabled` - PWD
- `vip` - VIP customers

**Indexes**:
```javascript
{ status: 1, createdAt: 1 }           // Filter by status
{ customer: 1, createdAt: -1 }        // User's tokens
{ tokenDate: 1, status: 1 }           // Daily queue
{ tokenNumber: 1, tokenDate: 1 }      // Unique per day (compound)
```

---

### `counter.js` - Counter Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Counter display name |
| status | Enum | No | Counter status |
| currentToken | ObjectId | No | Currently serving token |
| operator.id | ObjectId | No | Assigned operator |
| operator.name | String | No | Operator name |
| operator.avatar | String | No | Operator initials |
| tokensServed | Number | No | Daily count |
| avgServiceTime | Number | No | Average time (minutes) |
| services | Array | No | Service categories handled |
| startedAt | Date | No | When counter opened |

**Status Values**:
- `serving` - Serving a customer
- `available` - Ready for next
- `break` - On break
- `offline` - Not active

**Service Categories**:
- nadra, passport, excise, banks, utilities

---

### `service.js` - Service Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Service name |
| nameUrdu | String | No | Urdu name |
| slug | String | Yes | URL-friendly ID |
| category | Enum | Yes | Service category |
| avgTime | Number | Yes | Average time (minutes) |
| fee | Number | No | Service fee |
| isActive | Boolean | No | Active status |
| description | String | No | Description |
| tokensToday | Number | No | Daily token count |
| totalTokens | Number | No | All-time count |

**Category Values**:
- nadra, passport, excise, banks, utilities, electricity, sui-gas

---

### `settings.js` - Settings Model

**General Settings**:
| Field | Default | Description |
|-------|---------|-------------|
| centerName | "NADRA Office - Islamabad" | Center name |
| centerCode | "ISB-001" | Center code |
| address | "F-8 Markaz, Islamabad" | Address |
| phone | "051-1234567" | Phone |
| email | "contact@sqp.gov.pk" | Email |
| timezone | "Asia/Karachi" | Timezone |
| language | "en" | Default language |

**Queue Settings**:
| Field | Default | Description |
|-------|---------|-------------|
| maxQueueSize | 200 | Max queue size |
| avgServiceTime | 15 | Default service time |
| tokenPrefix | "A" | Token number prefix |
| autoCallEnabled | true | Auto-call feature |
| noShowTimeout | 5 | Minutes before no-show |
| priorityEnabled | true | Priority queue enabled |

**Notification Settings**:
| Field | Default | Description |
|-------|---------|-------------|
| smsEnabled | true | SMS notifications |
| emailEnabled | true | Email notifications |
| pushEnabled | true | Push notifications |
| notifyBefore | 3 | Notify X tokens before |
| reminderInterval | 10 | Reminder interval |

**Operating Hours**:
| Field | Default | Description |
|-------|---------|-------------|
| openTime | "09:00" | Opening time |
| closeTime | "17:00" | Closing time |
| breakStart | "13:00" | Break start |
| breakEnd | "14:00" | Break end |
| workDays | ["mon"-"fri"] | Working days |

**Display Settings**:
| Field | Default | Description |
|-------|---------|-------------|
| displayLanguage | "bilingual" | Display language |
| showEstimatedWait | true | Show wait time |
| showQueuePosition | true | Show position |
| announcementVolume | 80 | Volume level |
| darkMode | false | Dark mode |

**Token Counter**:
| Field | Default | Description |
|-------|---------|-------------|
| dailyTokenCounter | 0 | Daily counter |
| lastTokenDate | null | Last token date |

---

## Controllers (`controller/`)

### `auth.js` - Authentication Controller

| Function | Description |
|----------|-------------|
| `signup` | Register new user (hash password, create user) |
| `login` | Authenticate user (verify password, return JWT) |

---

### `userController.js` - User Controller

| Function | Description |
|----------|-------------|
| `createUser` | Create new user (admin only) |
| `readUser` | Get all users |
| `readUserById` | Get user by ID |
| `updateUser` | Update user data |
| `deleteUserbyid` | Delete user |

---

### `tokenController.js` - Token Controller

| Function | Description |
|----------|-------------|
| `bookToken` | Book new token (generates number, calculates position) |
| `getQueueStatus` | Get queue with filters (service, city, center) |
| `getMyTokens` | Get current user's tokens |
| `getTokenById` | Get single token details |
| `getTokenByNumber` | Get token by display number |
| `cancelToken` | Cancel a token |
| `callNextToken` | Admin: call next in queue |
| `completeToken` | Admin: mark as completed |
| `markNoShow` | Admin: mark as no-show |
| `getDashboardStats` | Get dashboard statistics |
| `getAnalytics` | Get detailed analytics |

**Token Number Generation**:
```javascript
// Format: {prefix}-{dailyCounter}
// Example: A-001, A-002, A-003
// Resets daily based on lastTokenDate
```

---

### `counterController.js` - Counter Controller

| Function | Description |
|----------|-------------|
| `createCounter` | Create new counter |
| `readCounters` | Get all counters (with currentToken populated) |
| `readCounterById` | Get counter by ID |
| `updateCounter` | Update counter settings |
| `deleteCounter` | Delete counter |
| `updateCounterStatus` | Change counter status |
| `getCounterStats` | Get counter statistics |
| `getOperators` | Get list of operators |

---

### `serviceController.js` - Service Controller

| Function | Description |
|----------|-------------|
| `createService` | Create new service |
| `readServices` | Get all services |
| `readServiceById` | Get service by ID |
| `updateService` | Update service |
| `deleteService` | Delete service |
| `toggleServiceStatus` | Toggle active status |
| `getServiceStats` | Get service statistics |

---

### `settingsController.js` - Settings Controller

| Function | Description |
|----------|-------------|
| `getSettings` | Get all settings |
| `updateSettings` | Update all settings |
| `updateGeneralSettings` | Update general section |
| `updateQueueSettings` | Update queue section |
| `updateNotificationSettings` | Update notifications |
| `updateOperatingHours` | Update hours |
| `updateDisplaySettings` | Update display |
| `resetDailyCounter` | Reset token counter |

---

## Routes (`routes/`)

### `auth.js` - Auth Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| POST | `/auth/login` | validateLogin | login |
| POST | `/auth/signup` | validateSignup | signup |

---

### `user.js` - User Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| POST | `/user/create` | authorization, isAdmin | createUser |
| GET | `/user/read` | authorization, isAdmin | readUser |
| GET | `/user/read/:id` | authorization, isAdmin | readUserById |
| PATCH | `/user/update/:id` | authorization, isAdmin | updateUser |
| DELETE | `/user/delete/:id` | authorization, isAdmin | deleteUserbyid |

---

### `token.js` - Token Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| GET | `/token/queue` | - | getQueueStatus |
| GET | `/token/stats` | - | getDashboardStats |
| GET | `/token/number/:tokenNumber` | - | getTokenByNumber |
| GET | `/token/analytics` | authorization, isAdmin | getAnalytics |
| POST | `/token/book` | authorization, validateTokenBooking | bookToken |
| GET | `/token/my-tokens` | authorization | getMyTokens |
| GET | `/token/:id` | authorization, validateObjectId | getTokenById |
| PATCH | `/token/cancel/:tokenId` | authorization, validateObjectId | cancelToken |
| POST | `/token/call-next` | authorization, isAdmin | callNextToken |
| PATCH | `/token/complete/:tokenId` | authorization, isAdmin, validateObjectId | completeToken |
| PATCH | `/token/no-show/:tokenId` | authorization, isAdmin, validateObjectId | markNoShow |

---

### `counter.js` - Counter Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| POST | `/counter/create` | authorization, isAdmin | createCounter |
| GET | `/counter/read` | authorization, isAdmin | readCounters |
| GET | `/counter/stats` | authorization, isAdmin | getCounterStats |
| GET | `/counter/operators` | authorization, isAdmin | getOperators |
| GET | `/counter/read/:id` | authorization, isAdmin | readCounterById |
| PATCH | `/counter/update/:id` | authorization, isAdmin | updateCounter |
| PATCH | `/counter/status/:id` | authorization, isAdmin | updateCounterStatus |
| DELETE | `/counter/delete/:id` | authorization, isAdmin | deleteCounter |

---

### `service.js` - Service Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| POST | `/service/create` | authorization, isAdmin | createService |
| GET | `/service/read` | - | readServices |
| GET | `/service/stats` | authorization, isAdmin | getServiceStats |
| GET | `/service/read/:id` | - | readServiceById |
| PATCH | `/service/update/:id` | authorization, isAdmin | updateService |
| PATCH | `/service/toggle/:id` | authorization, isAdmin | toggleServiceStatus |
| DELETE | `/service/delete/:id` | authorization, isAdmin | deleteService |

---

### `settings.js` - Settings Routes

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| GET | `/settings` | authorization, isAdmin | getSettings |
| PUT | `/settings` | authorization, isAdmin | updateSettings |
| PATCH | `/settings/general` | authorization, isAdmin | updateGeneralSettings |
| PATCH | `/settings/queue` | authorization, isAdmin | updateQueueSettings |
| PATCH | `/settings/notifications` | authorization, isAdmin | updateNotificationSettings |
| PATCH | `/settings/hours` | authorization, isAdmin | updateOperatingHours |
| PATCH | `/settings/display` | authorization, isAdmin | updateDisplaySettings |
| POST | `/settings/reset-counter` | authorization, isAdmin | resetDailyCounter |

---

## Middleware (`middleware/`)

### `authorization.js`
**Purpose**: JWT token verification

```javascript
// Flow:
// 1. Extract token from "Authorization: Bearer <token>"
// 2. Verify token with JWT_SECRET
// 3. Attach decoded user to req.user
// 4. Return 403 if no token
// 5. Return 401 if invalid/expired
```

**Usage**:
```javascript
router.get('/protected', authorization, controller);
```

---

### `isAdmin.js`
**Purpose**: Admin role verification

```javascript
// Flow:
// 1. Check req.user.role
// 2. Allow if role is 'admin' or 'superadmin'
// 3. Return 403 if not authorized
```

**Usage**:
```javascript
router.get('/admin-only', authorization, isAdmin, controller);
```

---

### `validators.js`
**Purpose**: Input validation and sanitization

**Validation Functions**:

| Function | Purpose |
|----------|---------|
| `validateSignup` | Validate registration data |
| `validateLogin` | Validate login credentials |
| `validateTokenBooking` | Validate token booking |
| `validateObjectId` | Validate MongoDB ObjectId |
| `sanitizeBody` | Sanitize all string inputs |

**Validation Patterns**:
```javascript
email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
cnic: /^\d{5}-\d{7}-\d{1}$/        // Pakistani format
phone: /^(03\d{9}|\+923\d{9})$/    // Pakistani format
password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
```

**Sanitization**:
- HTML entity encoding (prevents XSS)
- String trimming
- Email lowercase
- Phone space removal

---

## Utility Scripts

### `seedServices.js`
**Purpose**: Populate services database

**Services Seeded**:
- NADRA: 6 services (CNIC, NICOP, etc.)
- Passport: 5 services
- Excise: 5 services
- Electricity: 5 services
- Sui Gas: 4 services
- Banks: 5 services

**Run**: `node seedServices.js`

---

### `seedCounters.js`
**Purpose**: Populate counters database

**Counters Seeded**:
1. Counter 1 - nadra, passport
2. Counter 2 - nadra, passport, excise
3. Counter 3 - banks, utilities
4. Counter 4 - nadra, banks
5. Counter 5 - passport, excise (offline)

**Run**: `node seedCounters.js`

---

### `fixIndexes.js`
**Purpose**: Fix database indexes

**Actions**:
1. Drop old `tokenNumber_1` unique index
2. Clear old tokens
3. Reset settings counter
4. Keep compound index `tokenNumber_1_tokenDate_1`

**Run**: `node fixIndexes.js`

**When to use**: If token booking fails with duplicate key error

---

## Environment Variables

### `.env`
```env
# Server
PORT=3003

# Database
DB_URL="mongodb://localhost:27017/sqp_queue"

# JWT
JWT_SECRET="your-64-byte-hex-secret"
JWT_EXPIRES_IN="1h"
```

### `.env.example`
```env
# Server Configuration
PORT=3003

# MongoDB Connection
DB_URL="mongodb://localhost:27017/sqp_queue"

# JWT Configuration
# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="1h"
```

---

## API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Token Booking Response
```json
{
  "message": "Token booked successfully",
  "token": {
    "_id": "...",
    "tokenNumber": "A-001",
    "position": 1,
    "estimatedWaitTime": 15,
    "serviceName": "New CNIC",
    "serviceCenter": "NADRA DHA",
    "city": "Lahore",
    "status": "waiting",
    "priority": "normal",
    "createdAt": "..."
  }
}
```

### Queue Status Response
```json
{
  "total": 10,
  "waiting": 5,
  "serving": 2,
  "completed": 3,
  "noShows": 0,
  "tokens": [...],
  "queue": [...],
  "currentlyServing": [...]
}
```

---

## Authentication Flow

### Login
```
POST /auth/login
Body: { email, password }

1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
4. Return token and user data
```

### Protected Route Access
```
GET /token/my-tokens
Header: Authorization: Bearer <jwt_token>

1. authorization middleware extracts token
2. Verifies token signature
3. Attaches user to req.user
4. Controller accesses req.user.id
```

---

## Queue Management Flow

### Book Token
```
POST /token/book
Body: { serviceId, priority, serviceCenter, city }

1. Find service by slug or ObjectId
2. Get today's date (00:00:00)
3. Count waiting tokens
4. Generate token number (A-XXX)
5. Calculate position and wait time
6. Create token document
7. Update service stats
```

### Call Next Token
```
POST /token/call-next
Body: { counterId, serviceCenter, city }

1. Find available counter
2. Build query (today + waiting + filters)
3. Find next token (priority sort)
4. Update token: status=serving, calledAt=now
5. Update counter: status=serving, currentToken
```

### Complete Token
```
PATCH /token/complete/:tokenId

1. Find token by ID
2. Verify status is "serving"
3. Calculate actual service time
4. Update token: status=completed, completedAt
5. Update counter: status=available, tokensServed++
6. Update queue positions
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start with auto-reload
npm start

# Seed database
node seedServices.js
node seedCounters.js

# Fix indexes
node fixIndexes.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Security Features

1. **JWT Authentication** - Token-based auth
2. **Password Hashing** - bcrypt with salt
3. **Role-Based Access** - Admin-only routes
4. **Input Validation** - All inputs validated
5. **XSS Prevention** - HTML entity encoding
6. **CORS** - Configurable origins

---

## Database Indexes

| Collection | Index | Purpose |
|------------|-------|---------|
| tokens | status_1_createdAt_1 | Filter by status |
| tokens | customer_1_createdAt_-1 | User's tokens |
| tokens | tokenDate_1_status_1 | Daily queue |
| tokens | tokenNumber_1_tokenDate_1 (unique) | Daily uniqueness |

---

## Error Handling

### Global Error Handler (index.js)
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});
```

### Controller Error Handling
```javascript
try {
    // ... logic
} catch (error) {
    next(error); // Pass to global handler
}
```

---

## File Count Summary

| Category | Count |
|----------|-------|
| Controllers | 6 |
| Models | 5 |
| Routes | 6 |
| Middleware | 3 |
| Utility Scripts | 3 |
| Config Files | 3 |

---

## Contact

For questions about this codebase, refer to:
- Frontend integration: See `projectInfoFrontend.md`
- API testing: Use Postman with endpoints above
- Database: Connect with MongoDB Compass

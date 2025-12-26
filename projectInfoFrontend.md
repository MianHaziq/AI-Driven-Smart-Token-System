# Frontend Project Documentation

## Smart Queue Pakistan (SQP) - Frontend

A React-based Single Page Application for queue management system built with Vite, Tailwind CSS, and Zustand.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| Tailwind CSS | 4.1.17 | Styling |
| Zustand | 5.0.5 | State Management |
| React Router DOM | 7.10.1 | Routing |
| Axios | 1.9.0 | HTTP Client |
| React Hook Form | 7.56.4 | Form Handling |
| React Hot Toast | 2.5.2 | Notifications |
| Framer Motion | 12.15.0 | Animations |
| Recharts | 2.15.3 | Charts |
| React Icons | 5.5.0 | Icons (Feather) |
| Leaflet | 1.9.4 | Maps |

---

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── admin/           # Admin-specific components
│   │   └── customer/        # Customer-specific components
│   ├── data/                 # Static JSON data
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Page layout wrappers
│   ├── pages/                # Route pages
│   │   ├── public/          # Public pages
│   │   ├── customer/        # Customer pages
│   │   └── admin/           # Admin pages
│   ├── services/             # API service modules
│   ├── store/                # Zustand state stores
│   ├── utils/                # Utility functions
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                      # Environment variables
├── .env.example              # Env template
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
└── package.json              # Dependencies
```

---

## Entry Point Files

### `src/main.jsx`
**Purpose**: Application entry point
- Renders React app to DOM
- Imports global CSS

### `src/App.jsx`
**Purpose**: Main application component
- Defines all routes
- Implements route protection (ProtectedRoute, PublicRoute)
- Configures toast notifications
- Role-based redirects after login

**Key Components**:
- `ProtectedRoute` - Requires authentication + role check
- `PublicRoute` - Redirects authenticated users away from auth pages

### `src/index.css`
**Purpose**: Global styles
- Imports Tailwind CSS
- Custom utility classes

---

## Layouts (`src/layouts/`)

### `PublicLayout.jsx`
**Purpose**: Default layout for public and customer pages
- Top navigation bar (Navbar)
- Footer
- Used for: Landing, About, Services, Contact, Book Token, Customer pages

### `AuthLayout.jsx`
**Purpose**: Minimal layout for authentication pages
- Clean, centered design
- No navbar/footer
- Used for: Login, Register, Forgot Password

### `AdminLayout.jsx`
**Purpose**: Full admin dashboard layout
- Sidebar navigation
- Admin header with user menu
- Notifications dropdown
- Used for: All /admin/* routes

### `CustomerLayout.jsx`
**Purpose**: Legacy customer layout (deprecated)
- Replaced by PublicLayout for consistent design

### `index.js`
**Purpose**: Barrel export for all layouts

---

## Pages (`src/pages/`)

### Public Pages (`src/pages/public/`)

| File | Route | Description |
|------|-------|-------------|
| `Landing.jsx` | `/` | Home page with hero, features, services overview |
| `Login.jsx` | `/login` | User login form with validation |
| `Register.jsx` | `/register` | User registration form |
| `ForgotPassword.jsx` | `/forgot-password` | Password recovery |
| `About.jsx` | `/about` | Company information |
| `Services.jsx` | `/services` | Services listing |
| `Contact.jsx` | `/contact` | Contact form |
| `index.js` | - | Barrel exports |

### Customer Pages (`src/pages/customer/`)

| File | Route | Description |
|------|-------|-------------|
| `BookToken.jsx` | `/book-token` | Multi-step token booking wizard |
| `MyTokens.jsx` | `/customer/my-tokens` | Active tokens list (waiting/serving) |
| `History.jsx` | `/customer/history` | Completed/cancelled tokens |
| `Profile.jsx` | `/customer/profile` | User profile management |
| `TokenDetails.jsx` | `/token/:id` | Individual token tracking |
| `Dashboard.jsx` | - | Legacy (redirects to home) |
| `index.js` | - | Barrel exports |

### Admin Pages (`src/pages/admin/`)

| File | Route | Description |
|------|-------|-------------|
| `Dashboard.jsx` | `/admin/dashboard` | Queue management with counters |
| `Tokens.jsx` | `/admin/tokens` | All tokens management |
| `Counters.jsx` | `/admin/counters` | Counter configuration |
| `Services.jsx` | `/admin/services` | Service catalog management |
| `ManageQueue.jsx` | `/admin/queue` | Queue operations |
| `Analytics.jsx` | `/admin/analytics` | Reports and analytics |
| `Users.jsx` | `/admin/users` | User management |
| `Settings.jsx` | `/admin/settings` | System settings |
| `index.js` | - | Barrel exports |

---

## Components (`src/components/`)

### Common Components (`src/components/common/`)

| Component | File | Description |
|-----------|------|-------------|
| Alert | `Alert.jsx` | Success/error/warning messages |
| Badge | `Badge.jsx` | Status badges and tags |
| Button | `Button.jsx` | Styled button with variants, loading state |
| Card | `Card.jsx` | Container card with header/body |
| ConfirmDialog | `ConfirmDialog.jsx` | Confirmation modal |
| EmptyState | `EmptyState.jsx` | No data placeholder |
| Footer | `Footer.jsx` | Site footer |
| Input | `Input.jsx` | Form input with icon support |
| Loader | `Loader.jsx` | Loading spinner |
| Modal | `Modal.jsx` | Generic modal dialog |
| Navbar | `Navbar.jsx` | Top navigation bar |
| PageHeader | `PageHeader.jsx` | Page title section |
| Pagination | `Pagination.jsx` | Page navigation |
| SearchBar | `SearchBar.jsx` | Search input |
| Select | `Select.jsx` | Dropdown select |
| Sidebar | `Sidebar.jsx` | Admin sidebar navigation |
| StatCard | `StatCard.jsx` | Statistics display card |
| Table | `Table.jsx` | Data table |
| index.js | `index.js` | Barrel exports |

**Usage**:
```jsx
import { Button, Card, Modal, Input } from '../components/common';
```

---

## State Management (`src/store/`)

### `authStore.js`
**Purpose**: Authentication state management

| State | Type | Description |
|-------|------|-------------|
| `user` | Object | Current user data |
| `isAuthenticated` | Boolean | Auth status |
| `token` | String | JWT token |

| Action | Description |
|--------|-------------|
| `login(email, password)` | Authenticate user |
| `logout()` | Clear auth state |
| `initialize()` | Load auth from localStorage |
| `updateUser(data)` | Update user profile |

### `tokenStore.js`
**Purpose**: Token/queue management

| State | Type | Description |
|-------|------|-------------|
| `tokens` | Array | All tokens (admin) |
| `myTokens` | Array | User's active tokens |
| `tokenHistory` | Array | User's past tokens |
| `queueStats` | Object | Queue statistics |
| `dashboardStats` | Object | Dashboard stats |
| `isLoading` | Boolean | Loading state |

| Action | Description |
|--------|-------------|
| `fetchTokens(filters)` | Get tokens with filters |
| `fetchMyTokens()` | Get user's active tokens |
| `fetchTokenHistory()` | Get user's history |
| `bookToken(serviceId, priority, center, city)` | Book new token |
| `cancelToken(tokenId)` | Cancel a token |
| `callNextToken(counterId, center, city)` | Admin: call next |
| `completeToken(tokenId)` | Admin: complete token |
| `markNoShow(tokenId)` | Admin: mark no-show |

### `counterStore.js`
**Purpose**: Counter management

| Action | Description |
|--------|-------------|
| `fetchCounters()` | Get all counters |
| `createCounter(data)` | Create counter |
| `updateCounter(id, data)` | Update counter |
| `updateCounterStatus(id, status)` | Change status |
| `deleteCounter(id)` | Delete counter |

### `serviceStore.js`
**Purpose**: Service catalog management

| Action | Description |
|--------|-------------|
| `fetchServices()` | Get all services |
| `createService(data)` | Create service |
| `updateService(id, data)` | Update service |
| `toggleService(id)` | Toggle active status |
| `deleteService(id)` | Delete service |

### `userStore.js`
**Purpose**: User management (admin)

| Action | Description |
|--------|-------------|
| `fetchUsers()` | Get all users |
| `createUser(data)` | Create user |
| `updateUser(id, data)` | Update user |
| `deleteUser(id)` | Delete user |

---

## Utilities (`src/utils/`)

### `api.js`
**Purpose**: Axios instance configuration
- Base URL from environment variable
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles 401 errors (auto logout)

```javascript
import api from '../utils/api';

// Usage
const response = await api.get('/token/my-tokens');
const result = await api.post('/auth/login', { email, password });
```

### `constants.js`
**Purpose**: Application constants

| Constant | Description |
|----------|-------------|
| `ROUTES` | All route paths |
| `SERVICES` | Service categories and sub-services |
| `CITIES` | Pakistan cities list |
| `TOKEN_STATUS` | Token status values |
| `TOKEN_STATUS_LABELS` | Display labels for statuses |
| `PRIORITY_TYPES` | Priority levels |
| `USER_ROLES` | User role values |

### `helpers.js`
**Purpose**: Utility functions

| Function | Description |
|----------|-------------|
| `formatDate(date)` | Format date for display |
| `formatTime(date)` | Format time for display |
| `formatDateTime(date)` | Format date and time |
| `getInitials(name)` | Get name initials |
| `classNames(...classes)` | Merge CSS classes |

---

## Data Files (`src/data/`)

### `centers.json`
**Purpose**: Service center locations
```json
{
  "centers": [
    {
      "id": "nadra-dha-lahore",
      "name": "NADRA Executive Office DHA",
      "city": "Lahore",
      "address": "DHA Phase 5, Lahore",
      "serviceCategory": "nadra"
    }
  ]
}
```

### `services.json`
**Purpose**: Service catalog data (optional static fallback)

---

## Routing Structure

### Public Routes (No Auth Required)
```
/                    → Landing
/about               → About
/services            → Services
/contact             → Contact
/book-token          → BookToken
```

### Auth Routes (Redirects if Logged In)
```
/login               → Login
/register            → Register
/forgot-password     → ForgotPassword
```

### Customer Routes (Auth Required: user/customer)
```
/customer/my-tokens  → MyTokens
/customer/history    → History
/customer/profile    → Profile
/token/:id           → TokenDetails
```

### Admin Routes (Auth Required: admin/superadmin)
```
/admin/dashboard     → Dashboard
/admin/tokens        → Tokens
/admin/queue         → ManageQueue
/admin/services      → Services
/admin/counters      → Counters
/admin/analytics     → Analytics
/admin/users         → Users
/admin/settings      → Settings
```

---

## Environment Variables

### `.env`
```env
VITE_API_URL=http://localhost:3003
```

### `.env.example`
```env
# API Configuration
VITE_API_URL=http://localhost:3003
```

---

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Key Flows

### Token Booking Flow (`BookToken.jsx`)
1. Select Service Category (NADRA, Passport, etc.)
2. Select Sub-Service (New CNIC, Renewal, etc.)
3. Select City
4. Select Service Center
5. Confirm & Book (requires login)
6. Show Token Details

### Admin Queue Management Flow (`Dashboard.jsx`)
1. Select Service Category
2. Select City
3. Select Service Center
4. View Queue Dashboard
5. Call Next Token → Complete/No-Show

### Authentication Flow
1. User submits login form
2. `authStore.login()` calls API
3. JWT token stored in localStorage
4. User redirected based on role:
   - admin/superadmin → `/admin/dashboard`
   - user/customer → `/`

---

## Styling Guide

### Color Palette
- **Primary (Pakistan Green)**: `#01411C`
- **Success**: Green shades
- **Warning**: Amber shades
- **Error**: Red shades
- **Gray**: Gray scale for text/backgrounds

### Component Classes
```jsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Badge variants
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Cancelled</Badge>
```

---

## Development Guidelines

1. **Components**: Place reusable components in `components/common/`
2. **State**: Use Zustand stores for global state
3. **API Calls**: Always use `utils/api.js` instance
4. **Forms**: Use React Hook Form for validation
5. **Routing**: Protected routes use `ProtectedRoute` wrapper
6. **Styling**: Use Tailwind utility classes
7. **Icons**: Import from `react-icons/fi` (Feather icons)

---

## File Count Summary

| Category | Count |
|----------|-------|
| Pages | 16 |
| Common Components | 18 |
| Layouts | 4 |
| Stores | 5 |
| Utilities | 3 |
| Data Files | 2 |
| Config Files | 4 |

---

## Contact

For questions about this codebase, refer to:
- Component props: Check component file JSDoc/comments
- API endpoints: See `projectInfoBackend.md`
- State management: Check respective store file

# Rent-A-Ride — Full Stack Vehicle Rental System (MERN)

A vehicle rental management web application built using MongoDB, Express.js, React, and Node.js.

---

## Features

- **Authentication & Roles**:
  - JWT-based authentication with bcrypt password hashing.
  - Role-based authorization for Customers and Admins.
  - Protected client routes with token persistence in `localStorage`.

- **Vehicle Catalog**:
  - Public vehicle inventory listing with real-time status badges.
  - Detailed vehicle view with rate calculation and availability checks.

- **Booking Workflow**:
  - Date conflict detection preventing double-booking for the same vehicle window.
  - Automated rental cost calculation based on duration and daily rates.
  - Customer booking management with cancellation support.

- **Demo Payment System**:
  - Simulated payment recording (UPI / Card / Cash) for project demonstrations.
  - Transitions booking status from `pending` to `confirmed`.
  - Customer payment history.

- **Admin Management Dashboard**:
  - **Bookings**: Manage status lifecycle (`pending` -> `confirmed` -> `active/rented` -> `completed/available`).
  - **Vehicles**: Add vehicles, update rental status, delete inventory.
  - **Branches**: Add pickup/dropoff branches, toggle active status, delete branches.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=6942
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:6942/api
```

---

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs by default on `http://localhost:6942`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs by default on `http://localhost:5173`.

---

## API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### Vehicles (`/api/vehicles`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public | List all vehicles |
| `GET` | `/api/vehicles/:id` | Public | Get single vehicle details |
| `POST` | `/api/vehicles` | Admin | Create a new vehicle |
| `PATCH` | `/api/vehicles/:id` | Admin | Update vehicle details or status |
| `DELETE` | `/api/vehicles/:id` | Admin | Remove a vehicle |

### Branches (`/api/branches`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/branches` | Public | List active branches (or all if `?all=true`) |
| `POST` | `/api/branches` | Admin | Create new branch |
| `PATCH` | `/api/branches/:id` | Admin | Update branch or toggle `isActive` |
| `DELETE` | `/api/branches/:id` | Admin | Remove branch |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Customer | Create booking (checks date overlap) |
| `GET` | `/api/bookings/my-bookings` | Customer | Get bookings for logged-in user |
| `PATCH` | `/api/bookings/:id/cancel` | Customer | Cancel customer's own booking |
| `GET` | `/api/bookings` | Admin | List all system bookings |
| `PATCH` | `/api/bookings/:id/status` | Admin | Update booking state machine & vehicle status |

### Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/:bookingId` | Customer | Record demo payment & confirm booking |
| `GET` | `/api/payments/my-payments` | Customer | View customer demo payment receipts |

# 📅 AppointBook — Appointment Booking System

> **ITAS4 (Client-Side) & ITAS5 (Server-Side) Final Project**
> A full-stack appointment booking system built with Angular, Node.js/Express/TypeScript, and Supabase.

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🖥️ Frontend (Vercel) | `https://appointbook.vercel.app` *(update after deploy)* |
| ⚙️ Backend API (Render) | `https://appointment-booking-api.onrender.com` *(update after deploy)* |
| 📚 API Docs (Swagger) | `https://appointment-booking-api.onrender.com/api/docs` |

---

## 🧰 Tech Stack

### Frontend (client/)
| Tech | Purpose |
|---|---|
| Angular 17 | Component-based SPA framework |
| Tailwind CSS | Utility-first responsive styling |
| RxJS | Reactive programming / HTTP observables |
| Angular Routing | Client-side navigation + Route Guards |
| Reactive Forms | Form building + validation |
| Angular Signals | Modern state management |

### Backend (server/)
| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| TypeScript | Type-safe backend development |
| Supabase (PostgreSQL) | Database + Storage |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Input validation & sanitization |
| Multer | File upload handling |
| Swagger/OpenAPI | API documentation |
| Winston | Logging |
| Helmet + CORS | Security middleware |

---

## ✨ Features

### Authentication
- [x] User Registration with validation
- [x] User Login with JWT
- [x] Password hashing with bcrypt (12 rounds)
- [x] JWT token stored in localStorage
- [x] Auto-logout on token expiry
- [x] Route guards for protected pages

### Role-Based Access
- [x] **Admin**: Full access — manage all appointments & users
- [x] **User**: Manage own appointments only

### Appointments
- [x] Create appointment (title, date, time, description, notes, file)
- [x] View all appointments (own or all for admin)
- [x] Edit pending appointments
- [x] Delete appointments
- [x] Status system: `pending → approved / rejected / cancelled`
- [x] Admin can approve/reject with notes

### Search, Filter & Pagination
- [x] Search by title (debounced)
- [x] Filter by status
- [x] Filter by date
- [x] Server-side pagination

### File Upload
- [x] Upload images, PDFs, DOC/DOCX
- [x] Stored in Supabase Storage
- [x] Public URL returned and linked to appointment

### Admin Panel
- [x] View all appointments with quick approve/reject
- [x] Appointment statistics (total, pending, approved, rejected, cancelled)
- [x] User management (list, toggle active/inactive, delete)

### Profile
- [x] Update name, phone
- [x] Upload avatar photo

---

## 🗂️ Repository Structure

```
appointment-booking-system/
│
├── client/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/         # auth.guard, admin.guard, guest.guard
│   │   │   │   ├── interceptors/   # auth.interceptor (JWT injection)
│   │   │   │   ├── models/         # TypeScript interfaces
│   │   │   │   └── services/       # auth, appointment, user, upload
│   │   │   ├── features/
│   │   │   │   ├── auth/           # login, register
│   │   │   │   ├── dashboard/      # stats + recent appointments
│   │   │   │   ├── appointments/   # list, form, detail
│   │   │   │   ├── admin/          # admin panel + user management
│   │   │   │   └── profile/        # user profile editor
│   │   │   ├── shared/
│   │   │   │   └── components/     # navbar, not-found
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── angular.json
│
├── server/                         # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── supabase.ts         # Supabase client setup
│   │   │   └── swagger.ts          # OpenAPI spec
│   │   ├── controllers/            # auth, user, appointment, upload
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts  # JWT verify + role check
│   │   │   ├── errorHandler.ts     # Global error handling
│   │   │   ├── validators.ts       # express-validator rules
│   │   │   ├── handleValidation.ts # Validation result checker
│   │   │   └── upload.middleware.ts# Multer config
│   │   ├── routes/                 # auth, user, appointment, upload
│   │   ├── services/               # business logic layer
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # logger, jwt helpers
│   │   └── index.ts                # Express app entry point
│   ├── render.yaml
│   └── package.json
│
├── supabase-schema.sql             # Database schema + seed
├── .env.example                    # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI: `npm install -g @angular/cli`
- Supabase account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/appointment-booking-system.git
cd appointment-booking-system
```

---

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **Database → SQL Editor**
3. Paste and run the contents of `supabase-schema.sql`
4. Go to **Storage → New Bucket**
   - Name: `appointments`
   - Public: ✅ Yes
5. Copy your keys from **Settings → API**:
   - Project URL
   - `anon` public key
   - `service_role` secret key

---

### 3. Run the Backend

```bash
cd server
cp .env.example .env
# Fill in your Supabase credentials in .env
npm install
npm run dev
# API runs at http://localhost:3000
# Swagger docs at http://localhost:3000/api/docs
```

---

### 4. Run the Frontend

```bash
cd client
npm install
npm start
# App runs at http://localhost:4200
```

---

### 5. Default Admin Login

```
Email:    admin@appointbook.dev
Password: Admin123!
```

> ⚠️ Change this password immediately after first login via Profile.

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login + get JWT token |
| GET | `/auth/me` | 🔒 User | Get current user |

### Users — `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | 🔑 Admin | List all users (paginated) |
| GET | `/users/:id` | 🔒 Owner/Admin | Get user by ID |
| PUT | `/users/:id` | 🔒 Owner/Admin | Update profile |
| PATCH | `/users/:id/toggle-status` | 🔑 Admin | Activate/deactivate user |
| DELETE | `/users/:id` | 🔑 Admin | Delete user |

### Appointments — `/api/appointments`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/appointments` | 🔒 User | Get appointments (own/all for admin) |
| POST | `/appointments` | 🔒 User | Create new appointment |
| GET | `/appointments/stats` | 🔑 Admin | Get status statistics |
| GET | `/appointments/:id` | 🔒 Owner/Admin | Get by ID |
| PUT | `/appointments/:id` | 🔒 Owner/Admin | Update appointment |
| PATCH | `/appointments/:id/status` | 🔑 Admin | Approve/reject |
| DELETE | `/appointments/:id` | 🔒 Owner/Admin | Delete |

### Upload — `/api/upload`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload` | 🔒 User | Upload file to Supabase Storage |

> **Query Parameters for GET /appointments:**
> `page`, `limit`, `status`, `date`, `search`, `sort`, `order`

---

## ☁️ Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repository → select `server/` directory (or set Root Directory to `server`)
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18
5. Add all environment variables from `.env.example`
6. Set `FRONTEND_URL` to your Vercel URL (after deploying frontend)
7. Click **Deploy**

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Set:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `dist/appointment-booking-client/browser`
4. Add environment variable:
   - `VITE_API_URL` is not used — update `src/environments/environment.prod.ts` with your Render URL before deploying
5. Click **Deploy**

---

## 🗄️ Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | TEXT | Unique |
| password_hash | TEXT | bcrypt hashed |
| full_name | TEXT | |
| phone | TEXT | Nullable |
| role | TEXT | `admin` or `user` |
| avatar_url | TEXT | Nullable |
| is_active | BOOLEAN | Default true |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated |

### `appointments`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| title | TEXT | |
| description | TEXT | Nullable |
| appointment_date | DATE | |
| appointment_time | TIME | |
| status | TEXT | pending/approved/rejected/cancelled |
| file_url | TEXT | Supabase Storage URL |
| notes | TEXT | User notes |
| admin_notes | TEXT | Admin decision notes |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | Auto-updated |

---

## 👥 Group Members

| Name | Role |
|---|---|
| Member 1 | Frontend Developer |
| Member 2 | Backend Developer |
| Member 3 | UI/UX & Documentation |

---

## ?? Screenshots

Add screenshots to the `screenshots/` folder and reference them below.

### UI Screenshots

| Page | Screenshot |
|---|---|
| Login | `screenshots/login.png` |
| Register | `screenshots/register.png` |
| User Dashboard | `screenshots/user-dashboard.png` |
| Appointments List | `screenshots/appointments-list.png` |
| Create Appointment | `screenshots/create-appointment.png` |
| Appointment Details | `screenshots/appointment-details.png` |
| Profile | `screenshots/profile.png` |
| Admin Dashboard | `screenshots/admin-dashboard.png` |
| Admin User Management | `screenshots/admin-users.png` |
| Admin Appointment Management | `screenshots/admin-appointments.png` |

### API Testing (Postman)

| Endpoint | Screenshot |
|---|---|
| `POST /auth/login` | `screenshots/api-login.png` |
| `POST /auth/register` | `screenshots/api-register.png` |
| `GET /appointments` | `screenshots/api-get-appointments.png` |
| `POST /appointments` | `screenshots/api-create-appointment.png` |
| `PATCH /appointments/:id/status` | `screenshots/api-update-appointment-status.png` |
| `POST /upload` | `screenshots/api-upload-file.png` |


## 📝 Notes

- No separate PDF documentation — everything is in this README and the `screenshots/` folder
- API is documented via Swagger at `/api/docs`
- All routes are protected with JWT authentication
- Admin seed user is created by the SQL schema


# Agro Nexus Connect - Full Setup Guide

Complete guide to set up and run both the frontend and backend.

## Project Overview

- **Frontend**: React + TypeScript + Vite (runs on port 8080)
- **Backend**: Node.js + Express + Sequelize (runs on port 4000)
- **Database**: PostgreSQL (port 5432)

## Quick Start

### 1. Start PostgreSQL (using Docker)

```bash
cd backend
docker-compose up -d
```

Verify it's running:
```bash
docker ps | grep postgres
```

### 2. Set Up Backend

```bash
cd backend
npm install
npm run db:sync
npm run db:seed
npm run dev
```

Backend will start on `http://localhost:4000`

### 3. Set Up Frontend

In a new terminal:

```bash
cd /workspaces/agro-nexus-connect
cp .env.example .env.local
npm install
npm run dev
```

Frontend will start on `http://localhost:8080`

### 4. Test the Setup

Open in browser:
- Frontend: `http://localhost:8080`
- Backend Health: `http://localhost:4000/api/health`

## Architecture

### Frontend (`src/`)
```
App.tsx                          # Main app with routing
├── pages/
│   ├── Index.tsx               # Landing page
│   ├── Marketplace.tsx         # Browse products (uses React Query)
│   ├── Dashboard.tsx           # Farmer dashboard (uses React Query)
│   ├── About.tsx
│   └── NotFound.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ui/                     # Shadcn UI components
├── services/
│   ├── api.ts                  # Axios client
│   ├── products.ts             # Product API calls
│   └── dashboard.ts            # Dashboard API calls
└── hooks/
    └── use-toast.ts            # Toast notifications
```

### Backend (`backend/src/`)
```
index.js                         # Express app entry
├── config/
│   └── database.js             # Sequelize config
├── models/
│   ├── User.js
│   ├── Farmer.js
│   ├── Product.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Review.js
│   ├── Category.js
│   └── index.js                # Associations
├── controllers/                # Business logic
├── routes/                     # API endpoints
├── middleware/
│   └── auth.js                 # JWT & error handling
└── scripts/
    ├── sync-db.js              # Create tables
    └── seed-db.js              # Sample data
```

## Environment Variables

### Frontend (`.env.local`)
```
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (`.env`)
```
DATABASE_URL=postgres://agronexus:password@localhost:5432/agronexus_db
NODE_ENV=development
PORT=4000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

## API Endpoints

All endpoints prefixed with `/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Current user
- `POST /auth/logout` - Logout

### Products
- `GET /products` - List products
- `GET /products/:id` - Product details
- `POST /products` - Create (farmers)
- `PUT /products/:id` - Update (farmers)
- `DELETE /products/:id` - Delete (farmers)

### Farmers
- `GET /farmers` - List farmers
- `GET /farmers/:id` - Farmer profile
- `GET /farmers/:id/products` - Farmer products
- `GET /farmers/dashboard` - Dashboard stats (farmers)

### Orders
- `GET /orders` - User orders
- `GET /orders/recent` - Recent orders (farmers)
- `POST /orders` - Create order
- `PUT /orders/:id/status` - Update status (sellers)

### Reviews
- `GET /reviews/:productId` - Product reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review

### Categories
- `GET /categories` - All categories

## Database Schema

### Relations
- User → Farmer (1:1, optional)
- Farmer → Products (1:M)
- User → Orders (1:M as buyer/seller)
- Order → OrderItems (1:M)
- OrderItem → Product (M:1)
- Product → Reviews (1:M)
- Review → User (M:1)

## Sample Test Data

After `npm run db:seed`:

**Farmers:**
1. john@example.com (Green Valley Farm, Kiambu)
2. mary@example.com (Harvest Dreams Farm, Nakuru)

**Buyer:**
- buyer@example.com

**Password:** password123 (all users)

**Sample Products:**
- Fresh Organic Tomatoes (120 KES/kg)
- Organic Green Beans (150 KES/kg)
- Grade A Maize (45 KES/kg)
- Premium Rice (180 KES/kg)

## Common Tasks

### Reseed Database
```bash
cd backend
npm run db:seed
```

### View Database
```bash
psql postgres://agronexus:password@localhost:5432/agronexus_db
```

### Stop Backend
```bash
Ctrl+C in terminal
```

### Stop Frontend
```bash
Ctrl+C in terminal
```

### Stop Database
```bash
docker-compose down  # Keeps data
docker-compose down -v  # Removes data
```

## Frontend Features

- **Landing Page**: Hero, features, testimonials, CTA
- **Marketplace**: Browse products with filters, search, pagination
- **Dashboard**: Farmer stats, recent orders, upcoming tasks
- **About**: Team, values, mission

### Data Flow
1. User navigates to page
2. React component mounts
3. useQuery hook fetches from backend API
4. Data is cached by React Query
5. UI renders with data

## Backend Features

- **Authentication**: JWT tokens, password hashing with bcrypt
- **Authorization**: Role-based access (farmer/buyer)
- **Database**: PostgreSQL with Sequelize ORM
- **Validation**: Basic input validation
- **Error Handling**: Centralized error middleware
- **Pagination**: Products and farmers support limit/offset

## Development Workflow

1. **Make changes to frontend** → Auto hot-reload (Vite)
2. **Make changes to backend** → Auto restart (nodemon)
3. **Add new endpoint**:
   - Create controller function
   - Add route
   - Frontend: add service function & React Query hook
4. **Test with API tools**: Postman, Thunder Client, curl

## Deployment

### Frontend
```bash
npm run build
# Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)
```

### Backend
1. Set production env vars in `.env`
2. Ensure PostgreSQL is accessible
3. Run migrations: `npm run db:sync`
4. Start: `npm start`
5. Deploy to platform (Heroku, Railway, etc.)

## Troubleshooting

### Frontend can't reach backend
- Ensure backend is running on port 4000
- Check `VITE_API_BASE_URL` in `.env.local`
- Check browser CORS in network tab

### Database connection failed
- Verify PostgreSQL is running: `docker-compose ps`
- Check credentials in `.env`
- Verify database exists and user has permissions

### Port conflicts
- Frontend: Change port in `vite.config.ts`
- Backend: Change `PORT` in `.env`

### Dependencies issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Backend structure with MVC pattern complete
2. ✅ Frontend connected to API with React Query
3. ✅ Sample data seeding ready
4. 🔄 Add authentication UI (login/register pages)
5. 🔄 Implement checkout flow for orders
6. 🔄 Add image uploads for products
7. 🔄 Real-time notifications
8. 🔄 Payment integration (M-Pesa, Stripe)
9. 🔄 Admin dashboard

## Support

For issues:
1. Check logs in terminal
2. Verify environment variables
3. Check database connection
4. Review API documentation
5. Test endpoints with curl or Postman

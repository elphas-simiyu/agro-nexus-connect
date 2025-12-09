# Backend API spec for Agro Nexus Connect

This document lists the expected backend endpoints and the recommended database schema for the frontend to work.

## Base URL
All endpoints are expected under `/api` (e.g. `https://api.example.com/api/...`). The frontend uses `VITE_API_BASE_URL` to configure the host.

---

## Authentication
- POST /api/auth/register
  - body: { username, email, password, user_type }
  - returns: { user, token }
- POST /api/auth/login
  - body: { email, password }
  - returns: { user, token }
- POST /api/auth/logout
- GET /api/auth/me
  - returns: { user }
- POST /api/auth/refresh
  - returns: { token }

## Products
- GET /api/products
  - query params: page, limit, category, q (search)
  - returns: { results: Product[], total, page, limit }
- GET /api/products/:id
  - returns: Product
- POST /api/products
  - body: Product payload (auth required, farmer)
  - returns: created Product
- PUT /api/products/:id
- DELETE /api/products/:id
- GET /api/categories
  - returns: Category[]

## Orders
- GET /api/orders
  - query params: userId (or for seller), status, page
  - returns: { results: Order[], total }
- POST /api/orders
  - body: { items: [{ productId, quantity }], buyerId, shipping, paymentMethod }
  - returns: created Order
- GET /api/orders/:id
- PUT /api/orders/:id/status
  - body: { status }
- GET /api/orders/recent
  - returns: recent orders for dashboard

## Farmers
- GET /api/farmers
- GET /api/farmers/:id
- PUT /api/farmers/:id
- GET /api/farmers/:id/products
- GET /api/farmers/dashboard
  - returns stats array for dashboard cards

## Reviews
- GET /api/reviews/:productId
- POST /api/reviews
- PUT /api/reviews/:id

---

## Database Schema (recommended)
See SQL-like definitions below.

Users
```
users
- id (PK)
- username
- email
- password_hash
- first_name
- last_name
- user_type (farmer|buyer)
- profile_image
- created_at
- updated_at
```

Farmers
```
farmers
- id (PK)
- user_id (FK -> users.id)
- location
- farm_name
- bio
- rating
- total_reviews
- verification_status
- created_at
```

Products
```
products
- id (PK)
- farmer_id (FK -> farmers.id)
- name
- description
- category
- price
- unit
- available_quantity
- image_url
- is_organic
- rating
- total_reviews
- created_at
- updated_at
```

Orders
```
orders
- id (PK)
- buyer_id (FK -> users.id)
- seller_id (FK -> users.id)
- status (pending|confirmed|shipped|delivered|cancelled)
- total_amount
- created_at
- updated_at
```

Order Items
```
order_items
- id (PK)
- order_id (FK -> orders.id)
- product_id (FK -> products.id)
- quantity
- unit_price
- subtotal
```

Reviews
```
reviews
- id (PK)
- product_id (FK -> products.id)
- user_id (FK -> users.id)
- rating
- comment
- created_at
```

Categories
```
categories
- id (PK)
- name
- description
- created_at
```

---

If you'd like, I can scaffold a minimal Node/Express backend that matches this API and schema so you can run the app end-to-end locally.
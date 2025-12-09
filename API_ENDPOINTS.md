# API Endpoints Reference

All endpoints are prefixed with `/api` and return JSON.

## Authentication Endpoints (`/api/auth`)

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_farmer",
  "email": "john@example.com",
  "password": "password123",
  "user_type": "farmer",
  "first_name": "John",
  "last_name": "Mwangi"
}

Response: 201 Created
{
  "user": { id, username, email, user_type },
  "token": "jwt_token_here"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { id, username, email, user_type },
  "token": "jwt_token_here"
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": { id, username, email, first_name, last_name, user_type, ... }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Logged out" }
```

---

## Product Endpoints (`/api/products`)

### List Products
```
GET /products?page=1&limit=10&category=Vegetables&q=tomato
Authorization: Optional

Response: 200 OK
{
  "results": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}

Query Parameters:
  - page: 1 (default)
  - limit: 10 (default)
  - category: Optional, filters by category
  - q: Optional, search by name/description
```

### Get Product Details
```
GET /products/:id
Authorization: Optional

Response: 200 OK
{
  "id": 1,
  "name": "Fresh Organic Tomatoes",
  "price": 120,
  "category": "Vegetables",
  ...
  "Farmer": { id, farm_name, location, rating },
  "Reviews": [...]
}
```

### Create Product (Farmers Only)
```
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Fresh Tomatoes",
  "description": "Organic fresh tomatoes",
  "category": "Vegetables",
  "price": 120,
  "unit": "kg",
  "available_quantity": 500,
  "image_url": "https://...",
  "is_organic": true
}

Response: 201 Created
{ id, name, price, ... }
```

### Update Product (Owner Only)
```
PUT /products/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "price": 150,
  "available_quantity": 300
}

Response: 200 OK
{ Updated product object }
```

### Delete Product (Owner Only)
```
DELETE /products/:id
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Product deleted" }
```

---

## Farmer Endpoints (`/api/farmers`)

### List All Farmers
```
GET /farmers?page=1&limit=10
Authorization: Optional

Response: 200 OK
{
  "results": [
    {
      "id": 1,
      "location": "Kiambu, Kenya",
      "farm_name": "Green Valley Farm",
      "rating": 4.8,
      "verification_status": "verified",
      "User": { username, email, first_name, last_name }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Get Farmer Profile
```
GET /farmers/:id
Authorization: Optional

Response: 200 OK
{
  "id": 1,
  "user_id": 1,
  "location": "Kiambu, Kenya",
  "farm_name": "Green Valley Farm",
  "bio": "Organic farmer",
  "rating": 4.8,
  "total_reviews": 156,
  "verification_status": "verified",
  "User": { id, username, email, first_name, last_name }
}
```

### Update Farmer Profile
```
PUT /farmers/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "location": "New Location",
  "farm_name": "New Farm Name",
  "bio": "Updated bio"
}

Response: 200 OK
{ Updated farmer object }
```

### Get Farmer's Products
```
GET /farmers/:id/products
Authorization: Optional

Response: 200 OK
[
  { id, name, price, category, available_quantity, ... },
  ...
]
```

### Get Dashboard Stats (Farmers Only)
```
GET /farmers/dashboard
Authorization: Bearer <token> (farmer only)

Response: 200 OK
[
  { title: "Total Revenue", value: "KES 245,000", change: "+12.5%", trend: "up" },
  { title: "Active Orders", value: "23", change: "+3", trend: "up" },
  { title: "Products Listed", value: "18", change: "-2", trend: "down" },
  { title: "Total Buyers", value: "156", change: "+28", trend: "up" }
]
```

---

## Order Endpoints (`/api/orders`)

### List User's Orders
```
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer <token>

Response: 200 OK
{
  "results": [
    {
      "id": 1,
      "buyer_id": 3,
      "seller_id": 1,
      "status": "pending",
      "total_amount": 24000,
      "createdAt": "2025-12-08T...",
      "Buyer": { id, username, email },
      "Seller": { id, username, email },
      "OrderItems": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 200,
          "unit_price": 120,
          "subtotal": 24000,
          "Product": { id, name, price }
        }
      ]
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10
}

Query Parameters:
  - page: 1 (default)
  - limit: 10 (default)
  - status: pending|confirmed|shipped|delivered|cancelled (optional)
```

### Create Order
```
POST /orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "items": [
    {
      "productId": 1,
      "quantity": 200
    }
  ],
  "seller_id": 1
}

Response: 201 Created
{
  "id": 1,
  "buyer_id": 3,
  "seller_id": 1,
  "status": "pending",
  "total_amount": 24000,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Get Order Details
```
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "buyer_id": 3,
  "seller_id": 1,
  "status": "pending",
  "total_amount": 24000,
  "Buyer": { ... },
  "Seller": { ... },
  "OrderItems": [ ... ]
}
```

### Update Order Status (Seller Only)
```
PUT /orders/:id/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "shipped"
}

Response: 200 OK
{ Updated order object with new status }

Valid statuses: pending, confirmed, shipped, delivered, cancelled
```

### Get Recent Orders (Farmers Only)
```
GET /orders/recent
Authorization: Bearer <token> (farmer/seller only)

Response: 200 OK
[
  {
    "id": "ORD-001",
    "buyer": "buyer_username",
    "product": "Fresh Tomatoes",
    "quantity": "200kg",
    "amount": "KES 24,000",
    "status": "pending"
  }
]
```

---

## Review Endpoints (`/api/reviews`)

### Get Product Reviews
```
GET /reviews/:productId
Authorization: Optional

Response: 200 OK
[
  {
    "id": 1,
    "product_id": 1,
    "user_id": 3,
    "rating": 5,
    "comment": "Excellent quality!",
    "createdAt": "2025-12-08T..."
  }
]
```

### Create Review
```
POST /reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product, very fresh!"
}

Response: 201 Created
{
  "id": 2,
  "product_id": 1,
  "user_id": 3,
  "rating": 5,
  "comment": "Great product, very fresh!",
  "createdAt": "2025-12-08T..."
}

Note: Product rating is automatically updated after creating review
```

### Update Review
```
PUT /reviews/:id
Content-Type: application/json
Authorization: Bearer <token> (review author only)

{
  "rating": 4,
  "comment": "Updated comment"
}

Response: 200 OK
{ Updated review object }
```

---

## Category Endpoints (`/api/categories`)

### Get All Categories
```
GET /categories
Authorization: Optional

Response: 200 OK
[
  { "id": 1, "name": "Vegetables", "description": "Fresh vegetables" },
  { "id": 2, "name": "Fruits", "description": "Fresh fruits" },
  { "id": 3, "name": "Grains", "description": "Grains and cereals" },
  ...
]
```

### Create Category (Admin)
```
POST /categories
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Organic Products",
  "description": "Certified organic products"
}

Response: 201 Created
{ "id": 7, "name": "Organic Products", "description": "..." }
```

---

## Health Check

### Server Health
```
GET /health
Authorization: Optional

Response: 200 OK
{ "message": "Server is running" }
```

---

## Error Responses

All errors return JSON with appropriate HTTP status code:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request (missing/invalid fields)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (not authorized for action)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (e.g., email already exists)
- `500` - Server Error

---

## Authentication

Protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens are obtained from:
- `POST /auth/register` - Returns token for new user
- `POST /auth/login` - Returns token for existing user

Token expiry: 7 days

---

## Sample Data

After running `npm run db:seed`, the following test accounts are created:

**Farmers:**
```
Email: john@example.com
Farm: Green Valley Farm (Kiambu)
Products: Tomatoes, Green Beans

Email: mary@example.com
Farm: Harvest Dreams Farm (Nakuru)
Products: Maize, Rice
```

**Buyer:**
```
Email: buyer@example.com
```

**Password (all users):** `password123`

---

## Testing with curl

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@example.com","password":"pass123","user_type":"buyer"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get products (save token from login response)
curl http://localhost:4000/api/products

# Get protected endpoint
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create order
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"items":[{"productId":1,"quantity":200}],"seller_id":1}'
```

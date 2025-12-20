# RR Products Manufacturing - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All admin operations require JWT authentication. First, login to get a token.

### Register Admin User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@rrproducts.com",
  "password": "securepassword123",
  "isAdmin": true
}
```

### Login (Get JWT Token)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@rrproducts.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isAdmin": true,
  "name": "Admin Name"
}
```

**Save the token** - You'll need it for all admin operations.

---

## Products API

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
  - Example: `/api/products?category=Brakes%20%26%20Suspension`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Brake Pad Assembly",
    "brand": "RR Premium",
    "category": "Brakes & Suspension",
    "price": 1890,
    "stock": 45,
    "description": "Manufactured with precision",
    "specs": {},
    "image": "",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Single Product
```http
GET /api/products/:id
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Brake Pad Assembly",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 1890,
  "stock": 45,
  "description": "Manufactured with precision",
  "specs": {},
  "image": ""
}
```

### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "LED Headlight Module",
  "brand": "RR Premium",
  "category": "Electrical & Lighting",
  "price": 2190,
  "stock": 50,
  "description": "High-quality LED assembly",
  "specs": {
    "Voltage": "12V",
    "Wattage": "35W",
    "Lifespan": "50000 hours"
  },
  "image": "https://example.com/image.jpg"
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "stock": 75,
  "price": 1990
}
```

**Note:** You can update any field. Only include fields you want to change.

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true
}
```

---

## Postman Setup

### Step 1: Create Environment
1. Open Postman
2. Click "Environments" → "Create Environment"
3. Add variable:
   - Variable: `base_url`
   - Initial Value: `http://localhost:5000`
   - Variable: `token`
   - Initial Value: (leave empty)

### Step 2: Login Request
1. Create new request: `POST {{base_url}}/api/auth/login`
2. Body → raw → JSON:
```json
{
  "email": "admin@rrproducts.com",
  "password": "yourpassword"
}
```
3. In Tests tab, add:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### Step 3: Admin Requests
For all admin requests (POST, PUT, DELETE), add:
- **Headers:**
  - Key: `Authorization`
  - Value: `Bearer {{token}}`

### Example: Update Stock
```http
PUT {{base_url}}/api/products/507f1f77bcf86cd799439011
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "stock": 100
}
```

---

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rrproducts
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Token missing"
}
```
or
```json
{
  "error": "Token invalid"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid data",
  "details": "Validation error message"
}
```

---

## Quick Start

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Register an admin user** (first time only):
   ```bash
   POST /api/auth/register
   {
     "name": "Admin",
     "email": "admin@rrproducts.com",
     "password": "admin123",
     "isAdmin": true
   }
   ```

3. **Login to get token:**
   ```bash
   POST /api/auth/login
   {
     "email": "admin@rrproducts.com",
     "password": "admin123"
   }
   ```

4. **Use token for admin operations:**
   - Add products
   - Update stock levels
   - Delete products
   - Manage inventory

---

## Stock Management Workflow

1. **Monitor Inventory:** `GET /api/products` - View all products and stock levels
2. **Check Low Stock:** Filter products where `stock < 30`
3. **Update Stock:** `PUT /api/products/:id` - Update stock after production or sales
4. **Add New Product:** `POST /api/products` - Add newly manufactured parts
5. **Remove Discontinued:** `DELETE /api/products/:id` - Remove obsolete products

---

## Notes

- All timestamps are in ISO 8601 format
- Stock values must be non-negative integers
- Price values are in Indian Rupees (₹)
- Categories: "Engine Parts", "Body & Frame", "Electrical & Lighting", "Brakes & Suspension", "Wheels & Tyres", "Accessories", "Oils & Lubricants"
- JWT tokens expire after 2 hours - re-login to get a new token


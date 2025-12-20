# RR Products - Complete Setup & Usage Guide

## 🔐 Login Passwords

### Frontend Login (Website UI)
- **Password:** `admin123`
- This is a simple password check for the website dashboard
- Location: Click "Manager Login" button in the navigation bar

### Backend API Login (Postman)
- **Email:** `admin@rrproducts.com` (or any email you register)
- **Password:** The password you set during registration
- This uses JWT authentication for API access

---

## 📦 MongoDB Compass Connection

### Step 1: Install MongoDB Compass
Download from: https://www.mongodb.com/try/download/compass

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
- **Windows:** MongoDB should be running as a service
- **Mac/Linux:** Run `mongod` in terminal

### Step 3: Connect in MongoDB Compass
1. Open MongoDB Compass
2. Use this connection string:
   ```
   mongodb://localhost:27017
   ```
   OR if you have a specific database:
   ```
   mongodb://localhost:27017/rrproducts
   ```
3. Click "Connect"

### Step 4: View Your Data
- **Database:** `rrproducts` (or the name in your MONGODB_URI)
- **Collections:**
  - `products` - All your inventory items
  - `users` - Admin users and their credentials

### Step 5: Create .env File
Create a file `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rrproducts
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

---

## 🚀 Initial Setup (First Time)

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on port 27017

### 3. Start Backend Server
```bash
cd server
npm start
```
Server will run on: `http://localhost:5000`

### 4. Start Frontend
```bash
cd client
npm start
```
Website will run on: `http://localhost:3000`

---

## 📝 Register Admin User (First Time via Postman)

### Step 1: Register Admin
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@rrproducts.com",
  "password": "admin123",
  "isAdmin": true
}
```

**Response:**
```json
{
  "message": "User registered"
}
```

### Step 2: Login to Get Token
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@rrproducts.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isAdmin": true,
  "name": "Admin User"
}
```

**⚠️ Save this token!** You'll need it for all admin operations.

---

## 🔄 Change Password via Postman

### Step 1: Login First (Get Token)
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@rrproducts.com",
  "password": "admin123"
}
```

Copy the `token` from response.

### Step 2: Change Password
```http
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

**Now use the new password for future logins!**

---

## 📦 Add/Update Stock via Postman

### Method 1: Add New Product (with stock)

```http
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Brake Pad Assembly",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 1890,
  "stock": 100,
  "description": "Manufactured with precision engineering",
  "specs": {
    "Material": "Ceramic Composite",
    "Fit": "Universal",
    "Warranty": "1 Year"
  },
  "image": ""
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Brake Pad Assembly",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 1890,
  "stock": 100,
  ...
}
```

### Method 2: Update Existing Stock

**First, get product ID:**
```http
GET http://localhost:5000/api/products
```

Find the `_id` of the product you want to update.

**Then update stock:**
```http
PUT http://localhost:5000/api/products/PRODUCT_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "stock": 150
}
```

**Example:**
```http
PUT http://localhost:5000/api/products/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "stock": 150
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Brake Pad Assembly",
  "stock": 150,
  ...
}
```

### Method 3: Update Multiple Fields (Stock + Price)

```http
PUT http://localhost:5000/api/products/PRODUCT_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "stock": 200,
  "price": 1990,
  "description": "Updated description"
}
```

---

## 🎯 Postman Setup (Recommended)

### Step 1: Create Environment
1. Open Postman
2. Click "Environments" → "+" (Create Environment)
3. Name: `RR Products`
4. Add variables:
   - `base_url` = `http://localhost:5000`
   - `token` = (leave empty, will be set automatically)

### Step 2: Auto-Save Token
Create a login request:
- **URL:** `POST {{base_url}}/api/auth/login`
- **Body:**
```json
{
  "email": "admin@rrproducts.com",
  "password": "admin123"
}
```
- **Tests Tab:** Add this script:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    console.log("Token saved:", jsonData.token);
}
```

### Step 3: Use Token in Requests
For all admin requests, add:
- **Header:** `Authorization`
- **Value:** `Bearer {{token}}`

---

## 📊 Complete Postman Collection

### 1. Register Admin
```
POST {{base_url}}/api/auth/register
Body: {
  "name": "Admin",
  "email": "admin@rrproducts.com",
  "password": "admin123",
  "isAdmin": true
}
```

### 2. Login
```
POST {{base_url}}/api/auth/login
Body: {
  "email": "admin@rrproducts.com",
  "password": "admin123"
}
```

### 3. Change Password
```
PUT {{base_url}}/api/auth/change-password
Headers: Authorization: Bearer {{token}}
Body: {
  "currentPassword": "admin123",
  "newPassword": "newPassword123"
}
```

### 4. Get All Products
```
GET {{base_url}}/api/products
```

### 5. Get Single Product
```
GET {{base_url}}/api/products/:id
```

### 6. Add New Product
```
POST {{base_url}}/api/products
Headers: Authorization: Bearer {{token}}
Body: {
  "name": "Product Name",
  "brand": "RR Premium",
  "category": "Engine Parts",
  "price": 1000,
  "stock": 50,
  "description": "Product description",
  "specs": {},
  "image": ""
}
```

### 7. Update Stock
```
PUT {{base_url}}/api/products/:id
Headers: Authorization: Bearer {{token}}
Body: {
  "stock": 100
}
```

### 8. Delete Product
```
DELETE {{base_url}}/api/products/:id
Headers: Authorization: Bearer {{token}}
```

---

## 🔍 View Data in MongoDB Compass

1. **Connect to:** `mongodb://localhost:27017`
2. **Select Database:** `rrproducts`
3. **Collections:**
   - **products** - View all inventory
   - **users** - View admin users (passwords are hashed)

### Example Product Document:
```json
{
  "_id": ObjectId("..."),
  "name": "Brake Pad Assembly",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 1890,
  "stock": 100,
  "description": "Manufactured with precision",
  "specs": {},
  "image": "",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

### Example User Document:
```json
{
  "_id": ObjectId("..."),
  "name": "Admin User",
  "email": "admin@rrproducts.com",
  "password": "$2a$10$hashedpassword...",
  "isAdmin": true,
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

---

## ⚠️ Troubleshooting

### MongoDB Connection Failed
- Make sure MongoDB is running: `mongod` or check Windows Services
- Check connection string in `.env` file
- Default port: `27017`

### Token Expired
- Tokens expire after 2 hours
- Just login again to get a new token

### 401 Unauthorized
- Check if token is included in `Authorization` header
- Make sure token starts with `Bearer `
- Token might be expired - login again

### 403 Forbidden
- User is not an admin
- Check `isAdmin: true` when registering

### Can't See Products
- Make sure backend server is running
- Check MongoDB connection
- Verify products exist in database (use MongoDB Compass)

---

## 🎯 Quick Reference

| Action | Method | Endpoint | Auth Required |
|--------|--------|----------|---------------|
| Register | POST | `/api/auth/register` | No |
| Login | POST | `/api/auth/login` | No |
| Change Password | PUT | `/api/auth/change-password` | Yes |
| Get Products | GET | `/api/products` | No |
| Get Product | GET | `/api/products/:id` | No |
| Add Product | POST | `/api/products` | Yes (Admin) |
| Update Product | PUT | `/api/products/:id` | Yes (Admin) |
| Delete Product | DELETE | `/api/products/:id` | Yes (Admin) |

---

## 📞 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify `.env` file exists with correct values
3. Check server console for errors
4. Verify token is valid (not expired)

**Happy Stock Managing! 🚀**


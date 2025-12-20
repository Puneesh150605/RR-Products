# 📮 Postman API Guide - RR Products Website

Complete step-by-step guide to manage your inventory, products, and users using Postman.

---

## 🚀 Quick Setup

### 1. Install Postman
- Download from: https://www.postman.com/downloads/
- Install and create a free account (optional but recommended)

### 2. Start Your Backend Server
```bash
cd server
npm install
npm start
```
Your server should be running on `http://localhost:5000`

---

## 🔐 Step 1: Authentication (Get Your Token)

### Register an Admin User (First Time Only)

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Admin User",
    "email": "admin@rrproducts.com",
    "password": "admin123456",
    "isAdmin": true
  }
  ```

**Expected Response:**
```json
{
  "message": "User registered"
}
```

---

### Login to Get JWT Token

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "email": "admin@rrproducts.com",
    "password": "admin123456"
  }
  ```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzEyMzQ1Njc4OTBhYiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMzE2NDgwMCwiZXhwIjoxNzAzMTcxNjAwfQ.abc123xyz...",
  "isAdmin": true,
  "name": "Admin User"
}
```

**⚠️ IMPORTANT:** Copy the `token` value - you'll need it for all admin operations!

---

## 📦 Step 2: Add Products to Catalog

### Add a New Product

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/products`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
  *(Replace `YOUR_TOKEN_HERE` with the token you got from login)*

- **Body (raw JSON):**
  ```json
  {
    "name": "Premium Disc Brake",
    "brand": "RR Premium",
    "category": "Brakes & Suspension",
    "price": 2500,
    "stock": 50,
    "description": "High-performance disc brake system with advanced heat dissipation",
    "image": "/images/brake-pad.jpg"
  }
  ```

**Expected Response:**
```json
{
  "_id": "65c1234567890abcdef12345",
  "name": "Premium Disc Brake",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 2500,
  "stock": 50,
  "description": "High-performance disc brake system with advanced heat dissipation",
  "image": "/images/brake-pad.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Available Categories:**
- `Engine Parts`
- `Body & Frame`
- `Electrical & Lighting`
- `Brakes & Suspension`
- `Wheels & Tyres`
- `Accessories`
- `Oils & Lubricants`

---

## 📊 Step 3: Manage Inventory (Update Stock)

### Update Product Stock

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/products/PRODUCT_ID`
  *(Replace `PRODUCT_ID` with the actual `_id` from the product you want to update)*

- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

- **Body (raw JSON) - Update Stock Only:**
  ```json
  {
    "stock": 75
  }
  ```

**Or Update Multiple Fields:**
```json
{
  "stock": 75,
  "price": 2800,
  "description": "Updated description with new features"
}
```

**Expected Response:**
```json
{
  "_id": "65c1234567890abcdef12345",
  "name": "Premium Disc Brake",
  "brand": "RR Premium",
  "category": "Brakes & Suspension",
  "price": 2800,
  "stock": 75,
  "description": "Updated description with new features",
  "image": "/images/brake-pad.jpg",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### Get All Products (View Inventory)

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/products`
- **Headers:** None required

**Filter by Category:**
- **URL:** `http://localhost:5000/api/products?category=Brakes%20%26%20Suspension`
  *(URL encode spaces and special characters)*

**Expected Response:**
```json
[
  {
    "_id": "65c1234567890abcdef12345",
    "name": "Premium Disc Brake",
    "brand": "RR Premium",
    "category": "Brakes & Suspension",
    "price": 2800,
    "stock": 75,
    "description": "High-performance disc brake system",
    "image": "/images/brake-pad.jpg"
  },
  {
    "_id": "65c1234567890abcdef12346",
    "name": "LED Headlight Module",
    "brand": "RR Premium",
    "category": "Electrical & Lighting",
    "price": 2190,
    "stock": 28,
    "description": "High-quality LED assembly",
    "image": "/images/led-headlight.jpg"
  }
]
```

---

### Get Single Product

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/products/PRODUCT_ID`
- **Headers:** None required

---

### Delete a Product

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/products/PRODUCT_ID`
- **Headers:**
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

**Expected Response:**
```json
{
  "message": "Product deleted"
}
```

---

## 🔑 Step 4: Change Password

### Update Your Password

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/auth/change-password`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

- **Body (raw JSON):**
  ```json
  {
    "currentPassword": "admin123456",
    "newPassword": "newSecurePassword789"
  }
  ```

**Expected Response:**
```json
{
  "message": "Password changed successfully"
}
```

**⚠️ Requirements:**
- New password must be at least 6 characters
- You must provide your current password
- Token must be valid (not expired)

---

## 🎯 Postman Tips & Best Practices

### 1. Save Your Token as Environment Variable

1. Click **Environments** in Postman
2. Create a new environment (e.g., "RR Products Local")
3. Add variable:
   - **Variable:** `token`
   - **Initial Value:** (leave empty)
   - **Current Value:** (paste your token here)
4. In your requests, use: `Bearer {{token}}` in Authorization header

### 2. Create a Collection

1. Click **New** → **Collection**
2. Name it "RR Products API"
3. Add all your requests to this collection
4. Set collection-level authorization to use `{{token}}`

### 3. Use Pre-request Scripts (Auto-Login)

Add this script to your collection's **Pre-request Script** tab:

```javascript
// Auto-login if token is missing or expired
if (!pm.environment.get("token")) {
    pm.sendRequest({
        url: 'http://localhost:5000/api/auth/login',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: 'admin@rrproducts.com',
                password: 'admin123456'
            })
        }
    }, function (err, res) {
        if (res.json().token) {
            pm.environment.set("token", res.json().token);
        }
    });
}
```

---

## 📋 Common Workflows

### Workflow 1: Add Multiple Products

1. **Login** → Get token
2. **POST** `/api/products` → Add Product 1
3. **POST** `/api/products` → Add Product 2
4. **POST** `/api/products` → Add Product 3
5. **GET** `/api/products` → Verify all products added

### Workflow 2: Update Stock After Production

1. **GET** `/api/products` → View current inventory
2. **PUT** `/api/products/:id` → Update stock for Product A
3. **PUT** `/api/products/:id` → Update stock for Product B
4. **GET** `/api/products` → Verify updates

### Workflow 3: Remove Discontinued Products

1. **GET** `/api/products` → List all products
2. **DELETE** `/api/products/:id` → Remove discontinued product
3. **GET** `/api/products` → Verify removal

---

## ⚠️ Troubleshooting

### Error: "Token missing" or "Token invalid"
- **Solution:** Login again to get a fresh token (tokens expire after 2 hours)

### Error: "Admin access required"
- **Solution:** Make sure you registered with `"isAdmin": true` and are using the correct user's token

### Error: "Cannot connect to server"
- **Solution:** 
  1. Check if backend server is running (`npm start` in `server` folder)
  2. Verify URL is `http://localhost:5000`
  3. Check server console for errors

### Error: "Product not found"
- **Solution:** Verify the product `_id` is correct (use GET `/api/products` to see all IDs)

---

## 📚 Quick Reference Table

| Action | Method | Endpoint | Auth Required |
|--------|--------|----------|---------------|
| Register User | POST | `/api/auth/register` | No |
| Login | POST | `/api/auth/login` | No |
| Change Password | PUT | `/api/auth/change-password` | Yes |
| Get All Products | GET | `/api/products` | No |
| Get Single Product | GET | `/api/products/:id` | No |
| Add Product | POST | `/api/products` | Yes (Admin) |
| Update Product | PUT | `/api/products/:id` | Yes (Admin) |
| Delete Product | DELETE | `/api/products/:id` | Yes (Admin) |

---

**Happy API Testing! 🚀**


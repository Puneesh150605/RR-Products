# 🗄️ MongoDB Compass Connection Guide - RR Products Website

Complete guide to connect MongoDB Compass to your RR Products database for visual database management.

---

## 📥 Step 1: Install MongoDB Compass

1. **Download MongoDB Compass:**
   - Visit: https://www.mongodb.com/try/download/compass
   - Choose your operating system (Windows/Mac/Linux)
   - Download and install the application

2. **Launch MongoDB Compass** after installation

---

## 🔌 Step 2: Find Your MongoDB Connection String

### Option A: Check Your Backend `.env` File

1. Navigate to your project folder: `RR_Products_Website_Export/server`
2. Open the `.env` file (or create one if it doesn't exist)
3. Look for the `MONGODB_URI` or `MONGO_URI` variable

**Example `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/rr_products
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### Option B: Default Local Connection String

If you're running MongoDB locally and haven't customized it, use:

```
mongodb://localhost:27017/rr_products
```

**Or if no database name is specified:**
```
mongodb://localhost:27017
```

### Option C: MongoDB Atlas (Cloud Database)

If you're using MongoDB Atlas (cloud), your connection string will look like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rr_products?retryWrites=true&w=majority
```

*(Replace `username`, `password`, and `cluster0.xxxxx` with your actual Atlas credentials)*

---

## 🔗 Step 3: Connect to Database in MongoDB Compass

### For Local MongoDB:

1. **Open MongoDB Compass**
2. In the connection screen, you'll see a connection string field
3. **Paste your connection string:**
   ```
   mongodb://localhost:27017/rr_products
   ```
4. Click **Connect**

### For MongoDB Atlas (Cloud):

1. **Open MongoDB Compass**
2. Paste your Atlas connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rr_products?retryWrites=true&w=majority
   ```
3. Click **Connect**

---

## 📊 Step 4: Explore Your Database

Once connected, you'll see:

### Database Structure:
```
rr_products (database)
├── products (collection)
│   ├── Document 1: { _id, name, brand, category, price, stock, ... }
│   ├── Document 2: { _id, name, brand, category, price, stock, ... }
│   └── ...
└── users (collection)
    ├── Document 1: { _id, name, email, password, isAdmin, ... }
    └── ...
```

### View Collections:

1. **Click on `products` collection** to see all your products
2. **Click on `users` collection** to see all registered users
3. **Click on any document** to view/edit its details

---

## ✏️ Step 5: Manage Data in MongoDB Compass

### View Products:

1. Click **`products`** collection
2. You'll see a list of all products with their details
3. Click any product to view full details in JSON format

### Add a Product (Manual Entry):

1. Click **`products`** collection
2. Click **"INSERT DOCUMENT"** button
3. Use the JSON editor or form view to add:
   ```json
   {
     "name": "New Product Name",
     "brand": "RR Premium",
     "category": "Engine Parts",
     "price": 1500,
     "stock": 100,
     "description": "Product description here",
     "image": "/images/product.jpg"
   }
   ```
4. Click **Insert**

### Edit a Product:

1. Click on the product document you want to edit
2. Click **Edit** button (pencil icon)
3. Modify the fields you want to change
4. Click **Update**

### Delete a Product:

1. Click on the product document
2. Click **Delete** button (trash icon)
3. Confirm deletion

### Update Stock Levels:

1. Open a product document
2. Click **Edit**
3. Change the `stock` value:
   ```json
   {
     "stock": 75
   }
   ```
4. Click **Update**

---

## 🔍 Step 6: Query and Filter Data

### Filter Products by Category:

1. In the `products` collection, use the **Filter** bar at the top
2. Enter filter query:
   ```json
   { "category": "Brakes & Suspension" }
   ```
3. Press Enter to see filtered results

### Filter Low Stock Items:

```json
{ "stock": { "$lt": 30 } }
```
*(Shows products with stock less than 30)*

### Search by Name:

```json
{ "name": { "$regex": "Brake", "$options": "i" } }
```
*(Finds all products with "Brake" in the name, case-insensitive)*

---

## 👥 Step 7: Manage Users

### View All Users:

1. Click **`users`** collection
2. You'll see all registered users
3. **Note:** Passwords are hashed (encrypted) for security

### Change User Password (Manual):

1. Open the user document
2. Click **Edit**
3. You'll need to hash the password first (use bcrypt)
4. **Better approach:** Use the API endpoint `/api/auth/change-password` via Postman

### Make a User Admin:

1. Open the user document
2. Click **Edit**
3. Change `isAdmin` to `true`:
   ```json
   {
     "isAdmin": true
   }
   ```
4. Click **Update**

---

## 🛠️ Step 8: Database Maintenance

### Export Data:

1. Click on a collection (e.g., `products`)
2. Click **"..."** menu → **Export Collection**
3. Choose format (JSON, CSV)
4. Save to your computer

### Import Data:

1. Click **"..."** menu → **Import Collection**
2. Select your JSON/CSV file
3. Choose import options
4. Click **Import**

### Create Indexes (For Better Performance):

1. Click on collection → **Indexes** tab
2. Click **Create Index**
3. Add fields you frequently query (e.g., `category`, `name`)
4. Click **Create**

---

## 🔐 Step 9: Security Best Practices

### For Local Development:

- ✅ Safe to use `mongodb://localhost:27017`
- ✅ No authentication required for local MongoDB

### For Production/Atlas:

- ⚠️ Always use authentication
- ⚠️ Use strong passwords
- ⚠️ Enable IP whitelist in Atlas
- ⚠️ Never commit connection strings to Git

---

## 📋 Common MongoDB Compass Operations

### Count Documents:

1. Click on collection
2. Look at the top bar - it shows total document count
3. Use filter to count filtered results

### View Collection Stats:

1. Click on collection
2. Click **"..."** menu → **View Collection Stats**
3. See size, indexes, and other statistics

### Duplicate a Document:

1. Open the document
2. Click **Clone Document**
3. Modify as needed
4. Click **Insert**

---

## ⚠️ Troubleshooting

### Error: "Cannot connect to MongoDB"

**Solutions:**
1. **Check if MongoDB is running:**
   - Windows: Open Services → Look for "MongoDB"
   - Mac/Linux: Run `mongod` in terminal
   - Or check: `brew services list` (Mac)

2. **Verify connection string:**
   - Make sure port is `27017` (default)
   - Check if database name is correct

3. **Check firewall settings:**
   - MongoDB might be blocked by firewall

### Error: "Authentication failed"

**Solutions:**
1. Verify username and password in connection string
2. Check if user has proper permissions
3. For Atlas: Verify IP whitelist includes your IP

### Can't See Collections:

**Solutions:**
1. Make sure you're connected to the correct database
2. Collections might be empty - try adding a document via API first
3. Refresh the connection

---

## 🎯 Quick Reference

| Operation | Steps |
|-----------|-------|
| **Connect** | Paste connection string → Click Connect |
| **View Products** | Click `products` collection |
| **Add Product** | Click INSERT DOCUMENT → Add JSON → Insert |
| **Edit Product** | Click document → Edit → Update |
| **Delete Product** | Click document → Delete → Confirm |
| **Filter Products** | Use Filter bar: `{ "category": "..." }` |
| **View Users** | Click `users` collection |
| **Export Data** | Collection menu → Export Collection |

---

## 📚 Connection String Examples

### Local MongoDB (Default):
```
mongodb://localhost:27017/rr_products
```

### Local MongoDB (Custom Port):
```
mongodb://localhost:27018/rr_products
```

### MongoDB Atlas:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rr_products?retryWrites=true&w=majority
```

### MongoDB with Authentication:
```
mongodb://username:password@localhost:27017/rr_products
```

---

**Happy Database Managing! 🗄️✨**


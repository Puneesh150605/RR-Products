# 📦 Complete Inventory Management Guide - RR Products

## ✅ How to Add Products to Inventory

### Step-by-Step Instructions:

1. **Login First** (Required)
   - Go to `/login` or click "Login" button
   - Enter your admin email and password
   - You'll be redirected to the Manage Stock page

2. **Add a Product**
   - Click the **"+ Add Product"** button (top right)
   - Fill in the form:
     - **Product Name** * (Required)
     - **Brand** (Optional, e.g., "RR Premium")
     - **Category** * (Required - Select from dropdown)
     - **Price (₹)** * (Required - Enter number)
     - **Stock Quantity** * (Required - Enter number)
     - **Description** (Optional)
     - **Specifications** (Optional)
     - **Image URL** (Optional - e.g., "/images/product.jpg")
   - Scroll down to see the **"✓ Add to Inventory"** button at the bottom
   - Click **"✓ Add to Inventory"** to save

3. **Verify Product Added**
   - The product will appear in the table below
   - You'll see a success message: "Product added to inventory successfully!"

---

## 🔄 How to Edit Stock/Units

### Method 1: Quick Add Units
1. Find your product in the table
2. Look for the **"Stock Management"** column
3. Click the green **"Add Units"** button
4. Enter the number of units to add
5. Click **"Add Units"** button
6. Stock will be updated automatically

### Method 2: Quick Remove Units
1. Find your product in the table
2. Click the orange **"Remove Units"** button
3. Enter the number of units to remove
4. Click **"Remove Units"** button
5. Stock will be updated (won't go below 0)

### Method 3: Edit Exact Stock
1. Find your product in the table
2. Click the blue **"Edit Stock"** button
3. Enter the new total stock quantity
4. Click **"Update Stock"** button
5. Stock will be set to the exact number you entered

---

## 🗑️ How to Remove/Delete Products

1. Find the product in the table
2. Look for the **"Product Actions"** column (rightmost column)
3. Click the red **"Delete"** button
4. Confirm deletion in the popup
5. Product will be removed from inventory

---

## ✏️ How to Edit Product Details

1. Find the product in the table
2. Click the blue **"Edit"** button in the **"Product Actions"** column
3. Modify any fields you want to change
4. Scroll down and click **"✓ Update Product"** button
5. Changes will be saved

---

## 📊 Understanding the Table

The inventory table has these columns:

1. **Product Name** - Name of the product
2. **Category** - Product category
3. **Brand** - Brand name
4. **Price (₹)** - Price in rupees
5. **Stock** - Current stock with status badge:
   - 🟢 **Green "In Stock"** = 30+ units
   - 🟡 **Yellow "Low Stock"** = Less than 30 units
   - 🔴 **Red "Out of Stock"** = 0 units
6. **Stock Management** - Three buttons:
   - **Add Units** (Green) - Add more stock
   - **Remove Units** (Orange) - Remove stock
   - **Edit Stock** (Blue) - Set exact stock
7. **Product Actions** - Two buttons:
   - **Edit** (Blue) - Edit product details
   - **Delete** (Red) - Remove product

---

## ⚠️ Troubleshooting

### "Please login" message appears
- **Solution:** Go to `/login` and login with your admin credentials
- Make sure you see "✓ Logged In" at the top

### Can't see "Add to Inventory" button
- **Solution:** Scroll down in the modal - the button is at the bottom
- The button is sticky and always visible at the bottom of the modal

### Form doesn't submit
- **Check:** Make sure all required fields are filled (Name, Category, Price, Stock)
- **Check:** Make sure you're logged in (see "✓ Logged In" status)
- **Check:** Check browser console (F12) for error messages

### Buttons not visible in table
- **Solution:** Scroll horizontally if table is wide
- **Solution:** Make browser window wider
- All buttons are in the rightmost columns

### Product not appearing after adding
- **Solution:** Wait a moment - the table refreshes automatically
- **Solution:** Refresh the page if needed
- **Check:** Check for error messages at the bottom of the screen

---

## 🎯 Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| **Add Product** | Top right | "+ Add Product" |
| **Save Product** | Bottom of modal | "✓ Add to Inventory" |
| **Add Stock** | Stock Management column | "Add Units" (Green) |
| **Remove Stock** | Stock Management column | "Remove Units" (Orange) |
| **Edit Stock** | Stock Management column | "Edit Stock" (Blue) |
| **Edit Product** | Product Actions column | "Edit" (Blue) |
| **Delete Product** | Product Actions column | "Delete" (Red) |

---

## 💡 Pro Tips

1. **Always login first** - All actions require authentication
2. **Check stock status** - Color-coded badges show stock levels at a glance
3. **Use quick stock buttons** - Faster than editing the whole product
4. **Image URLs** - Use `/images/product.jpg` format for local images
5. **Categories** - Must match exactly (case-sensitive)

---

**Your inventory system is now fully functional! 🚀**


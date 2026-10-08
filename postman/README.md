# SmartStock AI - Postman Collection & Testing Guide

This folder contains pre-configured Postman test files to test all endpoints of the **SmartStock AI (Ma7alkom)** backend.

---

## 📂 Included Files

1. **`SmartStock_AI_Backend.postman_collection.json`**
   - The complete API collection organized into folders:
     - **Health & Root**: `/api`
     - **Users**: `/api/users` (Create, List, Get by ID)
     - **Products**: `/api/products` (Create, List, Get by ID, Update, Delete)
     - **Stock Movements**: `/api/stock` (List, ENTRY, EXIT, ADJUSTMENT, DAMAGED)
2. **`SmartStock_AI_Local.postman_environment.json`**
   - Environment variables configured for `baseUrl` (`http://localhost:5000`).

---

## 🚀 How to Import into Postman

1. Open **Postman**.
2. Click the **Import** button (top left corner).
3. Drag & drop or select both files:
   - `SmartStock_AI_Backend.postman_collection.json`
   - `SmartStock_AI_Local.postman_environment.json`
4. In the top right corner of Postman, select the **"SmartStock AI - Local"** environment from the environment dropdown.

---

## 🧪 Recommended Testing Flow

Run the requests in this order for smooth testing:

### 1. Health Check
- Run **Health & Root > 1. API Status (Health Check)**
- Expected status: `200 OK` (`"SmartStock AI API is running"`)

### 2. Users
- Run **Users > 1. Create User**
  - *Note*: Postman automatically saves the newly created `userId` into your environment variables!
- Run **Users > 2. Get All Users**
- Run **Users > 3. Get User By ID** (uses the saved `{{userId}}`)

### 3. Products
- Run **Products > 1. Create Product**
  - *Note*: Postman automatically saves the newly created `productId` into your environment variables!
- Run **Products > 2. Get All Products**
- Run **Products > 3. Get Product By ID** (uses the saved `{{productId}}`)
- Run **Products > 4. Update Product** (updates price / description)

### 4. Stock Movements
- Run **Stock Movements > 2. Create Movement - ENTRY**
  - Increases the product stock quantity by 20.
- Run **Stock Movements > 3. Create Movement - EXIT**
  - Decreases the product stock quantity by 5.
- Run **Stock Movements > 4. Create Movement - ADJUSTMENT**
  - Sets the product stock quantity to 50.
- Run **Stock Movements > 5. Create Movement - DAMAGED**
  - Deducts 2 items due to damage.
- Run **Stock Movements > 1. Get All Stock Movements**
  - Lists all audit trail movements joined with product details and user info.

## Backend Documentation

### Overview
Vendor Supplier Connect is a web application backend built with **Express.js** and **MongoDB** (Mongoose), designed to connect vendors and suppliers for product ordering, group orders, and reviews. The backend features JWT authentication, role-based access, and a modular, scalable structure.

### Live API
**Backend API Live Link:** [https://bazaar-link-backend.vercel.app](https://bazaar-link-backend.vercel.app)

### Folder Structure
```
vendor-supplier-connect/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── README.md
```

### Backend Features
- User authentication (vendor/supplier) with JWT
- Role-based route protection
- Product management (add, update, list)
- Order management (individual/group, status updates)
- Review system for suppliers
- KYC fields for suppliers
- Global error handling
- Modular controllers and routes

### Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vendor-supplier-connect.git
   cd vendor-supplier-connect/backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   ```
4. **Run the server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000` by default.

### API Endpoints
#### Auth
- `POST /api/auth/register` — Register as vendor or supplier
- `POST /api/auth/login` — Login and receive JWT

#### Vendor
- `GET /api/vendor/profile` — Get vendor profile
- `GET /api/vendor/products` — Get nearby products
- `POST /api/vendor/order` — Place order
- `POST /api/vendor/group-order` — Join group order
- `GET /api/vendor/orders` — View order history
- `POST /api/vendor/review/:supplierId` — Leave a review

#### Supplier
- `GET /api/supplier/profile` — Get supplier profile
- `POST /api/supplier/product` — Add product
- `PATCH /api/supplier/product/:id` — Update product
- `GET /api/supplier/orders` — View incoming orders
- `PATCH /api/supplier/order/:id` — Fulfill order

#### Product
- `GET /api/products` — List all products
- `GET /api/products/:supplierId` — Get products by supplier
- `POST /api/products` — Add product (supplier only)

#### Order
- `GET /api/orders/vendor/:id` — Vendor orders
- `GET /api/orders/supplier/:id` — Supplier orders
- `PATCH /api/orders/:id/status` — Update order status

### Models
- **User:** name, phone, location, password, role (vendor/supplier), kyc (aadhaar, gstin)
- **Product:** name, unit, price, stock, supplier (ref User)
- **Order:** vendor, supplier, items (product + quantity), type (individual/group), status
- **Review:** vendor, supplier, rating, comment

### Middleware
- **auth.js:** JWT verification, role-based protection
- **errorHandler.js:** Global error handler

### Utilities
- **generateToken.js:** JWT token generation

### Environment Variables
- `PORT` — Server port
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — JWT secret key

### License
MIT

---
*For frontend documentation, see the section above (to be added).* 

# BazaarLink Frontend

#Live Link : https://bazaarlink.onrender.com/

A modern B2B marketplace platform built with React, featuring smart inventory management, group ordering, and real-time analytics.

## 🚀 Features

### For Vendors

- *Product Browsing*: Search and filter products from multiple suppliers
- *Smart Cart Management*: Add products from multiple suppliers with quantity controls
- *Group Orders*: Automatic detection and handling of multi-supplier orders
- *Order Tracking*: View pending and delivered orders with detailed history
- *Supplier Reviews*: Rate and review suppliers after order delivery
- *Analytics Dashboard*: Track spending, order history, and purchasing patterns

### For Suppliers

- *Product Management*: Add, edit, and manage product inventory with image uploads
- *Stock Control*: Set low-stock thresholds and receive restock alerts
- *Order Processing*: View and fulfill vendor orders with status tracking
- *Analytics & Insights*: View sales data, top products, and revenue trends
- *AI Predictions*: Get intelligent restock suggestions based on order patterns
- *Stock History*: Track detailed inventory movement history

## 🛠 Technology Stack

- *Frontend*: React 18+ with Hooks
- *Styling*: Inline styles with modern CSS features
- *State Management*: React Context API + useState/useEffect
- *API Communication*: Fetch API with custom hooks
- *Authentication*: JWT token-based auth with localStorage
- *File Handling*: FormData for image uploads
- *Routing*: Custom router implementation

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser
- Backend API running (see Backend README)

### Installation Steps

1. *Clone the repository*

bash
git clone <repository-url>
cd bazaarlink-frontend


1. *Install dependencies*

bash
npm install
# or
yarn install


1. *Environment Configuration*
   Update the API base URL in the code:

javascript
// In useAPI hook
const BASE_URL = 'https://your-backend-url.com/api';


1. *Start development server*

bash
npm start
# or
yarn start


The application will open at http://localhost:3000

## 🔧 Configuration

### API Endpoints

The frontend connects to these backend endpoints:

*Authentication*

- POST /api/auth/login - User login
- POST /api/auth/register - User registration

*Vendor Endpoints*

- GET /api/vendor/profile - Get vendor profile
- GET /api/vendor/products - Get all products
- GET /api/vendor/suppliers - Get all suppliers
- GET /api/vendor/orders - Get vendor orders
- POST /api/vendor/order - Place individual order
- POST /api/vendor/group-order - Place group order
- POST /api/vendor/review/:supplierId - Submit supplier review

*Supplier Endpoints*

- GET /api/supplier/profile - Get supplier profile
- GET /api/supplier/orders - Get supplier orders
- PATCH /api/supplier/order/:orderId - Fulfill order
- POST /api/supplier/product - Add new product
- PATCH /api/supplier/product/:productId - Update product
- GET /api/supplier/products/low-stock - Get low stock products
- POST /api/supplier/product/:productId/restock - Restock product
- GET /api/supplier/product/:productId/stock-history - Get stock history
- GET /api/supplier/predict-restock - AI restock predictions

*Public Endpoints*

- GET /api/products - Get all products
- GET /api/products/:supplierId - Get products by supplier

## 📱 User Guide

### Getting Started

1. *Registration*
- Visit the homepage and click “Register”
- Fill in your details including name, phone, location
- Choose your role: Vendor or Supplier
- Provide KYC details (Aadhaar, GSTIN)
- Submit to create your account
1. *Login*
- Use your registered phone number and password
- You’ll be automatically redirected to your role-specific dashboard

### Vendor Workflow

1. *Browse Products*
- Navigate to “Browse Products”
- Use search to find specific items
- Filter by supplier or product name
- View product details, prices, and stock levels
1. *Shopping Cart*
- Add products to cart with quantity controls
- View cart summary with items from different suppliers
- System automatically detects if it’s a group order (multiple suppliers)
1. *Place Orders*
- Review cart contents and total amount
- Click “Place Order” - system handles individual vs group orders
- Orders are automatically sent to respective suppliers
1. *Track Orders*
- View “My Orders” with sub-tabs for Pending/Delivered
- See order details, items, and status updates
- Leave reviews for suppliers after delivery
1. *Dashboard Analytics*
- View spending summary and order statistics
- See most/least ordered items
- Track your purchasing patterns

### Supplier Workflow

1. *Product Management*
- Add new products with images, pricing, and stock levels
- Set low-stock thresholds for automatic alerts
- Edit existing products (price, stock, thresholds)
- View product performance and stock status
1. *Inventory Control*
- Monitor low-stock alerts on dashboard
- Restock products when needed
- View detailed stock movement history
- Get AI-powered restock predictions
1. *Order Processing*
- View incoming orders in “Order Management”
- See order details with vendor information
- Mark orders as “Delivered” when fulfilled
- Track order history and status
1. *Analytics & Insights*
- View comprehensive analytics dashboard
- See top-selling products and revenue trends
- Monitor stock levels and movement
- Access AI restock recommendations
- View vendor reviews and ratings

## 🔐 Authentication & Security

- *JWT Tokens*: Secure authentication with tokens stored in localStorage
- *Role-based Access*: Vendors and suppliers have different interfaces and permissions
- *Session Management*: Automatic token validation and logout functionality
- *Image Upload*: Secure file handling for product images

## 🎨 UI/UX Features

- *Dark Theme*: Modern dark mode interface
- *Responsive Design*: Works on desktop, tablet, and mobile
- *Real-time Updates*: Dynamic data loading and updates
- *Interactive Elements*: Hover effects, animations, and transitions
- *Visual Feedback*: Loading states, success/error messages
- *Intuitive Navigation*: Role-based sidebar navigation

## 🔄 State Management

The application uses React Context for global state:

javascript
// Auth Context provides:
- user: Current user object
- login(userData): Login function
- logout(): Logout function  
- loading: Authentication loading state


## 📊 Data Flow

1. *Authentication*: JWT tokens manage user sessions
1. *API Calls*: Custom useAPI hook handles all backend communication
1. *State Updates*: Components update local state on API responses
1. *Real-time Sync*: Data refreshes on tab changes and user actions
1. *Error Handling*: Graceful error display and retry mechanisms

## 🐛 Troubleshooting

### Common Issues

*Login/Registration Issues*

- Verify backend is running and accessible
- Check network connection
- Ensure phone number format is correct

*Product/Order Loading Issues*

- Check JWT token validity (logout and login again)
- Verify user role permissions
- Check browser console for API errors

*Image Upload Issues*

- Ensure image file size is reasonable (<5MB)
- Check supported formats (jpg, png, gif)
- Verify backend storage configuration

## 🚀 Deployment

### Production Build

bash
npm run build
# or
yarn build


### Environment Variables

Create .env.production:


REACT_APP_API_BASE_URL=https://your-production-backend.com/api


### Deployment Platforms

- *Vercel*: Connect GitHub repo for automatic deployments
- *Netlify*: Drag and drop build folder or connect repo
- *AWS S3*: Upload build files to S3 bucket with CloudFront
- *Firebase Hosting*: Use Firebase CLI to deploy

## 🤝 Contributing

1. Fork the repository
1. Create feature branch: git checkout -b feature/new-feature
1. Make changes and test thoroughly
1. Commit changes: git commit -am 'Add new feature'
1. Push to branch: git push origin feature/new-feature
1. Submit pull request

## 📝 Code Structure


src/
├── components/
│   ├── AuthProvider.js      # Authentication context
│   ├── Router.js           # Application routing
│   ├── Header.js           # Navigation header
│   ├── LandingPage.js      # Homepage
│   ├── AuthPage.js         # Login/Register
│   ├── VendorDashboard.js  # Vendor interface
│   └── SupplierDashboard.js # Supplier interface
├── hooks/
│   ├── useAuth.js          # Authentication hook
│   └── useAPI.js           # API communication hook
├── utils/
│   └── constants.js        # App constants
└── App.js                  # Main application component


## 📞 Support

For technical support or questions:

- Check the backend README for API documentation
- Review browser console for error messages
- Ensure all dependencies are properly installed
- Verify backend connectivity and authentication

# Product Management System

A full-stack product management dashboard with React + TypeScript frontend and Node.js + Express + MongoDB backend.

## Features

- 📦 Product Management (CRUD operations)
- 📊 Real-time Inventory Tracking with Charts
- 📈 Sales & Revenue Analytics
- 🏷️ Barcode/QR Code Generation
- 🎨 Modern Dark Theme UI
- 📱 Responsive Design

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- shadcn/ui Components
- Tailwind CSS v4
- Recharts for Data Visualization
- Axios for API calls
- Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- TypeScript
- JWT Authentication
- CORS enabled

## Prerequisites

- Node.js v20+
- MongoDB installed and running locally
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Configure Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product-management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### 4. Seed Database (Optional)

Populate the database with sample data:
```bash
cd server
npm run seed
```

### 5. Start Development Servers

**Backend:**
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

**Frontend** (in a new terminal):
```bash
npm run dev
```
Frontend will run on http://localhost:5173

## Project Structure

```
product-management-system/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ProductTable.tsx
│   │   ├── InventoryChart.tsx
│   │   ├── SalesChart.tsx
│   │   ├── BarcodeGenerator.tsx
│   │   └── AddProductForm.tsx
│   ├── services/               # API services
│   ├── types/                  # TypeScript types
│   └── App.tsx                 # Main app component
├── server/                      # Backend source
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # Express routes
│   │   ├── index.ts           # Server entry point
│   │   └── seed.ts            # Database seeder
│   └── package.json
└── package.json

```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/stats/inventory` - Get inventory statistics

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## Features in Detail

### Dashboard
- Overview of product management system
- Quick add product functionality
- Real-time statistics

### Product Management
- View all products in a table format
- Edit and delete products
- Product images and details

### Inventory Tracking
- Pie chart showing product distribution by category
- Low stock alerts
- Category-wise quantity tracking

### Barcode Generation
- Generate QR codes for products
- Select products from dropdown
- Download barcodes

### Sales & Revenue Report
- Bar chart visualization
- Revenue and items sold metrics
- Best seller tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For support, email your-email@example.com or open an issue in the repository.
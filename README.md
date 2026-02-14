# Military Asset Management System

A production-ready full-stack application for managing military assets including purchases, transfers, assignments, and expenditures with role-based access control.

## Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **React Hot Toast** - Notifications

## Features

1. **Dashboard**
   - Opening Balance, Closing Balance
   - Net Movement (Purchases + Transfer In - Transfer Out)
   - Assigned and Expended Assets
   - Filters: Date, Base, Equipment Type
   - Net Movement modal with detailed breakdown

2. **Purchases**
   - Create purchase records
   - Filter by date & equipment type
   - Maintain purchase history

3. **Transfers**
   - Transfer assets between bases
   - Maintain full transfer history with timestamps

4. **Assignments & Expenditures**
   - Assign asset to personnel
   - Mark assets as expended
   - Maintain history

5. **Role-Based Access Control**
   - **Admin** → Full access to all bases
   - **Base Commander** → Only assigned base access
   - **Logistics Officer** → Purchases + transfers only

6. **API Logging**
   - Log every transaction (create/update/delete)
   - Store logs in audit_logs table

## Project Structure

```
Miltary_Requirements/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── purchase.controller.js
│   │   ├── transfer.controller.js
│   │   ├── assignment.controller.js
│   │   ├── expenditure.controller.js
│   │   ├── asset.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rbac.js              # Role-based access control
│   │   ├── auditLog.js          # Audit logging
│   │   └── errorHandler.js      # Error handling
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Base.js
│   │   ├── EquipmentType.js
│   │   ├── Asset.js
│   │   ├── Purchase.js
│   │   ├── Transfer.js
│   │   ├── Assignment.js
│   │   ├── Expenditure.js
│   │   ├── AuditLog.js
│   │   └── index.js             # Model associations
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── purchase.routes.js
│   │   ├── transfer.routes.js
│   │   ├── assignment.routes.js
│   │   ├── expenditure.routes.js
│   │   ├── asset.routes.js
│   │   └── user.routes.js
│   ├── scripts/
│   │   └── seed.js              # Seed data script
│   ├── server.js                # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── NetMovementModal.jsx
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Purchases.jsx
    │   │   ├── Transfers.jsx
    │   │   ├── Assignments.jsx
    │   │   └── Expenditures.jsx
    │   ├── config/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Database Schema

### Tables
1. **users** - User accounts with roles
2. **bases** - Military bases
3. **equipment_types** - Types of equipment
4. **assets** - Individual assets
5. **purchases** - Purchase records
6. **transfers** - Transfer records
7. **assignments** - Asset assignments to personnel
8. **expenditures** - Expended assets
9. **audit_logs** - API transaction logs

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE military_assets_db;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=military_assets_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Run database migrations and seed data**
   ```bash
   npm run seed
   ```
   
   This will:
   - Create all tables
   - Seed sample data (bases, equipment types, users, purchases, etc.)

6. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file (optional)**
   ```bash
   # Create .env file if you want to override API URL
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

## Test Credentials

After running the seed script, you can use these credentials:

- **Admin**
  - Email: `admin@military.gov`
  - Password: `admin123`

- **Base Commander (Fort Bragg)**
  - Email: `commander1@military.gov`
  - Password: `commander123`

- **Base Commander (Fort Benning)**
  - Email: `commander2@military.gov`
  - Password: `commander123`

- **Logistics Officer**
  - Email: `logistics1@military.gov`
  - Password: `logistics123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Dashboard
- `GET /api/dashboard` - Get dashboard data with filters

### Purchases
- `GET /api/purchases` - Get all purchases (with filters)
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create purchase (Admin, Logistics Officer)

### Transfers
- `GET /api/transfers` - Get all transfers (with filters)
- `GET /api/transfers/:id` - Get transfer by ID
- `POST /api/transfers` - Create transfer (Admin, Logistics Officer)

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment
- `PATCH /api/assignments/:id/return` - Return assigned asset

### Expenditures
- `GET /api/expenditures` - Get all expenditures
- `GET /api/expenditures/:id` - Get expenditure by ID
- `POST /api/expenditures` - Mark asset as expended

### Assets
- `GET /api/assets` - Get all assets (with filters)
- `GET /api/assets/:id` - Get asset by ID

### Users & References
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/bases` - Get all bases
- `GET /api/users/equipment-types` - Get all equipment types

## Role-Based Access Control

### Admin
- Full access to all bases
- Can create purchases and transfers
- Can view all data across all bases

### Base Commander
- Access limited to assigned base only
- Can create assignments and mark expenditures
- Can view data only for their base

### Logistics Officer
- Can create purchases and transfers
- Can view data across all bases
- Cannot create assignments or mark expenditures

## Key Features Explained

### 1. Net Movement Calculation
The dashboard calculates net movement as:
```
Net Movement = Purchases + Transfer In - Transfer Out
```

Clicking on the Net Movement card opens a modal showing:
- Breakdown of purchases, transfers in, and transfers out
- Recent purchase history
- Recent transfer history

### 2. Asset Status Flow
- **available** → Asset is available for assignment or transfer
- **assigned** → Asset is assigned to personnel
- **transferred** → Asset has been transferred to another base
- **expended** → Asset has been marked as expended

### 3. Audit Logging
Every API request (except health checks and login) is logged to the `audit_logs` table with:
- User ID
- Action type (create, read, update, delete)
- Entity type and ID
- Request method and endpoint
- Request body (sanitized)
- Response status
- IP address and user agent

### 4. Purchase Creation
When a purchase is created:
- Purchase record is created
- Assets are automatically created based on quantity
- Each asset gets a unique serial number: `{EQUIPMENT_CODE}-{BASE_CODE}-{TIMESTAMP}-{INDEX}`

### 5. Transfer Process
When transferring an asset:
- Transfer record is created
- Asset's base is updated
- Asset status is set to "transferred"
- Both source and destination bases are tracked

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Remove `{ alter: true }` from `sequelize.sync()` in `server.js`
3. Use proper database migrations in production
4. Set strong `JWT_SECRET`
5. Configure proper CORS origins
6. Use environment-specific database credentials

### Frontend
1. Build for production:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using a web server (nginx, Apache, etc.)
3. Configure API URL in environment variables

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE military_assets_db;`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Modify `vite.config.js` server port

### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check that backend is running before starting frontend

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration settings
- Ensure user is active in database

## Development Notes

### Database Sync
In development, the server uses `sequelize.sync({ alter: true })` which automatically updates the schema. In production, use proper migrations.

### Password Hashing
Passwords are automatically hashed using bcryptjs before saving to the database. The hashing happens in model hooks.

### Error Handling
All errors are caught by the error handler middleware which returns consistent error responses. Sequelize errors are properly formatted.

## License

ISC

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.

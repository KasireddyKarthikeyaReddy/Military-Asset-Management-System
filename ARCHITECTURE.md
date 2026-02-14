# Architecture & Implementation Notes

## Key Design Decisions

### 1. Database Schema Design

**Asset Lifecycle Tracking:**
- Assets are created automatically when purchases are made
- Each asset has a status field: `available`, `assigned`, `transferred`, `expended`
- Status transitions are enforced at the application level

**Transfer Tracking:**
- Transfers track both `fromBaseId` and `toBaseId`
- Transfer type (`transfer_in`/`transfer_out`) is relative to the base context
- Asset's `baseId` is updated when transfer is created

**Assignment Management:**
- Assignments have an `isActive` flag instead of deletion
- This maintains historical records
- When asset is returned, assignment is marked inactive and return date is set

### 2. Role-Based Access Control (RBAC)

**Three-Tier System:**

1. **Admin**
   - Full access to all bases
   - Can perform all operations
   - No base filtering applied

2. **Base Commander**
   - Limited to assigned base (`baseId` from user record)
   - Can create assignments and mark expenditures
   - Cannot create purchases or transfers
   - All queries automatically filtered by `baseId`

3. **Logistics Officer**
   - Can create purchases and transfers
   - Can view all bases
   - Cannot create assignments or mark expenditures

**Implementation:**
- `filterByBase` middleware automatically adds base filter to queries
- `requireRole` middleware checks role before allowing operations
- `requireBaseAccess` middleware validates base access for specific operations

### 3. Net Movement Calculation

**Formula:**
```
Net Movement = Purchases + Transfer In - Transfer Out
```

**Implementation Details:**
- Purchases: Count of assets created in date range
- Transfer In: Count of transfers where `toBaseId` matches filter and `transferType = 'transfer_in'`
- Transfer Out: Count of transfers where `fromBaseId` matches filter and `transferType = 'transfer_out'`

**Tricky Part:**
- For base commanders, transfers are filtered by their base
- For admins/logistics officers, all transfers are considered
- Date filters apply to all three components

### 4. Audit Logging

**Implementation:**
- Middleware intercepts all API requests (except health checks and login)
- Logs are created asynchronously after response is sent
- Request body is sanitized (passwords removed)
- Stores: user ID, action, entity type/ID, method, endpoint, status, IP, user agent

**Why Async:**
- Doesn't block the response
- Uses `setImmediate` to log after response is sent
- Failures in logging don't affect the API response

### 5. Purchase Creation Flow

**When a purchase is created:**

1. Purchase record is created with quantity and unit cost
2. Total cost is calculated automatically (hook in model)
3. Assets are created in a loop based on quantity
4. Each asset gets:
   - Unique serial number: `{EQUIPMENT_CODE}-{BASE_CODE}-{TIMESTAMP}-{INDEX}`
   - Status: `available`
   - Reference to purchase record
   - Purchase date and cost

**Why This Design:**
- Maintains traceability (each asset knows its purchase)
- Allows bulk purchases while tracking individual assets
- Serial numbers are auto-generated for uniqueness

### 6. Asset Status Transitions

**Valid Transitions:**
- `available` → `assigned` (when assignment created)
- `available` → `transferred` (when transfer created)
- `assigned` → `available` (when assignment returned)
- `assigned` → `expended` (when marked as expended)
- `available` → `expended` (when marked as expended)

**Enforcement:**
- Controllers validate status before operations
- Assignment return automatically sets asset back to `available`
- Expenditure automatically marks assignment as inactive

### 7. Frontend State Management

**AuthContext:**
- Stores user data and authentication state
- Persists to localStorage
- Provides login/logout functions
- Used by PrivateRoute for protection

**API Client:**
- Axios instance with interceptors
- Automatically adds JWT token to requests
- Handles 401 errors by redirecting to login
- Base URL configured via environment variable

### 8. Dashboard Filters

**Filter Application:**
- Filters are applied via query parameters
- Backend filters data based on:
  - Date range (startDate, endDate)
  - Base (baseId)
  - Equipment Type (equipmentTypeId)
- Role-based filtering is automatic (base commanders)

**Opening/Closing Balance:**
- Opening: Assets created before start date (or all if no date filter)
- Closing: Assets created up to end date (or all if no date filter)
- Both respect base and equipment type filters

### 9. Error Handling

**Three-Layer Approach:**

1. **Controller Level:**
   - Try-catch blocks
   - Validation errors returned with 400 status
   - Business logic errors with appropriate messages

2. **Middleware Level:**
   - Authentication errors: 401
   - Authorization errors: 403
   - Validation errors: 400

3. **Error Handler Middleware:**
   - Catches all unhandled errors
   - Formats Sequelize errors
   - Returns consistent error structure
   - Logs errors for debugging

### 10. Password Security

**Implementation:**
- Passwords hashed using bcryptjs (10 rounds)
- Hashing happens in model hooks (`beforeCreate`, `beforeUpdate`)
- Never stored in plain text
- Comparison method on User model for login

### 11. CORS Configuration

**Setup:**
- Backend allows specific origin (from .env)
- Credentials enabled for cookie support
- Configured in server.js middleware

**Why Important:**
- Frontend and backend run on different ports
- CORS prevents unauthorized cross-origin requests
- Must match frontend URL exactly

### 12. Database Relationships

**Key Relationships:**

- User → Base (many-to-one)
- Asset → Base (many-to-one)
- Asset → EquipmentType (many-to-one)
- Asset → Purchase (many-to-one)
- Purchase → Base (many-to-one)
- Purchase → EquipmentType (many-to-one)
- Transfer → Asset (many-to-one)
- Transfer → Base (from/to, many-to-one each)
- Assignment → Asset (many-to-one)
- Expenditure → Asset (many-to-one)

**Why Important:**
- Enables efficient queries with joins
- Maintains referential integrity
- Allows cascading operations

## Production Considerations

### 1. Database Migrations
- Current: Uses `sequelize.sync({ alter: true })` in development
- Production: Should use proper migrations (Sequelize CLI migrations)
- Never use `force: true` in production (drops all tables)

### 2. Environment Variables
- Never commit `.env` files
- Use strong `JWT_SECRET` (32+ random characters)
- Set `NODE_ENV=production`
- Use production database credentials

### 3. Security
- Rate limiting should be added for production
- Input validation should be enhanced (express-validator)
- SQL injection protection via Sequelize (already handled)
- XSS protection via React (already handled)

### 4. Performance
- Add database indexes for frequently queried fields
- Implement pagination (already done for most endpoints)
- Consider caching for dashboard data
- Use connection pooling (already configured)

### 5. Monitoring
- Add logging library (Winston, Pino)
- Set up error tracking (Sentry)
- Monitor API response times
- Track audit log table size

## Common Issues & Solutions

### Issue: "Cannot find module"
- **Solution:** Run `npm install` in both backend and frontend directories

### Issue: "Database connection refused"
- **Solution:** Check PostgreSQL is running, verify credentials in .env

### Issue: "CORS error"
- **Solution:** Ensure CORS_ORIGIN in backend .env matches frontend URL

### Issue: "Token expired"
- **Solution:** Login again, or increase JWT_EXPIRE in .env

### Issue: "Base Commander sees all bases"
- **Solution:** Check user's baseId is set correctly in database

### Issue: "Assets not created on purchase"
- **Solution:** Check purchase quantity > 0, verify equipment type and base exist

## Testing Recommendations

1. **Unit Tests:**
   - Test model hooks (password hashing, total cost calculation)
   - Test middleware (auth, RBAC)
   - Test utility functions

2. **Integration Tests:**
   - Test API endpoints with different roles
   - Test purchase → asset creation flow
   - Test transfer → asset update flow
   - Test assignment → asset status update

3. **E2E Tests:**
   - Test complete user workflows
   - Test role-based access restrictions
   - Test dashboard filters

## Future Enhancements

1. **Reporting:**
   - Export dashboard data to PDF/Excel
   - Scheduled reports via email
   - Custom date range reports

2. **Notifications:**
   - Email notifications for transfers
   - Alerts for low inventory
   - Assignment expiration reminders

3. **Advanced Features:**
   - Asset maintenance tracking
   - Warranty management
   - Multi-currency support
   - Barcode/QR code generation

4. **Performance:**
   - Redis caching layer
   - Database query optimization
   - CDN for static assets

5. **Security:**
   - Two-factor authentication
   - IP whitelisting
   - Session management
   - Password complexity requirements

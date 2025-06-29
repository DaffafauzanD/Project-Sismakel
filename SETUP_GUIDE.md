# Quick Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- SQL Server database
- npm or pnpm

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="sqlserver://localhost:1433;database=your_database;user=your_user;password=your_password;trustServerCertificate=true"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NODE_ENV="development"
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database with demo data**
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run start:dev
   ```

## Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL="http://localhost:3000"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Testing the Authentication

1. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

2. **Test login with demo users**
   - Username: `admin`, Password: `password123`
   - Username: `user`, Password: `password123`
   - Username: `moderator`, Password: `password123`

3. **Test protected routes**
   - Visit `/protected` to see role and permission-based content
   - Try accessing with different user roles

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `GET /auth/verify` - Verify JWT token

### Example API Usage

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'

# Get profile (requires authentication)
curl -X GET http://localhost:3000/auth/profile \
  -H "Cookie: access_token=your_jwt_token_here"
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify SQL Server is running
   - Check connection string in `.env`
   - Ensure database exists

2. **JWT Secret Error**
   - Set a strong JWT_SECRET in `.env`
   - Restart the backend server

3. **CORS Error**
   - Check if frontend URL is allowed in backend CORS config
   - Verify API base URL in frontend `.env`

4. **Port Already in Use**
   - Change port in backend `main.ts` or frontend `vite.config.js`
   - Kill existing processes using the port

### Debug Commands

```bash
# Check backend logs
npm run start:dev

# Check database connection
npx prisma studio

# Reset database
npx prisma migrate reset

# Check frontend build
npm run build
```

## Production Deployment

1. **Backend**
   ```bash
   npm run build
   npm run start:prod
   ```

2. **Frontend**
   ```bash
   npm run build
   # Deploy dist folder to your web server
   ```

3. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Configure production database URL
   - Set up HTTPS

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set secure cookie options
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up proper CORS
- [ ] Use environment variables
- [ ] Regular security updates

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the authentication documentation
3. Check browser developer tools for errors
4. Verify database connectivity
5. Test API endpoints directly 
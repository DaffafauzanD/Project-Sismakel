# Authentication System Documentation

## Overview
Sistem authentication menggunakan JWT (JSON Web Token) dengan cookie httpOnly untuk keamanan yang lebih baik.

## Features
- JWT Bearer Token Authentication
- HTTP-Only Cookie Storage
- Role-based Authorization
- Swagger Documentation Integration
- Password Hashing dengan bcrypt

## Setup

### 1. Environment Variables
Buat file `.env` di root backend dengan konfigurasi berikut:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Database Configuration
DATABASE_URL="sqlserver://localhost:1433;database=sismakel;user=sa;password=your-password;trustServerCertificate=true"

# Application Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:3001
```

### 2. Database Setup
Pastikan database sudah ter-setup dengan tabel yang diperlukan:
- `MST_USER` - untuk menyimpan user
- `MST_ROLE` - untuk menyimpan role
- `MST_PERMISSION` - untuk menyimpan permission
- `MST_ROLE_PERMISSION` - untuk relasi role dan permission

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/login
Login user dengan username dan password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "admin",
    "role": "admin"
  }
}
```

**Cookie:** JWT token akan disimpan dalam cookie `access_token` dengan httpOnly.

#### POST /api/v1/auth/logout
Logout user dan menghapus JWT token dari cookie.

**Headers:** `Authorization: Bearer <token>` atau cookie `access_token`

**Response:**
```json
{
  "message": "Logout berhasil"
}
```

#### GET /api/v1/auth/profile
Mendapatkan informasi profile user yang sedang login.

**Headers:** `Authorization: Bearer <token>` atau cookie `access_token`

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "admin",
    "role": "admin"
  }
}
```

#### GET /api/v1/auth/verify
Memverifikasi apakah JWT token masih valid.

**Headers:** `Authorization: Bearer <token>` atau cookie `access_token`

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "admin",
    "role": "admin"
  }
}
```

## Authorization

### Role-based Authorization
Sistem menggunakan role-based authorization dengan enum `UserRole`:

```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

### Using Guards

#### JWT Authentication Guard
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute() {
  return 'This route requires authentication';
}
```

#### Role-based Authorization
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
async adminOnlyRoute() {
  return 'This route requires admin role';
}
```

### Getting Current User
```typescript
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return this.userService.findById(user.id);
}
```

## Swagger Documentation

### Accessing Swagger UI
- URL: `http://localhost:3000/docs`
- Authentication: Klik tombol "Authorize" dan masukkan JWT token

### Bearer Token Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Features

### 1. HTTP-Only Cookies
JWT token disimpan dalam cookie httpOnly untuk mencegah XSS attacks.

### 2. Secure Cookie Settings
```typescript
response.cookie('access_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

### 3. Password Hashing
Password di-hash menggunakan bcrypt dengan salt rounds.

### 4. Token Expiration
JWT token memiliki expiration time (default: 24 hours).

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden"
}
```

## Testing

### Manual Testing dengan cURL

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}' \
  -c cookies.txt
```

#### Access Protected Route
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -b cookies.txt
```

## Best Practices

1. **Always use HTTPS in production**
2. **Change JWT_SECRET in production**
3. **Implement rate limiting for login endpoints**
4. **Use strong password policies**
5. **Implement refresh token mechanism for better security**
6. **Log authentication events for audit trails**
7. **Implement account lockout after failed attempts**

## Troubleshooting

### Common Issues

1. **Token not found**: Pastikan cookie `access_token` ada atau header `Authorization` ter-set
2. **Invalid token**: Token mungkin expired atau format salah
3. **CORS issues**: Pastikan `CORS_ORIGIN` ter-set dengan benar
4. **Database connection**: Pastikan `DATABASE_URL` valid dan database running 
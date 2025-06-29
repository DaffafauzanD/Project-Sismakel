# CORS Troubleshooting Guide

## 🚨 Masalah: CORS Error

### Error yang Muncul
```
Permintaan Cross-Origin Ditolak: Kebijakan Same Origin melarang pembacaan sumber daya jarak jauh di http://localhost:3000/api/v1/auth/login. (Alasan: header CORS 'Access-Control-Allow-Origin' tidak cocok dengan 'http://localhost:3001').

Permintaan Cross-Origin Ditolak: Kebijakan Same Origin melarang pembacaan sumber daya jarak jauh di http://localhost:3000/api/v1/auth/login. (Alasan: Permintaan CORS tidak berhasil). Kode status: (null).
```

### Penyebab
Frontend dan backend berjalan di port yang berbeda, dan backend belum dikonfigurasi untuk mengizinkan request dari origin frontend.

## ✅ Solusi

### 1. Backend CORS Configuration

#### Update Environment Configuration

```typescript
// backend/src/config/environment.config.ts
export const environment = {
  // ... other config
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : [
          'http://localhost:5173', // Vue.js dev server
          'http://localhost:3001', // Alternative port
          'http://localhost:3000', // Backend port (for testing)
          'http://127.0.0.1:5173', // Alternative localhost
          'http://127.0.0.1:3001', // Alternative localhost
        ],
  },
} as const;
```

#### Update Main.ts

```typescript
// backend/src/main.ts
app.enableCors({
  origin: environment.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Set-Cookie'],
});
```

### 2. Backend Environment Variables

#### Create .env file

```bash
# backend/.env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/sismakel?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173,http://localhost:3001,http://127.0.0.1:5173
```

### 3. Frontend Environment Variables

#### Update .env file

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=Sismakel
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true
```

## 🔧 Langkah-langkah Perbaikan

### 1. Restart Backend Server

```bash
cd backend
npm run start:dev
```

### 2. Restart Frontend Server

```bash
cd frontend
npm run dev
```

### 3. Verify CORS Configuration

Check backend console output:
```
🚀 App running at: http://localhost:3000
📚 Docs: http://localhost:3000/docs
🌐 CORS Origins: [ 'http://localhost:5173', 'http://localhost:3001', ... ]
```

### 4. Test API Endpoint

```bash
# Test with curl
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🔍 Debugging CORS Issues

### 1. Check Browser Network Tab

1. Open browser developer tools
2. Go to Network tab
3. Try to login
4. Check the failed request
5. Look for CORS error details

### 2. Check Backend Logs

```bash
# Check if backend is running
curl http://localhost:3000/api/v1/health

# Check CORS preflight
curl -X OPTIONS http://localhost:3000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

### 3. Common Issues

#### Issue: Backend not running
```bash
# Check if backend is running
netstat -an | grep :3000
# or
lsof -i :3000
```

#### Issue: Wrong API URL
```javascript
// ❌ Wrong
VITE_API_BASE_URL=http://localhost:3000

// ✅ Correct
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

#### Issue: Wrong CORS origin
```javascript
// ❌ Wrong - single origin
CORS_ORIGIN=http://localhost:5173

// ✅ Correct - multiple origins
CORS_ORIGIN=http://localhost:5173,http://localhost:3001,http://127.0.0.1:5173
```

## 🛠️ Alternative Solutions

### 1. Use Proxy in Vite (Development Only)

```javascript
// frontend/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

Then update environment:
```bash
# frontend/.env
VITE_API_BASE_URL=/api/v1
```

### 2. Use CORS Browser Extension (Development Only)

Install CORS browser extension to bypass CORS in development.

### 3. Use Different Ports

```bash
# Backend on port 3000
# Frontend on port 5173 (default)
# Make sure CORS allows both origins
```

## 📝 Best Practices

### 1. Environment-Specific CORS

```typescript
// Development
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
];

// Production
const corsOrigins = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
];

// Staging
const corsOrigins = [
  'https://staging.yourdomain.com',
];
```

### 2. Security Headers

```typescript
app.enableCors({
  origin: environment.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
});
```

### 3. Error Handling

```typescript
// Add CORS error handling
app.use((err, req, res, next) => {
  if (err.message === 'CORS') {
    res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed',
    });
  }
  next(err);
});
```

## 🚀 Quick Fix Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] CORS origin includes frontend URL
- [ ] API base URL includes `/api/v1` prefix
- [ ] Credentials enabled in CORS
- [ ] Allowed headers include `Authorization`
- [ ] Exposed headers include `Set-Cookie`
- [ ] Both servers restarted after changes

## 🔧 Testing

### 1. Test Login Endpoint

```javascript
// In browser console
fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 2. Test CORS Preflight

```bash
curl -X OPTIONS http://localhost:3000/api/v1/auth/login \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## 📚 Related Documentation

- [Authentication Guide](./README_AUTHENTICATION.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

## 🆘 Support

Jika masih mengalami masalah:

1. **Check both servers are running**
2. **Verify environment variables**
3. **Clear browser cache**
4. **Check browser console for errors**
5. **Test with curl or Postman**
6. **Verify CORS configuration in backend logs**

---

**Status**: ✅ Fixed dengan proper CORS configuration
**Backend Port**: 3000
**Frontend Port**: 5173
**API Prefix**: /api/v1 
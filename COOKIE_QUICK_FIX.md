# Cookie Quick Fix Guide

## 🚨 Masalah: cookie-es tidak tersedia

### Error
```
Uncaught SyntaxError: The requested module 'http://localhost:5173/node_modules/.vite/deps/cookie-es.js?v=2fd28c6c' doesn't provide an export named: 'setCookie'
```

## ✅ Solusi: Native Browser Cookie API

Project ini sekarang menggunakan **native browser cookie API** yang tidak memerlukan package tambahan.

### 1. Import Utility Functions

```javascript
import { 
  getAccessToken, 
  setAccessToken, 
  removeAccessToken,
  clearAuthCookies 
} from '@/utils/cookies'
```

### 2. Penggunaan

```javascript
// Get token
const token = getAccessToken()

// Set token
setAccessToken('your-jwt-token')

// Remove token
removeAccessToken()

// Clear all auth cookies
clearAuthCookies()

// Check if authenticated
if (isAuthenticated()) {
  console.log('User is logged in')
}
```

### 3. Test di Browser Console

```javascript
// Test cookie functions
import { getAccessToken, setAccessToken, getAllCookies } from '@/utils/cookies'

// Set test token
setAccessToken('test-token-123')

// Get token
console.log('Token:', getAccessToken())

// Get all cookies
console.log('All cookies:', getAllCookies())
```

## 🔧 Keuntungan Native API

1. **No Dependencies** - Tidak memerlukan package tambahan
2. **No Conflicts** - Tidak ada konflik dependency
3. **Smaller Bundle** - Ukuran bundle lebih kecil
4. **Better Performance** - Performa lebih baik
5. **Full Control** - Kontrol penuh atas cookie behavior

## 📝 Contoh Penggunaan Lengkap

### Di Auth Store

```javascript
// src/stores/auth.js
import { 
  getAccessToken, 
  setAccessToken, 
  clearAuthCookies 
} from '@/utils/cookies'

export const useAuthStore = defineStore('auth', () => {
  const initAuth = () => {
    const token = getAccessToken()
    if (token) {
      // Initialize auth state
    }
  }

  const login = async (credentials) => {
    // Login logic
    if (response.access_token) {
      setAccessToken(response.access_token)
    }
  }

  const logout = async () => {
    // Logout logic
    clearAuthCookies()
  }
})
```

### Di API Utility

```javascript
// src/utils/api.js
import { getAccessToken } from '@/utils/cookies'

export const $api = ofetch.create({
  baseURL: useConfig().apiBaseUrl.value || '/api',
  async onRequest({ options }) {
    const accessToken = getAccessToken()
    if (accessToken) {
      options.headers.append('Authorization', `Bearer ${accessToken}`)
    }
  },
})
```

### Di Component

```vue
<script setup>
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/cookies'

const testCookie = () => {
  // Set token
  setAccessToken('test-token')
  console.log('Token set:', getAccessToken())
  
  // Remove token
  removeAccessToken()
  console.log('Token removed:', getAccessToken())
}
</script>

<template>
  <VBtn @click="testCookie">Test Cookie</VBtn>
</template>
```

## 🚀 Quick Start

1. **Restart development server**
   ```bash
   npm run dev
   ```

2. **Test cookie functions**
   ```javascript
   // Di browser console
   import { getAccessToken, setAccessToken } from '@/utils/cookies'
   setAccessToken('test-token')
   console.log('Token:', getAccessToken())
   ```

3. **Verify authentication**
   ```javascript
   // Di browser console
   import { isAuthenticated } from '@/utils/cookies'
   console.log('Is authenticated:', isAuthenticated())
   ```

## 🔍 Debugging

### Check Cookie Status

```javascript
// Di browser console
console.log('Document cookies:', document.cookie)
console.log('Access token:', getAccessToken())
console.log('All cookies object:', getAllCookies())
```

### Common Issues

1. **Cookie not setting**
   - Check browser console for errors
   - Verify cookie options are correct
   - Test in incognito mode

2. **Cookie not persisting**
   - Check if path is set correctly
   - Verify maxAge is not too short
   - Test in different browsers

3. **Cookie not accessible**
   - Check if cookie name is correct
   - Verify cookie parsing logic
   - Test with different cookie values

## 📚 Related Documentation

- [TROUBLESHOOTING_COOKIES.md](./TROUBLESHOOTING_COOKIES.md) - Panduan troubleshooting lengkap
- [README_AUTHENTICATION.md](./README_AUTHENTICATION.md) - Dokumentasi authentication
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Ringkasan implementasi

## 🆘 Support

Jika masih mengalami masalah:

1. **Clear browser cache** dan restart development server
2. **Check browser console** untuk error messages
3. **Test in incognito mode** untuk menghindari cache issues
4. **Verify environment variables** sudah benar
5. **Check network tab** untuk API requests

---

**Status**: ✅ Fixed dengan Native Browser Cookie API
**Dependencies**: Tidak ada package tambahan yang diperlukan
**Compatibility**: Semua browser modern 

# Cookie Issue Quick Fix

## 🚨 Masalah yang Ditemukan

Ketika melakukan login dari frontend, cookie tidak ter-set di browser, tetapi ketika melakukan test langsung ke endpoint `/api/v1/auth/login`, cookie langsung ter-set.

## 🔍 Analisis Masalah

### Root Cause
Masalah utama adalah pada konfigurasi `$api` di frontend yang menggunakan `ofetch`. Secara default, `ofetch` tidak mengirimkan `credentials: 'include'`, yang diperlukan agar browser menyimpan cookie yang dikirim dari server.

### Perbedaan Behavior
- **Test langsung ke endpoint**: Menggunakan `fetch` dengan `credentials: 'include'` ✅
- **Login dari frontend**: Menggunakan `ofetch` tanpa `credentials: 'include'` ❌

## ✅ Solusi yang Diterapkan

### 1. Frontend Fix - `frontend/src/utils/api.js`

```javascript
export const $api = ofetch.create({
  baseURL: useConfig().apiBaseUrl.value || '/v1',
  credentials: 'include', // ✅ Added this line
  async onRequest({ options }) {
    const accessToken = getAccessToken()
    if (accessToken) {
      options.headers.append('Authorization', `Bearer ${accessToken}`)
    }
  },
  // ... rest of config
})
```

### 2. Backend Fix - `backend/src/modules/auth/presentation/auth.controller.ts`

```typescript
// Set JWT token in cookie
const cookieOptions = {
  httpOnly: process.env.NODE_ENV === 'production', // false in development
  secure: process.env.NODE_ENV === 'production', // false in development
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax', // ✅ Fixed TypeScript
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/', // Ensure cookie is available for all paths
};
```

## 🧪 Testing

### Test Script
Gunakan script `frontend/test-cookie-fix.js` untuk memverifikasi fix:

```javascript
// Jalankan di browser console
// 1. Check cookies
testCookies()

// 2. Test API call
testApiCall()

// 3. Test login (uncomment jika perlu)
// testLogin()
```

### Manual Testing
1. Login melalui frontend
2. Buka browser DevTools → Application → Cookies
3. Verifikasi cookie `access_token` dan `access_token_debug` ter-set
4. Test akses ke protected route

## 🔧 Konfigurasi yang Diperlukan

### Frontend Environment
```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend Environment
```bash
# backend/.env
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3001,http://127.0.0.1:5173
```

## 📋 Checklist Verifikasi

- [ ] Frontend menggunakan `credentials: 'include'` dalam `$api`
- [ ] Backend CORS dikonfigurasi dengan `credentials: true`
- [ ] Cookie options di backend sesuai untuk development
- [ ] Environment variables dikonfigurasi dengan benar
- [ ] Test login berhasil dan cookie ter-set
- [ ] Test akses protected route berhasil

## 🚀 Deployment Notes

### Development
- `httpOnly: false` - Cookie dapat diakses via JavaScript
- `secure: false` - Cookie dikirim via HTTP
- `sameSite: 'lax'` - Cookie dikirim untuk cross-site requests

### Production
- `httpOnly: true` - Cookie hanya dapat diakses via HTTP
- `secure: true` - Cookie hanya dikirim via HTTPS
- `sameSite: 'strict'` - Cookie hanya dikirim untuk same-site requests

## 🔍 Troubleshooting

### Jika cookie masih tidak ter-set:

1. **Check CORS Configuration**
   ```javascript
   // Backend main.ts
   app.enableCors({
     origin: environment.cors.origin,
     credentials: true, // ✅ Must be true
     // ...
   });
   ```

2. **Check Network Tab**
   - Pastikan request login mengirim `Cookie` header
   - Pastikan response login mengirim `Set-Cookie` header

3. **Check Browser Console**
   - Pastikan tidak ada CORS errors
   - Pastikan tidak ada cookie-related warnings

4. **Check Environment Variables**
   - Pastikan `VITE_API_BASE_URL` benar
   - Pastikan `CORS_ORIGIN` mencakup frontend URL

## 📚 Referensi

- [MDN - Credentials](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials)
- [MDN - SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#samesite_attribute)
- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [Express Cookie Parser](https://expressjs.com/en/resources/middleware/cookie-parser.html) 
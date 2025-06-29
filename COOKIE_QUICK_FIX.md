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
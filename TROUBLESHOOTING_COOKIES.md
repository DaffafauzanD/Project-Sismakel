# Cookie Troubleshooting Guide

## 🔧 Masalah: useCookie tidak tersedia

### Error yang Muncul
```
Uncaught SyntaxError: The requested module 'http://localhost:5173/node_modules/.vite/deps/@vueuse_core.js?v=2fd28c6c' doesn't provide an export named: 'useCookie'
```

### Penyebab
`useCookie` tidak tersedia di `@vueuse/core`. Project ini menggunakan package `cookie-es` untuk manajemen cookie.

### Solusi

#### 1. Gunakan Cookie Utility Functions

```javascript
// ❌ SALAH - useCookie tidak tersedia
import { useCookie } from '@vueuse/core'

// ✅ BENAR - Gunakan cookie-es
import { getCookie, setCookie, deleteCookie } from 'cookie-es'

// ✅ LEBIH BAIK - Gunakan utility functions
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/cookies'
```

#### 2. Contoh Penggunaan yang Benar

```javascript
// Di dalam composable atau component
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/cookies'

// Get token
const token = getAccessToken()

// Set token
setAccessToken('your-jwt-token')

// Remove token
removeAccessToken()
```

## 🔧 Masalah: cookie-es tidak tersedia

### Error yang Muncul
```
Uncaught SyntaxError: The requested module 'http://localhost:5173/node_modules/.vite/deps/cookie-es.js?v=2fd28c6c' doesn't provide an export named: 'setCookie'
```

### Penyebab
Package `cookie-es` tidak terinstall dengan benar atau ada konflik dependency.

### Solusi

#### 1. Gunakan Native Browser Cookie API

Project ini sekarang menggunakan native browser cookie API yang tidak memerlukan package tambahan:

```javascript
// ✅ BENAR - Gunakan utility functions dengan native API
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/cookies'

// Get token
const token = getAccessToken()

// Set token
setAccessToken('your-jwt-token')

// Remove token
removeAccessToken()
```

#### 2. Install cookie-es (Alternatif)

Jika ingin menggunakan cookie-es, install dengan force:

```bash
npm install cookie-es --force
```

Atau gunakan yarn:

```bash
yarn add cookie-es
```

#### 3. Gunakan js-cookie (Alternatif)

```bash
npm install js-cookie
```

```javascript
import Cookies from 'js-cookie'

// Set cookie
Cookies.set('access_token', 'your-token', { 
  expires: 1, // 1 day
  secure: import.meta.env.PROD,
  sameSite: 'strict'
})

// Get cookie
const token = Cookies.get('access_token')

// Remove cookie
Cookies.remove('access_token')
```

## 🍪 Cookie Utility Functions

### Available Functions

```javascript
import { 
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getUserPreferences,
  setUserPreferences,
  getThemeMode,
  setThemeMode,
  getLanguage,
  setLanguage,
  clearAuthCookies,
  clearAllCookies,
  isAuthenticated,
  getAllCookies,
  hasCookie
} from '@/utils/cookies'
```

### Usage Examples

```javascript
// Authentication
const token = getAccessToken()
setAccessToken('new-token')
removeAccessToken()

// User preferences
const preferences = getUserPreferences()
setUserPreferences({ theme: 'dark', language: 'id' })

// Theme
const theme = getThemeMode()
setThemeMode('dark')

// Language
const lang = getLanguage()
setLanguage('en')

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Clear all auth cookies
clearAuthCookies()

// Get all cookies
const allCookies = getAllCookies()

// Check if cookie exists
if (hasCookie('access_token')) {
  // Cookie exists
}
```

## 🔍 Debugging Cookie Issues

### 1. Check if Cookie is Set

```javascript
// Di browser console
console.log('Access Token:', getAccessToken())
console.log('All Cookies:', document.cookie)
console.log('All Cookies Object:', getAllCookies())
```

### 2. Check Cookie Options

```javascript
// Cookie options in utils/cookies.js
const ACCESS_TOKEN_OPTIONS = {
  secure: import.meta.env.PROD, // HTTPS in production
  sameSite: 'strict',
  path: '/',
  maxAge: 24 * 60 * 60, // 24 hours
}
```

### 3. Common Issues

#### Issue: Cookie not accessible
```javascript
// ❌ Wrong - httpOnly: true prevents client access
// (Not applicable with native API)

// ✅ Correct - Native API allows client access
setAccessToken('token')
```

#### Issue: Cookie not persisting
```javascript
// ❌ Wrong - Missing path
document.cookie = 'token=value'

// ✅ Correct - Set path
setAccessToken('token') // Includes path: '/'
```

#### Issue: Cookie not secure in production
```javascript
// ❌ Wrong - Always secure
setCookieValue('token', 'value', { secure: true })

// ✅ Correct - Secure only in production
setCookieValue('token', 'value', { secure: import.meta.env.PROD })
```

## 🛠️ Testing Cookie Functions

### 1. Test in Browser Console

```javascript
// Test cookie functions
import { getAccessToken, setAccessToken, getAllCookies } from '@/utils/cookies'

// Set a test token
setAccessToken('test-token-123')

// Get the token
console.log('Token:', getAccessToken())

// Check all cookies
console.log('All cookies:', getAllCookies())

// Check if authenticated
console.log('Is authenticated:', isAuthenticated())
```

### 2. Test in Component

```vue
<script setup>
import { getAccessToken, setAccessToken, removeAccessToken, getAllCookies } from '@/utils/cookies'

const testCookie = () => {
  // Set token
  setAccessToken('test-token')
  console.log('Token set:', getAccessToken())
  console.log('All cookies:', getAllCookies())
  
  // Remove token
  removeAccessToken()
  console.log('Token removed:', getAccessToken())
}
</script>

<template>
  <VBtn @click="testCookie">Test Cookie</VBtn>
</template>
```

## 📝 Best Practices

1. **Always use utility functions** instead of direct cookie manipulation
2. **Set appropriate cookie options** for security
3. **Handle cookie errors** gracefully
4. **Test cookie functionality** in different environments
5. **Use consistent cookie names** across the application
6. **Clear cookies properly** on logout
7. **Validate cookie data** before using
8. **Use native API** to avoid dependency conflicts

## 🚨 Security Considerations

### ✅ Secure Cookie Settings

```javascript
const SECURE_COOKIE_OPTIONS = {
  secure: import.meta.env.PROD, // HTTPS in production
  sameSite: 'strict', // Prevent CSRF
  path: '/', // Cookie scope
  maxAge: 24 * 60 * 60, // Expiration
}
```

### ❌ Insecure Cookie Settings

```javascript
const INSECURE_COOKIE_OPTIONS = {
  secure: false, // Always false
  sameSite: 'none', // Allow cross-site
  path: '/admin', // Limited scope
  // No expiration
}
```

## 🔄 Migration Guide

### From useCookie to Native API

```javascript
// OLD (doesn't work)
import { useCookie } from '@vueuse/core'
const token = useCookie('access_token')

// NEW (works)
import { getAccessToken } from '@/utils/cookies'
const token = getAccessToken()
```

### From cookie-es to Native API

```javascript
// OLD (may have dependency issues)
import { getCookie, setCookie } from 'cookie-es'
const token = getCookie('access_token')
setCookie('access_token', 'new-token')

// NEW (works without dependencies)
import { getAccessToken, setAccessToken } from '@/utils/cookies'
const token = getAccessToken()
setAccessToken('new-token')
```

### From js-cookie to Native API

```javascript
// OLD (requires js-cookie package)
import Cookies from 'js-cookie'
Cookies.set('access_token', 'token')
const token = Cookies.get('access_token')

// NEW (no dependencies)
import { setAccessToken, getAccessToken } from '@/utils/cookies'
setAccessToken('token')
const token = getAccessToken()
```

## 🆕 Native API Advantages

### ✅ Benefits

1. **No Dependencies**: Tidak memerlukan package tambahan
2. **No Conflicts**: Tidak ada konflik dependency
3. **Smaller Bundle**: Ukuran bundle lebih kecil
4. **Better Performance**: Performa lebih baik
5. **Full Control**: Kontrol penuh atas cookie behavior
6. **Cross-Browser**: Kompatibel dengan semua browser modern

### 🔧 Implementation Details

```javascript
// Native cookie parsing
const parseCookies = (cookieString) => {
  const cookies = {}
  if (!cookieString) return cookies
  
  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = decodeURIComponent(value)
    }
  })
  
  return cookies
}

// Native cookie setting
const setCookieValue = (name, value, options = {}) => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  
  if (options.path) cookieString += `; path=${options.path}`
  if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
  if (options.secure) cookieString += '; secure'
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`
  
  document.cookie = cookieString
}
```

## 🚀 Quick Fix

Jika Anda mengalami masalah dengan cookie, gunakan solusi ini:

```javascript
// 1. Import utility functions
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/cookies'

// 2. Use in your code
const token = getAccessToken()
setAccessToken('your-jwt-token')
removeAccessToken()

// 3. Test in browser console
console.log('Token:', getAccessToken())
console.log('All cookies:', document.cookie)
```

Solusi ini menggunakan native browser API dan tidak memerlukan package tambahan, sehingga menghindari semua masalah dependency. 
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

#### 3. Update Auth Store

```javascript
// src/stores/auth.js
import { 
  getAccessToken, 
  setAccessToken, 
  clearAuthCookies 
} from '@/utils/cookies'

export const useAuthStore = defineStore('auth', () => {
  // Initialize auth state from token
  const initAuth = () => {
    const token = getAccessToken()
    if (token) {
      // ... rest of logic
    }
  }

  // Login function
  const login = async (credentials) => {
    // ... login logic
    if (response.access_token) {
      setAccessToken(response.access_token)
    }
  }

  // Logout function
  const logout = async () => {
    // ... logout logic
    clearAuthCookies()
  }
})
```

#### 4. Update API Utility

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
  isAuthenticated
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
```

## 🔍 Debugging Cookie Issues

### 1. Check if Cookie is Set

```javascript
// Di browser console
console.log('Access Token:', getAccessToken())
console.log('All Cookies:', document.cookie)
```

### 2. Check Cookie Options

```javascript
// Cookie options in utils/cookies.js
const ACCESS_TOKEN_OPTIONS = {
  httpOnly: false, // Must be false for client-side access
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
setCookie('token', value, { httpOnly: true })

// ✅ Correct - httpOnly: false for client access
setCookie('token', value, { httpOnly: false })
```

#### Issue: Cookie not persisting
```javascript
// ❌ Wrong - Missing path
setCookie('token', value)

// ✅ Correct - Set path
setCookie('token', value, { path: '/' })
```

#### Issue: Cookie not secure in production
```javascript
// ❌ Wrong - Always secure
setCookie('token', value, { secure: true })

// ✅ Correct - Secure only in production
setCookie('token', value, { secure: import.meta.env.PROD })
```

## 🛠️ Testing Cookie Functions

### 1. Test in Browser Console

```javascript
// Test cookie functions
import { getAccessToken, setAccessToken } from '@/utils/cookies'

// Set a test token
setAccessToken('test-token-123')

// Get the token
console.log('Token:', getAccessToken())

// Check if authenticated
console.log('Is authenticated:', isAuthenticated())
```

### 2. Test in Component

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

## 📝 Best Practices

1. **Always use utility functions** instead of direct cookie-es calls
2. **Set appropriate cookie options** for security
3. **Handle cookie errors** gracefully
4. **Test cookie functionality** in different environments
5. **Use consistent cookie names** across the application
6. **Clear cookies properly** on logout
7. **Validate cookie data** before using

## 🚨 Security Considerations

### ✅ Secure Cookie Settings

```javascript
const SECURE_COOKIE_OPTIONS = {
  httpOnly: false, // Allow client access
  secure: import.meta.env.PROD, // HTTPS in production
  sameSite: 'strict', // Prevent CSRF
  path: '/', // Cookie scope
  maxAge: 24 * 60 * 60, // Expiration
}
```

### ❌ Insecure Cookie Settings

```javascript
const INSECURE_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: false, // Always false
  sameSite: 'none', // Allow cross-site
  path: '/admin', // Limited scope
  // No expiration
}
```

## 🔄 Migration Guide

### From useCookie to cookie-es

```javascript
// OLD (doesn't work)
import { useCookie } from '@vueuse/core'
const token = useCookie('access_token')

// NEW (works)
import { getAccessToken } from '@/utils/cookies'
const token = getAccessToken()
```

### From direct cookie-es to utility functions

```javascript
// OLD (works but not recommended)
import { getCookie, setCookie } from 'cookie-es'
const token = getCookie('access_token')
setCookie('access_token', 'new-token')

// NEW (recommended)
import { getAccessToken, setAccessToken } from '@/utils/cookies'
const token = getAccessToken()
setAccessToken('new-token')
``` 
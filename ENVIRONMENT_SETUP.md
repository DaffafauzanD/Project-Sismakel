# Environment Variables Setup Guide

## 📁 File Structure

```
frontend/
├── .env                    # Default environment (tidak di-commit)
├── .env.development       # Development environment
├── .env.production        # Production environment
├── env.example            # Template untuk .env
├── env.development.example # Template untuk development
└── env.production.example # Template untuk production
```

## 🚀 Quick Start

### 1. Development Setup

Buat file `.env` di folder `frontend/`:

```env
# API Configuration (WAJIB)
VITE_API_BASE_URL=http://localhost:3000

# Application Configuration
VITE_APP_TITLE=Sismakel
VITE_APP_DESCRIPTION=Sistem Manajemen Keluarga

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true

# Feature Flags
VITE_ENABLE_AUTH=true
```

### 2. Production Setup

Buat file `.env.production` di folder `frontend/`:

```env
# API Configuration (WAJIB)
VITE_API_BASE_URL=https://api.yourdomain.com

# Application Configuration
VITE_APP_TITLE=Sismakel
VITE_APP_DESCRIPTION=Sistem Manajemen Keluarga

# Development Configuration
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=false

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=true

# External Services
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/123456
```

## 📋 Variabel Environment Lengkap

### 🔗 API Configuration
```env
VITE_API_BASE_URL=http://localhost:3000
```

### 📱 Application Configuration
```env
VITE_APP_TITLE=Sismakel
VITE_APP_DESCRIPTION=Sistem Manajemen Keluarga
```

### 🛠️ Development Configuration
```env
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true
```

### 🚩 Feature Flags
```env
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false
```

### 🎨 Theme Configuration
```env
VITE_THEME_MODE=auto
VITE_THEME_PRIMARY_COLOR=#7367F0
VITE_THEME_SECONDARY_COLOR=#82868B
```

### 🌍 Localization
```env
VITE_DEFAULT_LOCALE=id
VITE_FALLBACK_LOCALE=en
```

### 📊 External Services
```env
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=
```

### 🚀 Production Configuration
```env
VITE_PRODUCTION_API_URL=https://api.yourdomain.com
VITE_PRODUCTION_APP_URL=https://app.yourdomain.com
```

## 💻 Cara Penggunaan di Kode

### 1. Menggunakan Composable (Recommended)

```javascript
// src/composables/useConfig.js
import { useConfig } from '@/composables/useConfig'

const { apiBaseUrl, appTitle, isDev, enableAuth } = useConfig()
```

### 2. Langsung dari Environment

```javascript
// Di dalam Vue component
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
const isDev = import.meta.env.VITE_DEV_MODE === 'true'
```

### 3. Contoh Penggunaan di Component

```vue
<script setup>
import { useConfig } from '@/composables/useConfig'

const { appTitle, isDev, enableAuth } = useConfig()
</script>

<template>
  <div>
    <h1>{{ appTitle }}</h1>
    <VChip v-if="isDev" color="warning">DEV</VChip>
    <div v-if="enableAuth">Authentication enabled</div>
  </div>
</template>
```

### 4. Contoh Penggunaan di API Utility

```javascript
// src/utils/api.js
import { useConfig } from '@/composables/useConfig'

export const $api = ofetch.create({
  baseURL: useConfig().apiBaseUrl.value,
  // ... rest of configuration
})
```

## 🔧 Environment-specific Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false
```

### Staging
```env
VITE_API_BASE_URL=https://staging-api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false
```

### Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=false
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=true
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/123456
```

## 🛡️ Keamanan

### ✅ Yang Aman untuk Client
- `VITE_API_BASE_URL` - URL API publik
- `VITE_APP_TITLE` - Judul aplikasi
- `VITE_DEV_MODE` - Mode development
- `VITE_ENABLE_AUTH` - Feature flags

### ❌ Yang Tidak Aman untuk Client
- API keys atau secrets
- Database connection strings
- JWT secrets
- Admin credentials

## 🔍 Troubleshooting

### 1. Variabel tidak terbaca
```bash
# Restart development server
npm run dev
```

### 2. Cek variabel di browser
```javascript
// Di browser console
console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
console.log('All env:', import.meta.env)
```

### 3. Validasi konfigurasi
```javascript
// src/composables/useConfig.js
const validateConfig = () => {
  const required = ['VITE_API_BASE_URL']
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
  }
}
```

## 📝 Best Practices

1. **Gunakan prefix VITE_** untuk semua variabel
2. **Buat file .env.example** sebagai template
3. **Jangan commit file .env** ke repository
4. **Gunakan .env.local** untuk konfigurasi lokal
5. **Validasi variabel** di runtime jika diperlukan
6. **Dokumentasikan** semua variabel yang digunakan
7. **Gunakan composable** untuk akses variabel
8. **Set default values** untuk variabel opsional

## 🚀 Deployment

### Vercel
```bash
# Set environment variables di Vercel dashboard
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=false
```

### Netlify
```bash
# Set environment variables di Netlify dashboard
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=false
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

## 📚 Referensi

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vue.js Environment Variables](https://vuejs.org/guide/essentials/application.html#app-config)
- [Environment Variables Best Practices](https://12factor.net/config) 
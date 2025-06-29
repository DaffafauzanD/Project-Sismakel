# Frontend Environment Variables Guide

## File .env untuk Frontend

Buat file `.env` di folder `frontend/` dengan konfigurasi berikut:

### Konfigurasi Minimal (Wajib)

```env
# API Configuration
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

### Konfigurasi Lengkap (Opsional)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Application Configuration
VITE_APP_TITLE=Sismakel
VITE_APP_DESCRIPTION=Sistem Manajemen Keluarga

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_ANALYTICS=false

# External Services (if needed)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# Build Configuration
VITE_BUILD_SOURCEMAP=true
VITE_BUILD_MINIFY=true

# PWA Configuration (if using PWA)
VITE_PWA_ENABLED=false
VITE_PWA_NAME=Sismakel
VITE_PWA_SHORT_NAME=Sismakel
VITE_PWA_DESCRIPTION=Sistem Manajemen Keluarga

# Theme Configuration
VITE_THEME_MODE=auto
VITE_THEME_PRIMARY_COLOR=#7367F0
VITE_THEME_SECONDARY_COLOR=#82868B

# Localization
VITE_DEFAULT_LOCALE=id
VITE_FALLBACK_LOCALE=en

# Development Server
VITE_DEV_SERVER_PORT=5173
VITE_DEV_SERVER_HOST=localhost

# Production Configuration
VITE_PRODUCTION_API_URL=https://api.yourdomain.com
VITE_PRODUCTION_APP_URL=https://app.yourdomain.com
```

## Penjelasan Variabel

### 🔗 API Configuration
- `VITE_API_BASE_URL`: URL backend API (wajib untuk authentication)

### 📱 Application Configuration
- `VITE_APP_TITLE`: Judul aplikasi
- `VITE_APP_DESCRIPTION`: Deskripsi aplikasi

### 🛠️ Development Configuration
- `VITE_DEV_MODE`: Mode development (true/false)
- `VITE_ENABLE_DEBUG`: Enable debug mode

### 🚩 Feature Flags
- `VITE_ENABLE_AUTH`: Enable authentication system
- `VITE_ENABLE_ANALYTICS`: Enable analytics

### 📊 External Services
- `VITE_GOOGLE_ANALYTICS_ID`: Google Analytics ID
- `VITE_SENTRY_DSN`: Sentry error tracking DSN

### 🏗️ Build Configuration
- `VITE_BUILD_SOURCEMAP`: Generate source maps
- `VITE_BUILD_MINIFY`: Minify build output

### 📱 PWA Configuration
- `VITE_PWA_ENABLED`: Enable Progressive Web App
- `VITE_PWA_NAME`: PWA name
- `VITE_PWA_SHORT_NAME`: PWA short name
- `VITE_PWA_DESCRIPTION`: PWA description

### 🎨 Theme Configuration
- `VITE_THEME_MODE`: Theme mode (light/dark/auto)
- `VITE_THEME_PRIMARY_COLOR`: Primary color
- `VITE_THEME_SECONDARY_COLOR`: Secondary color

### 🌍 Localization
- `VITE_DEFAULT_LOCALE`: Default language
- `VITE_FALLBACK_LOCALE`: Fallback language

### 🖥️ Development Server
- `VITE_DEV_SERVER_PORT`: Development server port
- `VITE_DEV_SERVER_HOST`: Development server host

### 🚀 Production Configuration
- `VITE_PRODUCTION_API_URL`: Production API URL
- `VITE_PRODUCTION_APP_URL`: Production app URL

## Cara Penggunaan

### 1. Development
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DEV_MODE=true
VITE_ENABLE_DEBUG=true
```

### 2. Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=false
```

### 3. Staging
```env
VITE_API_BASE_URL=https://staging-api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEBUG=true
```

## Akses Variabel di Vue.js

```javascript
// Di dalam Vue component
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
const isDev = import.meta.env.VITE_DEV_MODE === 'true'

// Di dalam composable
export const useConfig = () => {
  return {
    apiUrl: import.meta.env.VITE_API_BASE_URL,
    appTitle: import.meta.env.VITE_APP_TITLE,
    isDev: import.meta.env.VITE_DEV_MODE === 'true',
    enableAuth: import.meta.env.VITE_ENABLE_AUTH === 'true'
  }
}
```

## Contoh Penggunaan di API Utility

```javascript
// src/utils/api.js
export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  async onRequest({ options }) {
    const accessToken = useCookie('access_token').value
    if (accessToken) {
      options.headers.append('Authorization', `Bearer ${accessToken}`)
    }
  },
})
```

## Keamanan

### ✅ Yang Aman
- Semua variabel yang dimulai dengan `VITE_` akan terekspos ke client
- Gunakan hanya untuk konfigurasi yang aman untuk client

### ❌ Yang Tidak Aman
- Jangan simpan API keys, secrets, atau credentials
- Jangan simpan database connection strings
- Jangan simpan JWT secrets

## Troubleshooting

### 1. Variabel tidak terbaca
```bash
# Restart development server
npm run dev
```

### 2. API URL tidak sesuai
```javascript
// Cek di browser console
console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
```

### 3. Environment tidak terdeteksi
```bash
# Pastikan file .env ada di root frontend
ls -la frontend/.env
```

## Best Practices

1. **Gunakan prefix VITE_** untuk semua variabel
2. **Buat file .env.example** sebagai template
3. **Jangan commit file .env** ke repository
4. **Gunakan .env.local** untuk konfigurasi lokal
5. **Validasi variabel** di runtime jika diperlukan
6. **Dokumentasikan** semua variabel yang digunakan 
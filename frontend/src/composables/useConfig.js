import { computed } from 'vue'

export const useConfig = () => {
  // API Configuration
  const apiBaseUrl = computed(() => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000')
  
  // Application Configuration
  const appTitle = computed(() => import.meta.env.VITE_APP_TITLE || 'Sismakel')
  const appDescription = computed(() => import.meta.env.VITE_APP_DESCRIPTION || 'Sistem Manajemen Keluarga')
  
  // Development Configuration
  const isDev = computed(() => import.meta.env.VITE_DEV_MODE === 'true')
  const isDebug = computed(() => import.meta.env.VITE_ENABLE_DEBUG === 'true')
  
  // Feature Flags
  const enableAuth = computed(() => import.meta.env.VITE_ENABLE_AUTH === 'true')
  const enableAnalytics = computed(() => import.meta.env.VITE_ENABLE_ANALYTICS === 'true')
  
  // External Services
  const googleAnalyticsId = computed(() => import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '')
  const sentryDsn = computed(() => import.meta.env.VITE_SENTRY_DSN || '')
  
  // Theme Configuration
  const themeMode = computed(() => import.meta.env.VITE_THEME_MODE || 'auto')
  const primaryColor = computed(() => import.meta.env.VITE_THEME_PRIMARY_COLOR || '#7367F0')
  const secondaryColor = computed(() => import.meta.env.VITE_THEME_SECONDARY_COLOR || '#82868B')
  
  // Localization
  const defaultLocale = computed(() => import.meta.env.VITE_DEFAULT_LOCALE || 'id')
  const fallbackLocale = computed(() => import.meta.env.VITE_FALLBACK_LOCALE || 'en')
  
  // Production Configuration
  const productionApiUrl = computed(() => import.meta.env.VITE_PRODUCTION_API_URL || '')
  const productionAppUrl = computed(() => import.meta.env.VITE_PRODUCTION_APP_URL || '')
  
  // Helper functions
  const isProduction = computed(() => !isDev.value)
  const isStaging = computed(() => !isDev.value && !isProduction.value)
  
  return {
    // API
    apiBaseUrl,
    
    // Application
    appTitle,
    appDescription,
    
    // Environment
    isDev,
    isDebug,
    isProduction,
    isStaging,
    
    // Features
    enableAuth,
    enableAnalytics,
    
    // External Services
    googleAnalyticsId,
    sentryDsn,
    
    // Theme
    themeMode,
    primaryColor,
    secondaryColor,
    
    // Localization
    defaultLocale,
    fallbackLocale,
    
    // Production
    productionApiUrl,
    productionAppUrl
  }
} 
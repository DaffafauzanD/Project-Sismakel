// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
}

// Cookie options
const DEFAULT_COOKIE_OPTIONS = {
  secure: import.meta.env.PROD, // Use HTTPS in production
  sameSite: 'strict',
  path: '/',
}

// Access token cookie options
const ACCESS_TOKEN_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: 24 * 60 * 60, // 24 hours
}

// Refresh token cookie options
const REFRESH_TOKEN_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60, // 7 days
}

// User preferences cookie options
const USER_PREFERENCES_OPTIONS = {
  ...DEFAULT_COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

/**
 * Parse cookie string into object
 * @param {string} cookieString - Cookie string from document.cookie
 * @returns {object} Parsed cookies object
 */
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

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
const getCookieValue = (name) => {
  const cookies = parseCookies(document.cookie)
  return cookies[name] || null
}

/**
 * Set cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options
 */
const setCookieValue = (name, value, options = {}) => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
  
  if (options.path) {
    cookieString += `; path=${options.path}`
  }
  
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`
  }
  
  if (options.secure) {
    cookieString += '; secure'
  }
  
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }
  
  document.cookie = cookieString
}

/**
 * Delete cookie by name
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 */
const deleteCookieValue = (name, options = {}) => {
  const deleteOptions = {
    ...options,
    maxAge: -1, // Set to past date to delete
  }
  setCookieValue(name, '', deleteOptions)
}

/**
 * Get access token from cookie
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  // Try debug cookie first in development
  if (import.meta.env.DEV) {
    const debugToken = getCookieValue(COOKIE_NAMES.ACCESS_TOKEN + '_debug')
    if (debugToken) {
      return debugToken
    }
  }
  
  // Try regular cookie
  const token = getCookieValue(COOKIE_NAMES.ACCESS_TOKEN)
  return token
}

/**
 * Set access token in cookie
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  setCookieValue(COOKIE_NAMES.ACCESS_TOKEN, token, ACCESS_TOKEN_OPTIONS)
}

/**
 * Remove access token from cookie
 */
export const removeAccessToken = () => {
  deleteCookieValue(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' })
}

/**
 * Get refresh token from cookie
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  return getCookieValue(COOKIE_NAMES.REFRESH_TOKEN)
}

/**
 * Set refresh token in cookie
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = (token) => {
  setCookieValue(COOKIE_NAMES.REFRESH_TOKEN, token, REFRESH_TOKEN_OPTIONS)
}

/**
 * Remove refresh token from cookie
 */
export const removeRefreshToken = () => {
  deleteCookieValue(COOKIE_NAMES.REFRESH_TOKEN, { path: '/' })
}

/**
 * Get user preferences from cookie
 * @returns {object|null} User preferences or null if not found
 */
export const getUserPreferences = () => {
  const preferences = getCookieValue(COOKIE_NAMES.USER_PREFERENCES)
  if (preferences) {
    try {
      return JSON.parse(preferences)
    } catch (error) {
      return null
    }
  }
  return null
}

/**
 * Set user preferences in cookie
 * @param {object} preferences - User preferences object
 */
export const setUserPreferences = (preferences) => {
  const preferencesString = JSON.stringify(preferences)
  setCookieValue(COOKIE_NAMES.USER_PREFERENCES, preferencesString, USER_PREFERENCES_OPTIONS)
}

/**
 * Get theme mode from cookie
 * @returns {string} Theme mode (light, dark, auto)
 */
export const getThemeMode = () => {
  return getCookieValue(COOKIE_NAMES.THEME_MODE) || 'light'
}

/**
 * Set theme mode in cookie
 * @param {string} mode - Theme mode
 */
export const setThemeMode = (mode) => {
  setCookieValue(COOKIE_NAMES.THEME_MODE, mode, USER_PREFERENCES_OPTIONS)
}

/**
 * Get language from cookie
 * @returns {string} Language code
 */
export const getLanguage = () => {
  return getCookieValue(COOKIE_NAMES.LANGUAGE) || 'en'
}

/**
 * Set language in cookie
 * @param {string} language - Language code
 */
export const setLanguage = (language) => {
  setCookieValue(COOKIE_NAMES.LANGUAGE, language, USER_PREFERENCES_OPTIONS)
}

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = () => {
  removeAccessToken()
  removeRefreshToken()
  // Also clear debug cookie if it exists
  deleteCookieValue(COOKIE_NAMES.ACCESS_TOKEN + '_debug', { path: '/' })
}

/**
 * Clear all cookies
 */
export const clearAllCookies = () => {
  const cookies = parseCookies(document.cookie)
  Object.keys(cookies).forEach(cookieName => {
    deleteCookieValue(cookieName, { path: '/' })
  })
}

/**
 * Check if user is authenticated based on token presence
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = getAccessToken()
  return !!token
}

/**
 * Get all cookies as object
 * @returns {object} All cookies
 */
export const getAllCookies = () => {
  return parseCookies(document.cookie)
}

/**
 * Check if cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} True if cookie exists
 */
export const hasCookie = (name) => {
  return !!getCookieValue(name)
} 
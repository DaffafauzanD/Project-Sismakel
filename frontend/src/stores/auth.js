import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { $api } from '@/utils/api'
import { 
  getAccessToken, 
  setAccessToken, 
  removeAccessToken,
  clearAuthCookies 
} from '@/utils/cookies'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed properties
  const userRole = computed(() => user.value?.role || null)
  const userPermissions = computed(() => user.value?.permission || [])
  const isAdmin = computed(() => userRole.value === 'ADMIN')
  const isUser = computed(() => userRole.value === 'user')
  const isModerator = computed(() => userRole.value === 'moderator')

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission)
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => userPermissions.value.includes(permission))
  }

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => userPermissions.value.includes(permission))
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole.value === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }

  // Initialize auth state from token
  const initAuth = () => {
    const token = getAccessToken()
    if (token) {
      try {
        const decoded = jwtDecode(token)
        user.value = decoded
        isAuthenticated.value = true
      } catch (error) {
        console.error('Invalid token:', error)
        logout()
      }
    }
  }

  // Login function
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $api('/auth/login', {
        method: 'POST',
        body: credentials,
      })

      // Set user data
      user.value = response.user
      isAuthenticated.value = true

      // Token is automatically set in cookie by backend
      // We can decode it to get user info
      if (response.access_token) {
        const decoded = jwtDecode(response.access_token)
        user.value = decoded
        // Also set token in client-side cookie for consistency
        setAccessToken(response.access_token)
      }

      return response
    } catch (err) {
      error.value = err.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session
      await $api('/auth/logout', {
        method: 'POST',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state
      user.value = null
      isAuthenticated.value = false
      clearAuthCookies()
    }
  }

  // Verify token validity
  const verifyToken = async () => {
    const token = getAccessToken()
    if (!token) {
      return false
    }

    try {
      const response = await $api('/auth/verify', {
        method: 'GET',
      })
      
      if (response.valid) {
        user.value = response.user
        isAuthenticated.value = true
        return true
      }
    } catch (err) {
      console.error('Token verification failed:', err)
      logout()
      return false
    }
  }

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await $api('/auth/profile', {
        method: 'GET',
      })
      
      user.value = response.user
      return response.user
    } catch (err) {
      console.error('Failed to get profile:', err)
      throw err
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken: computed(() => getAccessToken()),

    // Computed
    userRole,
    userPermissions,
    isAdmin,
    isUser,
    isModerator,

    // Methods
    login,
    logout,
    verifyToken,
    getProfile,
    initAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  }
}) 
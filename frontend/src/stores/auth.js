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
  const userPermissions = computed(() => {
    // Handle both permission (from JWT) and permissions (from API)
    const permissions = user.value?.permission || user.value?.permissions || []
    return Array.isArray(permissions) ? permissions : []
  })
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
  const initAuth = async () => {
    const token = getAccessToken()
    if (token) {
      try {
        const decoded = jwtDecode(token)
        
        // Check if token is expired
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp < currentTime) {
          logout()
          return
        }
        
        // Set user data from JWT
        user.value = {
          id: decoded.sub,
          username: decoded.username,
          role: decoded.role,
          permission: decoded.permission || [],
        }
        isAuthenticated.value = true
      } catch (error) {
        logout()
      }
    } else {
      // Ensure state is clean
      user.value = null
      isAuthenticated.value = false
    }
  }

  // Refresh auth state from server
  const refreshAuth = async () => {
    try {
      const response = await $api('/auth/profile', {
        method: 'GET',
      })
      
      user.value = response.user
      isAuthenticated.value = true
      
      return true
    } catch (err) {
      logout()
      return false
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

      // Token is automatically set in cookie by backend
      // We can decode it to get user info
      if (response.access_token) {
        const decoded = jwtDecode(response.access_token)
        
        // Update user data with JWT payload
        user.value = {
          id: decoded.sub,
          username: decoded.username,
          role: decoded.role,
          permission: decoded.permission || [],
        }
        isAuthenticated.value = true
        
        // Also set token in client-side cookie for consistency
        setAccessToken(response.access_token)
        
        // Refresh auth state from server to ensure consistency
        await refreshAuth()
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
      // Ignore logout errors
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
        // Update user data from verification response
        user.value = response.user
        isAuthenticated.value = true
        
        return true
      }
    } catch (err) {
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
      throw err
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Computed
    userRole,
    userPermissions,
    isAdmin,
    isUser,
    isModerator,
    
    // Methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    initAuth,
    refreshAuth,
    login,
    logout,
    verifyToken,
    getProfile,
  }
}) 
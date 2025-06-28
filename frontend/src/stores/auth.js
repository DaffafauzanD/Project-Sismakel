import { defineStore } from 'pinia'
import { $api } from '@/utils/api'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    permissions: [],
    role: null,
  }),

  getters: {
    getUserRole: (state) => state.role,
    getUserPermissions: (state) => state.permissions,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    },
    hasRole: (state) => (role) => {
      return state.role === role
    },
    canAccess: (state) => (requiredPermissions = []) => {
      if (!requiredPermissions.length) return true
      return requiredPermissions.some(permission => 
        state.permissions.includes(permission)
      )
    }
  },

  actions: {
    async login(credentials) {
      try {
        const response = await $api('/auth/login', {
          method: 'POST',
          body: credentials,
        })

        console.log('Login response:', response)

        if (response.access_token) {
          // Decode JWT untuk mendapatkan user info
          const decodedToken = jwtDecode(response.access_token)
          
          this.token = response.access_token
          this.user = response.user
          this.isAuthenticated = true
          this.role = response.user?.role || decodedToken.role
          this.permissions = response.user?.permissions || decodedToken.permissions || []

          // Store token di cookie (sudah dihandle di backend)
          // Atau simpan di localStorage jika diperlukan
          localStorage.setItem('auth_user', JSON.stringify(response.user))
          
          return { success: true, data: response }
        }
      } catch (error) {
        console.error('Login failed:', error)
        return { 
          success: false, 
          message: error.data?.message || 'Login failed' 
        }
      }
    },

    async logout() {
      try {
        await $api('/auth/logout', {
          method: 'POST',
        })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async getProfile() {
      try {
        const response = await $api('/auth/profile')
        
        if (response.user) {
          this.user = response.user
          this.role = response.user.role
          this.permissions = response.user.permissions || []
          this.isAuthenticated = true
        }
        
        return response
      } catch (error) {
        console.error('Get profile failed:', error)
        this.clearAuth()
        throw error
      }
    },

    async checkAuth() {
      console.log('Checking auth status...')
      try {
        const response = await $api('/auth/verify')
        console.log('Auth verify response:', response)
        
        if (response.valid || response.user) {
          await this.getProfile()
          console.log('Auth check successful')
          return true
        } else {
          console.log('Auth check failed - invalid token')
          this.clearAuth()
          return false
        }
      } catch (error) {
        console.error('Auth check error:', error)
        this.clearAuth()
        return false
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.permissions = []
      this.role = null
      localStorage.removeItem('auth_user')
    },

    // Load auth state dari localStorage saat app dimulai
    initializeAuth() {
      console.log('Initializing auth state...')
      const storedUser = localStorage.getItem('auth_user')
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          console.log('Found stored user:', user)
          this.user = user
          this.role = user.role
          this.permissions = user.permissions || []
          this.isAuthenticated = true
          console.log('Auth state initialized from storage')
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          this.clearAuth()
        }
      } else {
        console.log('No stored user found')
      }
    }
  }
})

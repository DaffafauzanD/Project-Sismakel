import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  // Login function with redirect
  const login = async (credentials) => {
    try {
      const response = await authStore.login(credentials)
      console.log("response ::", response)
      // Redirect to dashboard or intended page
      const redirectTo = router.currentRoute.value.query.redirect || '/'
      await router.push(redirectTo)
      
      return response
    } catch (err) {
      throw err
    }
  }

  // Logout function with redirect
  const logout = async () => {
    await authStore.logout()
    // Redirect to login
    await router.push('/login')
  }

  return {
    // State from store
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    accessToken: authStore.accessToken,

    // Computed from store
    userRole: authStore.userRole,
    userPermissions: authStore.userPermissions,
    isAdmin: authStore.isAdmin,
    isUser: authStore.isUser,
    isModerator: authStore.isModerator,

    // Methods from store
    login,
    logout,
    verifyToken: authStore.verifyToken,
    getProfile: authStore.getProfile,
    initAuth: authStore.initAuth,
    hasPermission: authStore.hasPermission,
    hasAnyPermission: authStore.hasAnyPermission,
    hasAllPermissions: authStore.hasAllPermissions,
    hasRole: authStore.hasRole,
    hasAnyRole: authStore.hasAnyRole,
  }
} 
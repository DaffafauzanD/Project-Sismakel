import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission name
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return authStore.hasPermission(permission)
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role name
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return authStore.hasRole(role)
  }

  /**
   * Check if user can access with any of the required permissions
   * @param {Array<string>} permissions - Array of permission names
   * @returns {boolean}
   */
  const canAccess = (permissions = []) => {
    return authStore.canAccess(permissions)
  }

  /**
   * Check if user can perform action based on multiple conditions
   * @param {Object} options - { roles: [], permissions: [], requireAll: false }
   * @returns {boolean}
   */
  const canPerform = ({ roles = [], permissions = [], requireAll = false }) => {
    const roleCheck = roles.length === 0 || roles.some(role => hasRole(role))
    const permissionCheck = permissions.length === 0 || 
      (requireAll 
        ? permissions.every(permission => hasPermission(permission))
        : permissions.some(permission => hasPermission(permission))
      )

    return roleCheck && permissionCheck
  }

  /**
   * Get user's current role
   * @returns {string|null}
   */
  const getCurrentRole = () => {
    return authStore.getUserRole
  }

  /**
   * Get user's permissions
   * @returns {Array<string>}
   */
  const getUserPermissions = () => {
    return authStore.getUserPermissions
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return authStore.isAuthenticated
  }

  /**
   * Get current user data
   * @returns {Object|null}
   */
  const getCurrentUser = () => {
    return authStore.user
  }

  return {
    // State
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    role: computed(() => authStore.role),
    permissions: computed(() => authStore.permissions),

    // Methods
    hasPermission,
    hasRole,
    canAccess,
    canPerform,
    getCurrentRole,
    getUserPermissions,
    getCurrentUser,

    // Actions
    login: authStore.login,
    logout: authStore.logout,
    checkAuth: authStore.checkAuth,
    getProfile: authStore.getProfile,
  }
}

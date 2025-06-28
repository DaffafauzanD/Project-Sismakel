import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check role requirements
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole
    if (!authStore.hasRole(requiredRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied: Insufficient role permissions'
      })
    }
  }

  // Check permission requirements
  if (to.meta.requiredPermissions && to.meta.requiredPermissions.length > 0) {
    const requiredPermissions = to.meta.requiredPermissions
    if (!authStore.canAccess(requiredPermissions)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied: Insufficient permissions'
      })
    }
  }
})

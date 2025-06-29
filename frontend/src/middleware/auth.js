import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  const requiresAuth = to.meta?.requiresAuth === true
  const isPublic = to.meta?.public === true
  
  // If route is public, allow access
  if (isPublic) {
    return
  }
  
  // If route requires auth but user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    // Try to verify token from cookie
    const isValid = authStore.verifyToken()
    console.log("isValid ::", isValid);
    if (!isValid) {
      // Redirect to login with return URL
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  
  // Check role-based access
  const requiredRoles = to.meta?.roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(authStore.userRole)
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or show error
      return navigateTo({
        path: '/unauthorized',
        query: { 
          message: 'You do not have the required role to access this page',
          requiredRoles: requiredRoles.join(', '),
          currentRole: authStore.userRole
        }
      })
    }
  }
  
  // Check permission-based access
  const requiredPermissions = to.meta?.permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission => 
      authStore.userPermissions.includes(permission)
    )
    if (!hasRequiredPermission) {
      // Redirect to unauthorized page or show error
      return navigateTo({
        path: '/unauthorized',
        query: { 
          message: 'You do not have the required permissions to access this page',
          requiredPermissions: requiredPermissions.join(', '),
          currentPermissions: authStore.userPermissions.join(', ')
        }
      })
    }
  }
  
  // If authenticated user tries to access login page, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    return navigateTo({ path: '/protected/dashboard' })
  }
}) 
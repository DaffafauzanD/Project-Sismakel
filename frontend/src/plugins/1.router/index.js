import { setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAuthStore } from '@/stores/auth'

function recursiveLayouts(route) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i])
    
    return route
  }
  
  return setupLayouts([route])[0]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }
    
    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  const requiresAuth = to.meta?.requiresAuth === true
  const isPublic = to.meta?.public === true
  
  // If route is public, allow access
  if (isPublic) {
    return next()
  }
  
  // If route requires auth but user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    // Try to initialize auth from token first
    await authStore.initAuth()
    
    // If still not authenticated, try to verify token from server
    if (!authStore.isAuthenticated) {
      const isValid = await authStore.verifyToken()
      if (!isValid) {
        // Redirect to login with return URL
        return next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    }
  }
  
  // Check role-based access
  const requiredRoles = to.meta?.roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(authStore.userRole)
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or show error
      return next({
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
      return next({
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
    return next({ path: '/protected/dashboard' })
  }
  
  next()
})

export { router }
export default function (app) {
  app.use(router)
}

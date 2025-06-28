import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    meta: { requiresAuth: false, public: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/second-page',
    name: 'SecondPage',
    component: () => import('@/pages/second-page.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/pages/admin/index.vue'),
    meta: { 
      requiresAuth: true,
      requiresRole: 'admin'
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/pages/admin/users/index.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermissions: ['users.view']
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/products/index.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermissions: ['products.view']
    }
  },
  {
    path: '/products/create',
    name: 'CreateProduct',
    component: () => import('@/pages/products/create.vue'),
    meta: { 
      requiresAuth: true,
      requiredPermissions: ['products.create']
    }
  },
  // Fallback untuk unauthorized
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/pages/errors/unauthorized.vue'),
    meta: { requiresAuth: false }
  },
  // 404 page
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/[...error].vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  console.log('Router guard - Navigating to:', to.path)
  const authStore = useAuthStore()

  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  // Public routes (tidak perlu auth)
  if (to.meta.requiresAuth === false || to.meta.public === true) {
    // Jika sudah login dan akses halaman login, redirect ke dashboard
    if (to.path === '/login' && authStore.isAuthenticated) {
      console.log('Already authenticated, redirecting from login')
      const redirectTo = authStore.hasRole('admin') ? '/admin' : '/'
      return next(redirectTo)
    }
    return next()
  }

  // Routes yang butuh authentication
  console.log('Checking authentication for protected route')
  
  try {
    // Cek auth status dengan backend
    const isValidAuth = await authStore.checkAuth()
    console.log('Auth check result:', isValidAuth)
    
    if (!isValidAuth) {
      console.log('Authentication failed, redirecting to login')
      return next('/login')
    }

    // Check role requirements
    if (to.meta.requiresRole) {
      const requiredRole = to.meta.requiresRole
      console.log('Checking role requirement:', requiredRole)
      console.log('User role:', authStore.role)
      
      if (!authStore.hasRole(requiredRole)) {
        console.log('Role check failed, redirecting to unauthorized')
        return next('/unauthorized')
      }
    }

    // Check permission requirements
    if (to.meta.requiredPermissions && to.meta.requiredPermissions.length > 0) {
      const requiredPermissions = to.meta.requiredPermissions
      console.log('Checking permission requirements:', requiredPermissions)
      console.log('User permissions:', authStore.permissions)
      
      if (!authStore.canAccess(requiredPermissions)) {
        console.log('Permission check failed, redirecting to unauthorized')
        return next('/unauthorized')
      }
    }

    console.log('All checks passed, allowing navigation')
    next()
  } catch (error) {
    console.error('Auth guard error:', error)
    next('/login')
  }
})

export default router

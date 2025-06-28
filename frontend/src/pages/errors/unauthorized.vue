<template>
  <div class="d-flex flex-column align-center justify-center min-vh-100">
    <VCard
      class="pa-6 text-center"
      max-width="500"
    >
      <VIcon
        icon="tabler-shield-x"
        size="64"
        color="error"
        class="mb-4"
      />
      
      <h1 class="text-h4 mb-2">
        Access Denied
      </h1>
      
      <p class="text-body-1 mb-4">
        You don't have permission to access this page.
      </p>
      
      <div class="mb-4">
        <VAlert
          type="warning"
          variant="tonal"
        >
          Required: {{ requiredAccess }}
        </VAlert>
      </div>
      
      <div class="d-flex gap-3 justify-center">
        <VBtn
          color="primary"
          @click="goBack"
        >
          Go Back
        </VBtn>
        
        <VBtn
          variant="outlined"
          @click="goHome"
        >
          Go Home
        </VBtn>
        
        <VBtn
          color="error"
          variant="outlined"
          @click="logout"
        >
          Logout
        </VBtn>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const { logout: authLogout, user, role, permissions } = useAuth()
const router = useRouter()
const route = useRoute()

const requiredAccess = computed(() => {
  const from = router.options.history.state.back
  if (!from) return 'Unknown'
  
  // Try to find the route that was attempted
  const attemptedRoute = router.getRoutes().find(r => r.path === from)
  if (!attemptedRoute?.meta) return 'Unknown'
  
  const requirements = []
  
  if (attemptedRoute.meta.requiresRole) {
    requirements.push(`Role: ${attemptedRoute.meta.requiresRole}`)
  }
  
  if (attemptedRoute.meta.requiredPermissions) {
    requirements.push(`Permissions: ${attemptedRoute.meta.requiredPermissions.join(', ')}`)
  }
  
  return requirements.join(' | ') || 'Authentication required'
})

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  const defaultRoute = role.value === 'admin' ? '/admin' : '/'
  router.push(defaultRoute)
}

const logout = async () => {
  try {
    await authLogout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Meta untuk halaman
definePage({
  meta: {
    layout: 'blank',
    requiresAuth: false
  }
})
</script>

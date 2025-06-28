<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between">
            <span>Admin Dashboard</span>
            <VBtn
              color="error"
              @click="logout"
            >
              Logout
            </VBtn>
          </VCardTitle>
          
          <VCardText>
            <VAlert
              type="info"
              class="mb-4"
            >
              Welcome {{ user?.username }}! You have {{ role }} role with {{ permissions.length }} permissions.
            </VAlert>

            <!-- Stats Cards -->
            <VRow>
              <VCol
                v-if="hasPermission('users.view')"
                cols="12"
                md="4"
              >
                <VCard color="primary">
                  <VCardText class="text-white">
                    <div class="d-flex align-center">
                      <VIcon
                        icon="tabler-users"
                        size="40"
                        class="me-4"
                      />
                      <div>
                        <h3>{{ stats.totalUsers || 0 }}</h3>
                        <p class="mb-0">Total Users</p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                v-if="hasPermission('products.view')"
                cols="12"
                md="4"
              >
                <VCard color="success">
                  <VCardText class="text-white">
                    <div class="d-flex align-center">
                      <VIcon
                        icon="tabler-package"
                        size="40"
                        class="me-4"
                      />
                      <div>
                        <h3>{{ stats.totalProducts || 0 }}</h3>
                        <p class="mb-0">Total Products</p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol
                v-if="hasPermission('orders.view')"
                cols="12"
                md="4"
              >
                <VCard color="warning">
                  <VCardText class="text-white">
                    <div class="d-flex align-center">
                      <VIcon
                        icon="tabler-shopping-cart"
                        size="40"
                        class="me-4"
                      />
                      <div>
                        <h3>{{ stats.totalOrders || 0 }}</h3>
                        <p class="mb-0">Total Orders</p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <!-- Quick Actions -->
            <VRow class="mt-6">
              <VCol cols="12">
                <h5 class="text-h5 mb-4">Quick Actions</h5>
                
                <div class="d-flex flex-wrap gap-3">
                  <VBtn
                    v-if="hasPermission('users.create')"
                    color="primary"
                    to="/admin/users/create"
                  >
                    <VIcon
                      icon="tabler-user-plus"
                      class="me-2"
                    />
                    Add User
                  </VBtn>

                  <VBtn
                    v-if="hasPermission('products.create')"
                    color="success"
                    to="/admin/products/create"
                  >
                    <VIcon
                      icon="tabler-plus"
                      class="me-2"
                    />
                    Add Product
                  </VBtn>

                  <VBtn
                    v-if="hasPermission('reports.view')"
                    color="info"
                    to="/admin/reports"
                  >
                    <VIcon
                      icon="tabler-chart-bar"
                      class="me-2"
                    />
                    View Reports
                  </VBtn>

                  <VBtn
                    v-if="hasRole('super_admin')"
                    color="warning"
                    to="/admin/settings"
                  >
                    <VIcon
                      icon="tabler-settings"
                      class="me-2"
                    />
                    System Settings
                  </VBtn>
                </div>
              </VCol>
            </VRow>

            <!-- Recent Activities (only if has permission) -->
            <VRow
              v-if="hasPermission('activities.view')"
              class="mt-6"
            >
              <VCol cols="12">
                <VCard>
                  <VCardTitle>Recent Activities</VCardTitle>
                  <VCardText>
                    <VList>
                      <VListItem
                        v-for="activity in recentActivities"
                        :key="activity.id"
                      >
                        <VListItemTitle>{{ activity.action }}</VListItemTitle>
                        <VListItemSubtitle>{{ activity.timestamp }}</VListItemSubtitle>
                      </VListItem>
                    </VList>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>

            <!-- Permission Debug Info (hanya untuk development) -->
            <VRow
              v-if="isDev"
              class="mt-6"
            >
              <VCol cols="12">
                <VCard>
                  <VCardTitle>Debug: Current Permissions</VCardTitle>
                  <VCardText>
                    <VChip
                      v-for="permission in permissions"
                      :key="permission"
                      class="ma-1"
                      size="small"
                      color="primary"
                    >
                      {{ permission }}
                    </VChip>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'
import { $api } from '@/utils/api'

// Define page meta untuk protection
definePage({
  meta: {
    requiresAuth: true,
    requiresRole: 'admin', // Halaman ini hanya untuk admin
    layout: 'default',
  }
})

// Auth composable
const {
  user,
  role,
  permissions,
  hasRole,
  hasPermission,
  logout: authLogout
} = useAuth()

// Reactive data
const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0
})

const recentActivities = ref([])
const loading = ref(false)
const isDev = ref(process.env.NODE_ENV === 'development')

// Methods
const logout = async () => {
  try {
    await authLogout()
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const loadStats = async () => {
  loading.value = true
  try {
    // Load stats berdasarkan permission
    const promises = []
    
    if (hasPermission('users.view')) {
      promises.push($api('/admin/stats/users').then(res => {
        stats.value.totalUsers = res.count
      }))
    }
    
    if (hasPermission('products.view')) {
      promises.push($api('/admin/stats/products').then(res => {
        stats.value.totalProducts = res.count
      }))
    }
    
    if (hasPermission('orders.view')) {
      promises.push($api('/admin/stats/orders').then(res => {
        stats.value.totalOrders = res.count
      }))
    }

    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    loading.value = false
  }
}

const loadRecentActivities = async () => {
  if (!hasPermission('activities.view')) return
  
  try {
    const response = await $api('/admin/activities/recent')
    recentActivities.value = response.data
  } catch (error) {
    console.error('Failed to load activities:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await loadStats()
  await loadRecentActivities()
})

// Watch untuk reload data jika permission berubah
watch(() => permissions.value, () => {
  loadStats()
  loadRecentActivities()
}, { deep: true })
</script>

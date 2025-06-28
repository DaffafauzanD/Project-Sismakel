<template>
  <div>
    <!-- Navigation yang tergantung role -->
    <nav>
      <VBtn
        v-if="hasRole('admin')"
        to="/admin/users"
        color="primary"
      >
        Manage Users
      </VBtn>
      
      <VBtn
        v-if="hasPermission('products.view')"
        to="/products"
        color="secondary"
      >
        View Products
      </VBtn>
      
      <VBtn
        v-if="canAccess(['products.create', 'products.edit'])"
        to="/products/manage"
        color="success"
      >
        Manage Products
      </VBtn>
    </nav>

    <!-- Content yang tergantung permission -->
    <VCard class="mt-4">
      <VCardTitle>Product Management</VCardTitle>
      <VCardText>
        <!-- Hanya admin atau user dengan permission products.view yang bisa lihat -->
        <div v-if="canPerform({ roles: ['admin'], permissions: ['products.view'] })">
          <VDataTable
            :headers="headers"
            :items="products"
            :loading="loading"
          />
        </div>
        
        <!-- Pesan jika tidak ada akses -->
        <VAlert
          v-else
          type="warning"
          text="You don't have permission to view products"
        />
      </VCardText>
      
      <VCardActions v-if="hasPermission('products.create')">
        <VBtn
          color="primary"
          @click="createProduct"
        >
          Add New Product
        </VBtn>
      </VCardActions>
    </VCard>

    <!-- User Info -->
    <VCard class="mt-4">
      <VCardTitle>User Information</VCardTitle>
      <VCardText>
        <p><strong>Username:</strong> {{ user?.username }}</p>
        <p><strong>Role:</strong> {{ role }}</p>
        <p><strong>Permissions:</strong></p>
        <VChip
          v-for="permission in permissions"
          :key="permission"
          class="ma-1"
          size="small"
        >
          {{ permission }}
        </VChip>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

// Setup auth
const {
  user,
  role,
  permissions,
  hasRole,
  hasPermission,
  canAccess,
  canPerform,
  logout
} = useAuth()

// Reactive data
const products = ref([])
const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Price', key: 'price' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Methods
const createProduct = () => {
  // Logic untuk create product
  console.log('Creating product...')
}

const loadProducts = async () => {
  if (!hasPermission('products.view')) return
  
  loading.value = true
  try {
    // Load products dari API
    const response = await $api('/products')
    products.value = response.data
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

// Meta untuk route protection
definePage({
  meta: {
    requiresAuth: true,
    requiredPermissions: ['products.view'], // User harus punya permission ini
    // atau bisa pakai:
    // requiresRole: 'admin', // User harus punya role ini
  }
})

// Load data when component mounted
onMounted(() => {
  loadProducts()
})
</script>

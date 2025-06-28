<template>
  <slot
    v-if="canShow"
    :hasPermission="hasPermission"
    :hasRole="hasRole"
    :canAccess="canAccess"
  />
  <slot
    v-else-if="$slots.fallback"
    name="fallback"
  />
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  // Permission-based visibility
  permission: {
    type: String,
    default: null
  },
  permissions: {
    type: Array,
    default: () => []
  },
  
  // Role-based visibility
  role: {
    type: String,
    default: null
  },
  roles: {
    type: Array,
    default: () => []
  },
  
  // Advanced conditions
  requireAll: {
    type: Boolean,
    default: false
  },
  
  // Show when user doesn't have permission (inverse)
  inverse: {
    type: Boolean,
    default: false
  }
})

const { hasPermission, hasRole, canAccess } = useAuth()

const canShow = computed(() => {
  let hasAccess = true

  // Check single permission
  if (props.permission) {
    hasAccess = hasPermission(props.permission)
  }
  
  // Check multiple permissions
  if (props.permissions.length > 0) {
    if (props.requireAll) {
      hasAccess = props.permissions.every(permission => hasPermission(permission))
    } else {
      hasAccess = canAccess(props.permissions)
    }
  }
  
  // Check single role
  if (props.role) {
    hasAccess = hasAccess && hasRole(props.role)
  }
  
  // Check multiple roles
  if (props.roles.length > 0) {
    const roleAccess = props.roles.some(role => hasRole(role))
    hasAccess = hasAccess && roleAccess
  }

  // Return inverse if specified
  return props.inverse ? !hasAccess : hasAccess
})
</script>

<!-- 
Usage Examples:

1. Show only if user has specific permission:
<PermissionGuard permission="users.create">
  <VBtn>Create User</VBtn>
</PermissionGuard>

2. Show only if user has any of these permissions:
<PermissionGuard :permissions="['products.view', 'products.edit']">
  <VBtn>Manage Products</VBtn>
</PermissionGuard>

3. Show only if user has ALL permissions:
<PermissionGuard :permissions="['products.view', 'products.edit']" require-all>
  <VBtn>Full Product Management</VBtn>
</PermissionGuard>

4. Show only if user has specific role:
<PermissionGuard role="admin">
  <VBtn>Admin Panel</VBtn>
</PermissionGuard>

5. Show only if user has role AND permission:
<PermissionGuard role="admin" permission="users.delete">
  <VBtn color="error">Delete User</VBtn>
</PermissionGuard>

6. Show fallback content if no access:
<PermissionGuard permission="users.create">
  <VBtn>Create User</VBtn>
  <template #fallback>
    <VAlert type="warning">You don't have permission to create users</VAlert>
  </template>
</PermissionGuard>

7. Show content when user DOESN'T have permission (inverse):
<PermissionGuard permission="admin.access" inverse>
  <VAlert type="info">Limited user access</VAlert>
</PermissionGuard>
-->

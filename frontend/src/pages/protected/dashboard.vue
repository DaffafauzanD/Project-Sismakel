<script setup>
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN'],
    permissions: ['user.read'],
  },
})

const { 
  user, 
  isAuthenticated, 
  userRole, 
  userPermissions, 
  isAdmin, 
  isUser, 
  isModerator,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  logout 
} = useAuth()

// Example permissions and roles for demonstration
const examplePermissions = [
  'user.read',
  'user.write',
  'user.delete',
  'admin.read',
  'admin.write',
  'admin.delete',
  'moderator.read',
  'moderator.write'
]

const exampleRoles = ['ADMIN', 'user', 'moderator']

// Check specific permissions
const canReadUsers = computed(() => hasPermission('user.read'))
const canWriteUsers = computed(() => hasPermission('user.write'))
const canDeleteUsers = computed(() => hasPermission('user.delete'))
const canReadAdmin = computed(() => hasPermission('admin.read'))

// Check multiple permissions
const canManageUsers = computed(() => hasAllPermissions(['user.read', 'user.write']))
const canDoAnyUserAction = computed(() => hasAnyPermission(['user.read', 'user.write', 'user.delete']))

// Check roles
const isAdminOrModerator = computed(() => hasAnyRole(['ADMIN', 'moderator']))
const isOnlyUser = computed(() => hasRole('user'))

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <div class="protected-page">
    <VContainer fluid>
      <!-- Header -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h4 mb-2">Dashboard</h2>
                <p class="text-body-1 text-medium-emphasis">
                  This page demonstrates role and permission checking
                </p>
              </div>
              <VBtn
                color="error"
                variant="outlined"
                @click="handleLogout"
              >
                Logout
              </VBtn>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- User Information -->
      <VRow>
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>User Information</VCardTitle>
            <VCardText>
              <VList>
                <VListItem>
                  <VListItemTitle>Username</VListItemTitle>
                  <VListItemSubtitle>{{ user?.username || 'N/A' }}</VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Role</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip
                      :color="isAdmin ? 'error' : isModerator ? 'warning' : 'success'"
                      size="small"
                    >
                      {{ userRole || 'N/A' }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Authentication Status</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip
                      :color="isAuthenticated ? 'success' : 'error'"
                      size="small"
                    >
                      {{ isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>User Permissions</VCardTitle>
            <VCardText>
              <div v-if="userPermissions && userPermissions.length > 0">
                <VChip
                  v-for="permission in userPermissions"
                  :key="permission"
                  color="primary"
                  size="small"
                  class="ma-1"
                >
                  {{ permission }}
                </VChip>
              </div>
              <div v-else class="text-medium-emphasis">
                No permissions assigned
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Role-based Content -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>Role-based Content</VCardTitle>
            <VCardText>
              <!-- Admin Only Content -->
              <div v-if="isAdmin" class="mb-6">
                <VAlert
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  <VAlertTitle>Admin Panel</VAlertTitle>
                  This content is only visible to administrators.
                </VAlert>
                <VBtn
                  color="error"
                  variant="outlined"
                  class="me-2"
                >
                  Delete All Users
                </VBtn>
                <VBtn
                  color="warning"
                  variant="outlined"
                >
                  System Settings
                </VBtn>
              </div>

              <!-- Moderator Content -->
              <div v-if="isModerator" class="mb-6">
                <VAlert
                  type="warning"
                  variant="tonal"
                  class="mb-4"
                >
                  <VAlertTitle>Moderator Panel</VAlertTitle>
                  This content is visible to moderators and admins.
                </VAlert>
                <VBtn
                  color="warning"
                  variant="outlined"
                  class="me-2"
                >
                  Moderate Content
                </VBtn>
                <VBtn
                  color="info"
                  variant="outlined"
                >
                  User Reports
                </VBtn>
              </div>

              <!-- User Content -->
              <div v-if="isUser" class="mb-6">
                <VAlert
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <VAlertTitle>User Dashboard</VAlertTitle>
                  This content is visible to all authenticated users.
                </VAlert>
                <VBtn
                  color="primary"
                  variant="outlined"
                  class="me-2"
                >
                  My Profile
                </VBtn>
                <VBtn
                  color="success"
                  variant="outlined"
                >
                  My Settings
                </VBtn>
              </div>

              <!-- Admin or Moderator Content -->
              <div v-if="isAdminOrModerator" class="mb-6">
                <VAlert
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  <VAlertTitle>Management Panel</VAlertTitle>
                  This content is visible to admins and moderators.
                </VAlert>
                <VBtn
                  color="success"
                  variant="outlined"
                >
                  Manage Users
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Permission-based Content -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>Permission-based Content</VCardTitle>
            <VCardText>
              <!-- User Read Permission -->
              <div v-if="canReadUsers" class="mb-4">
                <VAlert
                  type="info"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>User Read Permission</VAlertTitle>
                  You have permission to read user data.
                </VAlert>
                <VBtn
                  color="info"
                  variant="outlined"
                  class="me-2"
                >
                  View Users
                </VBtn>
              </div>

              <!-- User Write Permission -->
              <div v-if="canWriteUsers" class="mb-4">
                <VAlert
                  type="success"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>User Write Permission</VAlertTitle>
                  You have permission to modify user data.
                </VAlert>
                <VBtn
                  color="success"
                  variant="outlined"
                  class="me-2"
                >
                  Edit Users
                </VBtn>
              </div>

              <!-- User Delete Permission -->
              <div v-if="canDeleteUsers" class="mb-4">
                <VAlert
                  type="error"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>User Delete Permission</VAlertTitle>
                  You have permission to delete users.
                </VAlert>
                <VBtn
                  color="error"
                  variant="outlined"
                  class="me-2"
                >
                  Delete Users
                </VBtn>
              </div>

              <!-- Admin Read Permission -->
              <div v-if="canReadAdmin" class="mb-4">
                <VAlert
                  type="warning"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>Admin Read Permission</VAlertTitle>
                  You have permission to read admin data.
                </VAlert>
                <VBtn
                  color="warning"
                  variant="outlined"
                  class="me-2"
                >
                  View Admin Panel
                </VBtn>
              </div>

              <!-- Multiple Permissions Check -->
              <div v-if="canManageUsers" class="mb-4">
                <VAlert
                  type="primary"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>User Management</VAlertTitle>
                  You have both read and write permissions for users.
                </VAlert>
                <VBtn
                  color="primary"
                  variant="outlined"
                  class="me-2"
                >
                  Full User Management
                </VBtn>
              </div>

              <!-- Any Permission Check -->
              <div v-if="canDoAnyUserAction" class="mb-4">
                <VAlert
                  type="secondary"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>User Actions Available</VAlertTitle>
                  You have at least one user-related permission.
                </VAlert>
                <VBtn
                  color="secondary"
                  variant="outlined"
                  class="me-2"
                >
                  User Actions
                </VBtn>
              </div>

              <!-- No Permissions -->
              <div v-if="!canReadUsers && !canWriteUsers && !canDeleteUsers" class="mb-4">
                <VAlert
                  type="warning"
                  variant="tonal"
                  class="mb-2"
                >
                  <VAlertTitle>Limited Access</VAlertTitle>
                  You don't have any user-related permissions.
                </VAlert>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Permission Testing -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>Permission Testing</VCardTitle>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <h4 class="text-h6 mb-3">Test Individual Permissions</h4>
                  <div
                    v-for="permission in examplePermissions"
                    :key="permission"
                    class="d-flex align-center justify-space-between mb-2 pa-2 rounded"
                    :class="hasPermission(permission) ? 'bg-success-lighten-5' : 'bg-grey-lighten-5'"
                  >
                    <span>{{ permission }}</span>
                    <VChip
                      :color="hasPermission(permission) ? 'success' : 'grey'"
                      size="small"
                    >
                      {{ hasPermission(permission) ? 'Yes' : 'No' }}
                    </VChip>
                  </div>
                </VCol>

                <VCol cols="12" md="6">
                  <h4 class="text-h6 mb-3">Test Role Access</h4>
                  <div
                    v-for="role in exampleRoles"
                    :key="role"
                    class="d-flex align-center justify-space-between mb-2 pa-2 rounded"
                    :class="hasRole(role) ? 'bg-success-lighten-5' : 'bg-grey-lighten-5'"
                  >
                    <span>{{ role }}</span>
                    <VChip
                      :color="hasRole(role) ? 'success' : 'grey'"
                      size="small"
                    >
                      {{ hasRole(role) ? 'Yes' : 'No' }}
                    </VChip>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.protected-page {
  padding: 20px 0;
}

.bg-success-lighten-5 {
  background-color: rgb(var(--v-theme-success) / 0.05);
}

.bg-grey-lighten-5 {
  background-color: rgb(var(--v-theme-grey) / 0.05);
}
</style> 
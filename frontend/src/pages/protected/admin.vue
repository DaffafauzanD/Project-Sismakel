<script setup>
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN'],
    permissions: ['admin.read', 'admin.write'],
  },
})

const { user, isAuthenticated, userRole, userPermissions, isAdmin } = useAuth()

const adminStats = ref({
  totalUsers: 1250,
  activeUsers: 890,
  newUsersThisMonth: 45,
  systemHealth: 'Good',
  lastBackup: '2024-01-15 02:30:00',
})

const recentActivities = ref([
  {
    id: 1,
    action: 'User created',
    user: 'john.doe@example.com',
    timestamp: '2024-01-15 10:30:00',
    status: 'success'
  },
  {
    id: 2,
    action: 'System backup',
    user: 'System',
    timestamp: '2024-01-15 02:30:00',
    status: 'success'
  },
  {
    id: 3,
    action: 'User deleted',
    user: 'admin@example.com',
    timestamp: '2024-01-14 15:45:00',
    status: 'warning'
  },
  {
    id: 4,
    action: 'Permission updated',
    user: 'admin@example.com',
    timestamp: '2024-01-14 14:20:00',
    status: 'info'
  },
])

const getStatusColor = (status) => {
  switch (status) {
    case 'success': return 'success'
    case 'warning': return 'warning'
    case 'error': return 'error'
    case 'info': return 'info'
    default: return 'grey'
  }
}
</script>

<template>
  <div class="admin-page">
    <VContainer fluid>
      <!-- Header -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h4 mb-2">Admin Dashboard</h2>
                <p class="text-body-1 text-medium-emphasis">
                  System administration and management panel
                </p>
              </div>
              <VChip
                color="error"
                size="large"
              >
                ADMIN ONLY
              </VChip>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- Admin Stats -->
      <VRow>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-primary">
                {{ adminStats.totalUsers }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Total Users
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-success">
                {{ adminStats.activeUsers }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Active Users
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-info">
                {{ adminStats.newUsersThisMonth }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                New Users (This Month)
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-warning">
                {{ adminStats.systemHealth }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                System Health
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Admin Actions -->
      <VRow>
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>System Management</VCardTitle>
            <VCardText>
              <VBtn
                block
                color="primary"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-account-multiple</VIcon>
                Manage Users
              </VBtn>
              <VBtn
                block
                color="warning"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-shield-account</VIcon>
                Manage Roles & Permissions
              </VBtn>
              <VBtn
                block
                color="info"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-database</VIcon>
                Database Management
              </VBtn>
              <VBtn
                block
                color="success"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-backup-restore</VIcon>
                System Backup
              </VBtn>
              <VBtn
                block
                color="error"
                variant="outlined"
              >
                <VIcon start>mdi-cog</VIcon>
                System Settings
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>Quick Actions</VCardTitle>
            <VCardText>
              <VBtn
                block
                color="primary"
                class="mb-2"
              >
                <VIcon start>mdi-plus</VIcon>
                Create New User
              </VBtn>
              <VBtn
                block
                color="warning"
                class="mb-2"
              >
                <VIcon start>mdi-export</VIcon>
                Export User Data
              </VBtn>
              <VBtn
                block
                color="info"
                class="mb-2"
              >
                <VIcon start>mdi-chart-line</VIcon>
                View Analytics
              </VBtn>
              <VBtn
                block
                color="success"
                class="mb-2"
              >
                <VIcon start>mdi-bell</VIcon>
                System Notifications
              </VBtn>
              <VBtn
                block
                color="secondary"
              >
                <VIcon start>mdi-help-circle</VIcon>
                Admin Help
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Recent Activities -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>Recent System Activities</VCardTitle>
            <VCardText>
              <VTable>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="activity in recentActivities"
                    :key="activity.id"
                  >
                    <td>{{ activity.action }}</td>
                    <td>{{ activity.user }}</td>
                    <td>{{ activity.timestamp }}</td>
                    <td>
                      <VChip
                        :color="getStatusColor(activity.status)"
                        size="small"
                      >
                        {{ activity.status }}
                      </VChip>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- System Information -->
      <VRow>
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>System Information</VCardTitle>
            <VCardText>
              <VList>
                <VListItem>
                  <VListItemTitle>Last Backup</VListItemTitle>
                  <VListItemSubtitle>{{ adminStats.lastBackup }}</VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Current User</VListItemTitle>
                  <VListItemSubtitle>{{ user?.username || 'N/A' }}</VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>User Role</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip
                      color="error"
                      size="small"
                    >
                      {{ userRole }}
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
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
  padding: 20px 0;
}
</style> 
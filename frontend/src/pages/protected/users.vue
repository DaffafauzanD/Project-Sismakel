<script setup>
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'moderator'],
    permissions: ['user.read', 'user.write'],
  },
})

const { user, isAuthenticated, userRole, userPermissions, isAdmin, isModerator } = useAuth()

const users = ref([
  {
    id: 1,
    username: 'john.doe',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'jane.smith',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-02',
    lastLogin: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'System Administrator',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15 11:45:00'
  },
  {
    id: 4,
    username: 'bob.wilson',
    email: 'bob.wilson@example.com',
    fullName: 'Bob Wilson',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-03',
    lastLogin: '2024-01-10 14:20:00'
  }
])

const searchQuery = ref('')
const selectedRole = ref('all')
const selectedStatus = ref('all')

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getRoleColor = (role) => {
  switch (role) {
    case 'ADMIN': return 'error'
    case 'moderator': return 'warning'
    case 'user': return 'success'
    default: return 'grey'
  }
}

const getStatusColor = (status) => {
  return status === 'active' ? 'success' : 'error'
}

const handleEditUser = (user) => {
  console.log('Edit user:', user)
}

const handleDeleteUser = (user) => {
  console.log('Delete user:', user)
}

const handleToggleStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}
</script>

<template>
  <div class="users-page">
    <VContainer fluid>
      <!-- Header -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h4 mb-2">User Management</h2>
                <p class="text-body-1 text-medium-emphasis">
                  Manage system users and their permissions
                </p>
              </div>
              <VBtn
                v-if="isAdmin"
                color="primary"
                prepend-icon="mdi-plus"
              >
                Add New User
              </VBtn>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- Filters -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardText>
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="searchQuery"
                    label="Search Users"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VSelect
                    v-model="selectedRole"
                    label="Filter by Role"
                    :items="[
                      { title: 'All Roles', value: 'all' },
                      { title: 'Admin', value: 'ADMIN' },
                      { title: 'Moderator', value: 'moderator' },
                      { title: 'User', value: 'user' }
                    ]"
                    variant="outlined"
                    density="compact"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VSelect
                    v-model="selectedStatus"
                    label="Filter by Status"
                    :items="[
                      { title: 'All Status', value: 'all' },
                      { title: 'Active', value: 'active' },
                      { title: 'Inactive', value: 'inactive' }
                    ]"
                    variant="outlined"
                    density="compact"
                  />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Users Table -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              Users ({{ filteredUsers.length }} of {{ users.length }})
            </VCardTitle>
            <VCardText>
              <VTable>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="user in filteredUsers"
                    :key="user.id"
                  >
                    <td>
                      <div>
                        <div class="font-weight-medium">{{ user.fullName }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ user.username }} • {{ user.email }}
                        </div>
                      </div>
                    </td>
                    <td>
                      <VChip
                        :color="getRoleColor(user.role)"
                        size="small"
                      >
                        {{ user.role }}
                      </VChip>
                    </td>
                    <td>
                      <VChip
                        :color="getStatusColor(user.status)"
                        size="small"
                      >
                        {{ user.status }}
                      </VChip>
                    </td>
                    <td>{{ user.createdAt }}</td>
                    <td>{{ user.lastLogin }}</td>
                    <td>
                      <VBtn
                        size="small"
                        color="primary"
                        variant="outlined"
                        class="me-1"
                        @click="handleEditUser(user)"
                      >
                        <VIcon size="small">mdi-pencil</VIcon>
                      </VBtn>
                      <VBtn
                        size="small"
                        :color="user.status === 'active' ? 'warning' : 'success'"
                        variant="outlined"
                        class="me-1"
                        @click="handleToggleStatus(user)"
                      >
                        <VIcon size="small">
                          {{ user.status === 'active' ? 'mdi-pause' : 'mdi-play' }}
                        </VIcon>
                      </VBtn>
                      <VBtn
                        v-if="isAdmin && user.role !== 'ADMIN'"
                        size="small"
                        color="error"
                        variant="outlined"
                        @click="handleDeleteUser(user)"
                      >
                        <VIcon size="small">mdi-delete</VIcon>
                      </VBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Statistics -->
      <VRow>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-primary">
                {{ users.filter(u => u.role === 'user').length }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Regular Users
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-warning">
                {{ users.filter(u => u.role === 'moderator').length }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Moderators
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-error">
                {{ users.filter(u => u.role === 'ADMIN').length }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Administrators
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" md="3">
          <VCard>
            <VCardText class="text-center">
              <div class="text-h4 font-weight-bold text-success">
                {{ users.filter(u => u.status === 'active').length }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Active Users
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Current User Info -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle>Current User Information</VCardTitle>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VList>
                    <VListItem>
                      <VListItemTitle>Current User</VListItemTitle>
                      <VListItemSubtitle>{{ user?.username || 'N/A' }}</VListItemSubtitle>
                    </VListItem>
                    <VListItem>
                      <VListItemTitle>User Role</VListItemTitle>
                      <VListItemSubtitle>
                        <VChip
                          :color="getRoleColor(userRole)"
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
                </VCol>
                <VCol cols="12" md="6">
                  <VCard variant="outlined">
                    <VCardTitle class="text-h6">User Permissions</VCardTitle>
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
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.users-page {
  padding: 20px 0;
}
</style> 
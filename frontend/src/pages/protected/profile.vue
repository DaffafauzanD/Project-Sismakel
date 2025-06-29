<script setup>
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'default',
    requiresAuth: true,
    roles: ['ADMIN', 'user', 'moderator'],
    permissions: ['user.read'],
  },
})

const { user, isAuthenticated, userRole, userPermissions } = useAuth()

const profileData = ref({
  username: user.value?.username || '',
  email: user.value?.email || '',
  fullName: user.value?.fullName || '',
  phone: user.value?.phone || '',
  address: user.value?.address || '',
})

const isEditing = ref(false)

const handleEdit = () => {
  isEditing.value = true
}

const handleSave = () => {
  // Here you would typically save the profile data to the backend
  console.log('Saving profile:', profileData.value)
  isEditing.value = false
}

const handleCancel = () => {
  // Reset form data
  profileData.value = {
    username: user.value?.username || '',
    email: user.value?.email || '',
    fullName: user.value?.fullName || '',
    phone: user.value?.phone || '',
    address: user.value?.address || '',
  }
  isEditing.value = false
}
</script>

<template>
  <div class="profile-page">
    <VContainer fluid>
      <!-- Header -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h4 mb-2">User Profile</h2>
                <p class="text-body-1 text-medium-emphasis">
                  Manage your account information and settings
                </p>
              </div>
              <VBtn
                v-if="!isEditing"
                color="primary"
                @click="handleEdit"
              >
                Edit Profile
              </VBtn>
              <div v-else>
                <VBtn
                  color="success"
                  class="me-2"
                  @click="handleSave"
                >
                  Save
                </VBtn>
                <VBtn
                  color="secondary"
                  variant="outlined"
                  @click="handleCancel"
                >
                  Cancel
                </VBtn>
              </div>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- Profile Information -->
      <VRow>
        <VCol cols="12" md="8">
          <VCard>
            <VCardTitle>Personal Information</VCardTitle>
            <VCardText>
              <VForm>
                <VRow>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileData.username"
                      label="Username"
                      :readonly="!isEditing"
                      variant="outlined"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileData.email"
                      label="Email"
                      type="email"
                      :readonly="!isEditing"
                      variant="outlined"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileData.fullName"
                      label="Full Name"
                      :readonly="!isEditing"
                      variant="outlined"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="profileData.phone"
                      label="Phone Number"
                      :readonly="!isEditing"
                      variant="outlined"
                      density="compact"
                    />
                  </VCol>
                  <VCol cols="12">
                    <VTextarea
                      v-model="profileData.address"
                      label="Address"
                      :readonly="!isEditing"
                      variant="outlined"
                      density="compact"
                      rows="3"
                    />
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="4">
          <VCard>
            <VCardTitle>Account Status</VCardTitle>
            <VCardText>
              <VList>
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
                <VListItem>
                  <VListItemTitle>User Role</VListItemTitle>
                  <VListItemSubtitle>
                    <VChip
                      color="primary"
                      size="small"
                    >
                      {{ userRole || 'N/A' }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle>Permissions</VListItemTitle>
                  <VListItemSubtitle>
                    <div class="mt-2">
                      <VChip
                        v-for="permission in userPermissions"
                        :key="permission"
                        color="secondary"
                        size="small"
                        class="ma-1"
                      >
                        {{ permission }}
                      </VChip>
                    </div>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>

          <VCard class="mt-4">
            <VCardTitle>Quick Actions</VCardTitle>
            <VCardText>
              <VBtn
                block
                color="primary"
                variant="outlined"
                class="mb-2"
              >
                Change Password
              </VBtn>
              <VBtn
                block
                color="warning"
                variant="outlined"
                class="mb-2"
              >
                Two-Factor Authentication
              </VBtn>
              <VBtn
                block
                color="info"
                variant="outlined"
              >
                Account Settings
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding: 20px 0;
}
</style> 
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

const { user, isAuthenticated, userRole } = useAuth()

const settings = ref({
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
  },
  preferences: {
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
  }
})

const handleSaveSettings = () => {
  // Here you would typically save settings to the backend
  console.log('Saving settings:', settings.value)
}

const handleResetSettings = () => {
  // Reset to default settings
  settings.value = {
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'UTC',
    }
  }
}
</script>

<template>
  <div class="settings-page">
    <VContainer fluid>
      <!-- Header -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VCardTitle class="d-flex justify-space-between align-center">
              <div>
                <h2 class="text-h4 mb-2">Settings</h2>
                <p class="text-body-1 text-medium-emphasis">
                  Manage your account settings and preferences
                </p>
              </div>
              <div>
                <VBtn
                  color="secondary"
                  variant="outlined"
                  class="me-2"
                  @click="handleResetSettings"
                >
                  Reset
                </VBtn>
                <VBtn
                  color="primary"
                  @click="handleSaveSettings"
                >
                  Save Settings
                </VBtn>
              </div>
            </VCardTitle>
          </VCard>
        </VCol>
      </VRow>

      <!-- Settings Tabs -->
      <VRow>
        <VCol cols="12">
          <VCard>
            <VTabs
              v-model="activeTab"
              grow
            >
              <VTab value="notifications">
                <VIcon start>mdi-bell</VIcon>
                Notifications
              </VTab>
              <VTab value="privacy">
                <VIcon start>mdi-shield</VIcon>
                Privacy
              </VTab>
              <VTab value="security">
                <VIcon start>mdi-lock</VIcon>
                Security
              </VTab>
              <VTab value="preferences">
                <VIcon start>mdi-cog</VIcon>
                Preferences
              </VTab>
            </VTabs>

            <VWindow v-model="activeTab">
              <!-- Notifications Tab -->
              <VWindowItem value="notifications">
                <VCardText>
                  <h3 class="text-h6 mb-4">Notification Settings</h3>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.notifications.email"
                        label="Email Notifications"
                        color="primary"
                      />
                      <p class="text-caption text-medium-emphasis">
                        Receive notifications via email
                      </p>
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.notifications.push"
                        label="Push Notifications"
                        color="primary"
                      />
                      <p class="text-caption text-medium-emphasis">
                        Receive push notifications in browser
                      </p>
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.notifications.sms"
                        label="SMS Notifications"
                        color="primary"
                      />
                      <p class="text-caption text-medium-emphasis">
                        Receive notifications via SMS
                      </p>
                    </VCol>
                  </VRow>
                </VCardText>
              </VWindowItem>

              <!-- Privacy Tab -->
              <VWindowItem value="privacy">
                <VCardText>
                  <h3 class="text-h6 mb-4">Privacy Settings</h3>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="settings.privacy.profileVisibility"
                        label="Profile Visibility"
                        :items="['public', 'private', 'friends']"
                        variant="outlined"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.privacy.showEmail"
                        label="Show Email Address"
                        color="primary"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.privacy.showPhone"
                        label="Show Phone Number"
                        color="primary"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VWindowItem>

              <!-- Security Tab -->
              <VWindowItem value="security">
                <VCardText>
                  <h3 class="text-h6 mb-4">Security Settings</h3>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.security.twoFactorAuth"
                        label="Two-Factor Authentication"
                        color="primary"
                      />
                      <p class="text-caption text-medium-emphasis">
                        Add an extra layer of security to your account
                      </p>
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="settings.security.sessionTimeout"
                        label="Session Timeout (minutes)"
                        type="number"
                        variant="outlined"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="settings.security.loginNotifications"
                        label="Login Notifications"
                        color="primary"
                      />
                      <p class="text-caption text-medium-emphasis">
                        Get notified of new login attempts
                      </p>
                    </VCol>
                  </VRow>
                </VCardText>
              </VWindowItem>

              <!-- Preferences Tab -->
              <VWindowItem value="preferences">
                <VCardText>
                  <h3 class="text-h6 mb-4">Preferences</h3>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="settings.preferences.language"
                        label="Language"
                        :items="[
                          { title: 'English', value: 'en' },
                          { title: 'Indonesian', value: 'id' },
                          { title: 'Spanish', value: 'es' },
                          { title: 'French', value: 'fr' }
                        ]"
                        variant="outlined"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="settings.preferences.theme"
                        label="Theme"
                        :items="['light', 'dark', 'auto']"
                        variant="outlined"
                        density="compact"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="settings.preferences.timezone"
                        label="Timezone"
                        :items="['UTC', 'Asia/Jakarta', 'America/New_York', 'Europe/London']"
                        variant="outlined"
                        density="compact"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VWindowItem>
            </VWindow>
          </VCard>
        </VCol>
      </VRow>

      <!-- Account Information -->
      <VRow>
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle>Account Information</VCardTitle>
            <VCardText>
              <VList>
                <VListItem>
                  <VListItemTitle>Username</VListItemTitle>
                  <VListItemSubtitle>{{ user?.username || 'N/A' }}</VListItemSubtitle>
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
            <VCardTitle>Danger Zone</VCardTitle>
            <VCardText>
              <VBtn
                block
                color="warning"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-key</VIcon>
                Change Password
              </VBtn>
              <VBtn
                block
                color="error"
                variant="outlined"
                class="mb-2"
              >
                <VIcon start>mdi-delete</VIcon>
                Delete Account
              </VBtn>
              <VBtn
                block
                color="secondary"
                variant="outlined"
              >
                <VIcon start>mdi-download</VIcon>
                Export Data
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script>
// Add this to handle the activeTab ref
const activeTab = ref('notifications')
</script>

<style lang="scss" scoped>
.settings-page {
  padding: 20px 0;
}
</style> 
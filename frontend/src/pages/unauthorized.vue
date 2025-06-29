<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()

const message = computed(() => route.query.message || 'Access Denied')
const requiredRoles = computed(() => route.query.requiredRoles || '')
const currentRole = computed(() => route.query.currentRole || '')
const requiredPermissions = computed(() => route.query.requiredPermissions || '')
const currentPermissions = computed(() => route.query.currentPermissions || '')

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}

const goToLogin = async () => {
  await logout()
}
</script>

<template>
  <div class="unauthorized-page">
    <VContainer class="fill-height">
      <VRow justify="center" align="center">
        <VCol cols="12" sm="8" md="6" lg="4">
          <VCard class="text-center pa-6">
            <!-- Error Icon -->
            <div class="mb-6">
              <VIcon
                icon="tabler-shield-lock"
                size="80"
                color="error"
                class="mb-4"
              />
            </div>

            <!-- Title -->
            <h1 class="text-h4 mb-4 text-error">
              Access Denied
            </h1>

            <!-- Message -->
            <p class="text-body-1 mb-6">
              {{ message }}
            </p>

            <!-- Role Information -->
            <div v-if="requiredRoles" class="mb-4">
              <VAlert
                type="warning"
                variant="tonal"
                class="mb-2"
              >
                <VAlertTitle>Required Roles</VAlertTitle>
                <p class="mb-1">{{ requiredRoles }}</p>
                <p v-if="currentRole" class="text-caption">
                  Your current role: {{ currentRole }}
                </p>
              </VAlert>
            </div>

            <!-- Permission Information -->
            <div v-if="requiredPermissions" class="mb-4">
              <VAlert
                type="warning"
                variant="tonal"
                class="mb-2"
              >
                <VAlertTitle>Required Permissions</VAlertTitle>
                <p class="mb-1">{{ requiredPermissions }}</p>
                <p v-if="currentPermissions" class="text-caption">
                  Your current permissions: {{ currentPermissions || 'None' }}
                </p>
              </VAlert>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex flex-column gap-3">
              <VBtn
                color="primary"
                variant="outlined"
                block
                @click="goBack"
              >
                Go Back
              </VBtn>
              
              <VBtn
                color="secondary"
                variant="outlined"
                block
                @click="goHome"
              >
                Go to Home
              </VBtn>
              
              <VBtn
                color="error"
                variant="outlined"
                block
                @click="goToLogin"
              >
                Login with Different Account
              </VBtn>
            </div>

            <!-- Help Text -->
            <div class="mt-6">
              <p class="text-caption text-medium-emphasis">
                If you believe this is an error, please contact your system administrator.
              </p>
            </div>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.unauthorized-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style> 
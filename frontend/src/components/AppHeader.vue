<script setup>
import { useConfig } from '@/composables/useConfig'
import { useAuth } from '@/composables/useAuth'

const { appTitle, isDev, enableAuth } = useConfig()
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <VAppBar>
    <VAppBarTitle>
      {{ appTitle }}
      <VChip
        v-if="isDev"
        size="small"
        color="warning"
        class="ms-2"
      >
        DEV
      </VChip>
    </VAppBarTitle>

    <VSpacer />

    <!-- User Menu -->
    <div v-if="enableAuth && isAuthenticated" class="d-flex align-center">
      <VMenu>
        <template #activator="{ props }">
          <VBtn
            v-bind="props"
            variant="text"
            class="text-none"
          >
            <VAvatar
              size="32"
              class="me-2"
            >
              {{ user?.username?.charAt(0).toUpperCase() }}
            </VAvatar>
            {{ user?.username }}
            <VIcon
              icon="tabler-chevron-down"
              class="ms-1"
            />
          </VBtn>
        </template>

        <VList>
          <VListItem @click="handleLogout">
            <VListItemTitle>
              <VIcon
                icon="tabler-logout"
                class="me-2"
              />
              Logout
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </div>
  </VAppBar>
</template> 
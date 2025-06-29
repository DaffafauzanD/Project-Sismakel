<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.push('/protected/dashboard')
})
</script>

<template>
  <div>
    <p>Redirecting to dashboard...</p>
  </div>
</template>

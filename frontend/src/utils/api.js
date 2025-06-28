import { ofetch } from 'ofetch'
import { useAuthStore } from '@/stores/auth'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  credentials: 'include', // Penting untuk cookie-based auth
  
  async onRequest({ options }) {
    // Token sudah di-handle via cookie di backend
    // Tapi tetap bisa set header jika diperlukan
    const authStore = useAuthStore()
    if (authStore.token) {
      options.headers = options.headers || {}
      options.headers.Authorization = `Bearer ${authStore.token}`
    }
  },

  async onResponseError({ response }) {
    // Handle unauthorized response
    if (response.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      
      // Redirect ke login jika tidak di halaman login
      if (process.client && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
  }
})

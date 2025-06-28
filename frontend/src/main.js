import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { useAuthStore } from '@/stores/auth'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)


// Register plugins
registerPlugins(app)

// Initialize auth state before mounting
app.mount('#app')

// Initialize auth after app is mounted
const authStore = useAuthStore()
authStore.initializeAuth()

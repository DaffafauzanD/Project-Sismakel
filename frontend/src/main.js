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

// Initialize authentication
const authStore = useAuthStore()
authStore.initAuth()

// Mount vue app
app.mount('#app')

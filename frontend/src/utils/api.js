import { ofetch } from 'ofetch'
import { useConfig } from '@/composables/useConfig'
import { getAccessToken } from '@/utils/cookies'

export const $api = ofetch.create({
  baseURL: useConfig().apiBaseUrl.value || '/v1',
  async onRequest({ options }) {
    const accessToken = getAccessToken()
    if (accessToken) {
      options.headers.append('Authorization', `Bearer ${accessToken}`)
    }
  },
  async onResponseError({ response }) {
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login if token is invalid
      const router = useRouter()
      await router.push('/login')
    }
  },
})

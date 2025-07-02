import { createFetch } from '@vueuse/core'
import { destr } from 'destr'
import { getAccessToken } from '@/utils/cookies'

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/v1',
  fetchOptions: {
    headers: {
      Accept: 'application/json',
    },
  },
  options: {
    refetch: true,
    async beforeFetch({ options }) {
      const accessToken = getAccessToken()
      if (accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }
      
      return { options }
    },
    afterFetch(ctx) {
      const { data, response } = ctx

      // Parse data if it's JSON
      let parsedData = null
      try {
        parsedData = destr(data)
      }
      catch (error) {
        // Silently handle parsing errors
      }
      
      return { data: parsedData, response }
    },
  },
})

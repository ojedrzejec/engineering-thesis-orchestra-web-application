import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TGroup } from '@/types/TGroup'

export const useGroups = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const groups = ref<TGroup[]>([])
  const loadingGroups = ref(false)

  const fetchGroups = async (orchestraId: string) => {
    loadingGroups.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/group/${orchestraId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      // if (response.status === 404) {
      //   throw new Error('Groups not found.')
      // }

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      console.log('Fetched data (groups): ', data)

      groups.value = data
      console.log('Fetched orchestra groups: ', groups.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to fetch orchestra groups.'
      console.error(baseErrorMessage, e)
      groups.value = []
    } finally {
      loadingGroups.value = false
    }
  }

  return {
    groups,
    loadingGroups,
    fetchGroups,
  }
}

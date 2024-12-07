import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'primevue/usetoast'
import type { TGroup } from '@/types/TGroup'

export const useGroups = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const groups = ref<TGroup[]>([])

  const loadingGroups = ref(false)
  const loadingNewGroupCreate = ref(false)

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

  const createNewGroup = async (orchestraId: string, groupName: string) => {
    loadingNewGroupCreate.value = true

    const postData = {
      id_orchestra: orchestraId,
      name: groupName,
    }
    console.log('postData:', JSON.stringify(postData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/group/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(postData),
      })

      if (!response) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'New group created!',
        life: 3000,
      })
    } catch (error) {
      const baseErrorMessage = 'Failed to create a new group.'
      console.error(baseErrorMessage, error)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingNewGroupCreate.value = false
    }
  }

  return {
    groups,
    loadingGroups,
    loadingNewGroupCreate,
    fetchGroups,
    createNewGroup,
  }
}

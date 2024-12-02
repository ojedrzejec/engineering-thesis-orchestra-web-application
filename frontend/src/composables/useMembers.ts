import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import type { TOrchestraMember } from '@/types/TOrchestraMember'

export const useMembers = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const allAppUsersNotInOrchestra = ref([])
  const allOrchestraMembers = ref<TOrchestraMember[]>([])
  const loadingAllAppUsersNotInOrchestra = ref(false)
  const loadingAllOrchestraMembers = ref(false)
  const loadingOrchestraMembersUpdate = ref(false)

  const fetchAllAppUsersNotInOrchestra = async (orchestraId: string) => {
    loadingAllAppUsersNotInOrchestra.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-member/all-app-users-not-in-orchestra/${orchestraId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      // console.log('Fetched all app users (data): ', data)

      allAppUsersNotInOrchestra.value = data
      // console.log(
      //   'Fetched all app users (allAppUsersNotInOrchestra.value): ',
      //   allAppUsersNotInOrchestra.value,
      // )
    } catch (e) {
      const baseErrorMessage = 'Failed to fetch all app users.'
      console.error(baseErrorMessage, e)
      allAppUsersNotInOrchestra.value = []
    } finally {
      loadingAllAppUsersNotInOrchestra.value = false
    }
  }

  const fetchAllOrchestraMembers = async (orchestraId: string) => {
    loadingAllOrchestraMembers.value = true

    try {
    } finally {
      loadingAllOrchestraMembers.value = false
    }
  }

  const UpdateAllOrchestraMembers = async () => {
    loadingOrchestraMembersUpdate.value = true

    try {
    } finally {
      loadingOrchestraMembersUpdate.value = false
    }
  }

  return {
    allAppUsersNotInOrchestra,
    allOrchestraMembers,
    loadingAllAppUsersNotInOrchestra,
    loadingAllOrchestraMembers,
    loadingOrchestraMembersUpdate,
    fetchAllAppUsersNotInOrchestra,
    fetchAllOrchestraMembers,
    UpdateAllOrchestraMembers,
  }
}

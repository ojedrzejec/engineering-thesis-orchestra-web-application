import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import type { TManager } from '@/types/TManager'
import type { TPlayer } from '@/types/TPlayer'

export const useManageAccess = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const orchestraManagers = ref<TManager[]>([])
  const orchestraPlayers = ref<TPlayer[]>([])
  const loadingOrchestraManagers = ref(false)
  const loadingOrchestraPlayers = ref(false)

  const fetchOrchestraManagers = async (orchestraId: string) => {
    loadingOrchestraManagers.value = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-member/orchestra-managers/${orchestraId}`,
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
      console.log('fetchOrchestraManagers (data): ', data)

      const counter = ref(1)
      orchestraManagers.value = data.map((manager: TManager) => ({
        ...manager,
        profile_picture: manager.profile_picture || null,
        value: `${counter.value++}`,
      }))
      console.log(
        'fetchOrchestraManagers (orchestraManagers.value): ',
        orchestraManagers.value,
      )
    } catch (error) {
      const baseErrorMessage = 'Failed to fetch orchestra managers.'
      console.error(baseErrorMessage, error)
      orchestraManagers.value = []
    } finally {
      loadingOrchestraManagers.value = false
    }
  }

  const fetchOrchestraPlayers = async (orchestraId: string) => {
    loadingOrchestraPlayers.value = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-member/orchestra-players/${orchestraId}`,
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
      console.log('fetchOrchestraPlayers (data): ', data)

      orchestraPlayers.value = data
      console.log(
        'fetchOrchestraPlayers (orchestraPlayers.value): ',
        orchestraPlayers.value,
      )
    } catch (error) {
      const baseErrorMessage = 'Failed to fetch orchestra players.'
      console.error(baseErrorMessage, error)
      orchestraPlayers.value = []
    } finally {
      loadingOrchestraPlayers.value = false
    }
  }

  const setPlayerAsManager = () => {}
  const revertManagerToPlayer = () => {}

  return {
    orchestraManagers,
    orchestraPlayers,
    loadingOrchestraManagers,
    loadingOrchestraPlayers,
    fetchOrchestraManagers,
    fetchOrchestraPlayers,
    setPlayerAsManager,
    revertManagerToPlayer,
  }
}

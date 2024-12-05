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
  const loadingPlayerToManager = ref(false)
  const loadingManagerToPlayer = ref(false)

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

  const updatePlayerToManager = async (
    orchestraId: string,
    selectedPlayerId: string,
  ) => {
    loadingPlayerToManager.value = true

    const updateData = {
      id_orchestra: orchestraId,
      id_orchestra_member: selectedPlayerId,
      is_manager: true,
    }
    console.log('updateData:', JSON.stringify(updateData, null, 2))

    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-orchestra-member/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify(updateData),
        },
      )

      if (!response) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Orchestra member set as manager!',
        life: 3000,
      })
    } catch (error) {
      const baseErrorMessage = 'Failed to set orchestra member as manager.'
      console.error(baseErrorMessage, error)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingPlayerToManager.value = false
    }
  }

  const updateManagerToPlayer = async (
    orchestraId: string,
    managerId: string,
  ) => {
    loadingManagerToPlayer.value = true

    const updateData = {
      id_orchestra: orchestraId,
      id_orchestra_member: managerId,
      is_manager: false,
    }
    console.log('updateData:', JSON.stringify(updateData, null, 2))

    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-orchestra-member/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify(updateData),
        },
      )

      if (!response) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'Orchestra member reverted to player!',
        life: 3000,
      })
    } catch (error) {
      const baseErrorMessage = 'Failed to set orchestra member as player.'
      console.error(baseErrorMessage, error)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingManagerToPlayer.value = false
    }
  }

  return {
    orchestraManagers,
    orchestraPlayers,
    loadingOrchestraManagers,
    loadingOrchestraPlayers,
    loadingPlayerToManager,
    loadingManagerToPlayer,
    fetchOrchestraManagers,
    fetchOrchestraPlayers,
    updatePlayerToManager,
    updateManagerToPlayer,
  }
}

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TPieceOfMusic } from '@/types/TPieceOfMusic'

export const usePiecesOfMusicView = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const memberGroup = ref<{ id: string; name: string } | null>(null)
  const loadingMemberGroup = ref(false)
  const piecesOfMusic = ref<TPieceOfMusic[]>([])
  const loadingPiecesOfMusic = ref(false)

  const fetchMemberGroup = async () => {
    loadingMemberGroup.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/repertoire/member-group/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      console.log('Fetched data (memberGroup): ', data)

      memberGroup.value = data
      console.log('Fetched memberGroup: ', memberGroup.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to fetch memberGroup.'
      console.error(baseErrorMessage, e)
      memberGroup.value = null
    } finally {
      loadingMemberGroup.value = false
    }
  }

  const fetchPiecesOfMusic = async (orchestraId: string) => {
    loadingPiecesOfMusic.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/repertoire/member-group/${orchestraId}`,
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
      console.log('Fetched data (available piecesOfMusic): ', data)
      piecesOfMusic.value = data
      console.log('Fetched available piecesOfMusic: ', piecesOfMusic.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = "Failed to fetch orchestra's piecesOfMusic."
      console.error(baseErrorMessage, e)
      piecesOfMusic.value = []
    } finally {
      loadingPiecesOfMusic.value = false
    }
  }

  return {
    memberGroup,
    piecesOfMusic,
    loadingMemberGroup,
    loadingPiecesOfMusic,
    fetchMemberGroup,
    fetchPiecesOfMusic,
  }
}

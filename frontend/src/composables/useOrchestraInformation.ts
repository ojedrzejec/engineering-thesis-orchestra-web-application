import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import { type TOrchestra } from '@/types/TOrchestra'

export const useOrchestraInformation = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const orchestraInformation = ref<TOrchestra | null>(null)
  const loadingOrchestraInformation = ref(false)

  const fetchOrchestraInformation = async (orchestraId: string) => {
    loadingOrchestraInformation.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/orchestra/${orchestraId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()

      console.log('Fetched orchestra information: ', data)

      orchestraInformation.value = {
        id: data.id,
        name: data.name,
        logo: data.logo,
        email: data.email,
        address: data.address,
        history: data.history,
        facebookUrl: data.facebook_url,
        instagramUrl: data.instagram_url,
        youtubeUrl: data.youtube_url,
      }
    } catch (error) {
      const baseErrorMessage = 'Failed to fetch orchestra information.'
      console.error(baseErrorMessage, error)
      orchestraInformation.value = null
    } finally {
      loadingOrchestraInformation.value = false
    }
  }

  // TODO
  // const updateOrchestra = async (orchestra: TOrchestra) => {}

  return {
    orchestraInformation,
    loadingOrchestraInformation,
    fetchOrchestraInformation,
    // TODO
    // updateOrchestra,
  }
}

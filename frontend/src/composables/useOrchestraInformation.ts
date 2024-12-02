import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import { type TOrchestra } from '@/types/TOrchestra'
import { useToast } from 'primevue/usetoast'

export const useOrchestraInformation = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const orchestraInformation = ref<TOrchestra | null>(null)
  const loadingOrchestraInformation = ref(false)
  const loadingOrchestraInformationUpdate = ref(false)

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

  const updateOrchestraInformation = async (orchestra: TOrchestra) => {
    loadingOrchestraInformationUpdate.value = true

    const updateData = {
      id: orchestra.id,
      name: orchestra.name,
      logo: orchestra.logo,
      email: orchestra.email,
      address: orchestra.address,
      history: orchestra.history,
      facebook_url: orchestra.facebookUrl,
      instagram_url: orchestra.instagramUrl,
      youtube_url: orchestra.youtubeUrl,
    }
    console.log('updateData:', JSON.stringify(updateData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/orchestra/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: `${orchestra.name} updated successfully!`,
        life: 3000,
      })
    } catch (error) {
      const baseErrorMessage = 'Failed to update orchestra.'
      console.error(baseErrorMessage, error)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingOrchestraInformationUpdate.value = false
    }
  }

  return {
    orchestraInformation,
    loadingOrchestraInformation,
    loadingOrchestraInformationUpdate,
    fetchOrchestraInformation,
    updateOrchestraInformation,
  }
}

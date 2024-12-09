import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TConcert } from '@/types/TConcert'

export const useConcerts = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const concerts = ref<TConcert[]>([])
  const loadingConcerts = ref(false)
  const loadingCreateConcert = ref(false)

  const fetchConcerts = async (orchestraId: string) => {
    loadingConcerts.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/concert/${orchestraId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      const data = await response.json()
      console.log('Fetched data (available groups): ', data)

      concerts.value = data

      console.log('Fetched available groups: ', concerts.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to fetch available orchestra groups.'
      console.error(baseErrorMessage, e)
      concerts.value = []
    } finally {
      loadingConcerts.value = false
    }
  }

  const createConcert = async (orchestraId: string, concert: TConcert) => {
    loadingCreateConcert.value = true

    const formData = {
      id_orchestra: orchestraId,
      name: concert.name,
      date_and_time: concert.date_and_time,
      place: concert.place,
      reservation_url: concert.reservation_url,
      description: concert.description,
      graphic: concert.graphic,
    }
    console.log('formData:', JSON.stringify(formData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/concert/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: 'New orchestra created!',
        life: 3000,
      })
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to post a new concert.'
      console.error(baseErrorMessage, e)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingCreateConcert.value = false
    }
  }

  return {
    concerts,
    loadingConcerts,
    loadingCreateConcert,
    fetchConcerts,
    createConcert,
  }
}

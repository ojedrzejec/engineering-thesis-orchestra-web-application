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
  const loadingMemberAvailabilityUpdate = ref(false)

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
      console.log('Fetched data (available concerts): ', data)

      concerts.value = data

      console.log('Fetched available concerts: ', concerts.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = "Failed to fetch available orchestra's concerts."
      console.error(baseErrorMessage, e)
      concerts.value = []
    } finally {
      loadingConcerts.value = false
    }
  }

  const createConcert = async (orchestraId: string, concert: TConcert) => {
    loadingCreateConcert.value = true

    const date = concert.date_and_time
      ?.toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('.')

    const time = concert.date_and_time
      ?.toISOString()
      .split('T')[1]
      .split('.')[0]
      .slice(0, 5)

    const formData = {
      id_orchestra: orchestraId,
      name: concert.name,
      date: date,
      time: time,
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
        detail: 'New concert created!',
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

  const updateMemberAvailability = async (
    concert: TConcert,
    isAvailable: boolean,
  ) => {
    loadingMemberAvailabilityUpdate.value = true

    const updateData = {
      id_concert: concert.id,
      is_available: isAvailable,
    }
    console.log('updateData:', JSON.stringify(updateData, null, 2))

    try {
      const response = await fetch(`${API_BASE_URL}/concert/`, {
        method: 'PUT',
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
        summary: 'Success!',
        detail: `Your availability updated successfully for \"${concert.name}\"!`,
        life: 3000,
      })
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to update your availability.'
      console.error(baseErrorMessage, e)
      toast.add({
        severity: 'error',
        summary: baseErrorMessage,
        life: 3000,
      })
    } finally {
      loadingMemberAvailabilityUpdate.value = false
    }
  }

  return {
    concerts,
    loadingConcerts,
    loadingCreateConcert,
    loadingMemberAvailabilityUpdate,
    fetchConcerts,
    createConcert,
    updateMemberAvailability,
  }
}

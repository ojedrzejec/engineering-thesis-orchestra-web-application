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
      console.log('Fetched data (available concerts): ', data)

      concerts.value = data

      // if (data.value && Array.isArray(data.value)) {
      //   concerts.value = data.value.map((c: TConcert) => {
      //     return {
      //       id: c.id,
      //       id_orchestra: c.id_orchestra,
      //       name: c.name,
      //       date_and_time: new Date(c.date + 'T' + c.time),
      //       date: c.date ? new Date(c.date) : null,
      //       time: c.time ? new Date(c.time) : null,
      //       place: c.place,
      //       description: c.description,
      //       reservation_url: c.reservation_url,
      //       graphic: c.graphic,
      //     }
      //   })
      // } else {
      //   concerts.value = []
      // }

      console.log('Fetched available concerts: ', concerts.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to fetch available orchestra concerts.'
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

    // console.log('date:', date)
    // console.log('time:', time)

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

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

    const date = concert.date_and_time?.toISOString().split('T')[0].split('-')

    // add 1 day to the date
    if (date) {
      const year = parseInt(date[0])
      const month = parseInt(date[1])
      const day = parseInt(date[2])
      console.log('year: ', year)
      console.log('month: ', month)
      console.log('day: ', day)

      const dateObject = new Date(year, month - 1, day)
      dateObject.setDate(dateObject.getDate() + 1)

      date[0] = dateObject.getFullYear().toString()
      date[1] = (dateObject.getMonth() + 1).toString()
      date[2] = dateObject.getDate().toString()
    }

    let time = concert.date_and_time
      ?.toISOString()
      .split('T')[1]
      .split('.')[0]
      .slice(0, 5)

    // add 1 hour to the time
    if (time) {
      const timeArray = time.split(':')
      const hour = parseInt(timeArray[0])
      const minute = parseInt(timeArray[1])
      console.log('hour: ', hour)
      console.log('minute: ', minute)

      if (minute === 0) {
        time = `${hour + 1}:00`
      } else {
        time = `${hour + 1}:${minute}`
      }
    }

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

  return {
    concerts,
    loadingConcerts,
    loadingCreateConcert,
    fetchConcerts,
    createConcert,
  }
}

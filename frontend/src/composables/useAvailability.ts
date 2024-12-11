import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TConcert } from '@/types/TConcert'
import type { TAvailability } from '@/types/TAvailability'

export const useAvailability = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const memberAvailability = ref<TAvailability[]>([])
  const loadingMemberAvailabilityFetch = ref(false)
  const loadingMemberAvailabilityUpdate = ref(false)

  const fetchMemberAvailability = async (orchestraId: string) => {
    loadingMemberAvailabilityFetch.value = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/concert/member-availability/${orchestraId}`,
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
      console.log('Fetched data (memberAvailability): ', data)

      memberAvailability.value = data
      console.log('Fetched member availability: ', memberAvailability.value)
    } catch (e) {
      console.error(e)
      const baseErrorMessage = 'Failed to fetch member availability.'
      console.error(baseErrorMessage, e)
      memberAvailability.value = []
    } finally {
      loadingMemberAvailabilityFetch.value = false
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
    memberAvailability,
    loadingMemberAvailabilityFetch,
    loadingMemberAvailabilityUpdate,
    fetchMemberAvailability,
    updateMemberAvailability,
  }
}

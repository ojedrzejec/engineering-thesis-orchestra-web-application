import { ref } from 'vue'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import type { TOrchestraInstrument } from '@/types/TOrchestraInstrument'

export const useInstruments = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const instrumentsInOrchestra = ref<TOrchestraInstrument[]>([])
  const loadingInstrumentsInOrchestra = ref(false)

  const fetchInstrumentsInOrchestra = async (orchestraId: string) => {
    loadingInstrumentsInOrchestra.value = true

    try {
      const response = await fetch(
        `${API_BASE_URL}/instrument/get-all-by-orchestra-id/${orchestraId}`,
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

      const data = (await response.json()) as {
        id: string
        id_orchestra_member: string
        name: string
        email: string
        first_name: string
        last_name: string
      }[]

      console.log('Fetched data: ', data)

      instrumentsInOrchestra.value = data.map(
        ({ id, id_orchestra_member, name, email, first_name, last_name }) => ({
          instrumentId: id,
          instrumentName: name,
          orchestraMemberId: id_orchestra_member,
          orchestraMemberEmail: email,
          orchestraMemberFirstName: first_name,
          orchestraMemberLastName: last_name,
        }),
      )
      console.log(
        'Fetched orchestra instruments: ',
        instrumentsInOrchestra.value,
      )
    } catch (error) {
      const baseErrorMessage = 'Failed to fetch orchestra instruments.'
      console.error(baseErrorMessage, error)
      instrumentsInOrchestra.value = []
    } finally {
      loadingInstrumentsInOrchestra.value = false
    }
  }

  return {
    instrumentsInOrchestra,
    loadingInstrumentsInOrchestra,
    fetchInstrumentsInOrchestra,
  }
}

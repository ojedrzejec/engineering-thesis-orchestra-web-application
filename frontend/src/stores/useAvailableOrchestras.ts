import { API_BASE_URL } from '@/constants/config'
import { defineStore, storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from './useAuthStore'
import type { TOrchestraAccess } from '@/types/TOrchestraAccess'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'

export const useAvailableOrchestrasStore = defineStore(
  'availbale-orchestras',
  () => {
    const authStore = useAuthStore()
    const { token } = storeToRefs(authStore)

    const loadingAvailableOrchestras = ref(false)
    const selectedOrchestraId = ref<string | null>(null)
    const availableOrchestras = ref<TOrchestraAccess[]>([])

    const selectedOrchestraDetails = computed<TOrchestraAccess | null>(
      () =>
        availableOrchestras.value.find(
          orchestra => orchestra.id === selectedOrchestraId.value,
        ) || null,
    )

    const setSelectedOrchestraId = (id: string) => {
      selectedOrchestraId.value = id
    }

    const fetchAvailableOrchestras = async () => {
      loadingAvailableOrchestras.value = true
      try {
        if (!token.value) {
          throw new Error('No token available.')
        }

        const response = await fetch(
          `${API_BASE_URL}/orchestra-orchestra-member`,
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
          name: string
          is_owner: boolean
          is_manager: boolean
        }[]

        availableOrchestras.value = data.map(
          ({ id, name, is_manager, is_owner }) => ({
            id,
            name,
            accessType: is_owner
              ? EOrchestraRole.OWNER
              : is_manager
                ? EOrchestraRole.MANAGER
                : EOrchestraRole.PLAYER,
          }),
        )
      } catch (e) {
        const baseErrorMessage = 'Failed to fetch available orchestras.'
        console.error(baseErrorMessage, e)
        // TODO: ??? toast ???
      } finally {
        loadingAvailableOrchestras.value = false
      }
    }

    onMounted(() => {
      console.log('Łeeeeeee fetchAvailableOrchestras')
      fetchAvailableOrchestras()
    })

    return {
      selectedOrchestraId,
      selectedOrchestraDetails,
      availableOrchestras,
      loadingAvailableOrchestras,
      setSelectedOrchestraId,
      fetchAvailableOrchestras,
    }
  },
)

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import type { TManager } from '@/types/TManager'
import type { TPlayer } from '@/types/TPlayer'

export const useManageAccess = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const orchestraManagers = ref<TManager[]>([])
  const orchestraPlayers = ref<TPlayer[]>([])
  const loadingOrchestraManagers = ref(false)
  const loadingOrchestraPlayers = ref(false)

  const fetchOrchestraManagers = () => {}
  const fetchOrchestraPlayers = () => {}
  const setPlayerAsManager = () => {}
  const revertManagerToPlayer = () => {}

  return {
    orchestraManagers,
    orchestraPlayers,
    loadingOrchestraManagers,
    loadingOrchestraPlayers,
    fetchOrchestraManagers,
    fetchOrchestraPlayers,
    setPlayerAsManager,
    revertManagerToPlayer,
  }
}

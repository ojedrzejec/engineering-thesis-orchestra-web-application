import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY_TOKEN = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)

  const isSignedIn = computed(() => !!token.value)

  const setToken = (newValue: string) => {
    token.value = newValue
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, newValue)
  }

  const removeToken = () => {
    token.value = null
    localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN)
  }

  // Persist the token across page refreshes
  const tokenFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN)
  if (tokenFromLocalStorage) {
    token.value = tokenFromLocalStorage
  }

  return {
    isSignedIn,
    setToken,
    removeToken,
  }
})

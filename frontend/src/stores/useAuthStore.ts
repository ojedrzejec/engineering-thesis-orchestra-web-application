import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY_TOKEN = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (newValue: string) => {
    console.log('Setting token:', newValue)
    token.value = newValue
    localStorage.setItem(LOCAL_STORAGE_KEY_TOKEN, newValue)
  }

  const getToken = () => token.value

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
    isLoggedIn,
    setToken,
    getToken,
    removeToken,
  }
})

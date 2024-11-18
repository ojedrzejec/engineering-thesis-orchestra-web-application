import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY_TOKEN = 'token'
const LOCAL_STORAGE_KEY_ID = 'id'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const id = ref<string | null>(null)

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

  const setId = (newValue: string) => {
    id.value = newValue
    localStorage.setItem(LOCAL_STORAGE_KEY_ID, newValue)
  }

  const getId = () => {
    if (!id.value) {
      id.value = localStorage.getItem(LOCAL_STORAGE_KEY_ID)
    }
    return id.value
  }

  const removeId = () => {
    id.value = null
    localStorage.removeItem(LOCAL_STORAGE_KEY_ID)
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
    setId,
    getId,
    removeId,
  }
})

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/constants/config'

const LOCAL_STORAGE_KEY_TOKEN = 'token'
const LOCAL_STORAGE_KEY_ID = 'id'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const id = ref<string | null>(null)
  const userProfile = ref<any>(null)

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

  const fetchUserProfileData = async () => {
    if (!token.value) {
      throw new Error('No token available')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orchestra-member/single`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${token.value}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile data')
      }

      userProfile.value = await response.json()
      console.log('Fetched user profile:', userProfile.value)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      userProfile.value = null
    }
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
    fetchUserProfileData,
    userProfile,
  }
})

import { API_BASE_URL } from '@/constants/config'
import { initOrchestraMember } from '@/constants/initOrchestraMember'
import type { TOrchestraMember } from '@/types/TOrchestraMember'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const LOCAL_STORAGE_KEY_TOKEN = 'token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const userProfile = ref<TOrchestraMember>(initOrchestraMember)

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

  const fetchUserProfileData = async () => {
    if (!token.value) {
      throw new Error('No token available')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orchestra-member/single`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile data')
      }

      const text = await response.text()
      if (!text) {
        throw new Error('Empty response body')
      }

      const data = JSON.parse(text)
      console.log('Fetched profile data:', data)

      userProfile.value.firstName = data.first_name
      userProfile.value.lastName = data.last_name
      userProfile.value.instruments = data.instruments.map(
        (instrument: string) => ({ name: instrument }),
      )
      userProfile.value.phone = data.phone
      userProfile.value.dateOfBirth = new Date(data.birth_date)
      userProfile.value.isStudent = data.are_you_student
      userProfile.value.university = data.university
      userProfile.value.description = data.description
      userProfile.value.profilePicture = data.profile_picture || null // Ensure profilePicture is set correctly

      console.log('User profile:', userProfile.value)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      userProfile.value = initOrchestraMember
    }
  }

  // Persist the token across page refreshes
  const tokenFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN)
  if (tokenFromLocalStorage) {
    token.value = tokenFromLocalStorage
  }

  return {
    token,
    isLoggedIn,
    setToken,
    getToken,
    removeToken,
    fetchUserProfileData,
    userProfile,
  }
})

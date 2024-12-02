import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import type { TMember } from '@/types/TMember'

export const useMembers = () => {
  const authStore = useAuthStore()
  const { token } = storeToRefs(authStore)

  const toast = useToast()

  const allAppUsersNotInOrchestra = ref([])
  const allOrchestraMembers = ref<TMember[]>([])
  const loadingAllAppUsersNotInOrchestra = ref(false)
  const loadingAllOrchestraMembers = ref(false)
  const loadingOrchestraMembersUpdate = ref(false)

  const fetchAllAppUsersNotInOrchestra = async (orchestraId: string) => {
    loadingAllAppUsersNotInOrchestra.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-member/all-app-users-not-in-orchestra/${orchestraId}`,
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
      // console.log('Fetched all app users (data): ', data)

      allAppUsersNotInOrchestra.value = data
      // console.log(
      //   'Fetched all app users (allAppUsersNotInOrchestra.value): ',
      //   allAppUsersNotInOrchestra.value,
      // )
    } catch (e) {
      const baseErrorMessage = 'Failed to fetch all app users.'
      console.error(baseErrorMessage, e)
      allAppUsersNotInOrchestra.value = []
    } finally {
      loadingAllAppUsersNotInOrchestra.value = false
    }
  }

  const fetchAllOrchestraMembers = async (orchestraId: string) => {
    loadingAllOrchestraMembers.value = true
    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-member/all-orchestra-members/${orchestraId}`,
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
      console.log('Fetched data: ', data)

      allOrchestraMembers.value = data.map((orchestraMember: any) => ({
        id: orchestraMember.id,
        email: orchestraMember.email,
        firstName: orchestraMember.first_name,
        lastName: orchestraMember.last_name,
        phone: orchestraMember.phone,
        dateOfBirth: new Date(orchestraMember.birth_date)
          .toISOString()
          .split('T')[0]
          .split('-')
          .reverse()
          .join('.'),
        isStudent: orchestraMember.are_you_student,
        university: orchestraMember.university,
        profilePicture: orchestraMember.profile_picture || null,
        description: orchestraMember.description,
        instruments: orchestraMember.instruments,
        accessType: orchestraMember.is_owner
          ? EOrchestraRole.OWNER
          : orchestraMember.is_manager
            ? EOrchestraRole.MANAGER
            : EOrchestraRole.PLAYER,
      }))

      // // convert instruments string array to string of instruments
      // allOrchestraMembers.value.forEach(orchestraMember => {
      //   if (Array.isArray(orchestraMember.instruments)) {
      //     orchestraMember.instruments = orchestraMember.instruments.join(', ')
      //   }
      // })

      console.log('Fetched orchestra members: ', allOrchestraMembers)
      console.log(
        'Fetched orchestra members VALUE: ',
        allOrchestraMembers.value,
      )
    } catch (error) {
      console.error('Failed to fetch orchestra members: ', error)
      allOrchestraMembers.value = []
    } finally {
      loadingAllOrchestraMembers.value = false
    }
  }

  const UpdateAllOrchestraMembers = async () => {
    loadingOrchestraMembersUpdate.value = true

    try {
    } finally {
      loadingOrchestraMembersUpdate.value = false
    }
  }

  return {
    allAppUsersNotInOrchestra,
    allOrchestraMembers,
    loadingAllAppUsersNotInOrchestra,
    loadingAllOrchestraMembers,
    loadingOrchestraMembersUpdate,
    fetchAllAppUsersNotInOrchestra,
    fetchAllOrchestraMembers,
    UpdateAllOrchestraMembers,
  }
}

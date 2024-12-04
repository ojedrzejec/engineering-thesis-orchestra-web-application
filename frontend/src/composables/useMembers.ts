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

      console.log('Fetched orchestra members: ', allOrchestraMembers.value)
    } catch (e) {
      const baseErrorMessage = 'Failed to fetch orchestra members.'
      console.error(baseErrorMessage, e)
      allOrchestraMembers.value = []
    } finally {
      loadingAllOrchestraMembers.value = false
    }
  }

  const updateAllOrchestraMembers = async (
    selectedOrchestraId: string,
    foundOrchestraMember: { id: string; email: string },
  ) => {
    loadingOrchestraMembersUpdate.value = true

    const postData = {
      id_orchestra: selectedOrchestraId,
      id_orchestra_member: foundOrchestraMember.id,
      is_owner: false,
      is_manager: false,
    }
    console.log('postData: ', JSON.stringify(postData, null, 2))

    try {
      const response = await fetch(
        `${API_BASE_URL}/orchestra-orchestra-member/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify(postData),
        },
      )

      if (!response.ok) {
        throw new Error('Response not ok.')
      }

      toast.add({
        severity: 'success',
        summary: `The member ${foundOrchestraMember.email} added successfully!`,
        detail: 'Check the orchestra member details!',
        life: 3000,
      })
    } catch (e) {
      const baseErrorMessage = 'Failed to update orchestra members.'
      console.error(baseErrorMessage, e)

      toast.add({
        severity: 'error',
        summary: 'Adding failed.',
        detail: baseErrorMessage,
        life: 3000,
      })
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
    updateAllOrchestraMembers,
  }
}

import { defineStore } from 'pinia';
import { API_BASE_URL } from '@/constants/config';
import { ref } from 'vue';
import { useAuthStore } from './useAuthStore';
import { useOrchestraStore } from './useOrchestraStore';
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole';

export const useOrchestraMemberStore = defineStore('orchestraMember', () => {
  const authStore = useAuthStore()
  const orchestraStore = useOrchestraStore()
  const allEmailsNotAssignedToSelectedOrchestra = ref<string[]>([]);
  const loadingFetchingAllUsers = ref<boolean>(false)
  const allOrchestraMembersOfOrchestra = ref([]);
  const loadingFetchingOrchestraMembers = ref<boolean>(false)

  const fetchEmailsOfAllUsersNotAssignedToSelectedOrchestra = async () => {
    loadingFetchingAllUsers.value = true

    const token = authStore.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orchestra-member/all-not-assigned-to-selected-orchestra/${orchestraStore.selectedOrchestra?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.msg || 'API error';
        allEmailsNotAssignedToSelectedOrchestra.value = [];
        console.error('API error: ', errorMessage);
        throw new Error(`${errorMessage}`);
      }

      allEmailsNotAssignedToSelectedOrchestra.value = await response.json()
      console.log('Fetched all emails: ', allEmailsNotAssignedToSelectedOrchestra.value)
    
    } catch (error) {
      console.error('Failed to fetch all users: ', error)
      allEmailsNotAssignedToSelectedOrchestra.value = []
    } finally {
      loadingFetchingAllUsers.value = false
    }
  }

  const fetchAllOrchestraMembersOfOrchestraWithRoles = async () => {
    loadingFetchingOrchestraMembers.value = true

    const token = authStore.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orchestra-member/all-assigned-to-selected-orchestra/${orchestraStore.selectedOrchestra?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.msg || 'API error';
        allOrchestraMembersOfOrchestra.value = [];
        console.error('API error: ', errorMessage);
        throw new Error(`${errorMessage}`);
      }

      const data = await response.json()
      console.log('Fetched data: ', data)

      allOrchestraMembersOfOrchestra.value = data.map((orchestraMember: any) => (
        {
          id: orchestraMember.id,
          email: orchestraMember.email,
          firstName: orchestraMember.first_name,
          lastName: orchestraMember.last_name,
          phone: orchestraMember.phone,
          dateOfBirth: new Date(orchestraMember.birth_date).toISOString().split('T')[0].split('-').reverse().join('.'),
          isStudent: orchestraMember.are_you_student,
          university: orchestraMember.university,
          profilePicture: orchestraMember.profile_picture || null,
          description: orchestraMember.description,
          instruments: orchestraMember.instruments,
          accessType: orchestraMember.is_owner ? EOrchestraRole.OWNER : (orchestraMember.is_manager ? EOrchestraRole.MANAGER : EOrchestraRole.PLAYER),
        }
      ))

      console.log('Fetched orchestra members: ', allOrchestraMembersOfOrchestra)
      console.log('Fetched orchestra members VALUE: ', allOrchestraMembersOfOrchestra.value)

    } catch (error) {
      console.error('Failed to fetch orchestra members: ', error)
      allOrchestraMembersOfOrchestra.value = []
    } finally {
      loadingFetchingOrchestraMembers.value = false
    }
  }


  return {
    allEmailsNotAssignedToSelectedOrchestra,
    loadingFetchingAllUsers,
    fetchEmailsOfAllUsersNotAssignedToSelectedOrchestra,

    allOrchestraMembersOfOrchestra,
    loadingFetchingOrchestraMembers,
    fetchAllOrchestraMembersOfOrchestraWithRoles,
  }
});

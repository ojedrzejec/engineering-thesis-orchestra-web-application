import { defineStore } from 'pinia';
import { API_BASE_URL } from '@/constants/config';
import { ref } from 'vue';
import { useAuthStore } from './useAuthStore';
import { useOrchestraStore } from './useOrchestraStore';
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole';

export const useOrchestraMemberStore = defineStore('orchestraMember', () => {
  const authStore = useAuthStore()
  const orchestraStore = useOrchestraStore()
  const allEmailsNotAssignedToSelectedOrchestra = ref<string[]>([]);
  const loadingFetchingAllUsers = ref<boolean>(false)

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


  return {
    allEmailsNotAssignedToSelectedOrchestra,
    loadingFetchingAllUsers,
    fetchEmailsOfAllUsersNotAssignedToSelectedOrchestra,
  }
});

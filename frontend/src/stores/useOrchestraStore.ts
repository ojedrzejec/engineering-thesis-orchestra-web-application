import { API_BASE_URL } from '@/constants/config';
import type { TOrchestra } from '@/types/TOrchestra';
import type { TOrchestraAccess } from '@/types/TOrchestraAccess';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './useAuthStore';
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole';

export const useOrchestraStore = defineStore('orchestra', () => {
    const authStore = useAuthStore()
    const availableOrchestras = ref<TOrchestraAccess[]>([])
    const selectedOrchestra = ref<TOrchestra | null>(null)
    const loading = ref<boolean>(false)
    
    const fetchOrchestras = async () => {
        loading.value = true
        try {
            const token = authStore.getToken();
            if (!token) {
                throw new Error('No token available');
            }
    
            console.log('Token:', token); // Log the token
    
            const response = await fetch(`${API_BASE_URL}/orchestra-orchestra-member`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error:', errorData);
                availableOrchestras.value = [];
                return;
            }
    
            const data = await response.json()
            console.log('Fetched orchestras:', data)
            if (Array.isArray(data)) {
                availableOrchestras.value = data.map((orchestra: any) => ({
                    id: orchestra.id,
                    name: orchestra.name,
                    accessType: orchestra.is_owner ? EOrchestraRole.OWNER : (orchestra.is_manager ? EOrchestraRole.MANAGER : EOrchestraRole.PLAYER),
                }));
            } else {
                availableOrchestras.value = [];
                console.error('API response is not an array:', data);
            }
        } catch (error) {
            console.error('Failed to fetch orchestras:', error)
            availableOrchestras.value = []
        } finally {
            loading.value = false
        }
    }
    
    const selectOrchestra = (orchestra: TOrchestra) => {
        selectedOrchestra.value = orchestra;
    };
    
    return {
        availableOrchestras,
        fetchOrchestras,
        selectOrchestra,
    };
});
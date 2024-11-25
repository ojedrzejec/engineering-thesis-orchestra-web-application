import { API_BASE_URL } from '@/constants/config';
import type { TOrchestraAccess } from '@/types/TOrchestraAccess';
import type { TOrchestra } from '@/types/TOrchestra';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './useAuthStore';
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole';

export const useOrchestraStore = defineStore('orchestra', () => {
    const authStore = useAuthStore()
    const availableOrchestras = ref<TOrchestraAccess[]>([])
    const selectedOrchestra = ref<TOrchestra | null>(null)
    const orchestraToUpdate = ref<TOrchestra | null>(null)
    const loading = ref<boolean>(false)
    const loadingSelectedOrchestra = ref<boolean>(false)
    
    const fetchOrchestras = async () => {
        loading.value = true
        try {
            const token = authStore.getToken();
            if (!token) {
                throw new Error('No token available');
            }
    
            console.log('Token: ', token);
    
            const response = await fetch(`${API_BASE_URL}/orchestra-orchestra-member`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error: ', errorData);
                availableOrchestras.value = [];
                return;
            }
    
            const data = await response.json()
            // console.log('Fetched orchestras: ', data)
            if (Array.isArray(data)) {
                availableOrchestras.value = data.map((orchestra: any) => ({
                    id: orchestra.id,
                    name: orchestra.name,
                    accessType: orchestra.is_owner ? EOrchestraRole.OWNER : (orchestra.is_manager ? EOrchestraRole.MANAGER : EOrchestraRole.PLAYER),
                }));

                selectOrchestra(selectedOrchestra.value?.id ? selectedOrchestra.value?.id : availableOrchestras.value[0]?.id)
            } else {
                availableOrchestras.value = [];
                console.error('API response is not an array: ', data);
            }
        } catch (error) {
            console.error('Failed to fetch orchestras: ', error)
            availableOrchestras.value = []
        } finally {
            loading.value = false
        }
    }

    const selectOrchestra = async (orchestraId: string) => {
        if (!orchestraId) {
            console.error('No orchestra ID provided')
            selectedOrchestra.value = null
            return
        }
        loadingSelectedOrchestra.value = true
        try {
            const response = await fetch(`${API_BASE_URL}/orchestra/${orchestraId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authStore.getToken()}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API error: ', errorData);
                selectedOrchestra.value = null;
                return;
            }

            const data = await response.json()
            selectedOrchestra.value = {
                id: data.id,
                name: data.name,
                logo: data.logo,
                email: data.email,
                address: data.address,
                history: data.history,
                facebookUrl: data.facebook_url,
                instagramUrl: data.instagram_url,
                youtubeUrl: data.youtube_url,
            };
            
            orchestraToUpdate.value = selectedOrchestra.value

            // console.log('selectOrchestra | Orchestra To Update: ', JSON.parse(JSON.stringify(orchestraToUpdate.value, null, 2)));
            // console.log('selectOrchestra | Selected orchestra: ', JSON.parse(JSON.stringify(selectedOrchestra.value, null, 2)));

        } catch (error) {
            console.error('Failed to select orchestra: ', error)
            selectedOrchestra.value = null
        } finally {
            loadingSelectedOrchestra.value = false
        }
    };

    const updateOrchestra = async (orchestra: TOrchestra) => {
        if (!orchestra) {
            console.error('No orchestra ID provided')
            selectedOrchestra.value = null
            return
        }

        orchestraToUpdate.value = orchestra
        selectedOrchestra.value = orchestraToUpdate.value
        
        // console.log('updateOrchestra | orchestraToUpdate: ', JSON.parse(JSON.stringify(orchestraToUpdate.value, null, 2)));
        // console.log('updateOrchestra | Selected orchestra: ', JSON.parse(JSON.stringify(selectedOrchestra.value, null, 2)));
    }
    
    return {
        availableOrchestras,
        selectedOrchestra,
        orchestraToUpdate,
        fetchOrchestras,
        selectOrchestra,
        updateOrchestra,
    };
});
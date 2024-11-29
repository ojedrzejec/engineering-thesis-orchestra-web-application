<template>
<div class="manage-access-view">
  <Toast/>
  <div class="manage-access-view__title">
    <h1>Manage Access</h1>
  </div>
  <h2 class="manage-access-view__subtitle">
    MANAGERS:
  </h2>

  <div class="manage-access-view__accordion">
    <div v-if="orchestraManagers === null || orchestraManagers.length === 0">
      No managers found.
    </div>
    <div v-else>
      <!-- <pre>
        orchestra Managers:
        {{orchestraManagers ? orchestraManagers : 'No managers'}}
      </pre> -->
      <Accordion :value="['0']" multiple>
        <AccordionPanel v-for="manager in orchestraManagers" :key="manager.email" :value="manager.value">
          <AccordionHeader><Avatar :image="manager.profilePicture" size="xlarge" />{{ manager.firstName }} {{ manager.lastName }}</AccordionHeader>
          <AccordionContent>
            <div class="manage-access-view__accordion-item">
              <h4 class="m-0">First Name:</h4>
              <p class="m-0">{{ manager.firstName }}</p>
            </div>
            <div class="manage-access-view__accordion-item">
              <h4 class="m-0">Last Name:</h4>
              <p class="m-0">{{ manager.lastName }}</p>
            </div>
            <div class="manage-access-view__accordion-item">
              <h4 class="m-0">Email:</h4>
              <p class="m-0">{{ manager.email }}</p>
            </div>
            <div class="manage-access-view__accordion-item">
              <h4 class="m-0">Description:</h4>
              <p class="m-0">{{ manager.description }}</p>
            </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
  </div>
  
  <div>
    <p>
      TODO: add to each manager a bin icon / a 'remove' button to revert the manager back to a player
    </p>
  </div>

  <div class="manage-access-view__form">
    <div class="manage-access-view__form-input card flex justify-center">
      <Select 
        v-model="selectedPlayer" 
        :options="orchestraPlayers" 
        optionLabel="email" 
        :loading="loadingGettingPlayers" 
        placeholder="Select an orchestra member (player)" 
        :disabled="loadingGettingPlayers" 
        showClear 
        filter 
        class="w-full md:w-56" 
      ></Select>
    </div>
    <div>
      <Button 
        class="manage-access-view__form-button"
        @click.prevent="handleSetAsManager"
        :disabled="loadingSetting || !selectedPlayer"
        :label="loadingSetting ? 'Setting...' : 'Set as Manager'" 
      ></Button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { API_BASE_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/useAuthStore';
const authStore = useAuthStore()
import { useOrchestraStore } from '@/stores/useOrchestraStore';
const orchestraStore = useOrchestraStore()
import type { TManager } from '@/types/TManager';
import type { TPlayer } from '@/types/TPlayer';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Avatar from 'primevue/avatar';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const orchestraManagers = ref<TManager[]>([])
const loadingGettingManagers = ref(false)
const orchestraPlayers = ref<TPlayer[]>([])
const selectedPlayer = ref<TPlayer | null>(null)
const loadingGettingPlayers = ref(false)
const loadingSetting = ref(false)

onMounted( async () => {
  fetchOrchestraManagers()
  fetchOrchestraPlayers()
})

onUnmounted(() => {
  if(orchestraManagers.value === null || orchestraManagers.value.length === 0) {
    fetchOrchestraManagers()
  }

  if(orchestraPlayers.value === null || orchestraPlayers.value.length === 0) {
    fetchOrchestraPlayers()
  }
})

const fetchOrchestraManagers = async () => {
  console.log('fetchOrchestraManagers')

  loadingGettingManagers.value = true

  const token = authStore.getToken();
  if (!token) {
    throw new Error('No token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orchestra-member/orchestra-managers/${orchestraStore.selectedOrchestra?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData)
      throw new Error('Failed to fetch orchestra managers: ' + errorData.message)
    }

    const data = await response.json()
    console.log("getAllOrchestraManagerByOrchestraId: ", data)

    const counter = ref(1)
    orchestraManagers.value = data.map((manager: TManager) => ({
      ...manager,
      id: manager.id,
      email: manager.email,
      firstName: manager.first_name,
      lastName: manager.last_name,
      profilePicture: manager.profile_picture || null,
      description: manager.description,
      value: `${counter.value++}`,
    }))

  } catch (error) {
    console.error(error)
    orchestraManagers.value = []
  } finally {
    loadingGettingManagers.value = false
  }
}

const fetchOrchestraPlayers = async () => {
  console.log('fetchOrchestraPlayers')

  loadingGettingPlayers.value = true

  const token = authStore.getToken();
  if (!token) {
    throw new Error('No token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orchestra-member/orchestra-players/${orchestraStore.selectedOrchestra?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData)
      throw new Error('Failed to fetch orchestra players: ' + errorData.message)
    }

    const data = await response.json()
    console.log("getAllOrchestraPlayerByOrchestraId: ", data)
    orchestraPlayers.value = data

  } catch (error) {
    console.error(error)
    orchestraPlayers.value = []
  } finally {
    loadingGettingPlayers.value = false
  }
}

const handleSetAsManager = async () => {
  console.log('handleSetAsManager')
  
  if (!selectedPlayer.value) {
    return
  }

  const token = authStore.getToken();
  if (!token) {
    throw new Error('No token available');
  }
  
  loadingSetting.value = true

  const updateData = {
    id_orchestra: orchestraStore.selectedOrchestra?.id,
    id_orchestra_member: selectedPlayer.value.id,
  }
  console.log('updateData:', JSON.stringify(updateData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/orchestra-orchestra-member/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(updateData),
    });

    if(!response) {
      const errorData = await response.json();
      const errorMessage = errorData.msg || 'Apologies for the inconvenience. Please try again later.';
      toast.add({ severity: 'error', summary: 'Action failed: ', detail: errorMessage, life: 3000 });
      throw new Error(`Action failed: ${errorMessage}`);
    }
    
    toast.add({ severity: 'success', summary: 'Success!', detail: 'Orchestra member set as manager!', life: 3000 });

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'An error occurred during setting the orchestra member as a manager.'
  } finally {
    loadingSetting.value = false
    selectedPlayer.value = null
    fetchOrchestraManagers()
    fetchOrchestraPlayers()
  }
}
</script>

<style setup lang="scss">
.manage-access-view {
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  width: 100%;
  
  // &__title {
  //   // margin-bottom: 20px;
  //   // text-align: left;
  // }

  &__subtitle {
    color: #10b981;
  }

  &__form {
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    gap: 30px;
    max-width: 350px;
  }
  
  &__form-input {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 5px;
    min-width: 330px;
  }

  &__form-button {
    width: 100%;
    min-width: 150px;
  }

  &__accordion {
    width: 100%;
    max-width: 500px;
  }

  &__accordion-item {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 2px;
    align-items: center;
  }
}
</style>

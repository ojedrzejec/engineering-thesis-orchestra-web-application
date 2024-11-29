<template>
<div class="manage-access-view">
  <div class="manage-access-view__title">
    <h1>Manage Access</h1>
  </div>

  <h2>MANAGERS:</h2>

  <pre>
    orchestraManagers:
    {{orchestraManagers ? orchestraManagers : 'No managers'}}
  </pre>

  <div class="manage-access-view__accordion">
    <!-- <Accordion value="0"> -->
    <Accordion :value="['0']" multiple>
      <AccordionPanel v-for="manager in orchestraManagers" :key="manager.email" :value="manager.value">
        <AccordionHeader>{{ manager.email }}</AccordionHeader>
        <AccordionContent>
          <p class="m-0">{{ manager.first_name }}</p>
          <p class="m-0">{{ manager.last_name }}</p>
          <p class="m-0">{{ manager.description }}</p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
  
  <div>
    <p>
      [...] to each set manager display a 'remove' button
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
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const orchestraManagers = ref([])
const loadingGettingManagers = ref(false)
const orchestraPlayers = ref<TOrchestraMember[]>([])
const selectedPlayer = ref<TOrchestraMember | null>(null)
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
    orchestraManagers.value = data.map((manager: any) => ({
      ...manager,
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
    selectedPlayer.value = null
  }
}

const handleSetAsManager = () => {
  console.log('handleSetAsManager')
  
  if (!selectedPlayer.value) {
    return
  }

  const token = authStore.getToken();
  if (!token) {
    throw new Error('No token available');
  }
  
  loadingSetting.value = true

  try {
    // PATCH orchestra member from player to manager (is_owner = false and is_manager = true)
  } catch (error) {
    console.error(error)
  } finally {
    loadingSetting.value = false
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
}
</style>

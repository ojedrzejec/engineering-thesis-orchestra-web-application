<template>
<div class="manage-access-view">
  <div class="manage-access-view__title">
    <h1>Manage Access</h1>
  </div>

  <div>
  <div class="manage-access-view__form">
    <p>
      [X] display a list of 'players' in the orchestra in the select dropdown
    </p>
    orchestraPlayers:
    <pre>
      {{orchestraPlayers}}
    </pre>

    <div class="manage-access-view__form-input card flex justify-center">
      <Select 
        v-model="selectedPlayer" 
        :options="orchestraPlayers" 
        optionLabel="email" 
        :loading="loadingGetPlayers" 
        placeholder="Select an orchestra member (player)" 
        :disabled="loadingGetPlayers" 
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

  <div>
    <p>
      [...] button 'set as manager'
    </p>
  </div>

  <div>
    <p>
      [...] to each setted manager display a 'remove' button
    </p>
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
import { initOrchestraMember } from '@/constants/initOrchestraMember';
import Select from 'primevue/select';
import Button from 'primevue/button';

const orchestraPlayers = ref<TOrchestraMember[]>([])
const selectedPlayer = ref<TOrchestraMember | null>(null)
const loadingGetPlayers = ref(false)
const loadingSetting = ref(false)

onMounted( async () => {
  console.log('ManageAccessView mounted')
  fetchOrchestraPlayers()
})

onUnmounted(() => {
  if(orchestraPlayers.value === null || orchestraPlayers.value.length === 0) {
    fetchOrchestraPlayers()
  }
})

const fetchOrchestraPlayers = async () => {
  console.log('fetchOrchestraPlayers')

  loadingGetPlayers.value = true

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
    loadingGetPlayers.value = false
  }
}

const handleSetAsManager = () => {
  console.log('handleSetAsManager')
  if (!selectedPlayer.value) {
    return
  }

  try {

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

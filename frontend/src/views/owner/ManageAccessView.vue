<template>
<div class="manage-access-view">
  <div class="manage-access-view__title">
    <h1>Manage Access</h1>
  </div>

  <div>
    <p>
      [X] display a list of 'players' in the orchestra in the select dropdown
    </p>
    orchestraPlayers:
    <pre>
      {{orchestraPlayers}}
    </pre>
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
import { ref, onMounted } from 'vue'
import { API_BASE_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/useAuthStore';
const authStore = useAuthStore()
import { useOrchestraStore } from '@/stores/useOrchestraStore';
const orchestraStore = useOrchestraStore()
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import { initOrchestraMember } from '@/constants/initOrchestraMember';

const orchestraPlayers = ref<TOrchestraMember[]>([])
const loadingGetPlayers = ref(false)

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
</script>

<style setup lang="scss">
</style>

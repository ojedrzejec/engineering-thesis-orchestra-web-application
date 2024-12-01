<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { setSelectedOrchestraId } = availableOrchestrasStore

watch(
  () => route.params.orchestraId,
  orchestraId => {
    setSelectedOrchestraId(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ selectedOrchestraDetails?.name }}</h1>
    </div>
    <h3>My Availability in {{ selectedOrchestraId }}</h3>
    {{ route.params }}

    <pre>
      
      Display all concerts -> go to details (seperate component)

      (if one chosen, the other needs to be disabled)
      - green button "I am available"
      - red button "I cannot participate"
    </pre>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'

const route = useRoute()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraId, selectedOrchestraDetails } = storeToRefs(
  availableOrchestrasStore,
)
</script>

<style setup lang="scss"></style>

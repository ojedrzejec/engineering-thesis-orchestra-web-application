<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ selectedOrchestraDetails?.name }}</h1>
    </div>

    <div class="availability-view__content">
      <h3>My Availability in {{ selectedOrchestraId }}</h3>
      {{ route.params }}
      <pre>
        Display all concerts -> go to details (seperate component)

        (if one chosen, the other needs to be disabled)
        - green button "I am available"
        - red button "I cannot participate"
      </pre>
    </div>
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

<style setup lang="scss">
.availability-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 50px;
    width: 100%;
  }
}
</style>

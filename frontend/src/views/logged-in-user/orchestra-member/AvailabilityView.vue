<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ orchestraInformation?.name }}</h1>
    </div>
    {{ route.params }}
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrchestraInformation } from '@/composables/useOrchestraInformation'

const route = useRoute()

const { fetchOrchestraInformation, orchestraInformation } =
  useOrchestraInformation()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchOrchestraInformation(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<style setup lang="scss"></style>

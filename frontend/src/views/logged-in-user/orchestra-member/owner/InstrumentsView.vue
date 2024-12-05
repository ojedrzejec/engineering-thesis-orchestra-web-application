<template>
  <div class="instruments-view">
    <div class="instruments-view__title">
      <h1>Instruments</h1>
    </div>

    <pre>
      {{ route.params }}
    </pre>
    <pre>
      {{ { instrumentsInOrchestra } }}
    </pre>
    <ProgressSpinner v-if="loadingInstrumentsInOrchestra" />
  </div>
</template>

<script setup lang="ts">
import { useInstruments } from '@/composables/useInstruments'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'

const route = useRoute()

const {
  instrumentsInOrchestra,
  loadingInstrumentsInOrchestra,
  fetchInstrumentsInOrchestra,
} = useInstruments()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchInstrumentsInOrchestra(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<style setup lang="scss"></style>

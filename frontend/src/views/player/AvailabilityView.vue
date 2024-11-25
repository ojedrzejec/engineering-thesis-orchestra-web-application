<template>
<div class="availability-view">
    <h1>My Availability in {{ orchestraStore.selectedOrchestra?.name }}</h1>
    <h3>Orchestra id: <i>{{ orchestraStore.selectedOrchestra?.id }}</i></h3>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrchestraStore } from '@/stores/useOrchestraStore'
const orchestraStore = useOrchestraStore()

</script>

<style setup lang="scss">
</style>

<template>
  <div class="side-menu">
    <h1>Side menu</h1>

    <PanelMenu
      v-if="availableOrchestras.length && selectedOrchestraId"
      :model="panelMenuItems"
      multiple
      class="w-full md:w-80"
      :expandedKeys="{ 'owner-panel': true }"
    />
  </div>
</template>

<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import { storeToRefs } from 'pinia'
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const {
  availableOrchestras,
  loadingAvailableOrchestras,
  selectedOrchestraId,
  selectedOrchestraDetails,
} = storeToRefs(availableOrchestrasStore)

const panelMenuItems = computed<MenuItem[]>(() => {
  const panelMenuItemsBuilder: MenuItem[] = [
    {
      label: 'My Availability',
      icon: 'pi pi-calendar',
      command: () => {
        router.push({
          name: 'availability',
          params: { orchestraId: selectedOrchestraId.value },
        })
      },
    },
    {
      label: 'Pieces Of Music',
      icon: 'pi pi-play',
      command: () => {
        router.push({
          name: 'pieces-of-music',
          params: { orchestraId: selectedOrchestraId.value },
        })
      },
    },
  ]

  if (
    selectedOrchestraDetails.value?.accessType === EOrchestraRole.MANAGER ||
    selectedOrchestraDetails.value?.accessType === EOrchestraRole.OWNER
  ) {
    panelMenuItemsBuilder.push(
      {
        label: 'Orchestra Information',
        icon: 'pi pi-info',
        command: () => {
          router.push({
            name: 'orchestra-information',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
      {
        label: 'Concerts',
        icon: 'pi pi-ticket',
        command: () => {
          router.push({
            name: 'concerts',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
      {
        label: 'Members',
        icon: 'pi pi-address-book',
        command: () => {
          router.push({
            name: 'members',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
    )
  }

  if (selectedOrchestraDetails.value?.accessType === EOrchestraRole.OWNER) {
    panelMenuItemsBuilder.push(
      {
        label: 'Groups',
        icon: 'pi pi-users',
        command: () => {
          router.push({
            name: 'groups',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
      {
        label: 'Instruments',
        icon: 'pi pi-megaphone',
        command: () => {
          router.push({
            name: 'instruments',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
      {
        label: 'Repertoire',
        icon: 'pi pi-book',
        command: () => {
          router.push({
            name: 'repertoire',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
      {
        label: 'Manage Access',
        icon: 'pi pi-unlock',
        command: () => {
          router.push({
            name: 'manage-access',
            params: { orchestraId: selectedOrchestraId.value },
          })
        },
      },
    )
  }

  return panelMenuItemsBuilder
})
</script>

<style lang="scss">
// TODO
</style>

<template>
  <div class="side-menu">
    <div class="side-menu__select-orchestra-container">
      <Select
        class="side-menu__select-orchestra"
        :model-value="selectedOrchestraId"
        @update:model-value="
          $router.push({
            name: 'availability',
            params: { orchestraId: $event },
          })
        "
        :options="availableOrchestras"
        option-label="name"
        option-value="id"
        :placeholder="
          loadingAvailableOrchestras ? 'Loading orchestras' : 'Select orchestra'
        "
        :loading="loadingAvailableOrchestras"
      />

      <RouterLink :to="{ name: 'create-orchestra' }">
        <Button
          class="side-menu__create-orchestra-button"
          label="Create new orchestra"
          icon="pi pi-plus"
          size="small"
          severity="secondary"
        />
      </RouterLink>
    </div>

    <Divider />

    <div v-if="!loadingAvailableOrchestras">
      <Message v-if="!availableOrchestras.length" severity="info">
        <div class="side-menu__message-info">
          <div>
            <i class="pi pi-info-circle"></i>
          </div>
          <h3>You do not belong to any orchestra</h3>
          <div>
            Go to the top left drop down menu to create a new orchestra.
          </div>
        </div>
      </Message>

      <Message v-else-if="!selectedOrchestraId" severity="info">
        <div class="app-view__message-info">
          <div>
            <i class="pi pi-info-circle"></i>
          </div>
          <h3>Orchestra Selection</h3>
          <div>
            Go to the top left drop down menu to select the orchestra or to
            create a new one.
          </div>
        </div>
      </Message>

      <PanelMenu
        v-else
        :model="panelMenuItems"
        multiple
        class="w-full md:w-80"
        :expandedKeys="{ 'owner-panel': true }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import { storeToRefs } from 'pinia'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'

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
.side-menu {
  &__select-orchestra-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__select-orchestra {
    width: 100%;
  }

  &__create-orchestra-button {
    width: 100%;
    border: 2px solid var(--p-surface-300) !important;
  }

  &__message-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px 0;
    text-align: center;
  }
}
</style>

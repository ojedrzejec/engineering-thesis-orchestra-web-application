<template>
  <div class="app-view">
    <header>
      <Toast />

      <div class="app-view__navigation-menu-horizontal">
        <Menubar :model="menubarItems">
          <template #start>
            <svg
              width="35"
              height="40"
              viewBox="0 0 35 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-8"
            >
              <path
                d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                fill="var(--p-primary-color)"
              />
              <path
                d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                fill="var(--p-text-color)"
              />
            </svg>
          </template>
          <template #item="{ item, props, hasSubmenu, root }">
            <a v-ripple class="flex items-center" v-bind="props.action">
              <span :class="item.icon"></span>
              <span>{{ item.label }}</span>
              <Badge
                v-if="item.badge"
                :class="{ 'ml-auto': !root, 'ml-2': root }"
                :value="item.badge"
              />
              <span
                v-if="item.shortcut"
                class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
                >{{ item.shortcut }}</span
              >
              <i
                v-if="hasSubmenu"
                :class="[
                  'pi pi-angle-down ml-auto',
                  { 'pi-angle-down': root, 'pi-angle-right': !root },
                ]"
              ></i>
            </a>
          </template>
          <template #end>
            <div class="flex items-center gap-2">
              <Button
                class="w-32 sm:w-auto"
                @click.prevent="handleLoginLogoutButtonClick"
                :icon="loginLogoutIcon"
                :label="loginLogoutButtonLabel"
              ></Button>
            </div>
          </template>
        </Menubar>
      </div>
    </header>

    <div class="app-view__app-content">
      <div
        v-if="isLoggedIn && availableOrchestras.length && selectedOrchestraId"
        class="app-view__navigation-menu-vertical-left"
      >
        <PanelMenu
          :model="panelMenuItems"
          multiple
          class="w-full md:w-80"
          :expandedKeys="{ 'owner-panel': true }"
        />
      </div>

      <div
        v-else-if="
          isLoggedIn && availableOrchestras.length && !selectedOrchestraId
        "
        class="app-view__ navigation-menu-vertical-left"
      >
        <Card>
          <template #content>
            <Message severity="info">
              <div class="app-view__message-info">
                <div>
                  <i class="pi pi-info-circle"></i>
                </div>
                <h3>Orchestra Selection</h3>
                <div>
                  Go to the top left drop down menu to select the orchestra or
                  to create a new one.
                </div>
              </div>
            </Message>
          </template>
        </Card>
      </div>

      <div class="app-view__router-view">
        <RouterView />
      </div>
    </div>
    <footer></footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAvailableOrchestrasStore } from './stores/useAvailableOrchestras'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import type { MenuItem } from 'primevue/menuitem'
import PanelMenu from 'primevue/panelmenu'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

const availableOrchestrasStore = useAvailableOrchestrasStore()
const {
  availableOrchestras,
  loadingAvailableOrchestras,
  selectedOrchestraId,
  selectedOrchestraDetails,
} = storeToRefs(availableOrchestrasStore)

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const router = useRouter()

const loginLogoutButtonLabel = computed(() => {
  if (isLoggedIn.value) {
    return 'Log out'
  }

  return 'Log in'
})

const handleLoginLogoutButtonClick = () => {
  if (isLoggedIn.value) {
    authStore.removeToken()
    window.location.reload()
  }

  router.push({ name: 'login' })
}

const loginLogoutIcon = computed(() => {
  if (isLoggedIn.value) {
    return 'pi pi-sign-out'
  }

  return 'pi pi-sign-in'
})

const menubarItems = computed<MenuItem[]>(() => {
  const menuItems: MenuItem[] = []

  if (!isLoggedIn.value) {
    return menuItems
  }

  const orchestrasSubmenu: MenuItem[] = availableOrchestras.value.map(
    orchestra => ({
      label: orchestra.name,
      icon: 'pi pi-folder',
      command: () => {
        router.push({
          name: 'orchestra-information',
          params: { orchestraId: orchestra.id },
        })
      },
    }),
  )

  if (orchestrasSubmenu.length) {
    orchestrasSubmenu.push({
      separator: true,
    })
  }

  orchestrasSubmenu.push({
    label: 'Create Orchestra',
    icon: 'pi pi-plus-circle',
    command: () => {
      router.push({ name: 'create-orchestra' })
    },
  })

  menuItems.push(
    {
      label: loadingAvailableOrchestras.value
        ? 'Loading...'
        : availableOrchestras.value.length === 0
          ? 'You do not belong to any orchestra'
          : selectedOrchestraDetails.value?.name || 'Select an orchestra',
      icon: 'pi pi-folder-open',
      badge: availableOrchestras.value.length,
      items: orchestrasSubmenu,
    },
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => {
        router.push({ name: 'profile' })
      },
    },
  )

  return menuItems
})

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

<style setup lang="scss">
.app-view {
  &__navigation-menu-horizontal {
    margin: 20px;
  }

  &__app-content {
    display: flex;
    flex-direction: row;
    gap: 50px;
    margin: 20px;
  }

  &__navigation-menu-vertical-left {
    min-width: 300px;
  }

  &__router-view {
    margin: 20px;
    width: 100%;
  }

  &__message-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
}
</style>

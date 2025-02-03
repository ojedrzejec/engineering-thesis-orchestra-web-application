<template>
  <Menubar>
    <template #start>
      <div class="app-header__header-group">
        <Button
          v-if="!isDesktop && isLoggedIn"
          icon="pi pi-bars"
          severity="secondary"
          @click="$emit('mobile-menu-click')"
          rounded
        />
        <div class="app-header__header-title">Orchestra Manager</div>
      </div>
    </template>

    <template #end>
      <div class="app-header__header-group">
        <RouterLink :to="{ name: 'profile' }">
          <Button
            v-if="isLoggedIn"
            severity="secondary"
            icon="pi pi-user"
            :label="isDesktop ? 'Profile' : undefined"
          />
        </RouterLink>

        <Button
          @click.prevent="handleLoginLogoutButtonClick"
          :icon="loginLogoutIcon"
          :label="isDesktop ? loginLogoutButtonLabel : undefined"
        />
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { useWidthStore } from '@/stores/useWidthStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import Card from 'primevue/card'
import Message from 'primevue/message'
import Badge from 'primevue/badge'
import type { MenuItem } from 'primevue/menuitem'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'

defineEmits<{
  'mobile-menu-click': []
}>()

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const widthStore = useWidthStore()
const { isDesktop } = storeToRefs(widthStore)

const router = useRouter()

const loginLogoutButtonLabel = computed(() => {
  if (isLoggedIn.value) {
    return 'Log out'
  }

  return 'Log in'
})

const loginLogoutIcon = computed(() => {
  if (isLoggedIn.value) {
    return 'pi pi-sign-out'
  }

  return 'pi pi-sign-in'
})

const handleLoginLogoutButtonClick = () => {
  if (isLoggedIn.value) {
    authStore.removeToken()
    window.location.reload()
  }

  router.push({ name: 'login' })
}

const availableOrchestrasStore = useAvailableOrchestrasStore()
const {
  availableOrchestras,
  loadingAvailableOrchestras,
  selectedOrchestraId,
  selectedOrchestraDetails,
} = storeToRefs(availableOrchestrasStore)

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
          name: 'availability',
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
</script>

<style lang="scss">
.app-header {
  &__header-group {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

  &__header-title {
    font-weight: bold;

    @media (min-width: 576px) {
      font-size: 1.2rem;
    }

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  &__menu-orchestra-logo {
    width: 100%;
    max-height: 40px;
    object-fit: contain;
  }
}
</style>

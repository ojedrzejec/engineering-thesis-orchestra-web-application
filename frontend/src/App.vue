<template>
  <div class="app-view">
    <Toast />
    <header>
      <AppHeader
        class="app-view__navigation-menu-horizontal"
        @mobile-menu-click="mobileSideMenuDrawerVisible = true"
      />
    </header>

    <div class="app-view__app-content">
      <div
        v-if="isLoggedIn && isDesktop"
        class="app-view__navigation-menu-vertical-left"
      >
        <SideMenu />
      </div>

      <div class="app-view__router-view">
        <RouterView />
      </div>
    </div>

    <footer
      class="app-view__footer"
      v-if="isLoggedIn && selectedOrchestraId && orchestraInformation"
    >
      <AppFooter :orchestraInformation="orchestraInformation" />
    </footer>

    <Drawer v-model:visible="mobileSideMenuDrawerVisible" header=" ">
      <SideMenu />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAvailableOrchestrasStore } from './stores/useAvailableOrchestras'
import { useOrchestraInformation } from './composables/useOrchestraInformation'
import Toast from 'primevue/toast'
import Drawer from 'primevue/drawer'
import SideMenu from './components/SideMenu.vue'
import AppHeader from './components/AppHeader.vue'
import { useWidthStore } from './stores/useWidthStore'
import AppFooter from './components/AppFooter.vue'

const widthStore = useWidthStore()
const { isDesktop } = storeToRefs(widthStore)

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraId } = storeToRefs(availableOrchestrasStore)

const { orchestraInformation, fetchOrchestraInformation } =
  useOrchestraInformation()

const route = useRoute()

const mobileSideMenuDrawerVisible = ref(false)

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchOrchestraInformation(orchestraId.toString())
  },
  { immediate: true },
)

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
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

  &__footer {
    margin: 20px;
  }
}
</style>

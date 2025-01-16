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

      <!-- class="app-view__navigation-menu-vertical-left" -->
      <!-- <div
        v-else-if="
          isLoggedIn && availableOrchestras.length && !selectedOrchestraId
        "
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
      </div> -->

      <!-- class="app-view__navigation-menu-vertical-left" -->
      <!-- <div
        v-else-if="
          isLoggedIn && availableOrchestras.length === 0 && !selectedOrchestraId
        "
      >
        <Card>
          <template #content>
            <Message severity="info">
              <div class="app-view__message-info">
                <div>
                  <i class="pi pi-info-circle"></i>
                </div>
                <h3>You do not belong to any orchestra</h3>
                <div>
                  Go to the top left drop down menu to create a new orchestra.
                </div>
              </div>
            </Message>
          </template>
        </Card>
      </div> -->

      <div class="app-view__router-view">
        <RouterView />
      </div>
    </div>

    <footer class="app-view__footer" v-if="isLoggedIn && selectedOrchestraId">
      <Panel>
        <div class="app-view__footer-panel">
          <div class="app-view__footer-panel-column">
            <img
              alt="orchestra logo"
              :src="
                orchestraInformation?.logo ??
                'https://via.placeholder.com/640x200'
              "
              class="app-view__footer-orchestra-logo"
            />
          </div>
          <div class="app-view__footer-panel-column">
            <strong>{{ orchestraInformation?.name }}</strong>
            <div>{{ orchestraInformation?.email }}</div>
            <div>{{ orchestraInformation?.address }}</div>
          </div>

          <div class="app-view__footer-panel-column">
            <a
              v-if="orchestraInformation?.facebookUrl"
              class="app-view__link"
              :href="orchestraInformation.facebookUrl"
              target="_blank"
            >
              <i class="pi pi-facebook"></i>
              {{ orchestraInformation?.facebookUrl }}
            </a>

            <a
              v-if="orchestraInformation?.instagramUrl"
              class="app-view__link"
              :href="orchestraInformation.instagramUrl"
              target="_blank"
            >
              <i class="pi pi-instagram"></i>
              {{ orchestraInformation?.instagramUrl }}
            </a>

            <a
              v-if="orchestraInformation?.youtubeUrl"
              class="app-view__link"
              :href="orchestraInformation.youtubeUrl"
              target="_blank"
              rel="noopener"
            >
              <i class="pi pi-youtube"></i>
              {{ orchestraInformation?.youtubeUrl }}
            </a>
          </div>
        </div>
      </Panel>
    </footer>

    <Drawer v-model:visible="mobileSideMenuDrawerVisible" header=" ">
      <SideMenu />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { EOrchestraRole } from '@/constants/enums/EOrchestraRole'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAvailableOrchestrasStore } from './stores/useAvailableOrchestras'
import { useOrchestraInformation } from './composables/useOrchestraInformation'
import type { MenuItem } from 'primevue/menuitem'
import PanelMenu from 'primevue/panelmenu'
import Toast from 'primevue/toast'
import Panel from 'primevue/panel'
import Drawer from 'primevue/drawer'
import SideMenu from './components/SideMenu.vue'
import AppHeader from './components/AppHeader.vue'

const availableOrchestrasStore = useAvailableOrchestrasStore()
const {
  availableOrchestras,
  loadingAvailableOrchestras,
  selectedOrchestraId,
  selectedOrchestraDetails,
} = storeToRefs(availableOrchestrasStore)

const {
  orchestraInformation,
  loadingOrchestraInformation,
  fetchOrchestraInformation,
} = useOrchestraInformation()

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

const router = useRouter()

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

<style setup lang="scss">
.app-view {
  &__header-title {
    font-weight: bold;

    @media (min-width: 576px) {
      font-size: 1.2rem;
    }

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  &__header-group {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }

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

  &__footer-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;
  }

  &__footer-panel-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__menu-orchestra-logo {
    width: 100%;
    max-height: 40px;
    object-fit: contain;
  }

  &__footer-orchestra-logo {
    width: 100%;
    max-height: 80px;
    object-fit: contain;
  }

  &__link {
    color: var(--p-primary-color);
    :visited {
      color: var(--p-primary-color);
    }
    text-decoration: none;
  }
}
</style>

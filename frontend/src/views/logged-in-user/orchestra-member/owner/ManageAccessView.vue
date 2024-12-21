<template>
  <div class="manage-access-view">
    <div class="manage-access-view__title">
      <h1>Manage Access</h1>
    </div>

    <div class="manage-access-view__content">
      <h2 class="manage-access-view__subtitle">MANAGERS:</h2>
      <ProgressSpinner v-if="loadingOrchestraManagers" />
      <div
        v-if="!loadingOrchestraManagers"
        class="manage-access-view__accordion"
      >
        <div
          v-if="orchestraManagers === null || orchestraManagers.length === 0"
        >
          No managers found.
        </div>
        <div v-else>
          <!-- <pre>
          orchestra Managers:
          {{orchestraManagers ? orchestraManagers : 'No managers'}}
        </pre> -->
          <Accordion :value="['0']" multiple>
            <AccordionPanel
              v-for="manager in orchestraManagers"
              :key="manager.id ?? ''"
              :value="manager.value"
            >
              <!-- <div class="manage-access-view__accordion-position"> -->
              <AccordionHeader
                ><Avatar
                  :image="manager.profile_picture ?? undefined"
                  size="xlarge"
                />{{ manager.first_name }}
                {{ manager.last_name }}
              </AccordionHeader>
              <!-- <i class="pi pi-trash manage-access-view__trash-icon" @click="revertManagerToPlayer(manager)"></i> -->
              <Button
                class="manage-access-view__trash-icon"
                icon="pi pi-trash"
                severity="danger"
                variant="outlined"
                rounded
                aria-label="Cancel"
                @click="revertManagerToPlayer(manager)"
                :loading="loadingManagerToPlayer"
                :disabled="loadingManagerToPlayer"
              ></Button>
              <!-- </div> -->
              <AccordionContent>
                <div class="manage-access-view__accordion-item">
                  <h4 class="m-0">First Name:</h4>
                  <p class="m-0" v-if="manager.first_name">
                    {{ manager.first_name }}
                  </p>
                  <p
                    class="manage-access-view__accordion-item-info-not-provided"
                    v-if="!manager.first_name"
                  >
                    Not provided
                  </p>
                </div>
                <div class="manage-access-view__accordion-item">
                  <h4 class="m-0">Last Name:</h4>
                  <p class="m-0" v-if="manager.last_name">
                    {{ manager.last_name }}
                  </p>
                  <p
                    class="manage-access-view__accordion-item-info-not-provided"
                    v-if="!manager.last_name"
                  >
                    Not provided
                  </p>
                </div>
                <div class="manage-access-view__accordion-item">
                  <h4 class="m-0">Email:</h4>
                  <p class="m-0" v-if="manager.email">{{ manager.email }}</p>
                  <p
                    class="manage-access-view__accordion-item-info-not-provided"
                    v-if="!manager.email"
                  >
                    Not provided
                  </p>
                </div>
                <div class="manage-access-view__accordion-item">
                  <h4 class="m-0">Description:</h4>
                  <p class="m-0" v-if="manager.description">
                    {{ manager.description }}
                  </p>
                  <p
                    class="manage-access-view__accordion-item-info-not-provided"
                    v-if="!manager.description"
                  >
                    Not provided
                  </p>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>

      <div class="manage-access-view__form">
        <div class="manage-access-view__form-input card flex justify-center">
          <Select
            v-model="selectedPlayer"
            :options="orchestraPlayers"
            optionLabel="email"
            :loading="loadingOrchestraPlayers"
            placeholder="Select an orchestra member (player)"
            :disabled="loadingOrchestraPlayers"
            showClear
            filter
            class="w-full md:w-56"
          ></Select>
        </div>
        <div>
          <Button
            class="manage-access-view__form-button"
            @click.prevent="setPlayerAsManager"
            :disabled="loadingPlayerToManager || !selectedPlayer"
            :label="loadingPlayerToManager ? 'Setting...' : 'Set as Manager'"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Select from 'primevue/select'
import { useManageAccess } from '@/composables/useManageAccess'
import type { TManager } from '@/types/TManager'
import type { TPlayer } from '@/types/TPlayer'

const route = useRoute()

const selectedPlayer = ref<TPlayer | null>(null)

const {
  fetchOrchestraManagers,
  orchestraManagers,
  loadingOrchestraManagers,
  fetchOrchestraPlayers,
  orchestraPlayers,
  loadingOrchestraPlayers,
  updatePlayerToManager,
  loadingPlayerToManager,
  updateManagerToPlayer,
  loadingManagerToPlayer,
} = useManageAccess()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchOrchestraManagers(orchestraId.toString())
    await fetchOrchestraPlayers(orchestraId.toString())
  },
  { immediate: true },
)

const setPlayerAsManager = async () => {
  console.log('setPlayerAsManager')

  if (!selectedPlayer.value || !selectedPlayer.value.id) {
    return
  }

  try {
    await updatePlayerToManager(
      route.params.orchestraId.toString(),
      selectedPlayer.value.id,
    )
    await fetchOrchestraManagers(route.params.orchestraId.toString())
    await fetchOrchestraPlayers(route.params.orchestraId.toString())
  } catch (error) {
    const baseErrorMessage = 'Failed while setPlayerAsManager.'
    console.error(baseErrorMessage, error)
  } finally {
    selectedPlayer.value = null
  }
}

const revertManagerToPlayer = async (manager: TManager) => {
  console.log('revertManagerToPlayer', manager)

  if (!manager || !manager.id) {
    return
  }

  try {
    await updateManagerToPlayer(route.params.orchestraId.toString(), manager.id)

    await fetchOrchestraManagers(route.params.orchestraId.toString())
    await fetchOrchestraPlayers(route.params.orchestraId.toString())
  } catch (error) {
    const baseErrorMessage = 'Failed while revertManagerToPlayer.'
    console.error(baseErrorMessage, error)
  } finally {
    selectedPlayer.value = null
  }
}
</script>

<style setup lang="scss">
.manage-access-view {
  margin-bottom: 50px;

  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    width: 100%;
  }

  &__subtitle {
    color: #10b981;
  }

  &__form {
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    gap: 30px;
    max-width: 350px;
  }

  &__form-input {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 5px;
    min-width: 330px;
  }

  &__form-button {
    width: 100%;
    min-width: 150px;
  }

  &__accordion {
    width: 100%;
    max-width: 550px;
  }

  &__accordion-item {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 2px;
    align-items: center;
  }

  &__accordion-item-info-not-provided {
    color: #b8b8b8;
  }

  // &__accordion-position {
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-between;
  //   width: 100%;
  //   // align-items: center;
  // }

  &__trash-icon {
    // color: slateblue;
    font-size: 1.5rem;
    position: absolute;
    right: calc(50% - 500px);
    transform: translateY(+80%);
  }
}
</style>

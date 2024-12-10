<template>
  <div class="concerts-view">
    <Toast />
    <div class="concerts-view__title">
      <h1>Concerts</h1>
    </div>

    <div class="concerts-view__component-create card flex justify-center">
      <Drawer
        v-model:visible="visibleDrawerConcertCreateForm"
        header="Create new concert"
        position="full"
      >
        <ConcertCreateForm />
      </Drawer>
      <div class="concerts-view__component-create">
        <h3>Create new concert:</h3>
        <div class="concerts-view__component-create-button">
          <Button
            label="Create new concert"
            size="large"
            icon="pi pi-plus"
            @click="visibleDrawerConcertCreateForm = true"
          ></Button>
        </div>
      </div>
    </div>
    <div class="concerts-view__content">
      <div v-if="loadingConcerts">
        <ProgressSpinner />
      </div>
      <div v-else-if="concerts.length === 0">
        <h3>Concerts:</h3>
        <Message severity="error"
          >Failed to load concerts <strong>OR</strong> no concerts
          found.</Message
        >
      </div>

      <div v-else>
        <h3>Concerts:</h3>
        <div class="concerts-view__concert-list">
          <div
            v-for="(concert, id) in concerts"
            :key="id"
            class="concerts-view__concert-details"
            style="display: flex; justify-content: center"
          >
            <Card style="max-width: 40rem; overflow: hidden">
              <template #header>
                <img
                  alt="concert graphic"
                  :src="
                    concert.graphic ?? 'https://via.placeholder.com/528x280'
                  "
                  class="concerts-view__concert-image"
                />
              </template>
              <template #title>{{ concert.name }}</template>
              <template #subtitle>
                <!-- Card subtitle -->
                <div>
                  <div class="concerts-view__concert-details-subtitle">
                    <div>
                      <i class="pi pi-calendar" style="color: #708090"></i>
                      DATE:
                    </div>
                    <div>
                      <strong>{{ concert.date_and_time }}</strong>
                    </div>
                  </div>
                  <div class="concerts-view__concert-details-subtitle">
                    <div>
                      <i class="pi pi-clock" style="color: #708090"></i>
                      HOUR:
                    </div>
                    <div>
                      <strong>{{ concert.date_and_time }}</strong>
                    </div>
                  </div>
                  <div class="concerts-view__concert-details-subtitle">
                    <div>
                      <i class="pi pi-map-marker" style="color: #708090"></i>
                      LOCATION:
                    </div>
                    <div>
                      <strong>{{ concert.place }}</strong>
                    </div>
                  </div>
                </div>
              </template>
              <template #content>
                <div
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ concert.description }}
                </div>
              </template>
              <template #footer>
                <div class="concerts-view__single-button flex gap-4 mt-1">
                  <div class="card flex justify-center">
                    <Drawer
                      v-model:visible="visibleDrawerConcertDetails"
                      position="right"
                      header="Concert Details"
                      class="concerts-view__drawer !w-full md:!w-80 lg:!w-[30rem]"
                    >
                      <ConcertDetails :concertDetails="selectedConcert" />
                    </Drawer>
                    <Button
                      label="See details"
                      @click="openConcertDetails(concert)"
                    ></Button>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <pre>
          <div>Create a concerts (seperate component)</div>
          
          <div>Display all concerts -> go to details (seperate component)</div>
          
          <div>concert details component:
            - edit button on the top right -> go to edit concert (seperate component)
            - delete button on the top right
            - concert details
            - list of all members with their availability (seperate component)
          </div>
  
          <div>edit concert component:
            - form
            - save button
          </div>
        </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import ConcertCreateForm from '@/components/ConcertCreateForm.vue'
import ConcertDetails from '@/components/ConcertDetails.vue'
import { useConcerts } from '@/composables/useConcerts'
import type { TConcert } from '@/types/TConcert'

const route = useRoute()

const visibleDrawerConcertCreateForm = ref(false)
const visibleDrawerConcertDetails = ref(false)
const selectedConcert = ref<TConcert | null>(null)

const { concerts, loadingConcerts, fetchConcerts } = useConcerts()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchConcerts(orchestraId.toString())
  },
  { immediate: true },
)

const openConcertDetails = (concert: TConcert) => {
  selectedConcert.value = concert
  if (selectedConcert.value !== null) {
    visibleDrawerConcertDetails.value = true
  }
}
</script>

<style setup lang="scss">
.concerts-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 50px;
    // align-items: center;
    width: 100%;
  }

  &__component-create {
    display: flex;
    flex-direction: row;
    // justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  &__component-create-button {
    padding-left: 4rem;
  }

  &__concert-details {
    display: flex;
    // flex-direction: row;
    justify-content: center;
    gap: 20px;
  }

  &__concert-details-subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  &__single-button {
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  &__concert-list {
    display: flex;
    flex-direction: column;
    gap: 50px;
  }

  &__concert-image {
    width: 100%;
    max-height: 280px;
    object-fit: cover;
  }

  &__drawer {
    width: 100% !important;
    max-width: 30rem;
  }
}
</style>

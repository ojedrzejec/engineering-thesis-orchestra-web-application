<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ selectedOrchestraDetails?.name }}</h1>
    </div>

    <div class="availability-view__content">
      <Message severity="info">
        Please mark your availability for upcoming concerts.
      </Message>
      <h3>My Availability in {{ selectedOrchestraId }}</h3>
      {{ route.params }}
      <pre>
        Display all concerts -> go to details (seperate component)

        (if one chosen, the other needs to be disabled)
        - green button "I am available"
        - red button "I cannot participate"
      </pre>

      <div class="availability-view__concert-list">
        <h3>Upcoming Gigs</h3>
        <div class="availability-view__concert-details">
          <Card style="width: 33rem; overflow: hidden">
            <template #header>
              <!-- <img
              alt="user header"
              src="https://primefaces.org/cdn/primevue/images/usercard.png"
            /> -->
            </template>
            <template #title>Concert Title</template>
            <template #subtitle>
              <!-- Card subtitle -->
              <div>
                <div class="availability-view__concert-details-subtitle">
                  <div>
                    <i class="pi pi-calendar" style="color: #708090"></i>
                    DATE:
                  </div>
                  <div><strong>01.03.2025</strong></div>
                </div>
                <div class="availability-view__concert-details-subtitle">
                  <div>
                    <i class="pi pi-clock" style="color: #708090"></i>
                    HOUR:
                  </div>
                  <div><strong>19:00</strong></div>
                </div>
                <div class="availability-view__concert-details-subtitle">
                  <div>
                    <i class="pi pi-map-marker" style="color: #708090"></i>
                    LOCATION:
                  </div>
                  <div><strong>Filharmonia Łódzka</strong></div>
                </div>
              </div>
            </template>
            <template #content>
              <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore sed consequuntur error repudiandae numquam deserunt
                quisquam repellat libero asperiores earum nam nobis, culpa
                ratione quam perferendis esse, cupiditate neque quas!
              </p>
            </template>
            <template #footer>
              <div class="availability-view__buttons">
                <!-- flex gap-4 mt-1 -->
                <div>
                  <Button
                    icon="pi pi-check"
                    style="color: green"
                    label="Available"
                    severity="secondary"
                    outlined
                  ></Button>
                </div>
                <div>
                  <Button
                    icon="pi pi-times"
                    style="color: #d65a5a"
                    label="NOT Available"
                    severity="secondary"
                    outlined
                  ></Button>
                </div>
              </div>
              <div>
                <Button
                  class="availability-view__single-button"
                  label="See details"
                  @click="seeConcertDetails"
                ></Button>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="concerts-view__content">
      <div v-if="loadingConcerts">
        <ProgressSpinner />
      </div>
      <div v-else-if="concerts.length === 0">
        <h3>Upcoming Concerts:</h3>
        <Message severity="error">
          Failed to load concerts <strong>OR</strong> no concerts found.
        </Message>
      </div>

      <div v-else>
        <div class="concerts-view__concert-list">
          <h3>Upcoming Concerts:</h3>
          <div
            v-for="(concert, id) in concerts"
            :key="id"
            class="concerts-view__concert-details"
            style="display: flex; justify-content: center"
          >
            <Card style="max-width: 40rem; overflow: hidden">
              <template #header>
                <!-- <img
                  v-if="concert.graphic"
                  alt="concert graphic"
                  :src="
                    concert.graphic ?? 'https://via.placeholder.com/640x200'
                  "
                  class="concerts-view__concert-image"
                /> -->
              </template>
              <template #title
                ><strong>{{ concert.name }}</strong></template
              >
              <template #subtitle>
                <!-- Card subtitle -->
                <div class="concerts-view__concert-details-subtitle">
                  <div
                    class="concerts-view__concert-details-subtitle-single-info"
                  >
                    <div>
                      <i class="pi pi-calendar" style="color: #708090"></i>
                      DATE:
                    </div>
                    <div>
                      <strong>{{
                        concert.date
                          ?.toString()
                          .split('T')[0]
                          .split('-')
                          .reverse()
                          .join('.')
                      }}</strong>
                    </div>
                  </div>
                  <div
                    class="concerts-view__concert-details-subtitle-single-info"
                  >
                    <div>
                      <i class="pi pi-clock" style="color: #708090"></i>
                      TIME:
                    </div>
                    <div>
                      <strong>{{
                        concert.time?.toString().split('.')[0].slice(0, 5)
                      }}</strong>
                    </div>
                  </div>
                  <div
                    class="concerts-view__concert-details-subtitle-single-info"
                  >
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
                <!-- <div
                  style="
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ concert.description }}
                </div> -->
              </template>
              <template #footer>
                <div class="availability-view__buttons">
                  <!-- flex gap-4 mt-1 -->
                  <div>
                    <Button
                      icon="pi pi-check"
                      style="color: green"
                      label="Available"
                      severity="secondary"
                      outlined
                    ></Button>
                  </div>
                  <div>
                    <Button
                      icon="pi pi-times"
                      style="color: #d65a5a"
                      label="NOT Available"
                      severity="secondary"
                      outlined
                    ></Button>
                  </div>
                </div>

                <!-- <div class="concerts-view__single-button flex gap-4 mt-1"> -->
                <!-- <div class="card flex justify-center"> -->
                <Drawer
                  v-model:visible="visibleDrawerConcertDetails"
                  position="right"
                  header="Concert Details"
                  class="concerts-view__drawer !w-full md:!w-80 lg:!w-[30rem]"
                >
                  <ConcertDetails :concertDetails="selectedConcert" />
                </Drawer>
                <Button
                  class="availability-view__single-button"
                  @click="openConcertDetails(concert)"
                >
                  See details
                  <i class="pi pi-angle-right"></i>
                </Button>
                <!-- </div> -->
                <!-- </div> -->
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import ConcertDetails from '@/components/ConcertDetails.vue'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import { useConcerts } from '@/composables/useConcerts'
import type { TConcert } from '@/types/TConcert'

const route = useRoute()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraId, selectedOrchestraDetails } = storeToRefs(
  availableOrchestrasStore,
)

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

const seeConcertDetails = () => {
  console.log('see concert details')
}
</script>

<style setup lang="scss">
.availability-view {
  margin-bottom: 50px;

  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 50px;
    width: 100%;
  }

  &__concert-details-subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  &__buttons {
    display: flex;
    // gap: 10px;
    flex-direction: row;
    justify-content: space-evenly;
  }

  &__single-button {
    margin-top: 20px;
    width: 100%;
  }
}

.concerts-view {
  margin-bottom: 50px;

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

  &__concert-details {
    display: flex;
    // flex-direction: row;
    justify-content: center;
    gap: 20px;
  }

  &__concert-details-subtitle {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    // justify-content: space-between;
  }

  &__concert-details-subtitle-single-info {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 0px;
    align-items: flex-start;
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
    max-height: 200px;
    object-fit: cover;
  }

  &__drawer {
    width: 100% !important;
    max-width: 40rem;
  }
}
</style>

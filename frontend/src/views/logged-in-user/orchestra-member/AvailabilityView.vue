<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ selectedOrchestraDetails?.name }}</h1>
    </div>

    <div class="availability-view__content">
      <Message severity="info">
        <div class="availability-view__message-info">
          <div>
            <i class="pi pi-info-circle"></i>
          </div>
          <div>Please mark your availability for upcoming concerts.</div>
        </div>
      </Message>

      <div v-if="loadingConcerts || loadingMemberAvailabilityFetch">
        <ProgressSpinner />
      </div>
      <div v-else-if="concerts.length === 0">
        <h3>Upcoming Concerts:</h3>
        <Message severity="error">
          Failed to load concerts <strong>OR</strong> no concerts found.
        </Message>
      </div>

      <div v-else>
        <div class="availability-view__concert-list">
          <h3>Upcoming Concerts:</h3>
          <div
            v-for="(concert, id) in concerts"
            :key="id"
            class="availability-view__concert-details"
            style="display: flex; justify-content: center"
          >
            <Card class="availability-view__concert-card">
              <template #header>
                <!-- <img
                  v-if="concert.graphic"
                  alt="concert graphic"
                  :src="
                    concert.graphic ?? 'https://via.placeholder.com/640x200'
                  "
                  class="availability-view__concert-image"
                /> -->
              </template>

              <template #title
                ><strong>{{ concert.name }}</strong></template
              >

              <template #subtitle>
                <div class="availability-view__concert-details-subtitle">
                  <div
                    class="availability-view__concert-details-subtitle-single-info"
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
                    class="availability-view__concert-details-subtitle-single-info"
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
                    class="availability-view__concert-details-subtitle-single-info"
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

              <!-- <template #content>
                <div>
                  {{ concert.description }}
                </div>
              </template> -->

              <template #footer>
                <div class="availability-view__buttons">
                  <div>
                    <Button
                      v-if="
                        memberAvailability.find(
                          (availability: TAvailability) =>
                            availability.id_concert === concert.id,
                        )?.is_available === true
                      "
                      icon="pi pi-check"
                      label="Available"
                      style="color: #ffffff"
                      severity="success"
                      :loading="loadingMemberAvailabilityUpdate"
                      :disabled="loadingMemberAvailabilityUpdate"
                      @click="updateAvailability(concert, true)"
                      raised
                    ></Button>
                    <Button
                      v-else
                      icon="pi pi-check"
                      label="Available"
                      style="color: green"
                      :loading="loadingMemberAvailabilityUpdate"
                      :disabled="loadingMemberAvailabilityUpdate"
                      severity="secondary"
                      outlined
                      @click="updateAvailability(concert, true)"
                      raised
                    ></Button>
                  </div>
                  <div>
                    <Button
                      v-if="
                        memberAvailability.find(
                          (availability: TAvailability) =>
                            availability.id_concert === concert.id,
                        )?.is_available === false
                      "
                      icon="pi pi-times"
                      label="NOT Available"
                      style="color: #ffffff"
                      severity="danger"
                      @click="updateAvailability(concert, false)"
                      :loading="loadingMemberAvailabilityUpdate"
                      :disabled="loadingMemberAvailabilityUpdate"
                      raised
                    ></Button>
                    <Button
                      v-else
                      icon="pi pi-times"
                      label="NOT Available"
                      style="color: #d65a5a"
                      severity="secondary"
                      outlined
                      @click="updateAvailability(concert, false)"
                      :loading="loadingMemberAvailabilityUpdate"
                      :disabled="loadingMemberAvailabilityUpdate"
                      raised
                    ></Button>
                  </div>
                </div>

                <Button
                  class="availability-view__single-button"
                  @click="openConcertDetails(concert)"
                >
                  See details
                  <i class="pi pi-angle-right"></i>
                </Button>
              </template>
            </Card>
          </div>

          <Drawer
            v-model:visible="visibleDrawerConcertDetails"
            position="right"
            header="Concert Details"
            class="availability-view__drawer !w-full md:!w-80 lg:!w-[30rem]"
          >
            <ConcertDetails
              v-if="selectedConcert"
              :concertDetails="selectedConcert"
              :selectedOrchestraDetails="selectedOrchestraDetails"
            />
            <div v-else>No concert data</div>
          </Drawer>
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
import { useAvailability } from '@/composables/useAvailability'
import type { TConcert } from '@/types/TConcert'
import type { TAvailability } from '@/types/TAvailability'

const route = useRoute()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraDetails } = storeToRefs(availableOrchestrasStore)

const visibleDrawerConcertDetails = ref(false)
const selectedConcert = ref<TConcert | null>(null)

const { concerts, loadingConcerts, fetchConcerts } = useConcerts()

const {
  memberAvailability,
  loadingMemberAvailabilityFetch,
  fetchMemberAvailability,
  loadingMemberAvailabilityUpdate,
  updateMemberAvailability,
} = useAvailability()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchConcerts(orchestraId.toString())
    await fetchMemberAvailability(orchestraId.toString())
  },
  { immediate: true },
)

const openConcertDetails = (concert: TConcert) => {
  selectedConcert.value = concert
  if (selectedConcert.value !== null) {
    visibleDrawerConcertDetails.value = true
  }
}

const updateAvailability = async (concert: TConcert, isAvailable: boolean) => {
  console.log('concert.id: ', concert.id)
  console.log('isAvailable: ', isAvailable)

  try {
    await updateMemberAvailability(concert, isAvailable)

    await fetchMemberAvailability(route.params.orchestraId.toString())
    await fetchConcerts(route.params.orchestraId.toString())
  } catch (error) {
    const baseErrorMessage = 'Failed while updateAvailability.'
    console.error(baseErrorMessage, error)
  }
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
    gap: 50px;
    width: 100%;
  }

  &__concert-details {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  &__concert-details-subtitle {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__concert-details-subtitle-single-info {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 20px;
    align-items: flex-start;
  }

  &__concert-card {
    width: 100%;
    max-width: 600px;
    overflow: hidden;
  }

  &__message-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
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

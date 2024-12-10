<template>
  <div class="availability-view">
    <div class="availability-view__title">
      <h1>My Availability in {{ selectedOrchestraDetails?.name }}</h1>
    </div>

    <div class="availability-view__content">
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
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import Card from 'primevue/card'
import Button from 'primevue/button'

const route = useRoute()

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraId, selectedOrchestraDetails } = storeToRefs(
  availableOrchestrasStore,
)

const seeConcertDetails = () => {
  console.log('see concert details')
}
</script>

<style setup lang="scss">
.availability-view {
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
</style>

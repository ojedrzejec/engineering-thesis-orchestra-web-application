<template>
  <div class="concerts-view">
    <div class="concerts-view__title">
      <h1>Concerts</h1>
    </div>

    <div class="concerts-view__content">
      <div class="concerts-view__component-create card flex justify-center">
        <Drawer
          v-model:visible="visible"
          header="Create new concert"
          position="full"
        >
          <ConcertCreateForm />
        </Drawer>
        <div>
          <h3>Create new concert</h3>
          <Button icon="pi pi-plus" @click="visible = true"></Button>
        </div>
      </div>

      <div class="concerts-view__concert-list">
        <h3>Concerts</h3>
        <div class="concerts-view__concert-details">
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
                <div class="concerts-view__concert-details-subtitle">
                  <div>
                    <i class="pi pi-calendar" style="color: #708090"></i>
                    DATE:
                  </div>
                  <div><strong>01.03.2025</strong></div>
                </div>
                <div class="concerts-view__concert-details-subtitle">
                  <div>
                    <i class="pi pi-clock" style="color: #708090"></i>
                    HOUR:
                  </div>
                  <div><strong>19:00</strong></div>
                </div>
                <div class="concerts-view__concert-details-subtitle">
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
              <div class="concerts-view__single-button flex gap-4 mt-1">
                <Button label="See details" class="w-full"></Button>
              </div>
            </template>
          </Card>
        </div>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Card from 'primevue/card'
import ConcertCreateForm from '@/components/ConcertCreateForm.vue'

const visible = ref(false)
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
}
</style>

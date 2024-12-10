<template>
  <div v-if="concertDetails" class="concert-details-view__drawer-content">
    <div
      class="concert-details-view__drawer-single-info concert-details-view__drawer-graphic"
    >
      <div v-if="concertDetails.graphic">
        <img
          :src="concertDetails.graphic"
          alt="Profile Picture"
          style="
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 0.75rem;
            width: 100%;
            max-width: 10rem;
          "
        />
      </div>
    </div>
    <div class="concert-details-view__drawer-single-info">
      <div class="concert-details-view__drawer-single-info">
        <h4>Concert Name:</h4>
        <p v-if="concertDetails.name">
          {{ concertDetails.name }}
        </p>
        <div
          class="concert-details-view__drawer-single-info-not-provided"
          v-if="!concertDetails.name"
        >
          Not provided
        </div>
      </div>

      <div class="concert-details-view__drawer-single-info">
        <h4>Description:</h4>
        <p v-if="concertDetails.description">
          {{ concertDetails.description }}
        </p>
        <div
          class="concert-details-view__drawer-single-info-not-provided"
          v-if="!concertDetails.description"
        >
          Not provided
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TConcert } from '@/types/TConcert'

const props = defineProps<{
  concertDetails: TConcert | null
}>()
</script>

<style setup lang="scss">
.concert-details-view {
  //   &__drawer-content {
  //     display: flex;
  //     flex-direction: column;
  //     // gap: 10px;
  //     // width: 30rem;
  //     // height: 100%;
  //   }

  //   &__drawer-single-info {
  //     // display: flex;
  //     // flex-direction: row;
  //     // align-items: center;
  //     // gap: 20px;

  //     display: grid;
  //     grid-template-columns: 1fr 1fr;
  //     gap: 20px;
  //     align-items: center;
  //   }

  //   &__drawer-graphic {
  //     font-weight: bold;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     margin: 20px auto;
  //     // border: 1px solid #e0e0e0;
  //   }

  //   &__drawer-single-info-not-provided {
  //     color: #b8b8b8;
  //   }
}
</style>

<template>
  <div class="concert-details-view">
    <div
      class="concert-details-view__drawer-single-info concert-details-view__concert-title"
    >
      <!-- <h4>Concert Name:</h4> -->
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

    <div class="concert-details-view__date-time-location">
      <div class="concert-details-view__concert-details-subtitle-single-info">
        <div>
          <i class="pi pi-calendar" style="color: #708090"></i>
          DATE:
        </div>
        <div>
          <strong>{{
            concertDetails.date
              ?.toString()
              .split('T')[0]
              .split('-')
              .reverse()
              .join('.')
          }}</strong>
        </div>
      </div>

      <div class="concert-details-view__concert-details-subtitle-single-info">
        <div>
          <i class="pi pi-clock" style="color: #708090"></i>
          TIME:
        </div>
        <div>
          <strong>{{
            concertDetails.time?.toString().split('.')[0].slice(0, 5)
          }}</strong>
        </div>
      </div>

      <div class="concert-details-view__concert-details-subtitle-single-info">
        <div>
          <i class="pi pi-map-marker" style="color: #708090"></i>
          LOCATION:
        </div>
        <div>
          <strong>{{ concertDetails.place }}</strong>
        </div>
      </div>
    </div>

    <ConcertAvailability v-if="concertDetails" :concertId="concertDetails.id" />

    <div class="concert-details-view__drawer-single-info">
      <div>
        <i class="pi pi-external-link" style="color: #708090"></i>
        RESERVE YOUR SEAT:
      </div>
      <p v-if="concertDetails.reservation_url">
        <a
          :href="concertDetails.reservation_url"
          target="_blank"
          class="concert-details-view__link"
        >
          {{ concertDetails.reservation_url }}
        </a>
      </p>
      <div
        class="concert-details-view__drawer-single-info-not-provided"
        v-if="!concertDetails.reservation_url"
      >
        Not provided
      </div>
    </div>

    <div class="concert-details-view__drawer-single-info">
      <div>
        <i class="pi pi-bars" style="color: #708090"></i>
        DESCRIPTION:
      </div>
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
            max-width: 100%;
            height: auto;
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TConcert } from '@/types/TConcert'
import ConcertAvailability from './ConcertAvailability.vue'

const props = defineProps<{
  concertDetails: TConcert
}>()
</script>

<style setup lang="scss">
.concert-details-view {
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__concert-title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    color: #008b5d;
    text-wrap: balance;
  }

  &__date-time-location {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__link {
    color: #008b5d;
  }

  &__drawer-single-info {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 0px;

    // display: grid;
    // grid-template-columns: 1fr 1fr;
    // gap: 20px;
    // align-items: center;
  }

  //   &__drawer-graphic {
  //     font-weight: bold;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     margin: 20px auto;
  //     // border: 1px solid #e0e0e0;
  //   }

  &__drawer-single-info-not-provided {
    color: #b8b8b8;
  }

  &__concert-details-subtitle-single-info {
    display: grid;
    grid-template-columns: 3fr 7fr;
    align-items: flex-start;
  }

  &__datatable-availability {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>

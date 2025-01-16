<template>
  <Panel>
    <div class="app-footer__footer-panel">
      <div class="app-footer__footer-panel-column">
        <img
          alt="orchestra logo"
          :src="
            orchestraInformation.logo ?? 'https://via.placeholder.com/640x200'
          "
          class="app-footer__footer-orchestra-logo"
        />
      </div>
      <div class="app-footer__footer-panel-column">
        <strong>{{ orchestraInformation.name }}</strong>
        <div>{{ orchestraInformation.email }}</div>
        <div>{{ orchestraInformation.address }}</div>
      </div>

      <div class="app-footer__footer-panel-row">
        <a
          v-if="orchestraInformation.facebookUrl"
          class="app-footer__link"
          :href="orchestraInformation.facebookUrl"
          target="_blank"
        >
          <i
            class="pi pi-facebook app-footer__social-icon"
            :class="{ 'app-footer__social-icon--desktop': isDesktop }"
          />
        </a>

        <a
          v-if="orchestraInformation.instagramUrl"
          class="app-footer__link"
          :href="orchestraInformation.instagramUrl"
          target="_blank"
        >
          <i
            class="pi pi-instagram app-footer__social-icon"
            :class="{ 'app-footer__social-icon--desktop': isDesktop }"
          />
        </a>

        <a
          v-if="orchestraInformation.youtubeUrl"
          class="app-footer__link"
          :href="orchestraInformation.youtubeUrl"
          target="_blank"
          rel="noopener"
        >
          <i
            class="pi pi-youtube app-footer__social-icon"
            :class="{ 'app-footer__social-icon--desktop': isDesktop }"
          />
        </a>
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import type { TOrchestra } from '@/types/TOrchestra'
import Panel from 'primevue/panel'
import { useWidthStore } from '@/stores/useWidthStore'
import { storeToRefs } from 'pinia'

defineProps<{
  orchestraInformation: TOrchestra
}>()

const widthStore = useWidthStore()

const { isDesktop } = storeToRefs(widthStore)
</script>

<style lang="scss">
.app-footer {
  &__footer-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  &__footer-panel-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__footer-panel-row {
    display: flex;
    flex-direction: row;
    gap: 20px;
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

  &__social-icon {
    font-size: 1.5rem !important;

    &--desktop {
      font-size: 2rem !important;
    }
  }
}
</style>

<template>
  <div class="pieces-of-music-view">
    <div class="pieces-of-music-view__title">
      <h1>Pieces of Music</h1>
    </div>

    <pre>
      {{ { memberGroup } }}
      {{ memberGroup?.id }}
      {{ memberGroup?.name }}
    </pre>

    <div class="pieces-of-music-view__content">
      <div v-if="loadingMemberGroup">
        <ProgressSpinner />
      </div>
      <div v-else-if="memberGroup">
        <Message severity="info">
          <div>
            You belong to the orchestra group:
            <strong>{{ memberGroup.name }}</strong>
          </div>
        </Message>

        <div v-if="loadingPiecesOfMusic">
          <ProgressSpinner />
        </div>
        <div v-else-if="piecesOfMusic.length === 0">
          <Message severity="error">No pieces of music found.</Message>
        </div>

        <div v-else>
          <h3>Available pieces of music for your orchestra group:</h3>
        </div>
        <pre>
          {{ { piecesOfMusic } }}
          <div v-for="piece in piecesOfMusic" :key="piece.id">
            {{ piece.id }}
            {{ piece.id_orchestra }}
            {{ piece.title }}
            {{ piece.composer }}
          </div>
        </pre>
      </div>
      <div v-else>
        <Message severity="error">
          <div>You are not assigned to any orchestra group.</div>
          <br />
          <div>No pieces of music available for you.</div>
        </Message>
      </div>

      <pre>
        PLAYER (if he/she is assigned to an orchestra group)
        <div>
          See all pieces of music (title, composer, pdf files, group):
          - button to download pdf files
        </div>
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import { usePiecesOfMusicView } from '@/composables/usePiecesOfMusicView'

const route = useRoute()

const {
  memberGroup,
  piecesOfMusic,
  loadingMemberGroup,
  loadingPiecesOfMusic,
  fetchMemberGroup,
  fetchPiecesOfMusic,
} = usePiecesOfMusicView()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchMemberGroup()
    await fetchPiecesOfMusic(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<style setup lang="scss">
.pieces-of-music-view {
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
}
</style>

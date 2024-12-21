<template>
  <div class="pieces-of-music-view">
    <div class="pieces-of-music-view__title">
      <h1>Pieces of Music</h1>
    </div>

    <!-- <pre>
      {{ { memberGroup } }}
      {{ memberGroup?.id }}
      {{ memberGroup?.name }}
    </pre> -->

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
        <!-- <pre>
          {{ { piecesOfMusic } }}
          <div v-for="piece in piecesOfMusic" :key="piece.id">
            {{ piece.id }}
            {{ piece.id_orchestra }}
            {{ piece.title }}
            {{ piece.composer }}
            {{ piece.pdf }}
          </div>
        </pre> -->
        <div class="pieces-of-music-view__all-pieces-of-music-cards">
          <Card
            class="pieces-of-music-view__card-piece-of-music"
            v-for="pieceOfMusic in piecesOfMusic"
            :key="pieceOfMusic.id || ''"
          >
            <template #content>
              <h3>{{ pieceOfMusic.title }}</h3>
              <p>{{ pieceOfMusic.composer }}</p>
              <p>
                <Tag severity="success" :value="memberGroup.name"></Tag>
              </p>

              <div
                v-if="pieceOfMusic.pdf"
                class="pieces-of-music-view__card-piece-of-music-pdf"
              >
                <img
                  src="@/components/icons/iconPDF.png"
                  alt="PDF"
                  style="width: 100%; max-width: 35px"
                />
                <p>
                  {{ definePdfFileName(pieceOfMusic) }}
                </p>
                <Button
                  icon="pi pi-download"
                  severity="help"
                  text
                  size="large"
                  variant="outlined"
                  @click="downloadMusicSheetNotes(pieceOfMusic)"
                ></Button>
              </div>
              <div v-else class="error-message">
                <Message severity="secondary">No music scores added.</Message>
              </div>
            </template>
          </Card>
          <!-- </div> -->
        </div>
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
import Tag from 'primevue/tag'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { usePiecesOfMusicView } from '@/composables/usePiecesOfMusicView'
import type { TPieceOfMusic } from '@/types/TPieceOfMusic'

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

const definePdfFileName = (pieceOfMusic: TPieceOfMusic) => {
  return pieceOfMusic.title
    ? pieceOfMusic.title
        .replace(/\s+/g, '_')
        .toLowerCase()
        .concat('-')
        .concat(
          memberGroup.value
            ? memberGroup.value.name.replace(/\s+/g, '_').toLowerCase()
            : '',
        )
        .concat('.pdf')
    : 'music_sheet_notes.pdf'
}

const downloadMusicSheetNotes = (pieceOfMusic: TPieceOfMusic) => {
  const linkSource = pieceOfMusic.pdf
  const downloadLink = document.createElement('a')
  const fileName = definePdfFileName(pieceOfMusic)

  if (linkSource) {
    downloadLink.href = linkSource
  } else {
    console.error('PDF link source is null')
    return
  }
  downloadLink.download = fileName
  downloadLink.click()
}
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

  &__all-pieces-of-music-cards {
    display: grid;
    // border: 1px solid red;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    justify-content: center;
  }

  &__card-piece-of-music-pdf {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
}
</style>

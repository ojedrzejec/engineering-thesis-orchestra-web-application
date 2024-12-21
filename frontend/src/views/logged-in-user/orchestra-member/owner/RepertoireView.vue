<template>
  <div class="repertoire-view">
    <div class="repertoire-view__title">
      <h1>Repertoire</h1>
    </div>

    <div class="repertoire-view__content">
      <div v-if="loadingRepertoire">
        <ProgressSpinner />
      </div>
      <div v-else-if="!repertoire">
        <Message severity="error">Failed to load orchestra repertoire.</Message>
      </div>
      <div v-else-if="repertoire.length === 0">
        <Message severity="error"
          >Failed to load orchestra repertoire <strong>or</strong> no orchestra
          repertoire found.
        </Message>
      </div>

      <div v-else class="repertoire-view__content">
        <!-- <pre>
          {{ { repertoire } }}
        </pre> -->

        <div class="repertoire-view__all-pieces-of-music-cards">
          <Card
            class="repertoire-view__card-piece-of-music"
            v-for="pieceOfMusic in repertoire"
            :key="pieceOfMusic.id || ''"
          >
            <template #content>
              <h3>{{ pieceOfMusic.title }}</h3>
              <p>{{ pieceOfMusic.composer }}</p>
              <p>
                <Tag severity="success" :value="pieceOfMusic.groupName"></Tag>
              </p>

              <div
                v-if="pieceOfMusic.pdf"
                class="repertoire-view__card-piece-of-music-pdf"
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

        <div class="repertoire-view__form">
          <div class="repertoire-view__form-input">
            <div>
              <FloatLabel variant="on">
                <InputText
                  class="repertoire-view__form-input-field"
                  id="title"
                  v-model="title"
                  @input="validateTitleInput"
                  :invalid="!isTitleValid && showTitleErrors"
                ></InputText>
                <label for="title">Title</label>
              </FloatLabel>
              <div class="repertoire-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    title &&
                    !messageValidationInputLength(title) &&
                    showTitleErrors
                  "
                  >{{ validateInputLength('Title') }}</Message
                >
              </div>
            </div>
            <div>
              <FloatLabel variant="on">
                <InputText
                  class="repertoire-view__form-input-field"
                  id="groupName"
                  v-model="composer"
                  @input="validateComposerInput"
                  :invalid="!isComposerValid && showComposerErrors"
                ></InputText>
                <label for="groupName">Composer</label>
              </FloatLabel>
              <div class="repertoire-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    composer &&
                    !messageValidationInputLength(composer) &&
                    showComposerErrors
                  "
                  >{{ validateInputLength('Composer') }}</Message
                >
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <Message severity="error">{{ errorMessage }}</Message>
          </div>

          <div>
            <Button
              class="repertoire-view__form-button"
              icon="pi pi-plus"
              @click.prevent="handleCreateNewPieceOfMusic"
              :disabled="loadingNewPieceOfMusicCreate || !title || !composer"
              :label="
                loadingNewPieceOfMusicCreate
                  ? 'Creating...'
                  : 'Create new piece of music'
              "
            ></Button>
          </div>
        </div>

        <Divider />

        <!-- <Card>
          <template #content> -->
        <div class="repertoire-view__form">
          <div class="repertoire-view__form-input">
            <div>
              <Select
                v-model="selectedPieceOfMusic"
                showClear
                filter
                :loading="loadingPiecesOfMusic"
                :options="piecesOfMusic"
                optionLabel="title"
                placeholder="Select a piece of music"
                :disabled="loadingPiecesOfMusic"
                class="w-full md:w-56"
              ></Select>
            </div>
            <div>
              <Select
                v-model="selectedGroup"
                showClear
                filter
                :loading="loadingGroups"
                :options="groups"
                optionLabel="name"
                placeholder="Select a group"
                :disabled="loadingGroups"
                class="w-full md:w-56"
              ></Select>
            </div>
          </div>

          <div
            class="repertoire-view__form-input repertoire-view__file"
            style="align-items: center"
          >
            <FileUpload
              mode="advanced"
              name="pdf"
              accept="application/pdf"
              :maxFileSize="1000000"
              class="p-button-outlined"
              :auto="false"
              :customUpload="true"
              :show-cancel-button="false"
              :show-upload-button="false"
              :chooseLabel="pdfFile ? 'Change PDF' : 'Choose PDF File'"
              @remove="removeFileCallback"
              @select="onFileSelect"
            >
              <template v-if="!pdfFile" #empty>
                <span>Drag and drop files to here to upload.</span>
              </template>
            </FileUpload>
          </div>
          <div>
            <Button
              class="repertoire-view__form-button"
              label="Add music sheet notes to the group"
              severity="secondary"
              @click="
                selectedPieceOfMusic &&
                  selectedGroup &&
                  pdfFile &&
                  addFileToGroup(selectedPieceOfMusic, selectedGroup, pdfFile)
              "
              :loading="loadingMusicSheetNotesAdd"
              :disabled="
                !selectedPieceOfMusic ||
                !selectedGroup ||
                !pdfFile ||
                loadingMusicSheetNotesAdd
              "
            ></Button>
          </div>
        </div>
        <!-- </template>
        </Card> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { useRepertoire } from '@/composables/useRepertoire'
import { useGroups } from '@/composables/useGroups'
import type { TGroup } from '@/types/TGroup'
import {
  messageValidationInputLength,
  validateInputLength,
} from '@/constants/validation/repertoireValidation'
import type { TPieceOfMusic } from '@/types/TPieceOfMusic'
import type { TRepertoire } from '@/types/TRepertoire'

const route = useRoute()

const selectedGroup = ref<TGroup | null>(null)
const selectedPieceOfMusic = ref<TPieceOfMusic | null>(null)
const title = ref('')
const composer = ref('')
const pdfFile = ref<string | null>(null)
const errorMessage = ref('')
const showTitleErrors = ref(false)
const showComposerErrors = ref(false)

const isTitleValid = computed(
  () => !title.value || messageValidationInputLength(title.value),
)
const isComposerValid = computed(
  () => !composer.value || messageValidationInputLength(composer.value),
)

const validateTitleInput = () => {
  showTitleErrors.value = true
}
const validateComposerInput = () => {
  showComposerErrors.value = true
}

const showErrors = (message: string) => {
  errorMessage.value = message
}

const {
  repertoire,
  piecesOfMusic,
  loadingRepertoire,
  loadingPiecesOfMusic,
  loadingNewPieceOfMusicCreate,
  loadingMusicSheetNotesAdd,
  fetchRepertoire,
  fetchPiecesOfMusic,
  createPieceOfMusic,
  addMusicSheetNotes,
} = useRepertoire()

const { groups, loadingGroups, fetchGroups } = useGroups()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchRepertoire(orchestraId.toString())
    await fetchPiecesOfMusic(orchestraId.toString())
    await fetchGroups(orchestraId.toString())
  },
  { immediate: true },
)

const handleCreateNewPieceOfMusic = async () => {
  console.log('handleCreateGroup function starts...')

  if (!title.value || !composer.value) {
    showErrors('Please fill in the fields above.')
    return
  }
  errorMessage.value = ''

  try {
    await createPieceOfMusic(
      route.params.orchestraId.toString(),
      title.value,
      composer.value,
    )
    await fetchRepertoire(route.params.orchestraId.toString())
  } catch (e) {
    const baseErrorMessage = 'Failed while handleCreateNewPieceOfMusic.'
    console.error(baseErrorMessage, e)
  } finally {
    title.value = ''
    composer.value = ''
  }
}

const addFileToGroup = async (
  selectedPieceOfMusic: TPieceOfMusic,
  selectedGroup: TGroup,
  file: string,
) => {
  console.log('Inside addFileToGroup')

  try {
    await addMusicSheetNotes(
      route.params.orchestraId.toString(),
      selectedPieceOfMusic,
      selectedGroup,
      file,
    )
    await fetchGroups(route.params.orchestraId.toString())
    await fetchRepertoire(route.params.orchestraId.toString())
  } finally {
    selectedPieceOfMusic.value = null
    selectedGroup.value = null
    pdfFile.value = null
  }
}

const onFileSelect = async (event: FileUploadSelectEvent) => {
  // if (!pdfFile.value) return

  const file: File = Array.isArray(event.files) ? event.files[0] : event.files

  if (file) {
    pdfFile.value = await fileToBase64(file)
  }
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('File could not be converted to base64 string'))
      }
    }
    reader.onerror = error => reject(error)
  })

const removeFileCallback = () => {
  if (!pdfFile.value) return

  pdfFile.value = null
}

const definePdfFileName = (pieceOfMusic: TRepertoire) => {
  return pieceOfMusic.title
    ? pieceOfMusic.title
        .replace(/\s+/g, '_')
        .toLowerCase()
        .concat('-')
        .concat(
          pieceOfMusic.groupName
            ? pieceOfMusic.groupName.replace(/\s+/g, '_').toLowerCase()
            : '',
        )
        .concat('.pdf')
    : 'music_sheet_notes.pdf'
}

const downloadMusicSheetNotes = (pieceOfMusic: TRepertoire) => {
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
.repertoire-view {
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

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__form-input {
    display: flex;
    flex-direction: row;
    // align-items: center;
    gap: 5px;
    min-width: 300px;
  }

  &__form-button {
    width: 100%;
    min-width: 150px;
  }

  &__file {
    .p-fileupload-file-badge {
      display: none !important;
    }
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

<template>
  <div class="orchestra-information-view">
    <Toast />
    <div class="orchestra-information-view__title">
      <h1>Orchestra Information</h1>
    </div>
    {{ route.params }}

    <div v-if="loadingOrchestraInformation">
      <ProgressSpinner />
    </div>
    <div v-else-if="!orchestraInformation">
      <Message severity="error">Failed to load orchestra information.</Message>
    </div>
    <Form v-else>
      <Fluid>
        <div class="orchestra-information-view__form">
          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="orchestra-information-view__form-input-field"
                id="name"
                v-model="orchestraInformation.name"
                @input="validateNameInput"
                :invalid="!isNameValid && showNameErrors"
              ></InputText>
              <label for="name">Orchestra’s Name</label>
            </FloatLabel>
            <div class="orchestra-information-view__form-error-messages">
              <Message
                severity="error"
                v-if="!orchestraInformation.name && showNameErrors"
                >{{ messageInputRequired('Name') }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraInformation.name &&
                  !validateNameLength(orchestraInformation.name) &&
                  showNameErrors
                "
                >{{ messageValidationInputLength('Name') }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraInformation.name &&
                  !validateWhitespaces(orchestraInformation.name) &&
                  showNameErrors
                "
                >{{ messageValidationWhitespaces('Name') }}</Message
              >
            </div>
          </div>

          <div
            class="orchestra-information-view__form-input orchestra-information-view__file"
            style="align-items: center"
          >
            <FileUpload
              mode="advanced"
              name="logo"
              accept="image/*"
              :maxFileSize="1000000"
              class="p-button-outlined"
              :auto="false"
              :customUpload="true"
              :show-cancel-button="false"
              :show-upload-button="false"
              :chooseLabel="
                orchestraInformation.logo
                  ? 'Change Logo'
                  : 'Choose Orchestra Logo'
              "
              :multiple="false"
              @remove="removeFileCallback"
              @select="onFileSelect"
            >
              <!-- @upload="onFileSelect" -->
              <template v-if="!orchestraInformation.logo" #empty>
                <span>Drag and drop files to here to upload.</span>
              </template>
            </FileUpload>
            <div v-if="orchestraInformation.logo">
              <img
                :src="orchestraInformation.logo"
                alt="Orchestra Logo"
                style="
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  border-radius: 0.75rem;
                  width: 100%;
                  max-width: 10rem;
                "
              />
            </div>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="orchestra-information-view__form-input-field"
                id="email"
                v-model="orchestraInformation.email"
                v-keyfilter="/[^\s]/"
                @input="validateEmailInput"
                :invalid="!isEmailValid && showEmailErrors"
              ></InputText>
              <label for="email">Email</label>
            </FloatLabel>
            <div class="orchestra-information-view__form-error-messages">
              <Message
                severity="error"
                v-if="
                  orchestraInformation.email && !isEmailValid && showEmailErrors
                "
                >{{ messageValidationEmail }}</Message
              >
            </div>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <Textarea
                id="address"
                v-model="orchestraInformation.address"
                rows="2"
                cols="30"
                autoResize
              ></Textarea>
              <label for="address">Address</label>
            </FloatLabel>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <Textarea
                id="history"
                v-model="orchestraInformation.history"
                rows="7"
                cols="30"
                autoResize
              ></Textarea>
              <label for="history">History</label>
            </FloatLabel>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="orchestra-information-view__form-input-field"
                id="facebookUrl"
                v-model="orchestraInformation.facebookUrl"
                v-keyfilter="/[^\s]/"
                @input="validateFacebookUrlInput"
                :invalid="!isFacebookUrlValid && showFacebookUrlErrors"
              ></InputText>
              <label for="facebookUrl">Facebook Link</label>
            </FloatLabel>
            <div class="orchestra-information-view__form-error-messages">
              <Message
                severity="error"
                v-if="
                  orchestraInformation.facebookUrl &&
                  !isFacebookUrlValid &&
                  showFacebookUrlErrors
                "
                >{{ messageValidationLink }}</Message
              >
            </div>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="orchestra-information-view__form-input-field"
                id="instagramUrl"
                v-model="orchestraInformation.instagramUrl"
                v-keyfilter="/[^\s]/"
                @input="validateInstagramUrlInput"
                :invalid="!isInstagramUrlValid && showInstagramUrlErrors"
              ></InputText>
              <label for="instagramUrl">Instagram Link</label>
            </FloatLabel>
            <div class="orchestra-information-view__form-error-messages">
              <Message
                severity="error"
                v-if="
                  orchestraInformation.instagramUrl &&
                  !isInstagramUrlValid &&
                  showInstagramUrlErrors
                "
                >{{ messageValidationLink }}</Message
              >
            </div>
          </div>

          <div class="orchestra-information-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="orchestra-information-view__form-input-field"
                id="youtubeUrl"
                v-model="orchestraInformation.youtubeUrl"
                v-keyfilter="/[^\s]/"
                @input="validateYouTubeUrlInput"
                :invalid="!isYouTubeUrlValid && showYouTubeUrlErrors"
              ></InputText>
              <label for="youtubeUrl">YouTube Link</label>
            </FloatLabel>
            <div class="orchestra-information-view__form-error-messages">
              <Message
                severity="error"
                v-if="
                  orchestraInformation.youtubeUrl &&
                  !isYouTubeUrlValid &&
                  showYouTubeUrlErrors
                "
                >{{ messageValidationLink }}</Message
              >
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <Message severity="error">{{ errorMessage }}</Message>
          </div>

          <div>
            <Button
              class="orchestra-information-view__form-button"
              @click.prevent="handleOrchestraUpdate"
              :disabled="loadingOrchestraInformationUpdate"
              :label="
                loadingOrchestraInformationUpdate ? 'Updating...' : 'Update'
              "
            ></Button>
          </div>
        </div>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { useOrchestraInformation } from '@/composables/useOrchestraInformation'
import { API_BASE_URL } from '@/constants/config'
import {
  messageInputRequired,
  messageValidationEmail,
  messageValidationInputLength,
  messageValidationLink,
  messageValidationWhitespaces,
  validateEmail,
  validateFacebookLink,
  validateInstagramLink,
  validateNameLength,
  validateWhitespaces,
  validateYouTubeLink,
} from '@/constants/validation/orchestraCreationValidation'
import { Form } from '@primevue/forms'
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import FloatLabel from 'primevue/floatlabel'
import Fluid from 'primevue/fluid'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

const toast = useToast()
const route = useRoute()

const {
  fetchOrchestraInformation,
  loadingOrchestraInformation,
  orchestraInformation,
  updateOrchestraInformation,
  loadingOrchestraInformationUpdate,
} = useOrchestraInformation()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchOrchestraInformation(orchestraId.toString())
  },
  { immediate: true },
)

// const authStore = useAuthStore()
// const { token } = storeToRefs(authStore)
// const orchestraStore = useOrchestraStore()

// const orchestra = ref<TOrchestra>(initOrchestra)

// onMounted(() => {
//   if (orchestraStore.orchestraToUpdate) {
//     orchestra.value = orchestraStore.orchestraToUpdate
//   }
// })

const errorMessage = ref('')
const showNameErrors = ref(false)
const showEmailErrors = ref(false)
const showFacebookUrlErrors = ref(false)
const showInstagramUrlErrors = ref(false)
const showYouTubeUrlErrors = ref(false)

const isNameValid = computed(
  () =>
    orchestraInformation.value?.name &&
    validateNameLength(orchestraInformation.value.name) &&
    validateWhitespaces(orchestraInformation.value.name),
)
const isEmailValid = computed(
  () =>
    !orchestraInformation.value?.email ||
    validateEmail(orchestraInformation.value.email),
)
const isFacebookUrlValid = computed(
  () =>
    !orchestraInformation.value?.facebookUrl ||
    validateFacebookLink(orchestraInformation.value.facebookUrl),
)
const isInstagramUrlValid = computed(
  () =>
    !orchestraInformation.value?.instagramUrl ||
    validateInstagramLink(orchestraInformation.value.instagramUrl),
)
const isYouTubeUrlValid = computed(
  () =>
    !orchestraInformation.value?.youtubeUrl ||
    validateYouTubeLink(orchestraInformation.value.youtubeUrl),
)

const validateNameInput = () => {
  showNameErrors.value = true
}
const validateEmailInput = () => {
  showEmailErrors.value = true
}
const validateFacebookUrlInput = () => {
  showFacebookUrlErrors.value = true
}
const validateInstagramUrlInput = () => {
  showInstagramUrlErrors.value = true
}
const validateYouTubeUrlInput = () => {
  showYouTubeUrlErrors.value = true
}

const showErrors = () => {
  showNameErrors.value = true
  showEmailErrors.value = true
  showFacebookUrlErrors.value = true
  showInstagramUrlErrors.value = true
  showYouTubeUrlErrors.value = true
}

const onFileSelect = async (event: FileUploadSelectEvent) => {
  if (!orchestraInformation.value) return

  const file: File = Array.isArray(event.files) ? event.files[0] : event.files

  if (file) {
    orchestraInformation.value.logo = await fileToBase64(file)
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
  if (!orchestraInformation.value) return

  orchestraInformation.value.logo = null
}

const handleOrchestraUpdate = async () => {
  console.log('Button clicked! Inside handleOrchestraUpdate function')

  if (!orchestraInformation.value) {
    throw new Error('Orchestra information is not available.')
  }

  if (
    !isNameValid.value ||
    !isEmailValid.value ||
    !isFacebookUrlValid.value ||
    !isInstagramUrlValid.value ||
    !isYouTubeUrlValid.value
  ) {
    showErrors()
    return
  }

  errorMessage.value = ''

  await updateOrchestraInformation(orchestraInformation.value)
}
</script>

<style setup lang="scss">
.orchestra-information-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__title {
    margin-bottom: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }

  &__form-input {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 5px;
    min-width: 550px;
  }

  &__form-error-messages {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__form-button {
    width: 100%;
    min-width: 300px;
  }

  &__file {
    .p-fileupload-file-badge {
      display: none !important;
    }
  }
}
</style>

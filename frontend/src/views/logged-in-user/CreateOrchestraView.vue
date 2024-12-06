<template>
  <div class="create-orchestra-view">
    <Toast />
    <div class="create-orchestra-view__title">
      <h1>Create new orchestra</h1>
    </div>

    <div class="create-orchestra-view__content">
      <Form>
        <Fluid>
          <div class="create-orchestra-view__form">
            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-orchestra-view__form-input-field"
                  id="name"
                  v-model="orchestra.name"
                  @input="validateNameInput"
                  :invalid="!isNameValid && showNameErrors"
                ></InputText>
                <label for="name">Orchestra’s Name</label>
              </FloatLabel>
              <div class="create-orchestra-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="!orchestra.name && showNameErrors"
                  >{{ messageInputRequired('Name') }}</Message
                >
                <Message
                  severity="error"
                  v-if="
                    orchestra.name &&
                    !validateNameLength(orchestra.name) &&
                    showNameErrors
                  "
                  >{{ messageValidationInputLength('Name') }}</Message
                >
                <Message
                  severity="error"
                  v-if="
                    orchestra.name &&
                    !validateWhitespaces(orchestra.name) &&
                    showNameErrors
                  "
                  >{{ messageValidationWhitespaces('Name') }}</Message
                >
              </div>
            </div>

            <div
              class="create-orchestra-view__form-input create-orchestra-view__file"
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
                  orchestra.logo ? 'Change Logo' : 'Choose Orchestra Logo'
                "
                @remove="removeFileCallback"
                @select="onFileSelect"
                @upload="onFileSelect"
              >
                <template v-if="!orchestra.logo" #empty>
                  <span>Drag and drop files to here to upload.</span>
                </template>
              </FileUpload>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-orchestra-view__form-input-field"
                  id="email"
                  v-model="orchestra.email"
                  v-keyfilter="/[^\s]/"
                  @input="validateEmailInput"
                  :invalid="!isEmailValid && showEmailErrors"
                ></InputText>
                <label for="email">Email</label>
              </FloatLabel>
              <div class="create-orchestra-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="orchestra.email && !isEmailValid && showEmailErrors"
                  >{{ messageValidationEmail }}</Message
                >
              </div>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <Textarea
                  id="address"
                  v-model="orchestra.address"
                  rows="2"
                  cols="30"
                  autoResize
                ></Textarea>
                <label for="address">Address</label>
              </FloatLabel>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <Textarea
                  id="history"
                  v-model="orchestra.history"
                  rows="7"
                  cols="30"
                  autoResize
                ></Textarea>
                <label for="history">History</label>
              </FloatLabel>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-orchestra-view__form-input-field"
                  id="facebookUrl"
                  v-model="orchestra.facebookUrl"
                  v-keyfilter="/[^\s]/"
                  @input="validateFacebookUrlInput"
                  :invalid="!isFacebookUrlValid && showFacebookUrlErrors"
                ></InputText>
                <label for="facebookUrl">Facebook Link</label>
              </FloatLabel>
              <div class="create-orchestra-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    orchestra.facebookUrl &&
                    !isFacebookUrlValid &&
                    showFacebookUrlErrors
                  "
                  >{{ messageValidationLink }}</Message
                >
              </div>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-orchestra-view__form-input-field"
                  id="instagramUrl"
                  v-model="orchestra.instagramUrl"
                  v-keyfilter="/[^\s]/"
                  @input="validateInstagramUrlInput"
                  :invalid="!isInstagramUrlValid && showInstagramUrlErrors"
                ></InputText>
                <label for="instagramUrl">Instagram Link</label>
              </FloatLabel>
              <div class="create-orchestra-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    orchestra.instagramUrl &&
                    !isInstagramUrlValid &&
                    showInstagramUrlErrors
                  "
                  >{{ messageValidationLink }}</Message
                >
              </div>
            </div>

            <div class="create-orchestra-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-orchestra-view__form-input-field"
                  id="youtubeUrl"
                  v-model="orchestra.youtubeUrl"
                  v-keyfilter="/[^\s]/"
                  @input="validateYouTubeUrlInput"
                  :invalid="!isYouTubeUrlValid && showYouTubeUrlErrors"
                ></InputText>
                <label for="youtubeUrl">YouTube Link</label>
              </FloatLabel>
              <div class="create-orchestra-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    orchestra.youtubeUrl &&
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
                class="create-orchestra-view__form-button"
                @click.prevent="handleOrchestraCreation"
                :disabled="loading"
                :label="loading ? 'Creating...' : 'Create'"
              ></Button>
            </div>
          </div>
        </Fluid>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Form } from '@primevue/forms'
import Fluid from 'primevue/fluid'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import FileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import {
  messageInputRequired,
  messageValidationInputLength,
  messageValidationWhitespaces,
  messageValidationEmail,
  messageValidationLink,
  validateNameLength,
  validateWhitespaces,
  validateEmail,
  validateFacebookLink,
  validateInstagramLink,
  validateYouTubeLink,
} from '@/constants/validation/orchestraCreationValidation'
import type { TOrchestra } from '@/types/TOrchestra'
import { initOrchestra } from '@/constants/initOrchestra'
import { API_BASE_URL } from '@/constants/config'
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()

const orchestra = ref<TOrchestra>(initOrchestra)

const loading = ref(false)
const errorMessage = ref('')
const showNameErrors = ref(false)
const showEmailErrors = ref(false)
const showFacebookUrlErrors = ref(false)
const showInstagramUrlErrors = ref(false)
const showYouTubeUrlErrors = ref(false)

const isNameValid = computed(
  () =>
    orchestra.value.name &&
    validateNameLength(orchestra.value.name) &&
    validateWhitespaces(orchestra.value.name),
)
const isEmailValid = computed(
  () => !orchestra.value.email || validateEmail(orchestra.value.email),
)
const isFacebookUrlValid = computed(
  () =>
    !orchestra.value.facebookUrl ||
    validateFacebookLink(orchestra.value.facebookUrl),
)
const isInstagramUrlValid = computed(
  () =>
    !orchestra.value.instagramUrl ||
    validateInstagramLink(orchestra.value.instagramUrl),
)
const isYouTubeUrlValid = computed(
  () =>
    !orchestra.value.youtubeUrl ||
    validateYouTubeLink(orchestra.value.youtubeUrl),
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

const onFileSelect = async event => {
  const file = event.files[0]
  if (file) {
    orchestra.value.logo = (await fileToBase64(file)) as string
  }
}

const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const removeFileCallback = file => {
  console.log(file)
  orchestra.value.logo = null
}

const handleOrchestraCreation = async () => {
  console.log('Button clicked! Inside handleOrchestraCreation function')

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

  loading.value = true
  errorMessage.value = ''

  const formData = {
    name: orchestra.value.name,
    logo: orchestra.value.logo,
    email: orchestra.value.email,
    address: orchestra.value.address,
    history: orchestra.value.history,
    facebook_url: orchestra.value.facebookUrl,
    instagram_url: orchestra.value.instagramUrl,
    youtube_url: orchestra.value.youtubeUrl,
  }
  console.log('formData:', JSON.stringify(formData, null, 2))

  try {
    const response = await fetch(`${API_BASE_URL}/orchestra/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(formData),
    })

    if (!response) {
      const errorData = await response.json()
      const errorMessage =
        errorData.msg ||
        'Apologies for the inconvenience. Please try again later.'
      toast.add({
        severity: 'error',
        summary: 'Orchestra creation failed',
        detail: errorMessage,
        life: 3000,
      })
      throw new Error(`${errorMessage}`)
    }

    toast.add({
      severity: 'success',
      summary: `${orchestra.value.name} created successfully!`,
      detail: 'You are the orchestra owner! :)',
      life: 3000,
    })
    orchestra.value = initOrchestra
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value =
      error.message || 'An error occurred during orchestra creation.'
  } finally {
    loading.value = false
  }
}
</script>

<style setup lang="scss">
.create-orchestra-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    // gap: 50px;
    width: 100%;
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

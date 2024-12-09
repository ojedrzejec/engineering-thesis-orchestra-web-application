<template>
  <div class="create-concert-view">
    <Toast />
    <div class="create-concert-view__content">
      <div class="create-concert-view__title">
        <h1>Create new concert</h1>
      </div>
      <Form>
        <Fluid>
          <div class="create-concert-view__form">
            <div class="create-concert-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-concert-view__form-input-field"
                  id="name"
                  v-model="concert.name"
                  @input="validateNameInput"
                  :invalid="!isNameValid && showNameErrors"
                ></InputText>
                <label for="name">Concert Name</label>
              </FloatLabel>
              <div class="create-concert-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="!concert.name && showNameErrors"
                  >{{ messageInputRequired('Concert Name') }}</Message
                >
                <Message
                  severity="error"
                  v-if="
                    concert.name &&
                    !validateLength(concert.name) &&
                    showNameErrors
                  "
                  >{{ messageValidationInputLength('Concert Name') }}</Message
                >
              </div>
            </div>

            <div class="flex-auto">
              <label for="templatedisplay" class="font-bold block mb-2">
                Custom Icon
              </label>
              <DatePicker
                v-model="concert.time"
                showIcon
                fluid
                iconDisplay="input"
                timeOnly
                inputId="templatedisplay"
              >
                <template #inputicon="slotProps">
                  <i class="pi pi-clock" @click="slotProps.clickCallback"></i>
                </template>
              </DatePicker>
            </div>

            <div class="create-concert-view__form-input">
              <label for="templatedisplay" class="font-bold block mb-2">
                Custom Icon
              </label>
              <DatePicker
                v-model="concert.time"
                showIcon
                fluid
                iconDisplay="input"
                timeOnly
                inputId="templatedisplay"
              >
                <template #inputicon="slotProps">
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
                </template>
              </DatePicker>
            </div>

            <div class="create-concert-view__form-input">
              <label for="datepicker-24h" class="font-bold block mb-2">
                24h Format
              </label>
              <DatePicker
                id="datepicker-24h"
                v-model="concert.date_and_time"
                showTime
                hourFormat="24"
                fluid
                iconDisplay="input"
              >
                <template #inputicon="slotProps">
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
                </template>
              </DatePicker>
            </div>

            <div class="create-concert-view__form-input">
              <FloatLabel variant="on">
                <DatePicker
                  v-model="concert.date_and_time"
                  dateFormat="dd/mm/yy"
                  showIcon
                  inputId="dateOfBirth"
                  iconDisplay="input"
                  @input="validateDateAndTimeInput"
                  :invalid="!concert.date_and_time && showDateAndTimeErrors"
                />
                <label for="dateOfBirth">Date of Birth</label>
              </FloatLabel>
              <div class="create-concert-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="!concert.date_and_time && showDateAndTimeErrors"
                  >{{ messageInputRequired }}</Message
                >
              </div>
            </div>

            <div class="create-concert-view__form-input">
              <FloatLabel variant="on">
                <Textarea
                  class="create-concert-view__form-input-field"
                  id="place"
                  v-model="concert.place"
                  @input="validatePlaceInput"
                  :invalid="!isPlaceValid && showPlaceErrors"
                  rows="2"
                  cols="30"
                  autoResize
                ></Textarea>
                <label for="place">Location</label>
              </FloatLabel>
              <div class="create-concert-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="!concert.place && showPlaceErrors"
                  >{{ messageInputRequired('Place') }}</Message
                >
                <Message
                  severity="error"
                  v-if="
                    concert.place &&
                    !validateLength(concert.place) &&
                    showPlaceErrors
                  "
                  >{{ messageValidationInputLength('Place') }}</Message
                >
              </div>
            </div>

            <div
              class="create-concert-view__form-input create-concert-view__file"
              style="align-items: center"
            >
              <FileUpload
                mode="advanced"
                name="graphic"
                accept="image/*"
                :maxFileSize="20000000"
                class="p-button-outlined"
                :auto="false"
                :customUpload="true"
                :show-cancel-button="false"
                :show-upload-button="false"
                :chooseLabel="
                  concert.graphic ? 'Change graphic' : 'Choose concert graphic'
                "
                @remove="removeFileCallback"
                @select="onFileSelect"
              >
                <template v-if="!concert.graphic" #empty>
                  <span>Drag and drop files to here to upload.</span>
                </template>
              </FileUpload>
            </div>

            <div class="create-concert-view__form-input">
              <FloatLabel variant="on">
                <InputText
                  class="create-concert-view__form-input-field"
                  id="reservation_url"
                  v-model="concert.reservation_url"
                  v-keyfilter="/[^\s]/"
                  @input="validateReservationUrlInput"
                  :invalid="!isReservationUrlValid && showReservationUrlErrors"
                ></InputText>
                <label for="reservation_url">Link to tickets reservation</label>
              </FloatLabel>
              <div class="create-concert-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="
                    concert.reservation_url &&
                    !isReservationUrlValid &&
                    showReservationUrlErrors
                  "
                  >{{ messageValidationLink }}</Message
                >
              </div>
            </div>

            <div class="create-concert-view__form-input">
              <FloatLabel variant="on">
                <Textarea
                  id="description"
                  v-model="concert.description"
                  rows="7"
                  cols="30"
                  autoResize
                ></Textarea>
                <label for="description">Description</label>
              </FloatLabel>
            </div>

            <div v-if="errorMessage" class="error-message">
              <Message severity="error">{{ errorMessage }}</Message>
            </div>

            <div>
              <Button
                class="create-concert-view__form-button"
                @click.prevent="handleConcertCreation()"
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Form } from '@primevue/forms'
import Fluid from 'primevue/fluid'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import Toast from 'primevue/toast'
import { useConcerts } from '@/composables/useConcerts'
import type { TConcert } from '@/types/TConcert'
import { initConcert } from '@/constants/initConcert'
import {
  messageInputRequired,
  messageValidationInputLength,
  messageValidationLink,
  validateLength,
  validateLink,
} from '@/constants/validation/concertValidation'

const route = useRoute()

const {
  concerts,
  loadingConcerts,
  loadingCreateConcert,
  fetchConcerts,
  createConcert,
} = useConcerts()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchConcerts(orchestraId.toString())
  },
  { immediate: true },
)

const concert = ref<TConcert>(initConcert)

const loading = ref(false)
const errorMessage = ref('')

const showNameErrors = ref(false)
const showDateAndTimeErrors = ref(false)
const showReservationUrlErrors = ref(false)
const showPlaceErrors = ref(false)

const isNameValid = computed(
  () => concert.value.name && validateLength(concert.value.name),
)

const isPlaceValid = computed(
  () => concert.value.place && validateLength(concert.value.place),
)

const isReservationUrlValid = computed(
  () =>
    !concert.value.reservation_url ||
    validateLink(concert.value.reservation_url),
)

const validateNameInput = () => {
  showNameErrors.value = true
}
const validateDateAndTimeInput = () => {
  showDateAndTimeErrors.value = true
}

const validatePlaceInput = () => {
  showPlaceErrors.value = true
}

const validateReservationUrlInput = () => {
  showReservationUrlErrors.value = true
}

const showErrors = () => {
  showNameErrors.value = true
  showDateAndTimeErrors.value = true
  showPlaceErrors.value = true
  showReservationUrlErrors.value = true
}

const onFileSelect = async (event: FileUploadSelectEvent) => {
  if (!concert.value) return

  const file: File = Array.isArray(event.files) ? event.files[0] : event.files

  if (file) {
    concert.value.graphic = await fileToBase64(file)
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
  if (!concert.value) return

  concert.value.graphic = null
}

const handleConcertCreation = async () => {
  console.log('Button clicked! Inside handleConcertCreation function...')

  if (
    !isNameValid.value ||
    !isReservationUrlValid.value ||
    !concert.value.date_and_time ||
    !isPlaceValid.value
  ) {
    showErrors()
    return
  }

  errorMessage.value = ''

  try {
    await createConcert(
      route.params.selectedOrchestraId.toString(),
      concert.value,
    )
    await fetchConcerts(route.params.selectedOrchestraId.toString())
  } finally {
    concert.value = initConcert
  }

  // loading.value = true

  // const formData = {
  //   name: concert.value.name,
  //   date_and_time: concert.value.date_and_time,
  //   place: concert.value.place,
  //   graphic: concert.value.graphic,
  //   reservation_url: concert.value.reservation_url,
  //   description: concert.value.description,
  // }
  // console.log('formData:', JSON.stringify(formData, null, 2))

  // try {
  //   const response = await fetch(`${API_BASE_URL}/concert/`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${authStore.getToken()}`,
  //     },
  //     body: JSON.stringify(formData),
  //   })

  //   if (!response) {
  //     const errorData = await response.json()
  //     const errorMessage =
  //       errorData.msg ||
  //       'Apologies for the inconvenience. Please try again later.'
  //     toast.add({
  //       severity: 'error',
  //       summary: 'Orchestra creation failed',
  //       detail: errorMessage,
  //       life: 3000,
  //     })
  //     throw new Error(`${errorMessage}`)
  //   }

  //   toast.add({
  //     severity: 'success',
  //     summary: `${orchestra.value.name} created successfully!`,
  //     detail: 'You are the orchestra owner! :)',
  //     life: 3000,
  //   })
  //   orchestra.value = initOrchestra
  // } catch (error) {
  //   console.error('Error:', error)
  //   errorMessage.value =
  //     error.message || 'An error occurred during orchestra creation.'
  // } finally {
  //   loading.value = false
  // }
}
</script>

<style setup lang="scss">
.create-concert-view {
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

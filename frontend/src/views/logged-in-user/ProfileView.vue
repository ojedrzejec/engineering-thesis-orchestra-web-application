<template>
  <div class="profile-view">
    <div class="profile-view__title">
      <h1>My Profile</h1>
    </div>
    <Message severity="info">
      <div class="profile-view__message-info">
        <div>
          <i class="pi pi-info-circle"></i>
        </div>
        <div>Update your personal information if necessary.</div>
      </div>
    </Message>
    <Form>
      <Fluid>
        <div class="profile-view__form">
          <div class="profile-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="profile-view__form-input-field"
                id="firstName"
                v-model="orchestraMember.firstName"
                @input="validateFirstNameInput"
                :invalid="!isFirstNameValid && showFirstNameErrors"
              ></InputText>
              <label for="firstName">First Name</label>
            </FloatLabel>
            <div class="profile-view__form-error-messages">
              <Message
                severity="error"
                v-if="!orchestraMember.firstName && showFirstNameErrors"
                >{{ messageInputRequired }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraMember.firstName &&
                  !validateFirstLastNameLength(orchestraMember.firstName) &&
                  showFirstNameErrors
                "
                >{{
                  messageValidationFirstLastNameLength('First Name')
                }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraMember.firstName &&
                  !validatePolishLettersAndWhitespaces(
                    orchestraMember.firstName,
                  ) &&
                  showFirstNameErrors
                "
                >{{ messageValidationLettersAndWhitespaces }}</Message
              >
            </div>
          </div>

          <div class="profile-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="profile-view__form-input-field"
                id="lastName"
                v-model="orchestraMember.lastName"
                @input="validateLastNameInput"
                :invalid="!isLastNameValid && showLastNameErrors"
              ></InputText>
              <label for="lastName">Last Name</label>
            </FloatLabel>
            <div class="profile-view__form-error-messages">
              <Message
                severity="error"
                v-if="!orchestraMember.lastName && showLastNameErrors"
                >{{ messageInputRequired }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraMember.lastName &&
                  !validateFirstLastNameLength(orchestraMember.lastName) &&
                  showLastNameErrors
                "
                >{{
                  messageValidationFirstLastNameLength('Last Name')
                }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraMember.lastName &&
                  !validatePolishLettersAndWhitespaces(
                    orchestraMember.lastName,
                  ) &&
                  showLastNameErrors
                "
                >{{ messageValidationLettersAndWhitespaces }}</Message
              >
            </div>
          </div>

          <div class="profile-view__form-input profile-view__form-section">
            <div class="profile-view__text-color">Instruments:</div>
            <div
              v-for="(instrument, ix) in orchestraMember.instruments"
              :key="ix"
              class="profile-view__form-input-instruments"
            >
              <div
                class="profile-view__form-input-instrument-header profile-view__text-color"
              >
                Instrument: {{ ix + 1 }}
                <i
                  class="pi pi-trash"
                  style="color: slateblue"
                  @click="removeInstrument(ix)"
                ></i>
              </div>
              <div>
                <FloatLabel variant="on">
                  <InputText
                    class="profile-view__form-input-field"
                    id="instrument"
                    v-model="instrument.name"
                    @input="validateInstrumentInput"
                    @update="handleInstrumentsUpdate(instrument, ix)"
                    :invalid="!isInstrumentValid && showInstrumentErrors"
                  ></InputText>
                  <label for="instrument">Instrument Name</label>
                </FloatLabel>
                <div class="profile-view__form-error-messages">
                  <Message
                    severity="error"
                    v-if="!instrument.name && showInstrumentErrors"
                    >{{ messageInputRequired }}</Message
                  >
                  <Message
                    severity="error"
                    v-if="
                      instrument.name &&
                      !validatePolishLettersAndWhitespaces(instrument.name) &&
                      showInstrumentErrors
                    "
                    >{{ messageValidationLettersAndWhitespaces }}</Message
                  >
                </div>
              </div>
            </div>
            <div>
              <Button
                class="p-button-outlined"
                @click.prevent="addNewInstrument"
                :disabled="
                  orchestraMember.instruments.length > 0 &&
                  !orchestraMember.instruments[
                    orchestraMember.instruments.length - 1
                  ].name
                "
                :label="loading ? 'Adding Instrument...' : 'Add Instrument'"
              ></Button>
            </div>
          </div>

          <div class="profile-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="profile-view__form-input-field"
                v-model="orchestraMember.phone"
                id="phone"
                @input="validatePhoneInput"
                :invalid="!isPhoneValid && showPhoneErrors"
                v-keyfilter="{
                  pattern: /^[\+]?([0-9]{1,11})?$/,
                  validateOnly: true,
                }"
              ></InputText>
              <label for="phone">Phone Number</label>
            </FloatLabel>
            <div class="profile-view__form-error-messages">
              <Message
                severity="error"
                v-if="!orchestraMember.phone && showPhoneErrors"
                >{{ messageInputRequired }}</Message
              >
              <Message
                severity="error"
                v-if="
                  orchestraMember.phone &&
                  !validatePhoneNumber(orchestraMember.phone) &&
                  showPhoneErrors
                "
                >{{ messageValidationPhoneNumber }}</Message
              >
            </div>
          </div>

          <div class="profile-view__form-input">
            <FloatLabel variant="on">
              <DatePicker
                v-model="orchestraMember.dateOfBirth"
                dateFormat="dd/mm/yy"
                showIcon
                inputId="dateOfBirth"
                iconDisplay="input"
                @input="validateDateOfBirthInput"
                :invalid="!orchestraMember.dateOfBirth && showDateOfBirthErrors"
              />
              <label for="dateOfBirth">Date of Birth</label>
            </FloatLabel>
            <div class="profile-view__form-error-messages">
              <Message
                severity="error"
                v-if="!orchestraMember.dateOfBirth && showDateOfBirthErrors"
                >{{ messageInputRequired }}</Message
              >
            </div>
          </div>

          <div class="profile-view__form-input">
            <SelectButton
              v-model="orchestraMember.isStudent"
              :options="options"
              optionLabel="name"
              optionValue="value"
              @click="validateIsStudentInput"
              :invalid="
                orchestraMember.isStudent === null && showIsStudentErrors
              "
            />
            <div class="profile-view__form-error-messages">
              <Message
                severity="error"
                v-if="orchestraMember.isStudent === null && showIsStudentErrors"
                >{{ messageInputRequired }}</Message
              >
            </div>

            <div v-if="orchestraMember.isStudent">
              <FloatLabel variant="on">
                <Textarea
                  id="university"
                  v-model="orchestraMember.university"
                  rows="1"
                  cols="30"
                  autoResize
                  @input="validateUniversityInput"
                  :invalid="!orchestraMember.university && showUniversityErrors"
                ></Textarea>
                <label for="university">University Name</label>
              </FloatLabel>
              <div class="profile-view__form-error-messages">
                <Message
                  severity="error"
                  v-if="!orchestraMember.university && showUniversityErrors"
                  >{{ messageInputRequired }}</Message
                >
              </div>
            </div>
          </div>

          <div
            class="profile-view__form-input profile-view__file"
            style="align-items: center"
          >
            <FileUpload
              mode="advanced"
              name="profilePicture"
              accept="image/*"
              :maxFileSize="1000000"
              class="p-button-outlined"
              :auto="false"
              :customUpload="true"
              :show-cancel-button="false"
              :show-upload-button="false"
              :chooseLabel="
                orchestraMember.profilePicture
                  ? 'Change Profile Picture'
                  : 'Choose Your Profile Picture'
              "
              @remove="removeFileCallback"
              @select="onFileSelect"
            >
              <!-- @upload="onFileSelect" -->
              <template v-if="!orchestraMember.profilePicture" #empty>
                <span>Drag and drop files to here to upload.</span>
              </template>
            </FileUpload>
            <div v-if="orchestraMember.profilePicture">
              <img
                :src="orchestraMember.profilePicture"
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

          <div class="profile-view__form-input">
            <FloatLabel variant="on">
              <Textarea
                id="description"
                v-model="orchestraMember.description"
                rows="6"
                cols="30"
                autoResize
              ></Textarea>
              <label for="description"
                >Description - write a few words about yourself
                <i class="pi pi-face-smile"></i
              ></label>
            </FloatLabel>
          </div>

          <div v-if="errorMessage" class="error-message">
            <Message severity="error">{{ errorMessage }}</Message>
          </div>

          <div>
            <Button
              class="profile-view__form-button"
              @click.prevent="handleUpdate"
              :disabled="loading"
              :label="loading ? 'Updating...' : 'Update'"
            ></Button>
          </div>
        </div>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
import type { TOrchestraMember } from '@/types/TOrchestraMember'
import type { TInstrument } from '@/types/TInstrument'
import { initInstrument } from '@/constants/initInstrument'
import { initOrchestraMember } from '@/constants/initOrchestraMember'
import { messageInputRequired } from '@/constants/validation/loginValidation'
import {
  messageValidationFirstLastNameLength,
  messageValidationLettersAndWhitespaces,
  messageValidationPhoneNumber,
  validateFirstLastNameLength,
  validatePolishLettersAndWhitespaces,
  validatePhoneNumber,
} from '@/constants/validation/registrationValidation'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import Fluid from 'primevue/fluid'
import DatePicker from 'primevue/datepicker'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { Form } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const toast = useToast()

const orchestraMember = ref<TOrchestraMember>(initOrchestraMember)

onMounted(async () => {
  console.log('onMounted function')

  await authStore.fetchUserProfileData()
  orchestraMember.value = authStore.userProfile

  if (!orchestraMember.value) {
    toast.add({
      severity: 'error',
      summary: 'Error loading user data.',
      life: 3000,
    })
    console.error('Error loading data')
    return
  }

  console.log('GET data: ', orchestraMember.value)
  toast.add({
    severity: 'success',
    summary: 'Your data loaded successfully!',
    life: 3000,
  })
})

const options = ref([
  { name: 'I am a student currently.', value: true },
  { name: 'I am NOT a student currently.', value: false },
])

const loading = ref(false)
const errorMessage = ref('')
const showFirstNameErrors = ref(false)
const showLastNameErrors = ref(false)
const showIsStudentErrors = ref(false)
const showUniversityErrors = ref(false)
const showInstrumentErrors = ref(false)
const showDateOfBirthErrors = ref(false)
const showPhoneErrors = ref(false)

// Computed Properties for Validation
const isFirstNameValid = computed(
  () =>
    orchestraMember.value.firstName &&
    validateFirstLastNameLength(orchestraMember.value.firstName) &&
    validatePolishLettersAndWhitespaces(orchestraMember.value.firstName),
)
const isLastNameValid = computed(
  () =>
    orchestraMember.value.lastName &&
    validateFirstLastNameLength(orchestraMember.value.lastName) &&
    validatePolishLettersAndWhitespaces(orchestraMember.value.lastName),
)
const isInstrumentValid = computed(() =>
  orchestraMember.value.instruments.every(
    instrument =>
      instrument.name && validatePolishLettersAndWhitespaces(instrument.name),
  ),
)
const isPhoneValid = computed(
  () =>
    orchestraMember.value.phone &&
    validatePhoneNumber(orchestraMember.value.phone),
)

// Validation Methods
const validateFirstNameInput = () => {
  showFirstNameErrors.value = true
}
const validateLastNameInput = () => {
  showLastNameErrors.value = true
}
const validateInstrumentInput = () => {
  showInstrumentErrors.value = true
}
const validateDateOfBirthInput = () => {
  showDateOfBirthErrors.value = true
}
const validateIsStudentInput = () => {
  showIsStudentErrors.value = true
}
const validateUniversityInput = () => {
  showUniversityErrors.value = true
}
const validatePhoneInput = () => {
  showPhoneErrors.value = true
}

const showErrors = () => {
  showFirstNameErrors.value = true
  showLastNameErrors.value = true
  showInstrumentErrors.value = true
  showPhoneErrors.value = true
  showDateOfBirthErrors.value = true
  showIsStudentErrors.value = true
  showUniversityErrors.value = true
}

const removeInstrument = (ix: number) => {
  orchestraMember.value.instruments = orchestraMember.value.instruments.filter(
    (_, index) => index !== ix,
  )
}

const addNewInstrument = () => {
  orchestraMember.value.instruments = [
    ...orchestraMember.value.instruments,
    Object.assign({}, initInstrument),
  ]
}

const handleInstrumentsUpdate = (instrument: TInstrument, ix: number) => {
  orchestraMember.value.instruments = orchestraMember.value.instruments.map(
    (inst, i) => (i === ix ? instrument : inst),
  )
}

const onFileSelect = async (event: FileUploadSelectEvent) => {
  if (!orchestraMember.value) return

  const file: File = Array.isArray(event.files) ? event.files[0] : event.files

  if (file) {
    orchestraMember.value.profilePicture = await fileToBase64(file)
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
  if (!orchestraMember.value) return

  orchestraMember.value.profilePicture = null
}

const handleUpdate = async () => {
  if (
    !isFirstNameValid.value ||
    !isLastNameValid.value ||
    orchestraMember.value.isStudent === null ||
    (orchestraMember.value.isStudent && !orchestraMember.value.university) ||
    !isInstrumentValid.value ||
    !orchestraMember.value.dateOfBirth ||
    !isPhoneValid.value
  ) {
    showErrors()
    return
  }

  loading.value = true
  errorMessage.value = ''

  if (orchestraMember.value.isStudent === false) {
    orchestraMember.value.university = null
  }

  const updateData = {
    first_name: orchestraMember.value.firstName,
    last_name: orchestraMember.value.lastName,
    instruments: orchestraMember.value.instruments.map(instrument =>
      instrument.name?.toLowerCase(),
    ),
    phone: orchestraMember.value.phone,
    birth_date: orchestraMember.value.dateOfBirth.toISOString().split('T')[0],
    are_you_student: orchestraMember.value.isStudent,
    university: orchestraMember.value.university,
    profile_picture: orchestraMember.value.profilePicture,
    description: orchestraMember.value.description,
  }
  console.log('updateData: ', JSON.stringify(updateData, null, 2))

  try {
    const response = await fetch(`${API_BASE_URL}/orchestra-member/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // informs the server that the data being sent in the request body is formatted as JSON
        Authorization: `Bearer ${authStore.getToken()}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response) {
      const errorData = await response.json()
      const errorMessage =
        errorData.msg ||
        'Apologies for the inconvenience. Please try again later.'
      toast.add({
        severity: 'error',
        summary: 'Update failed',
        detail: errorMessage,
        life: 3000,
      })
      throw new Error(
        `Update failed. Please try again later. - ${errorMessage}`,
      )
    }

    toast.add({
      severity: 'success',
      summary: 'Your data were updated successfully!',
      detail: 'Explore your account! :)',
      life: 3000,
    })
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred during update.'
  } finally {
    loading.value = false
  }
}
</script>

<style setup lang="scss">
.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;

  &__title {
    margin-bottom: 20px;
  }

  &__message-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  &__form {
    margin-top: 50px;
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
    min-width: 300px;
  }

  &__form-error-messages {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__info {
    margin-bottom: 40px;
    text-align: center;
  }

  &__form-button {
    width: 100%;
    min-width: 300px;
  }

  &__form-input-instruments {
    margin: 10px 0 10px;
  }

  &__form-input-instrument-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__text-color {
    color: #475569;
  }

  &__file {
    .p-fileupload-file-badge {
      display: none !important;
    }
  }

  &__form-section {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 17px;
  }
}
</style>

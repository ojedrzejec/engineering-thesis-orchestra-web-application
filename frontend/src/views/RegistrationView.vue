<template>
  <div class="registration-view">
    <Toast />
    <div class="registration-view__title">
      <h1>Create your account</h1>
    </div>
    <div class="registration-view__info">
      Do you already have an account? <RouterLink to="/login">Go to LOGIN page.</RouterLink>
    </div>
    <Form>
      <Fluid>
        <div class="registration-view__form">
          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <InputText 
                class="registration-view__form-input-field"
                id="email" 
                v-model="orchestraMember.email" 
                v-keyfilter="/[^\s]/"
                @input="validateEmailInput" 
                :invalid="!isEmailValid && showEmailErrors"
              ></InputText>
              <label for="email">Email</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!orchestraMember.email && showEmailErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="orchestraMember.email && !isEmailValid && showEmailErrors">{{ messageValidationEmail }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <Password 
                id="password" 
                v-model="orchestraMember.password" 
                toggleMask
                @input="validatePasswordInput" 
                :invalid="!isPasswordValid && showPasswordErrors"
                autocomplete="current-password"
              >
                <template #footer>
                  <div class="registration-view__form-error-messages">
                    <Divider />
                    <Message severity="error" v-if="!orchestraMember.password && showPasswordErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validatePasswordLength(orchestraMember.password) && showPasswordErrors">{{ messageValidationPasswordLength }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validateSpecialCharacter(orchestraMember.password) && showPasswordErrors">{{ messageValidationSpecialCharacter }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validateDigitNumber(orchestraMember.password) && showPasswordErrors">{{ messageValidationDigitNumber }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validateCapitalLetter(orchestraMember.password) && showPasswordErrors">{{ messageValidationCapitalLetter }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validateSmallLetter(orchestraMember.password) && showPasswordErrors">{{ messageValidationSmallLetter }}</Message>
                    <Message severity="error" v-if="orchestraMember.password && !validateNoWhitespaces(orchestraMember.password) && showPasswordErrors">{{ messageValidationNoWhitespaces }}</Message>
                  </div>
                </template>
              </Password>
              <label for="password">Password</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <!-- <Message severity="error" v-if="!password && showPasswordErrors">{{ messageValidationInput }}</Message> -->
              <Message severity="error" v-if="!orchestraMember.password && showPasswordErrors" >
                {{ messageInputRequired }}
              </Message>
              <Message 
                severity="error" 
                v-if="orchestraMember.password && showPasswordErrors && (
                    !validatePasswordLength(orchestraMember.password) 
                    || !validateSpecialCharacter(orchestraMember.password) 
                    || !validateDigitNumber(orchestraMember.password) 
                    || !validateCapitalLetter(orchestraMember.password) 
                    || !validateSmallLetter(orchestraMember.password) 
                    || !validateNoWhitespaces(orchestraMember.password)
                  )"
              > {{ messageValidationInput }}
              </Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <Password 
                id="passwordRepeated" 
                v-model="passwordRepeated" 
                toggleMask
                @input="validatePasswordRepeatedInput" 
                :invalid="!isPasswordRepeatedValid && showPasswordRepeatedErrors"
                :feedback="false"
              >
              </Password>
              <label for="passwordRepeated">Repeat Password</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!passwordRepeated && showPasswordRepeatedErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="passwordRepeated && (!orchestraMember.password || !validatePasswordsMatch(orchestraMember.password, passwordRepeated)) && showPasswordRepeatedErrors">{{ messageValidationPasswordsMatch }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <InputText 
                class="registration-view__form-input-field"
                id="firstName" 
                v-model="orchestraMember.firstName" 
                @input="validateFirstNameInput" 
                :invalid="!isFirstNameValid && showFirstNameErrors"
              ></InputText>
              <label for="firstName">First Name</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!orchestraMember.firstName && showFirstNameErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="orchestraMember.firstName && !validateFirstLastNameLength(orchestraMember.firstName) && showFirstNameErrors">{{ messageValidationFirstLastNameLength("First Name") }}</Message>
              <Message severity="error" v-if="orchestraMember.firstName && !validateLettersAndWhitespaces(orchestraMember.firstName) && showFirstNameErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <InputText 
                class="registration-view__form-input-field"
                id="lastName" 
                v-model="orchestraMember.lastName" 
                @input="validateLastNameInput" 
                :invalid="!isLastNameValid && showLastNameErrors"
              ></InputText>
              <label for="lastName">Last Name</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!orchestraMember.lastName && showLastNameErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="orchestraMember.lastName && !validateFirstLastNameLength(orchestraMember.lastName) && showLastNameErrors">{{ messageValidationFirstLastNameLength("Last Name") }}</Message>
              <Message severity="error" v-if="orchestraMember.lastName && !validateLettersAndWhitespaces(orchestraMember.lastName) && showLastNameErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <div class="registration-view__text-color">Instruments:</div>
            <div v-for="(instrument, ix) in instruments" :key="ix" class="registration-view__form-input-instruments">
              <div class="registration-view__form-input-instrument-header registration-view__text-color">
                Instrument: {{ ix + 1 }}
                <i class="pi pi-trash" style="color: slateblue" @click="removeInstrument(ix)"></i>
              </div>
              <div>
                <FloatLabel variant="on">
                  <InputText 
                    class="registration-view__form-input-field"
                    id="instrument" 
                    v-model="instrument.name"
                    @input="validateInstrumentInput" 
                    @update="handleInstrumentsUpdate(instrument, ix)"
                    :invalid="!isInstrumentValid && showInstrumentErrors"
                  ></InputText>
                  <label for="instrument">Instrument Name</label>
                </FloatLabel>
                <div class="registration-view__form-error-messages">
                  <Message severity="error" v-if="!instrument.name && showInstrumentErrors">{{ messageInputRequired }}</Message>
                  <Message severity="error" v-if="instrument.name && !validateLettersAndWhitespaces(instrument.name) && showInstrumentErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
                </div>
              </div>
            </div>
            <div>
              <Button 
                severity="secondary"
                @click.prevent="addNewInstrument"
                :disabled="instruments.length > 0 && !instruments[instruments.length - 1].name"
                :label="loading ? 'Adding Instrument...' : 'Add Instrument'" 
              ></Button>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <InputText 
                  class="registration-view__form-input-field"
                  v-model="orchestraMember.phone"
                  id="phone" 
                  @input="validatePhoneInput" 
                  :invalid="!isPhoneValid && showPhoneErrors"
                  v-keyfilter="{ pattern: /^[\+]?([0-9]{1,11})?$/, validateOnly: true }"
                ></InputText>
              <label for="phone">Phone Number</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!orchestraMember.phone && showPhoneErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="orchestraMember.phone && !validatePhoneNumber(orchestraMember.phone) && showPhoneErrors">{{ messageValidationPhoneNumber }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
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
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!orchestraMember.dateOfBirth && showDateOfBirthErrors">{{ messageInputRequired }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <SelectButton 
              v-model="orchestraMember.isStudent" 
              :options="options"
              optionLabel="name"
              optionValue="value"
              @click="validateIsStudentInput"
              :invalid="orchestraMember.isStudent === null && showIsStudentErrors" 
            />
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="orchestraMember.isStudent === null && showIsStudentErrors">{{ messageInputRequired }}</Message>
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
              <div class="registration-view__form-error-messages">
                <Message severity="error" v-if="!orchestraMember.university && showUniversityErrors">{{ messageInputRequired }}</Message>
              </div>
            </div>
          </div>

          <!-- TODO - Add profilePicture -->

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <Textarea 
                id="description" 
                v-model="orchestraMember.description" 
                rows="6" 
                cols="30" 
                autoResize
              ></Textarea>
              <label for="description">Description - write a few words about yourself <i class="pi pi-face-smile"></i></label>
            </FloatLabel>
          </div>

          <div v-if="errorMessage" class="error-message">
            <Message severity="error">{{ errorMessage }}</Message>
          </div>

          <div>
            <Button 
              class="registration-view__form-button"
              @click.prevent="handleRegister"
              :disabled="loading"
              :label="loading ? 'Registering...' : 'Register'" 
            ></Button>
          </div>
        </div>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Fluid from 'primevue/fluid';
import DatePicker from 'primevue/datepicker';
import { Form } from '@primevue/forms';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { API_BASE_URL } from '@/constants/config';
import { 
  messageValidationInput, 
  messageInputRequired,
  messageValidationPasswordLength, 
  messageValidationSpecialCharacter, 
  messageValidationDigitNumber, 
  messageValidationCapitalLetter, 
  messageValidationSmallLetter, 
  messageValidationEmail, 
  messageValidationNoWhitespaces,
  validatePasswordLength, 
  validateSpecialCharacter, 
  validateDigitNumber, 
  validateCapitalLetter, 
  validateSmallLetter, 
  validateEmail, 
  validateNoWhitespaces 
} from '@/constants/validation/loginValidation';
import { 
  messageValidationPasswordsMatch, 
  messageValidationFirstLastNameLength,
  messageValidationLettersAndWhitespaces,
  messageValidationPhoneNumber,
  validatePasswordsMatch,
  validateFirstLastNameLength,
  validateLettersAndWhitespaces,
  validatePhoneNumber,
} from '@/constants/validation/registrationValidation';
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import { initOrchestraMember } from '@/constants/initOrchestraMember';
import type { TInstrument } from '@/types/TInstrument';
import { initInstrument } from '@/constants/initInstrument';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const orchestraMember = ref<TOrchestraMember>(initOrchestraMember);
const passwordRepeated = ref<string | null>(null);
const options = ref([
    { name: 'I am a student currently.', value: true },
    { name: 'I am NOT a student currently.', value: false }
]);
const instruments = ref<TInstrument[]>([]);

const removeInstrument = (ix: number) => {
  instruments.value = instruments.value.filter((_, index) => index !== ix)
}
const addNewInstrument = () => {
  // instruments.value = [...instruments.value, initInstrument];
  instruments.value = [...instruments.value, Object.assign({}, initInstrument)]
}
const handleInstrumentsUpdate = (instrument: TInstrument, ix: number) => {
  instruments.value = instruments.value.map((inst, i) => i === ix ? instrument : inst)
}

const loading = ref(false);
const errorMessage = ref('');
const showEmailErrors = ref(false); // Controls if error messages should be displayed for email
const showPasswordErrors = ref(false); // Controls if error messages should be displayed for password
const showPasswordRepeatedErrors = ref(false);
const showFirstNameErrors = ref(false);
const showLastNameErrors = ref(false);
const showIsStudentErrors = ref(false);
const showUniversityErrors = ref(false);
const showInstrumentErrors = ref(false);
const showDateOfBirthErrors = ref(false);
const showPhoneErrors = ref(false);

// Computed Properties for Validation
const isEmailValid = computed(() => orchestraMember.value.email && validateEmail(orchestraMember.value.email) && validateNoWhitespaces(orchestraMember.value.email));
const isPasswordValid = computed(() => orchestraMember.value.password && validatePasswordLength(orchestraMember.value.password) && validateSpecialCharacter(orchestraMember.value.password) &&
  validateDigitNumber(orchestraMember.value.password) && validateCapitalLetter(orchestraMember.value.password) && validateSmallLetter(orchestraMember.value.password) && validateNoWhitespaces(orchestraMember.value.password));
const isPasswordRepeatedValid = computed(() => passwordRepeated.value && (!orchestraMember.value.password || validatePasswordsMatch(orchestraMember.value.password, passwordRepeated.value)));
const isFirstNameValid = computed(() => orchestraMember.value.firstName && validateFirstLastNameLength(orchestraMember.value.firstName) && validateLettersAndWhitespaces(orchestraMember.value.firstName));
const isLastNameValid = computed(() => orchestraMember.value.lastName && validateFirstLastNameLength(orchestraMember.value.lastName) && validateLettersAndWhitespaces(orchestraMember.value.lastName));
const isInstrumentValid = computed(() => instruments.value.every(instrument => instrument.name && validateLettersAndWhitespaces(instrument.name)));
const isPhoneValid = computed(() => orchestraMember.value.phone && validatePhoneNumber(orchestraMember.value.phone));

// Validation Methods
const validateEmailInput = () => {
  showEmailErrors.value = true; // Enable error display for email when user types
};
const validatePasswordInput = () => {
  showPasswordErrors.value = true; // Enable error display for password when user types
};
const validatePasswordRepeatedInput = () => {
  showPasswordRepeatedErrors.value = true; // Enable error display for password when user types
};
const validateFirstNameInput = () => {
  showFirstNameErrors.value = true;
};
const validateLastNameInput = () => {
  showLastNameErrors.value = true;
};
const validateInstrumentInput = () => {
  showInstrumentErrors.value = true;
};
const validateDateOfBirthInput = () => {
  showDateOfBirthErrors.value = true;
};
const validateIsStudentInput = () => {
  showIsStudentErrors.value = true;
};
const validateUniversityInput = () => {
  showUniversityErrors.value = true;
};
const validatePhoneInput = () => {
  showPhoneErrors.value = true;
}

const showErrors = () => {
  showEmailErrors.value = true;
  showPasswordErrors.value = true;
  showPasswordRepeatedErrors.value = true;
  showFirstNameErrors.value = true;
  showLastNameErrors.value = true;
  showInstrumentErrors.value = true;
  showPhoneErrors.value = true;
  showDateOfBirthErrors.value = true;
  showIsStudentErrors.value = true;
  showUniversityErrors.value = true;
};

// Register Handler
const handleRegister = async () => {
  // Check if all fields are valid before proceeding with register
  if (!isEmailValid.value || !isPasswordValid.value || !isPasswordRepeatedValid.value || 
    !isFirstNameValid.value || !isLastNameValid.value || orchestraMember.value.isStudent === null || 
    (orchestraMember.value.isStudent && !orchestraMember.value.university) || !isInstrumentValid.value ||
    !orchestraMember.value.dateOfBirth || !isPhoneValid.value) {
    // errorMessage.value = 'Please correct the errors before registering in.';
    showErrors();
    return;
  }

  console.log("NO input ERRORS");
  
  loading.value = true;
  errorMessage.value = '';

  const instrumentNamesArray = instruments.value.map(instrument => instrument.name?.toLowerCase());
  
  const registerData = {
    email: orchestraMember.value.email,
    password: orchestraMember.value.password,
    first_name: orchestraMember.value.firstName,
    last_name: orchestraMember.value.lastName,
    instruments: instrumentNamesArray,
    phone: orchestraMember.value.phone,
    birth_date: orchestraMember.value.dateOfBirth,
    are_you_student: orchestraMember.value.isStudent,
    university: orchestraMember.value.university,
    // profile_picture: orchestraMember.value.profilePicture,
    description: orchestraMember.value.description,
  };
  console.log(JSON.stringify(registerData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      throw new Error('Register failed. Please try again later.');
    }

    toast.add({ severity: 'info', summary: 'Registered successfully!', detail: 'Now log in to your account! :)', life: 3000 });

    const { token } = await response.json();
    authStore.setToken(token);
    const redirectPath = route.query.redirect?.toString() || '/';
    router.push(redirectPath);

  } catch (error) {
    errorMessage.value = error.message || 'An error occurred during register.';
  } finally {
    loading.value = false;
  }
};
</script>

<style setup lang="scss">
.registration-view {
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
    margin-bottom: 8px
  }

  &__text-color {
    color: #424242;
  }   
}
</style>

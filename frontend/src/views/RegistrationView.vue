<template>
  <div class="registration-view">
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
                v-model="email" 
                v-keyfilter="/[^\s]/"
                @input="validateEmailInput" 
                :invalid="!isEmailValid && showEmailErrors"
              ></InputText>
              <label for="email">Email</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <Message severity="error" v-if="!email && showEmailErrors">{{ messageInputRequired }}</Message>
              <Message severity="error" v-if="email && !isEmailValid && showEmailErrors">{{ messageValidationEmail }}</Message>
            </div>
          </div>

          <div class="registration-view__form-input">
            <FloatLabel variant="on">
              <Password 
                id="password" 
                v-model="password" 
                toggleMask
                @input="validatePasswordInput" 
                :invalid="!isPasswordValid && showPasswordErrors"
                autocomplete="current-password"
              >
                <template #footer>
                  <div class="registration-view__form-error-messages">
                    <Divider />
                    <Message severity="error" v-if="!password && showPasswordErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="password && !validatePasswordLength(password) && showPasswordErrors">{{ messageValidationPasswordLength }}</Message>
                    <Message severity="error" v-if="password && !validateSpecialCharacter(password) && showPasswordErrors">{{ messageValidationSpecialCharacter }}</Message>
                    <Message severity="error" v-if="password && !validateDigitNumber(password) && showPasswordErrors">{{ messageValidationDigitNumber }}</Message>
                    <Message severity="error" v-if="password && !validateCapitalLetter(password) && showPasswordErrors">{{ messageValidationCapitalLetter }}</Message>
                    <Message severity="error" v-if="password && !validateSmallLetter(password) && showPasswordErrors">{{ messageValidationSmallLetter }}</Message>
                    <Message severity="error" v-if="password && !validateNoWhitespaces(password) && showPasswordErrors">{{ messageValidationNoWhitespaces }}</Message>
                  </div>
                </template>
              </Password>
              <label for="password">Password</label>
            </FloatLabel>
            <div class="registration-view__form-error-messages">
              <!-- <Message severity="error" v-if="!password && showPasswordErrors">{{ messageValidationInput }}</Message> -->
              <Message severity="error" v-if="!password && showPasswordErrors" >
                {{ messageInputRequired }}
              </Message>
              <Message 
                severity="error" 
                v-if="password && showPasswordErrors && (
                    !validatePasswordLength(password) 
                    || !validateSpecialCharacter(password) 
                    || !validateDigitNumber(password) 
                    || !validateCapitalLetter(password) 
                    || !validateSmallLetter(password) 
                    || !validateNoWhitespaces(password)
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
              <Message severity="error" v-if="passwordRepeated && (!password || !validatePasswordsMatch(password, passwordRepeated)) && showPasswordRepeatedErrors">{{ messageValidationPasswordsMatch }}</Message>
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
              <Message severity="error" v-if="orchestraMember.firstName && !validateSmallCapitalLetters(orchestraMember.firstName) && showFirstNameErrors">{{ messageValidationSmallCapitalLetters }}</Message>
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
              <Message severity="error" v-if="orchestraMember.lastName && !validateSmallCapitalLetters(orchestraMember.lastName) && showFirstNameErrors">{{ messageValidationSmallCapitalLetters }}</Message>
            </div>
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
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import Password from 'primevue/password';
import Divider from 'primevue/divider';
import Fluid from 'primevue/fluid';
import { Form } from '@primevue/forms';
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
  messageValidationSmallCapitalLetters,
  validatePasswordsMatch,
  validateFirstLastNameLength,
  validateSmallCapitalLetters,
} from '@/constants/validation/registrationValidation';
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import { initOrchestraMember } from '@/constants/initOrchestraMember';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref<string | null>(null);
const password = ref<string | null>(null);
const passwordRepeated = ref<string | null>(null);
const orchestraMember = ref<TOrchestraMember>(initOrchestraMember);

const loading = ref(false);
const errorMessage = ref('');
const showEmailErrors = ref(false); // Controls if error messages should be displayed for email
const showPasswordErrors = ref(false); // Controls if error messages should be displayed for password
const showPasswordRepeatedErrors = ref(false);
const showFirstNameErrors = ref(false);
const showLastNameErrors = ref(false);

// Computed Properties for Validation
const isEmailValid = computed(() => email.value && validateEmail(email.value) && validateNoWhitespaces(email.value));
const isPasswordValid = computed(() => password.value && validatePasswordLength(password.value) && validateSpecialCharacter(password.value) &&
  validateDigitNumber(password.value) && validateCapitalLetter(password.value) && validateSmallLetter(password.value) && validateNoWhitespaces(password.value));
// const isPasswordRepeatedValid = computed(() => passwordRepeated.value && password.value && validatePasswordsMatch(password.value, passwordRepeated.value));
const isPasswordRepeatedValid = computed(() => passwordRepeated.value && (!password.value || validatePasswordsMatch(password.value, passwordRepeated.value)));
const isFirstNameValid = computed(() => orchestraMember.value.firstName && validateFirstLastNameLength(orchestraMember.value.firstName) && validateSmallCapitalLetters(orchestraMember.value.firstName));
const isLastNameValid = computed(() => orchestraMember.value.lastName && validateFirstLastNameLength(orchestraMember.value.lastName) && validateSmallCapitalLetters(orchestraMember.value.lastName));

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

const showErrors = () => {
  showEmailErrors.value = true;
  showPasswordErrors.value = true;
  showPasswordRepeatedErrors.value = true;
  showFirstNameErrors.value = true;
  showLastNameErrors.value = true;
};

// Register Handler
const handleRegister = async () => {
  // Check if all fields are valid before proceeding with register
  if (!isEmailValid.value || !isPasswordValid.value || !isPasswordRepeatedValid.value || !isFirstNameValid.value || !isLastNameValid.value) {
    // errorMessage.value = 'Please correct the errors before registering in.';
    showErrors();
    return;
  }

  console.log("NO input ERRORS");
  
  loading.value = true;
  errorMessage.value = '';

  const registerData = {
    email: email.value,
    password: password.value,
    firstName: orchestraMember.value.firstName,
    lastName: orchestraMember.value.lastName,
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
    gap: 25px;
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
}
</style>

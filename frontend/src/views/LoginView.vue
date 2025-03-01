<template>
  <div class="login-view">
    <Toast />
    <div class="login-view__title">
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__info">
      Don't have an account?
      <RouterLink to="/registration">Go to REGISTRATION page.</RouterLink>
    </div>
    <Form @submit="handleLogin">
      <Fluid>
        <div class="login-view__form">
          <div class="login-view__form-input">
            <FloatLabel variant="on">
              <InputText
                class="login-view__form-input-field"
                id="email"
                v-model="email"
                v-keyfilter="/[^\s]/"
                @input="validateEmailInput"
                :invalid="!isEmailValid && showEmailErrors"
              ></InputText>
              <label for="email">Email</label>
            </FloatLabel>
            <div class="login-view__form-error-messages">
              <Message severity="error" v-if="!email && showEmailErrors">{{
                messageInputRequired
              }}</Message>
              <Message
                severity="error"
                v-if="email && !isEmailValid && showEmailErrors"
                >{{ messageValidationEmail }}</Message
              >
            </div>
          </div>

          <div class="login-view__form-input">
            <FloatLabel variant="on">
              <Password
                id="password"
                v-model="password"
                toggleMask
                @input="validatePasswordInput"
                :invalid="!isPasswordValid && showPasswordErrors"
                autocomplete="current-password"
                :feedback="false"
              >
                <!-- <template #footer>
                  <div class="login-view__form-error-messages">
                    <Divider />
                    <Message severity="error" v-if="!password && showPasswordErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="password && !validatePasswordLength(password) && showPasswordErrors">{{ messageValidationPasswordLength }}</Message>
                    <Message severity="error" v-if="password && !validateSpecialCharacter(password) && showPasswordErrors">{{ messageValidationSpecialCharacter }}</Message>
                    <Message severity="error" v-if="password && !validateDigitNumber(password) && showPasswordErrors">{{ messageValidationDigitNumber }}</Message>
                    <Message severity="error" v-if="password && !validateCapitalLetter(password) && showPasswordErrors">{{ messageValidationCapitalLetter }}</Message>
                    <Message severity="error" v-if="password && !validateSmallLetter(password) && showPasswordErrors">{{ messageValidationSmallLetter }}</Message>
                    <Message severity="error" v-if="password && !validateNoWhitespaces(password) && showPasswordErrors">{{ messageValidationNoWhitespaces }}</Message>
                  </div>
                </template> -->
              </Password>
              <label for="password">Password</label>
            </FloatLabel>
            <div class="login-view__form-error-messages">
              <!-- <Message severity="error" v-if="!password && showPasswordErrors">{{ messageValidationInput }}</Message> -->
              <Message severity="error" v-if="!password && showPasswordErrors">
                {{ messageInputRequired }}
              </Message>
              <Message
                severity="error"
                v-if="
                  password &&
                  showPasswordErrors &&
                  (!validatePasswordLength(password) ||
                    !validateSpecialCharacter(password) ||
                    !validateDigitNumber(password) ||
                    !validateCapitalLetter(password) ||
                    !validateSmallLetter(password) ||
                    !validateNoWhitespaces(password))
                "
              >
                {{ messageValidationInput }}
              </Message>
            </div>
          </div>
          <div v-if="errorMessage" class="error-message">
            <Message severity="error">{{ errorMessage }}</Message>
          </div>

          <div>
            <Button
              class="login-view__form-button"
              type="submit"
              :disabled="loading"
              :label="loading ? 'Logging in...' : 'Log in'"
            />
          </div>
        </div>
      </Fluid>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Message from 'primevue/message'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import Fluid from 'primevue/fluid'
import { Form } from '@primevue/forms'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { API_BASE_URL } from '@/constants/config'
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
  validateNoWhitespaces,
} from '@/constants/validation/loginValidation'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref<string | null>(null)
const password = ref<string | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const showEmailErrors = ref(false) // Controls if error messages should be displayed for email
const showPasswordErrors = ref(false) // Controls if error messages should be displayed for password

// Computed Properties for Validation
const isEmailValid = computed(
  () =>
    email.value &&
    validateEmail(email.value) &&
    validateNoWhitespaces(email.value),
)
const isPasswordValid = computed(
  () =>
    password.value &&
    validatePasswordLength(password.value) &&
    validateSpecialCharacter(password.value) &&
    validateDigitNumber(password.value) &&
    validateCapitalLetter(password.value) &&
    validateSmallLetter(password.value) &&
    validateNoWhitespaces(password.value),
)

// Validation Methods
const validateEmailInput = () => {
  showEmailErrors.value = true // Enable error display for email when user types
}
const validatePasswordInput = () => {
  showPasswordErrors.value = true // Enable error display for password when user types
}

const showErrors = () => {
  showEmailErrors.value = true
  showPasswordErrors.value = true
}

// Login Handler
const handleLogin = async () => {
  // Check if all fields are valid before proceeding with login
  if (!isEmailValid.value || !isPasswordValid.value) {
    // errorMessage.value = 'Please correct the errors before logging in.';
    showErrors()
    return
  }

  loading.value = true
  errorMessage.value = ''

  const loginData = {
    email: email.value,
    password: password.value,
  }
  console.log(JSON.stringify(loginData, null, 2))

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage =
        errorData.msg || 'Please check your credentials and try again.'
      toast.add({
        severity: 'error',
        summary: 'Login failed',
        detail: errorMessage,
        life: 3000,
      })
      throw new Error(`Login failed. ${errorMessage}`)
    }

    toast.add({
      severity: 'info',
      summary: 'Successful login!',
      detail: 'Explore your account! :)',
      life: 3000,
    })

    const data = await response.json()
    console.log('Login response:', data) // Log the response
    const { token } = data
    console.log('Received token:', token) // Log the token
    authStore.setToken(token)
    console.log('Token set in authStore:', authStore.getToken())
    const redirectPath = route.query.redirect?.toString() || '/profile'
    router.push(redirectPath)
  } catch (error) {
    errorMessage.value =
      (error as Error).message || 'An error occurred during login.'
  } finally {
    loading.value = false
  }
}
</script>

<style setup lang="scss">
.login-view {
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

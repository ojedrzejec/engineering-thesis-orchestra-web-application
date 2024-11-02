<template>
  <div class="login-view">
    <div>
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__info">
      Don't have an account? <RouterLink to="/registration">Go to REGISTRATION page.</RouterLink>
    </div>
    <div class="login-view__form">
      <!-- Email Input Field -->
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText 
            id="email" 
            v-model="email" 
            @input="validateEmailInput" 
            :invalid="!isEmailValid" 
          ></InputText>
          <label for="email">Email</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!email && showErrors">{{ messageValidationInput }}</Message>
          <Message severity="error" v-if="!isEmailValid && email && showErrors">{{ messageValidationEmail }}</Message>
        </div>
      </div>

      <!-- Password Input Field -->
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText 
            id="password" 
            v-model="password" 
            type="password"
            @input="validatePasswordInput" 
            :invalid="!isPasswordValid" 
          ></InputText>
          <label for="password">Password</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!password && showErrors">{{ messageValidationInput }}</Message>
          <Message severity="error" v-if="password && !validateLength(password)">{{ messageValidationLength }}</Message>
          <Message severity="error" v-if="password && !validateSpecialCharacter(password)">{{ messageValidationSpecialCharacter }}</Message>
          <Message severity="error" v-if="password && !validateDigitNumber(password)">{{ messageValidationDigitNumber }}</Message>
          <Message severity="error" v-if="password && !validateCapitalLetter(password)">{{ messageValidationCapitalLetter }}</Message>
          <Message severity="error" v-if="password && !validateSmallLetter(password)">{{ messageValidationSmallLetter }}</Message>
          <Message severity="error" v-if="password && !validateNoWhitespaces(password)">{{ messageValidationNoWhitespaces }}</Message>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <Message severity="error">{{ errorMessage }}</Message>
      </div>

      <!-- Login Button -->
      <div>
        <Button 
          @click.prevent="handleLogin"
          :disabled="loading"
          :label="loading ? 'Logging in...' : 'Login'" 
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { API_BASE_URL } from '@/constants/config';
import { 
  messageValidationInput, 
  messageValidationLength, 
  messageValidationSpecialCharacter, 
  messageValidationDigitNumber, 
  messageValidationCapitalLetter, 
  messageValidationSmallLetter, 
  messageValidationEmail, 
  messageValidationNoWhitespaces 
} from '@/constants/validation/loginValidation';
import { 
  validateInput, 
  validateLength, 
  validateSpecialCharacter, 
  validateDigitNumber, 
  validateCapitalLetter, 
  validateSmallLetter, 
  validateEmail, 
  validateNoWhitespaces 
} from '@/constants/validation/loginValidation';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref<string | null>(null);
const password = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const showErrors = ref(false); // Controls if error messages should be displayed

// Computed Properties for Validation
const isEmailValid = computed(() => email.value && validateEmail(email.value) && validateNoWhitespaces(email.value));
const isPasswordValid = computed(() => password.value && validateLength(password.value) && validateSpecialCharacter(password.value) &&
  validateDigitNumber(password.value) && validateCapitalLetter(password.value) && validateSmallLetter(password.value) && validateNoWhitespaces(password.value));

// Validation Methods
const validateEmailInput = () => {
  showErrors.value = true; // Enable error display when user types
};
const validatePasswordInput = () => {
  showErrors.value = true; // Enable error display when user types
};

// Login Handler
const handleLogin = async () => {
  if (!isEmailValid.value || !isPasswordValid.value) {
    validateEmailInput();
    validatePasswordInput();
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';

  const loginData = {
    email: email.value,
    password: password.value
  };
  console.log(JSON.stringify(loginData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials and try again.');
    }

    const { token } = await response.json();
    authStore.setToken(token);
    const redirectPath = route.query.redirect?.toString() || '/';
    router.push(redirectPath);

  } catch (error) {
    errorMessage.value = error.message || 'An error occurred during login.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-view__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.login-view__form-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.login-view__form-error-messages {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.login-view__info {
  margin-bottom: 40px;
  text-align: center;
}
</style>

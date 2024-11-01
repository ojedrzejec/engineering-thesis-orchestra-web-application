<template>
  <div class="login-view">
    <div>
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__info">
      Don't have an account? <RouterLink to="/registration">Go to REGISTRATION page.</RouterLink>
    </div>
    <div class="login-view__form">
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="email" v-model="email" :invalid="!validateEmailInput()" ></InputText>
          <label for="email">Email</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateInput(email)">{{messageValidationInput}}</Message>
          <Message severity="error" v-if="!validateEmail(email)">{{messageValidationEmail}}</Message>
          <Message severity="error" v-if="!validateNoWhitespaces(email)">{{messageValidationNoWhitespaces}}</Message>
        </div>
      </div>
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="password" v-model="password" :invalid="!validatePasswordInput()" ></InputText>
          <label for="password">Password</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateInput(password)">{{messageValidationInput}}</Message>
          <Message severity="error" v-if="!validateLength(password)">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSpecialCharacter(password)">{{messageValidationSpecialCharacter}}</Message>
          <Message severity="error" v-if="!validateDigitNumber(password)">{{messageValidationDigitNumber}}</Message>
          <Message severity="error" v-if="!validateCapitalLetter(password)">{{messageValidationCapitalLetter}}</Message>
          <Message severity="error" v-if="!validateSmallLetter(password)">{{messageValidationSmallLetter}}</Message>
          <Message severity="error" v-if="!validateNoWhitespaces(password)">{{messageValidationNoWhitespaces}}</Message>
        </div>
      </div>
      <div v-if="errorMessage" class="error-message">
        <Message severity="error">{{ errorMessage }}</Message>
      </div>
      <div>
        <Button 
          @click.prevent="handleLogin"
          :disabled="loading || !(validateEmailInput() && validatePasswordInput())"
          :label="loading ? 'Logging in...' : 'Login'" >
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Message from 'primevue/message';
import { messageValidationInput, messageValidationLength, messageValidationSpecialCharacter, messageValidationDigitNumber, messageValidationCapitalLetter, messageValidationSmallLetter, messageValidationEmail, messageValidationNoWhitespaces } from '@/constants/validation/loginValidation'
import { validateInput, validateLength, validateSpecialCharacter, validateDigitNumber, validateCapitalLetter, validateSmallLetter, validateEmail, validateNoWhitespaces } from '@/constants/validation/loginValidation'
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { API_BASE_URL } from '@/constants/config';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const authStore = useAuthStore()
const loading = ref(false);
const errorMessage = ref('');

const validateEmailInput = () => {
  return validateInput(email.value) && validateNoWhitespaces(email.value) && validateEmail(email.value);
}
const validatePasswordInput = () => {
  // return validateInput(password.value) && validateNoWhitespaces(password.value) && validateLength(password.value) && validateSpecialCharacter(password.value) && validateDigitNumber(password.value) && validateCapitalLetter(password.value) && validateSmallLetter(password.value);
  return true
}

const handleLogin = async () => {
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
      body: JSON.stringify(loginData, null, 2),
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

<style>
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
  flex-direction: row;
  gap: 5px;
}

.login-view__info {
  margin-bottom: 40px;
  text-align: center;
}
</style>

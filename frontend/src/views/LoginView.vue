<template>
  <div class="login-view">
    <div>
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__form" >
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="email" v-model="email" :invalid="!validateEmailInput()" ></InputText>
          <label for="email">Email</label>
        </FloatLabel>
        {{ console.log(email) }}
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
        {{ console.log(password) }}
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateInput(password)">{{messageValidationInput}}</Message>
          <Message severity="error" v-if="!validateLength(password)">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSpecialCharacter(password)">{{messageValidationSpecialCharacter}}</Message>
          <Message severity="error" v-if="!validateDigitNumber(password)">{{messageValidationDigitNumber}}</Message>
          <Message severity="error" v-if="!validateCapitalLetter(password)">{{messageValidationCapitalLetter}}</Message>
          <Message severity="error" v-if="!validateSmallLetter(password)">{{messageValidationSmallLetter}}</Message>
          <Message severity="error" v-if="!validateNoWhitespaces(password)">{{messageValidationNoWhitespaces}}</Message>
          <!-- <Message severity="error" v-if="!validateSmallCapitalLetters(password)">{{messageValidationSmallCapitalLetters}}</Message> -->
        </div>
      </div>
      <div>
        <Button label="Login"></Button>
      </div>
    </div>
    <div class="login-view__info">
      Don't have an account? <RouterLink to="/registration">Go to REGISTRATION page.</RouterLink>
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

const email = ref('');
const password = ref('');

const validateEmailInput = () => {
  return validateInput(email.value) && validateNoWhitespaces(email.value) && validateEmail(email.value);
}
const validatePasswordInput = () => {
  return validateInput(password.value) && validateNoWhitespaces(password.value) && validateLength(password.value) && validateSpecialCharacter(password.value) && validateDigitNumber(password.value) && validateCapitalLetter(password.value) && validateSmallLetter(password.value);
}
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
  margin-top: 40px;
  text-align: center;
}
</style>

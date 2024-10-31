<template>
  <div class="login-view">
    <div>
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__form">
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="email" v-model="email" :invalid="!validateEmailInput()" ></InputText>
          <label for="email">Email</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateInput(email)">{{messageValidationInput}}</Message>
          <Message severity="error" v-if="!validateEmail()">{{messageValidationEmail}}</Message>
          <Message severity="error" v-if="!validateNoWhitespaces(email)">{{messageValidateNoWhitespaces}}</Message>
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
          <Message severity="error" v-if="!validateNoWhitespaces(password)">{{messageValidateNoWhitespaces}}</Message>
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

const email = ref('');
const password = ref('');

// validation messages
const messageValidationInput = "Input is required.";
const messageValidationLength = "Password must be at least 8 characters long.";
const messageValidationSpecialCharacter = "Password must be at least 1 special character.";
const messageValidationDigitNumber = "Password must be at least 1 digit number.";
// const messageValidationSmallCapitalLetters = "Input must contain only letters.";
const messageValidationCapitalLetter = "Input must contain at least 1 capital letter.";
const messageValidationSmallLetter = "Input must contain at least 1 small letter.";
const messageValidationEmail = "Please enter a valid email address.";
const messageValidateNoWhitespaces = "Input must not contain whitespaces.";

// validation functions
const validateInput = (input: string) => {
  return input.length > 0;
}

const validateLength = (input: string) => {
  return input.length >= 8;
}

const validateSpecialCharacter = (input: string) => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(input);
}

const validateDigitNumber = (input: string) => {
  return /[0-9]/.test(input);
}

const validateSmallCapitalLetters = (input: string) => {
  return /^[a-zA-Z]+$/.test(input);
}

const validateCapitalLetter = (input: string) => {
  return /[A-Z]/.test(input);
}

const validateSmallLetter = (input: string) => {
  return /[a-z]/.test(input);
}

const validateNoWhitespaces = (input: string) => {
  return !/\s/.test(input);
}

const validateEmail = () => {
  return email.value && /.+@.+\..+/.test(email.value);
}

const validateEmailInput = () => {
  return validateInput(email.value) && validateNoWhitespaces(email.value) && validateEmail();
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

<template>
  <div class="registration-view">
    <div>
      <h1>Create your account</h1>
    </div>
    <div class="registration-view__form">
      <div class="registration-view__form-input">
        <FloatLabel variant="on">
          <InputText id="username" v-model="username" :invalid="!validateUsername" ></InputText>
          <label for="username">Username</label>
        </FloatLabel>
        <div class="registration-view__form-error-messages">
          <Message severity="error" v-if="!validateLength()">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSmallCapitalLetters()">{{messageValidationSmallCapitalLetters}}</Message>
        </div>
      </div>
      <div class="registration-view__form-input">
        <FloatLabel variant="on">
          <InputText id="password" v-model="password" :invalid="!validatePassword" ></InputText>
          <label for="password">Password</label>
        </FloatLabel>
        <div class="registration-view__form-error-messages">
          <Message severity="error" v-if="!validateLength()">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSmallCapitalLetters()">{{messageValidationSmallCapitalLetters}}</Message>
        </div>
      </div>
      <div class="registration-view__form-input">
        <FloatLabel variant="on">
          <InputText id="text" v-model="passwordRepeated" :invalid="!validatePasswordRepeated" ></InputText>
          <label for="text">Repeat password</label>
        </FloatLabel>
        <div class="registration-view__form-error-messages">
          <Message severity="error" v-if="!validatePasswordRepeated()">{{messageValidationPasswordRepeated}}</Message>
        </div>
      </div>
      <div>
        <Button label="Register"></Button>
      </div>
    </div>
    <div class="registration-view__info">
      Do you already have an account? <RouterLink to="/login">Go to LOGIN page.</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';

const username = ref('');
const password = ref('');
const passwordRepeated = ref('');

const messageValidationLength = "Input must be at least 2 characters long.";
const validateLength = () => {
  return username.value.length >= 2;
}

const messageValidationSmallCapitalLetters = "Input must contain only letters.";
const validateSmallCapitalLetters = () => {
  return username.value.match("^[a-zA-Z]+$");
}

const validateUsername = () => {
  return (validateLength() && validateSmallCapitalLetters());
}

const validatePassword = () => {
  return (validateLength() && validateSmallCapitalLetters());
}

const messageValidationPasswordRepeated = "Passwords do not match.";
const validatePasswordRepeated = () => {
  return password.value === passwordRepeated.value;
}
</script>

<style>
.registration-view__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.registration-view__form-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.registration-view__form-error-messages {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

.registration-view__info {
  margin-top: 40px;
  text-align: center;
}

/* @media (min-width: 1024px) {
  .registration {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>

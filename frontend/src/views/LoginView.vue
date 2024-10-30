<template>
  <div class="login-view">
    <div>
      <h1>Login to your account</h1>
    </div>
    <div class="login-view__form">
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="username" v-model="username" :invalid="!validateUsername" ></InputText>
          <label for="username">Username</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateLength()">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSmallCapitalLetters()">{{messageValidationSmallCapitalLetters}}</Message>
        </div>
      </div>
      <div class="login-view__form-input">
        <FloatLabel variant="on">
          <InputText id="password" v-model="password" :invalid="!validatePassword" ></InputText>
          <label for="password">Password</label>
        </FloatLabel>
        <div class="login-view__form-error-messages">
          <Message severity="error" v-if="!validateLength()">{{messageValidationLength}}</Message>
          <Message severity="error" v-if="!validateSmallCapitalLetters()">{{messageValidationSmallCapitalLetters}}</Message>
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

const username = ref('');
const password = ref('');

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

/* @media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>

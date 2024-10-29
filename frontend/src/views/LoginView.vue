<template>
  <div class="login">
    <h1>Login to your account</h1>
  </div>
  <div>
    <FloatLabel variant="in">
      <InputText id="username" v-model="username" :invalid="!validationUsername" ></InputText>
      <label for="username">Username</label>
    </FloatLabel>
    <FloatLabel variant="in">
      <InputText id="password" v-model="password" :invalid="!validationPassword" ></InputText>
      <label for="password">Password</label>
    </FloatLabel>
    <Button label="Login"></Button>
  </div>
  <div>
    Don't have an account? <RouterLink to="/registration">Register</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';

const username = ref('');
const validationUsername = ref('');
const password = ref('');
const validationPassword = ref('');
</script>

<style>
/* @media (min-width: 1024px) {
  .login {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
</style>

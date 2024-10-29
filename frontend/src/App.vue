<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <br />
        <RouterLink to="/about">About</RouterLink>
        <br />
        <RouterLink to="/login">Login</RouterLink>
        <br />
        <RouterLink to="/registration">Registration</RouterLink>
      </nav>
      <Button label="Test Button"></Button>
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Button from 'primevue/button';
</script>

<style>
</style>

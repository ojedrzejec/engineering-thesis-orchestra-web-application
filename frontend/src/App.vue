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
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { computed } from 'vue'


const authStore = useAuthStore()
const router = useRouter()

const loginLogoutButtonLabel = computed(() => {
  if (authStore.isSignedIn) {
    return 'Sign out'
  }

  return 'Sign in'
})

const handleLoginLogoutButtonClick = () => {
  if (authStore.isSignedIn) {
    authStore.removeToken()
  }

  router.push({ name: 'login' })
}
</script>

<style>
</style>

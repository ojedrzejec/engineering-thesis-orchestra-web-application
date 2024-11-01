import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { signedOutOnly: true },
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView,
      meta: { signedOutOnly: true },
    },
    // {
    //   path: '/orchestra-member-edit-info',
    //   name: 'orchestra-member-edit-info',
    //   component: OrchestraMemberEditInfoView,
    //   meta: { signedInOnly: true },
    // },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta?.signedInOnly && !authStore.isSignedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta?.signedOutOnly && authStore.isSignedIn) {
    return {
      path: '/',
    }
  }
})

export default router

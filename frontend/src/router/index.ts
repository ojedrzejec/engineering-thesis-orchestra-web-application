import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/guest/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import ConductorBoardAboutView from '@/views/guest/aboutUs/ConductorBoardAboutView.vue'
import HistoryAboutView from '@/views/guest/aboutUs/HistoryAboutView.vue'
import InstrumentsAboutView from '@/views/guest/aboutUs/InstrumentsAboutView.vue'
import PhotosGalleryView from '@/views/guest/gallery/PhotosGalleryView.vue'
import VideosGalleryView from '@/views/guest/gallery/VideosGalleryView.vue'
import PreviousConcertsView from '@/views/guest/concerts/PreviousConcertsView.vue'
import UpcomingConcertsView from '@/views/guest/concerts/UpcomingConcertsView.vue'
import CreateOrchestraView from '@/views/CreateOrchestraView.vue'
import ProfileView from '@/views/ProfileView.vue'

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
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { logOutOnly: true },
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView,
      meta: { logOutOnly: true },
    },
    {
      path: '/contact',
      name: 'contact',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/guest/ContactView.vue'),
      meta: { logOutOnly: true },
    },
    {
      path: '/instruments',
      name: 'instruments',
      component: InstrumentsAboutView,
      meta: { logOutOnly: true },
    },
    {
      path: '/conductor-and-board',
      name: 'conductor-and-board',
      component: ConductorBoardAboutView,
      meta: { logOutOnly: true },
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryAboutView,
      meta: { logOutOnly: true },
    },
    {
      path: '/photos',
      name: 'photos',
      component: PhotosGalleryView,
      meta: { logOutOnly: true },
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosGalleryView,
      meta: { logOutOnly: true },
    },
    {
      path: '/previous-concerts',
      name: 'previous-concerts',
      component: PreviousConcertsView,
      meta: { logOutOnly: true },
    },
    {
      path: '/upcoming-concerts',
      name: 'upcoming-concerts',
      component: UpcomingConcertsView,
      meta: { logOutOnly: true },
    },
    {
      path: '/create-orchestra',
      name: 'create-orchestra',
      component: CreateOrchestraView,
      meta: { logInOnly: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { logInOnly: true },
    },
    {
      path: '/availability',
      name: 'availability',
      component: () => import('@/views/player/AvailabilityView.vue'),
      meta: { logInOnly: true },
    },
    {
      path: '/pieces-of-music',
      name: 'pieces-of-music',
      component: () => import('@/views/player/PiecesOfMusicView.vue'),
      meta: { logInOnly: true },
    },
    {
      path: '/orchestra-information',
      name: 'orchestra-information',
      component: () => import('@/views/owner/OrchestraInformationView.vue'),
      meta: { logInOnly: true },
    },
    {
      path: '/members',
      name: 'members',
      component: () => import('@/views/owner/MembersView.vue'),
      meta: { logInOnly: true },
    },
    {
      path: '/instruments',
      name: 'instruments',
      component: () => import('@/views/owner/InstrumentsView.vue'),
      meta: { logInOnly: true },
    },
    {
      path: '/manage-access',
      name: 'manage-access',
      component: () => import('@/views/owner/ManageAccessView.vue'),
      meta: { logInOnly: true },
    }
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta?.logInOnly && !authStore.isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta?.logOutOnly && authStore.isLoggedIn) {
    return {
      path: '/profile',
    }
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/guest/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import ConductorBoardAboutView from '@/views/guest/aboutUs/ConductorBoardAboutView.vue'
import HistoryAboutView from '@/views/guest/aboutUs/HistoryAboutView.vue'
import InstrumentsAboutView from '@/views/guest/aboutUs/InstrumentsAboutView.vue'
import PhotosGalleryView from '@/views/guest/gallery/PhotosGalleryView.vue'
import VideosGalleryView from '@/views/guest/gallery/VideosGalleryView.vue'
import PreviousEventsView from '@/views/guest/events/PreviousEventsView.vue'
import UpcomingEventsView from '@/views/guest/events/UpcomingEventsView.vue'

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
      path: '/previous-events',
      name: 'previous-events',
      component: PreviousEventsView,
      meta: { logOutOnly: true },
    },
    {
      path: '/upcoming-events',
      name: 'upcoming-events',
      component: UpcomingEventsView,
      meta: { logOutOnly: true },
    },
    // {
    //   path: '/orchestra-member-edit-info',
    //   name: 'orchestra-member-edit-info',
    //   component: OrchestraMemberEditInfoView,
    //   meta: { logInOnly: true },
    // },
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
      path: '/',
    }
  }
})

export default router

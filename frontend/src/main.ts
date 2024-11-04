import './assets/styles.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Ripple from 'primevue/ripple'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none', // dark mode disabled
        }
    },
});

app.directive('ripple', Ripple) // Register the Ripple directive globally

const pinia = createPinia()
app.use(pinia)

app.mount('#app')

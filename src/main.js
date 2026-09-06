import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/400-italic.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import '@fontsource/atkinson-hyperlegible/700-italic.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import dbPlugin from './dbPlugin.js'
import { captureEvent, initializeAnalytics } from './services/analytics.js'

import VueCameraLib from 'vue-camera-lib'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'juanNutrisyon',
    themes: {
      juanNutrisyon: {
        dark: false,
        colors: {
          primary: '#1e784b',
          secondary: '#e7a629',
          surface: '#ffffff',
          background: '#fbfdfb',
          error: '#b3261e',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify);
app.use(VueCameraLib);
app.use(dbPlugin);

initializeAnalytics();
router.afterEach((to) => {
  captureEvent('$pageview', { $current_url: window.location.href, route_name: to.name })
})

app.mount('#app')

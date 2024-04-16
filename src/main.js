import './assets/main.css'
import { StreamBarcodeReader } from "vue-barcode-reader";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import dbPlugin from './dbPlugin.js'

import VueCameraLib from 'vue-camera-lib'
import 'vuetify/dist/vuetify.min.css'

import 'vue-toast-notification/dist/theme-bootstrap.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(router)
app.use(vuetify);
app.use(VueCameraLib);
app.use(dbPlugin);

app.component('StreamBarcodeReader', StreamBarcodeReader);

//app.provide('dbPromise', dbPromise);

app.mount('#app')

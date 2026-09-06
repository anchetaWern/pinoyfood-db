<template>
  <v-app>
    <default-bar :loggedInUser="loggedInUser" />

    <default-view />

    <donation-modal />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
import DonationModal from '@/components/contribution/DonationModal.vue'

import { auth } from '@/firebase.js'
import { onAuthStateChanged } from "firebase/auth"

const loggedInUser = ref(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    loggedInUser.value = user;
  } else {
    loggedInUser.value = null;
  }
});
</script>

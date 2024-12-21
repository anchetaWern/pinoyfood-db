<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <a href="/" style="color: #333;">
        <img :src="logo" alt="juan nutrisyon logo" style="width:150px;" />
      </a>
    </v-app-bar-title>

    <div class="mr-2">
      <v-btn size="small" icon="mdi-help" @click="helpDialog = true"></v-btn>

      <a href="/" style="color: #333;" v-if="loggedInUser">single</a>

      <a href="/bulk" style="color: #333;" v-if="loggedInUser">| bulk</a>
      
      <a href="/login" style="color: #333;" v-if="!loggedInUser">login</a>

      <a href="#" @click="logoutUser" style="color: #333;" v-if="loggedInUser">| logout</a>
    </div>
  </v-app-bar>


  <v-dialog
    v-model="helpDialog"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card title="Help">
        <template v-slot:text>
          Hello! Thank you for contributing to the pinoy food database! Your contribution is greatly appreciated. <br>
          <br> First step is to acquire an API key which you can use for logging in. 
          <br> Please send me an email at ancheta dot wern at gmail dot com
          <br> Once you acquired your API key. Click on <a href="/login">login</a>, paste your API key and log in.
          <br> After that, you can help out in two ways:
          <ol class="pl-5">
            <li>Via the bulk upload - this allows you to pick multiple images from your gallery and submit it by bulk.</li>
            <li>Via the single upload - this allows you to upload food labels one by one.</li>
          </ol>
          <br> Once submitted, it will undergo through a review process before it becomes available on the main website (app.juanutrisyon.info). 
          
          <br> Here's what each field are for:
          <br>
          <ul class="pl-5">
            <li>Food or product title - this is the photo of the food itself. Make sure that the title is clear as this will be used when adding the food into the database.</li>
            <li>Food label - the nutrition facts. Yes, this web app only accepts foods that already have food labels in them.</li>
            <li>Ingredients - no explanation needed. This may also include allergen information.</li>
            <li>Barcode - this will be used for barcode search</li>
          </ul>
        </template>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="ok"
            variant="flat"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>


</template>

<script>
import logo from '@/assets/juan-nutrisyon.png'
import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import { signOut } from "firebase/auth"
import { auth } from '@/firebase.js'

export default {
  data: () => ({
    logo,
    helpDialog: false
  }),

  props: {
    loggedInUser: {
      type: Object,
    }
  },

  methods: {
    async logoutUser(event)
    {
      event.preventDefault();
      console.log('logout');

      localStorage.clear();

      try {
        await signOut(auth);
        console.log("User logged out");
        createToast(
          {
            title: 'Logout successful',
          }, 
          { type: 'success', position: 'bottom-right' }
        );
      } catch (error) {
        console.error("Error logging out:", error.message);
      }

      this.$router.push(`/login`);

    }
  }

}
</script>

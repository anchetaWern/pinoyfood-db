<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <a href="/" style="color: #333;">
        <img :src="logo" alt="juan nutrisyon logo" style="width:150px;" />
      </a>
    </v-app-bar-title>

    <div class="mr-2">
      <v-btn size="small" icon="mdi-help" @click="helpDialog = true"></v-btn>

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
          Hello 👋! Thank you for contributing to the Juan Nutrisyon database! Your contribution is greatly appreciated. <br>
          To contribute, just select the photos of grocery foods from your phone. <br> Please include photos of the main label (food title). The food label (nutrition facts), and ingredients are optional.
          Logging in is optional, but if you want to be recognized as a contributor, please consider <a href="https://app.juanutrisyon.info/register">creating an account</a> and then <a href="https://contribute.juanutrisyon.info/login">logging in</a> before uploading photos. 
          That way we'll know exactly who contributed 🙏.
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

<template>
  <v-app-bar flat class="contribution-app-bar">
    <v-app-bar-title>
      <router-link to="/" class="brand-link">
        <img :src="logo" alt="Juan Nutrisyon" />
      </router-link>
    </v-app-bar-title>

    <div class="app-bar-actions mr-2">
      <v-btn
        class="support-button"
        size="small"
        variant="text"
        prepend-icon="mdi-heart-outline"
        @click="openDonationModal('header')"
      >
        Support
      </v-btn>

      <v-btn
        v-if="showHelp"
        size="small"
        icon="mdi-help"
        aria-label="Contribution upload help"
        @click="helpDialog = true"
      ></v-btn>

      <router-link to="/login" class="account-link" v-if="!loggedInUser && showHelp">Log in</router-link>

      <a href="#" @click="logoutUser" class="account-link" v-if="loggedInUser">Log out</a>
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
import { useDonationModal } from '@/composables/useDonationModal'

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

  setup() {
    return useDonationModal();
  },

  computed: {
    showHelp() {
      return ['/bulk', '/scan', '/contribute/product-labels'].includes(this.$route.path);
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

<style scoped>
.contribution-app-bar {
  border-bottom: 1px solid #dfe9e3;
}

.brand-link {
  display: inline-flex;
  align-items: center;
}

.brand-link img {
  display: block;
  width: 150px;
}

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.account-link {
  padding: 5px;
  color: #27473a;
  font-weight: 650;
  text-decoration: none;
}

@media (max-width: 600px) {
  .brand-link img {
    width: 130px;
  }

  .support-button :deep(.v-btn__content) {
    font-size: 0;
  }

  .support-button :deep(.v-icon) {
    margin: 0;
    font-size: 22px;
  }
}
</style>

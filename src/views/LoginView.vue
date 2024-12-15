<template>

  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">

      <v-text-field clearable label="Email" v-model="email"></v-text-field>
      <v-text-field
        v-model="password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        name="password"
        clearable
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-btn block @click="login" color="grey-darken-4">
      Login
      </v-btn>

    </v-responsive>
  </v-container>
  
</template>

<script>
import { createToast } from 'mosha-vue-toastify'
import { auth } from '@/firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  
  data() {
    return {
      email: '',
      password: '', 
      showPassword: false,
    };
  },

  methods: {
    async login() {
      
      try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            this.email,
            this.password
        );
      
        createToast(
          {
            title: 'Login successful',
          }, 
          { type: 'success', position: 'bottom-right' }
        );

        this.$router.push(`/bulk`);

      } catch (error) {
        
          createToast(
              {
                  title: 'Error logging in',
                  description: "Please check your details."
              }, 
              { type: 'danger', position: 'bottom-right' }
          );

      }

    }
  }
}
</script>

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

      <v-btn block @click="login" color="grey-darken-4" :disabled="loggingIn">
      {{  loggingIn ? "Logging in.." : "Login" }}
      </v-btn>

    </v-responsive>
  </v-container>
  
</template>

<script>
import { createToast } from 'mosha-vue-toastify'
import { auth } from '@/firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios'

const API_BASE_URI = import.meta.env.VITE_API_URI;

export default {
  
  data() {
    return {
      email: '',
      password: '', 
      showPassword: false,
      loggingIn: false,
    };
  },

  methods: {
    async login() {

      this.loggingIn = true;
      
      try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            this.email,
            this.password
        );

        const user = userCredential.user;

        const token = await user.getIdToken();
  
        const res = await axios.post(`${API_BASE_URI}/firebase-auth/sync`, 
          { 
            token
          }, 
        );

        localStorage.setItem('api_key', res.data.user.api_key);

        createToast(
          {
            title: 'Login successful',
          }, 
          { type: 'success', position: 'bottom-right' }
        );

        this.email = '';
        this.password = '';
        this.loggingIn = false;
        
        this.$router.push(`/bulk`);

      } catch (error) {
        
          createToast(
              {
                  title: 'Error logging in',
                  description: "Please check your details."
              }, 
              { type: 'danger', position: 'bottom-right' }
          );

          this.loggingIn = false;

      }

    }
  }
}
</script>

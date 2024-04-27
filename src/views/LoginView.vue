<template>

  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">

      <v-text-field clearable label="API key" v-model="apiKey"></v-text-field>

      <v-btn block @click="login" color="grey-darken-4">
      Login
      </v-btn>

    </v-responsive>
  </v-container>
  
</template>

<script>
import { createToast, clearToasts } from 'mosha-vue-toastify'

export default {
  
  data() {
    return {
      apiKey: '', 
    };
  },

  methods: {
    async login() {
      const apiKey = this.apiKey;
      localStorage.setItem('api_key', apiKey);

      createToast(
        {
          title: 'API key saved!',
          description: 'You can now start submitting food labels'
        }, 
        { type: 'success', position: 'bottom-right' }
      );

      this.apiKey = '';
    }
  }
}
</script>

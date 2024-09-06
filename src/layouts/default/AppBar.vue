<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <a href="/" style="color: #333;">
      <v-icon icon="mdi-food" />
      PinoyFood DB
      </a>
    </v-app-bar-title>

    <div class="mr-2">
      <v-btn icon="mdi-help" @click="helpDialog = true"></v-btn>
      <a href="/bulk" style="color: #333;">bulk</a>
      |
      <a href="/login" style="color: #333;">login</a>
    </div>
  </v-app-bar>


  <v-dialog
    v-model="helpDialog"
    width="auto"
  >
    <template v-slot:default="{ isActive }">
      <v-card title="Help">
        <template v-slot:text>
          Hello! Thank you for contributing to the food database! First step is to acquire an API key which you can use for logging in. 
          <br> Please send me an email at ancheta dot wern at gmail dot com
          <br> You can use this web app to submit foods and their food labels, ingredients and barcode. 
          <br> Once submitted, it will undergo through a review process before it becomes available on the main website. 
          <br> Do note that it may take a while since I'm just a one-man team who's also busy with work and life).
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

export default {
  data: () => ({
    helpDialog: false
  }),

}
</script>

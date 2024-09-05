<template>

  <v-container class="fill-height">
    <v-responsive class="align-center fill-height pt-12">

      <v-file-input
        v-model="selectedFiles"
        label="Upload Images"
        multiple
        show-size
        accept="image/*"
        @change="previewImages"
        prepend-icon="mdi-camera"
      ></v-file-input>


      <v-row v-if="images.length" class="mt-4">
        <v-col v-for="(image, index) in images" :key="index" cols="12" sm="4" md="3">
          <v-card>
            <v-img :src="image.url" height="150px"></v-img>
            <v-card-actions>
              <v-btn color="red" @click="removeImage(index)">
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-btn block v-if="images.length" color="grey-darken-4" class="mt-4" @click="uploadImagesOneByOne">
        Upload
      </v-btn>

      <v-progress-linear
        v-if="uploading"
        :value="progressPercentage"
        height="20"
        color="blue"
        class="mt-4"
      ></v-progress-linear>

      <v-alert
        v-if="uploading"
        class="mt-2"
        type="info"
      >
        {{ uploadedImagesCount }}/{{ totalImages }} images uploaded
      </v-alert>


     
    </v-responsive>
  </v-container>
  
</template>

<script>
export default {
  data() {
    return {
      images: [],
    };
  },
  methods: {
    previewImages(event) {
      const files = event.target.files;
      this.images = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.images.push({ file, url: e.target.result });
        };

        reader.readAsDataURL(file);
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },

    async uploadImagesOneByOne() {
      for (const [index, image] of this.images.entries()) {
        const formData = new FormData();
        formData.append('image', image.file);

        try {
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Image ${index + 1} failed to upload`);
          }

          const data = await response.json();
          console.log(`Image ${index + 1} uploaded successfully`, data);

          // Remove the uploaded image from the array
          this.images.splice(index, 1);
        } catch (error) {
          console.error(error);
          //alert(`There was an error uploading image ${index + 1}`);
        }
      }

      if (!this.images.length) {
        //alert('All images uploaded successfully!');
      }
    },

  },
};
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.image-preview {
  position: relative;
}

.image-preview img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.image-preview button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.v-progress-linear {
  margin-top: 20px;
}
</style>
<template>

  <v-container class="fill-height">
    <v-responsive class="align-center pt-12">

      <div class="mb-3">
        <v-alert text="Click on the field below to select photos of food labels (including the title, and optionally the ingredients)" type="info"></v-alert>
      </div>

      <v-file-input
        v-model="selectedFiles"
        label="Upload Images"
        multiple
        show-size
        accept="image/*"
        @change="previewImages"
        prepend-icon="mdi-camera"
      ></v-file-input>


      <div class="mt-3">
        <v-progress-linear
          v-if="uploading"
          :model-value="progressPercentage"
          color="blue"
        ></v-progress-linear>
      </div>

      <div class="text-subtitle-2" v-if="uploading">{{ uploadedImagesCount }}/{{ totalImages }} images uploaded</div>

      <div v-if="images.length" ref="uploadActions" class="mt-4 bulk-import-actions">
        <v-btn block :disabled="uploading" color="grey-darken-4" @click="uploadImagesOneByOne">
          {{ uploading ? "Uploading..." : "Upload Images" }}
        </v-btn>
      </div>


      <div v-if="images.length" class="mt-4 bulk-import-grid">
        <div v-for="(image, index) in images" :key="index">
          <v-card class="px-2">
            <v-img :src="image.url" height="150px"></v-img>
            <v-card-actions>
              <v-btn color="red" @click="removeImage(index)">
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>

    </v-responsive>
  </v-container>
  
</template>

<script>
const API_BASE_URI = import.meta.env.VITE_API_URI;
const JUANUTRISYON_API_KEY = import.meta.env.VITE_APP_JUANUTRISYON_API_KEY;
import Compressor from 'compressorjs'
import axios from 'axios'
import { createToast, clearToasts } from 'mosha-vue-toastify'

export default {
  data() {
    return {
      images: [],

      selectedFiles: null,
      uploadedImagesCount: 0,
      uploading: false,
      progressPercentage: 0,
      totalImages: 0,

    };
  },
  methods: {

    async optimizeImage(blob) {
      return new Promise((resolve, reject) => {
        new Compressor(blob, {
          quality: 0.8,
          width: 1250,

          success(blob_obj) {
            const reader = new FileReader();
            reader.readAsDataURL(blob_obj);

            reader.onload = (event) => {
              const dataURL = event.target.result;
              resolve(dataURL);
            };

            reader.onerror = (error) => {
              reject(error);
            };
          },

          error(error) {
            reject(error);
          }
        });
      });
    },


    async previewImages() {
      const files = this.selectedFiles;
      this.images = [];

      if (!files?.length) {
        this.totalImages = 0;
        return;
      }

      const imageReaders = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            resolve({ file, url: e.target.result, uploading: false, uploaded: false });
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        });
      });

      try {
        this.images = await Promise.all(imageReaders);
        this.totalImages = files.length;
        await this.$nextTick();
        this.scrollToUploadButton();
      } catch (error) {
        this.images = [];
        this.totalImages = 0;
      }
    },

    scrollToUploadButton() {
      const uploadActions = this.$refs.uploadActions;

      if (!uploadActions) {
        return;
      }

      const topOffset = 72;
      const uploadActionsTop = uploadActions.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(uploadActionsTop - topOffset, 0),
        behavior: 'smooth',
      });
    },
    
    removeImage(index) {
      if (!this.images[index].uploading) {
        this.images.splice(index, 1);
        this.totalImages -= 1;
      }
    },

    dataURLtoBlob(dataURL) {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    },

    async uploadImagesOneByOne() {
      this.uploading = true;
      this.uploadedImagesCount = 0;
      this.progressPercentage = 0;

      const totalImages = this.images.length;


      for (const [index, image] of this.images.entries()) {

        if (image.uploaded || image.uploading) continue;

        this.images[index].uploading = true;
        
        try {
          const optimizedDataURL = await this.optimizeImage(image.file);

          // Convert base64 dataURL back to Blob for upload
          const blob = await this.dataURLtoBlob(optimizedDataURL);
          const formData = new FormData();
          formData.append('image', blob, image.file.name);
        
          const response = await axios.post(`${API_BASE_URI}/bulk-upload`, formData, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
              'x-api-key': JUANUTRISYON_API_KEY
            },
          });     

          // Mark the image as uploaded after successful upload
          this.images[index].uploading = false;
          this.images[index].uploaded = true; 

          // Update progress for each successfully uploaded image
          this.uploadedImagesCount += 1;
          this.progressPercentage = Math.round(
            (this.uploadedImagesCount / totalImages) * 100
          );

        } catch (error) {
          
          this.images[index].uploading = false;
          
        }
    
      }


      // Filter out uploaded images if needed (optional)
      this.images = this.images.filter(image => !image.uploaded);

      if (!this.images.length) {
        createToast(
          {
            title: 'Uploaded images!',
            description: 'Thank you for your contribution! We really appreciate it.'
          }, 
          { type: 'success', position: 'bottom-right' }
        );
      } else {
         createToast(
          {
            title: 'Upload error',
            description: 'Please try again later.'
          }, 
          { type: 'danger', position: 'bottom-right' }
        );
      }

      this.uploading = false;
      this.selectedFiles = null;
    },

  },
};
</script>

<style scoped>
.bulk-import-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.bulk-import-actions {
  position: sticky;
  bottom: 16px;
  z-index: 10;
}
</style>

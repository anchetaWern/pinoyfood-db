<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height">
        
        <div class="mb-2" v-if="!online">
          <v-alert 
            title="You are offline"
            text="Submitted entries will be temporarily stored locally. A separate button for submitting to the server will become visible once you go online." 
            color="error"></v-alert>
        </div>

        <div class="mb-2" v-if="goes_online">
          <v-alert 
            title="You are back online"
            text="You can now submit your offline entries to the server (if any)" 
            color="success"></v-alert>
        </div>
       
        <WebCamUI :fullscreenState="false"  @photoTaken="photoTaken" />
        <select @change="setCamera" v-model="deviceId">
            <option v-for="camera in cameras" :value="camera.deviceId">{{camera.label}}</option>
        </select>

        <div class="mb-3 current-label" v-if="currentLabel">
          <span class="text-subtitle-1">Upload or take picture of {{currentLabel}}</span>
        </div>
        
        <div class="mb-3">
          <v-card
            class="mx-auto"
            max-width="344"
          >
            <img :src="captured_title_image_data" class="img" />

            <v-card-title>
              <span class="text-subtitle-1">Food or product title*</span>
            </v-card-title>

            <v-file-input clearable label="Image file input" @change="previewImage('captured_title_image_data', 'title_image_file_input', $event)" ref="title_image_file_input"></v-file-input>
         
            <v-card-actions v-if="captured_title_image_data">
              <v-btn
                color="orange-lighten-2"
                variant="text"
                @click="removeImage('title')"
              >
                Remove
              </v-btn>

            </v-card-actions>

          </v-card>
        </div>
        
        <div class="mb-3">
          <v-card
            class="mx-auto"
            max-width="344"
          >
            <img :src="captured_foodlabel_image_data" class="img" />

            <v-card-title>
              <span class="text-subtitle-1">Food label*</span>
            </v-card-title>

            <v-file-input clearable label="Image file input" @change="previewImage('captured_foodlabel_image_data', 'foodlabel_image_file_input', $event)" ref="foodlabel_image_file_input"></v-file-input>

            <v-card-actions v-if="captured_foodlabel_image_data">
              <v-btn
                color="orange-lighten-2"
                variant="text"
                @click="removeImage('food_label')"
              >
                Remove
              </v-btn>

            </v-card-actions>

          </v-card>
        </div>

        <div class="mb-3">
          <v-card
            class="mx-auto"
            max-width="344"
          >
            <img :src="captured_barcode_image_data" class="img" />

            <v-card-title>
              <span class="text-subtitle-1">Barcode (optional)</span>
            </v-card-title>

            <v-file-input clearable label="Image file input" @change="previewImage('captured_barcode_image_data', 'barcode_image_file_input', $event)" ref="barcode_image_file_input"></v-file-input>

            <v-card-actions v-if="captured_barcode_image_data">
              <v-btn
                color="orange-lighten-2"
                variant="text"
                @click="removeImage('barcode')"
              >
                Remove
              </v-btn>
            
            </v-card-actions>

          </v-card>
        </div>


        <v-btn block @click="submitFood" color="grey-darken-4" v-if="captured_title_image_data && captured_foodlabel_image_data">
          {{ isSubmitting ? 'Submitting...' : 'Submit Food' }}
        </v-btn>

        <div class="mt-2">
          <v-btn block @click="submitStoredFoods" color="grey-darken-4" v-if="hasStoredFoods">
            {{ isSubmittingStoredFoods ? 'Submitting...' : 'Submit Offline Foods' }}
          </v-btn>
        </div>
  
    </v-responsive>
  </v-container>

</template>

<script>
import axios from 'axios'
import { WebCamUI } from 'vue-camera-lib'

import generateUniqueId from 'generate-unique-id'

import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

export default {
  inject: ['dbPromise'],

  data() {
    return {
      captured_title_image_data: null,
      captured_foodlabel_image_data: null,
      captured_barcode_image_data: null,
      
      cameras: [],
      deviceId: '',

      currentLabel: 'food or title',

      online: navigator.onLine,

      isSubmitting: false,
      isSubmittingStoredFoods: false, 

      hasStoredFoods: false,

      goes_online: false,

    };
  },

  async created() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    await this.checkIfDatabaseHasData();
  },

  destroyed() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },


  mounted() {
    
    this.cameras = this.$refs.webcam.cameras;
    if (this.cameras && this.cameras.length === 0) {
       
        let reloadCamInterval = setInterval(() => {
            this.loadCameras()
            if (this.cameras.length > 0) {
                clearInterval(reloadCamInterval)
            }
        }, 1000);
    }
    
  },


  methods: {

    previewImage(name, file_input_name, event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this[name] = e.target.result;
          this.updateCurrentLabel();
        };
        reader.readAsDataURL(file);
      } else {
        this[name] = null;
        this.$refs[file_input_name].reset();
      }

      
    },


    async checkIfDatabaseHasData() {
      try {
        const db = await this.dbPromise;
        const objectStoreNames = db.objectStoreNames;
       
        Array.from(objectStoreNames).forEach(async objectStoreName => {
          const tx = db.transaction(objectStoreName, 'readonly');
          const store = tx.objectStore(objectStoreName);
          const countRequest = store.count();
          const count = await countRequest;

          if (count > 0) {
            console.log(`The "${objectStoreName}" store contains data.`);

            this.hasStoredFoods = true;
          }
        });

      } catch (error) {
        console.error('Error checking database contents:', error);
      }
    },

    async updateOnlineStatus() {
      this.online = navigator.onLine;

      if (navigator.onLine) {
        this.goes_online = true;
        await this.checkIfDatabaseHasData();

        setTimeout(() => {
          this.goes_online = false;
        }, 5000);
      }
    },
    
    photoTaken(data) {
      if (this.captured_title_image_data === null) {
        this.captured_title_image_data = data.image_data_url;
      } else if (this.captured_foodlabel_image_data === null) {
        this.captured_foodlabel_image_data = data.image_data_url;
      } else {
        this.captured_barcode_image_data = data.image_data_url;
      }

      this.updateCurrentLabel();
    },

    removeImage(type) {
      
      if (type === 'title') {
        this.captured_title_image_data = null;
        this.$refs.title_image_file_input.reset();
      } else if (type === 'food_label') {
        this.captured_foodlabel_image_data = null;
        this.$refs.foodlabel_image_file_input.reset();
      } else {
        this.captured_barcode_image_data = null;
        this.$refs.barcode_image_file_input.reset();
      }

      this.updateCurrentLabel();
    },

    updateCurrentLabel() {
      if (this.captured_title_image_data === null) {
        this.currentLabel = 'food or title';
      } else if (this.captured_foodlabel_image_data === null) {
        this.currentLabel = 'food label';
      } else {
        this.currentLabel = 'barcode (optional)';
      }
    },

    /**
     TODO: 
     - show number of offline submitted foods on the button
     */

    clearForm() {
      this.captured_title_image_data = null;
      this.$refs.title_image_file_input.reset();

      this.captured_foodlabel_image_data = null;
      this.$refs.foodlabel_image_file_input.reset();

      this.captured_barcode_image_data = null;
      this.$refs.barcode_image_file_input.reset();
    },

    async submitFood() {

      if (navigator.onLine) {

        this.isSubmitting = true;

        const res = await this.saveFood({
          title_image: this.captured_title_image_data,
          nutrition_label_image: this.captured_foodlabel_image_data,
          barcode_image: this.captured_barcode_image_data, 
        });

        this.isSubmitting = false;

        createToast('Food submitted!', { type: 'success', position: 'bottom-right' });

        this.clearForm();

      } else {

        const group_key = generateUniqueId();

        const imagesData = [
          {
            field: 'title',
            value: this.captured_title_image_data
          },
          {
            field: 'nutrition_label',
            value: this.captured_foodlabel_image_data
          }
        ];

        if (this.captured_barcode_image_data) {
          
          imagesData.push({
            field: 'barcode',
            value: this.captured_barcode_image_data
          });

        }

        this.saveImagesWithGroup(imagesData, group_key);

        createToast('Temporarily saved food locally.', { type: 'warning', position: 'bottom-right' });

        this.clearForm();
      }      
    },


    async saveFoods(data) {
      const processedData = await Promise.all(data.map(async item => {
        const result = await this.saveFood(item);
        return result;
      }));

      return processedData;
    },


    async saveFood (data) {
      
      try {
        const { title_image, nutrition_label_image, barcode_image } = data;
        const res = await axios.post('http://pinoy-food-api.test/api/food-labels', 
          { // http://pinoy-food-api.test/api/food-labels | https://ewrxlas7zf.sharedwithexpose.com/api/food-labels
            title_image,
            nutrition_label_image,
            barcode_image,
          }, 
          {
            headers: {
              'x-api-key': 'IJaug2qIVeFwiSWSNoZ4ACgZI', 
            }
          }
        );

        return res.data;

      } catch (err) {
        console.log('error saving food: ', err);

        return err;
      }
  
    },


    async getImagesByGroup(groupKey) {

      try {
        const db = await this.dbPromise;
        const tx = db.transaction('foods', 'readonly');
        const store = tx.objectStore('foods');
    
        const range = IDBKeyRange.only(groupKey);
   
        const cursor = await store.openCursor(range);
        
        const foods = [];
      
        while (cursor) {
          const imageData = cursor.value;
          foods.push(imageData);
          cursor.continue();
        }

        return foods;

      } catch (error) {
        console.error('Error retrieving foods:', error);
        return [];
      }
    },
    
    findItemByField(array, fieldName, value) {
      return array.find(item => item[fieldName] === value);
    },

    async submitStoredFoods() {
      
      this.isSubmittingStoredFoods = true;

      const foods = await this.getAllDataFromStore('foods');
     
      const foods_data = Object.values(foods).map(itm => {

        const title_image = this.findItemByField(itm, 'field', 'title').value;
        const nutrition_label_image = this.findItemByField(itm, 'field', 'nutrition_label').value;
        const barcode_image = this.findItemByField(itm, 'field', 'barcode');

        const data = {
          title_image,
          nutrition_label_image
        };

        if (barcode_image) {
          Object.assign(data, { 'barcode_image': barcode_image.value });
        }

        return data;
      });

      const saved_foods = await this.saveFoods(foods_data);
     
      this.isSubmittingStoredFoods = false;

      await this.clearObjectStore('foods');
    },


    async clearObjectStore(storeName) {
      try {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        await store.clear();

      } catch (error) {
        console.error(`Error clearing object store "${storeName}":`, error);
      }
    },


    async getAllDataFromStore(storeName) {
      try {
        const db = await this.dbPromise;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const data = await store.getAll();

        const groupedData = {};
        data.forEach(item => {
          const groupKey = item.groupKey;
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = [];
          }
          groupedData[groupKey].push(item);
        });

        return groupedData;

      } catch (error) {
        console.error('Error retrieving data from store:', error);
        return [];
      }
    },


    async saveImagesWithGroup(imagesData, groupKey) {
      try {
        const db = await this.dbPromise;
       
        const tx = db.transaction('foods', 'readwrite');
        const store = tx.objectStore('foods');
        
        for (const imageData of imagesData) {
          imageData.groupKey = groupKey;
          await store.add(imageData);
        }
        
      } catch (error) {
        console.error('Error saving images:', error);
      }
    }

    
  },
  
};
</script>

<style>
.button-control {
  margin-bottom: 10px !important;
}

.button-control + div {
  display: none;
}

.img {
  max-width: 100%;
}

.current-label {
  padding: 10px;
  border: 1px dashed #ccc;
}
</style>

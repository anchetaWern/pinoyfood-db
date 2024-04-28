<template>
    <v-container class="fill-height">
        <v-responsive class="align-center fill-height">
            
            <WebCamUI :fullscreenState="false" @photoTaken="photoTaken" />
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
                  <img :src="captured_ingredients_image_data" class="img" />

                  <v-card-title>
                  <span class="text-subtitle-1">Ingredients (optional)</span>
                  </v-card-title>

                  <v-file-input clearable label="Image file input" @change="previewImage('captured_ingredients_image_data', 'ingredients_image_file_input', $event)" ref="ingredients_image_file_input"></v-file-input>

                  <v-card-actions v-if="captured_ingredients_image_data">
                  <v-btn
                      color="orange-lighten-2"
                      variant="text"
                      @click="removeImage('ingredients')"
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


            <v-btn block @click="submitFood" color="grey-darken-4" v-if="captured_title_image_data && captured_foodlabel_image_data" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit Food' }}
            </v-btn>

            <div class="mt-2">
            <v-btn block @click="submitStoredFoods" color="grey-darken-4" v-if="hasStoredFoods" :disabled="isSubmittingStoredFoods">
                {{ isSubmittingStoredFoods ? 'Submitting...' : 'Submit Offline Foods' }}

                <v-badge
                color="gray"
                :content="storedFoodCount"
                inline
                ></v-badge>
            </v-btn>
            </div>
    
        </v-responsive>
    </v-container>
</template>

<script>
import axios from 'axios'
import { WebCamUI } from 'vue-camera-lib'

import generateUniqueId from 'generate-unique-id'

import { createToast, clearToasts } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

export default {
  inject: ['dbPromise'],

  data() {
    return {
      captured_title_image_data: null,
      captured_foodlabel_image_data: null,
      captured_ingredients_image_data: null,
      captured_barcode_image_data: null,
      
      cameras: [],
      deviceId: '',

      currentLabel: 'food or title',

      online: navigator.onLine,

      isSubmitting: false,
      isSubmittingStoredFoods: false, 

      hasStoredFoods: false,
      storedFoodCount: 0,

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
    if (this.$refs.webcam && this.$refs.webcam.cameras) {
        this.cameras = this.$refs.webcam.cameras;
        if (this.cameras && this.cameras.length === 0) {
        
            let reloadCamInterval = setInterval(() => {
                this.loadCameras()
                if (this.cameras.length > 0) {
                    clearInterval(reloadCamInterval)
                }
            }, 1000);
        }
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

            //
            const getDataRequest = store.getAll();
            const data = await getDataRequest;

            const result = Object.groupBy(data, ({ groupKey }) => groupKey);

            console.log('Stored data:', data);
            console.log('res: ', Object.keys(result));
            //

            this.hasStoredFoods = true;
            this.storedFoodCount = Object.keys(result).length;
            console.log('stored count: ', count);
          }
        });

      } catch (error) {
        console.error('Error checking database contents:', error);
      }
    },

    async updateOnlineStatus() {
      this.online = navigator.onLine;

      if (navigator.onLine) {
        await this.checkIfDatabaseHasData();

        createToast(
          {
            title: 'You are back online',
            description: 'You can now submit your offline entries to the server (if any)'
          }, 
          { type: 'success', position: 'bottom-right' }
        );
      } else {
        createToast(
          {
            title: 'You are offline',
            description: 'Submitted entries will be temporarily stored locally. A separate button for submitting to the server will become visible once you go online.'
          }, 
          { type: 'danger', position: 'bottom-right' }
        );
      }

      setTimeout(() => {
        clearToasts();
      }, 5000);

    },
    
    photoTaken(data) {
      if (this.captured_title_image_data === null) {
        this.captured_title_image_data = data.image_data_url;
      } else if (this.captured_foodlabel_image_data === null) {
        this.captured_foodlabel_image_data = data.image_data_url;
      } else if (this.captured_ingredients_image_data === null) {
        console.log('waka: ', data.image_data_url);
        this.captured_ingredients_image_data = data.image_data_url;
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
      } else if (type === 'ingredients') {
        this.captured_ingredients_image_data = null;
        this.$refs.ingredients_image_file_input.reset();
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
      } else if (this.captured_ingredients_image_data === null) {
        this.currentLabel = 'ingredients';
      } else {
        this.currentLabel = 'barcode (optional)';
      }
    },

    clearForm() {
      this.captured_title_image_data = null;
      this.$refs.title_image_file_input.reset();

      this.captured_foodlabel_image_data = null;
      this.$refs.foodlabel_image_file_input.reset();

      this.captured_ingredients_image_data = null;
      this.$refs.ingredients_image_file_input.reset();

      this.captured_barcode_image_data = null;
      this.$refs.barcode_image_file_input.reset();
    },

    async submitFood() {

      if (navigator.onLine) {

        this.isSubmitting = true;

        const res = await this.saveFood({
          title_image: this.captured_title_image_data,
          nutrition_label_image: this.captured_foodlabel_image_data,
          ingredients_image: this.captured_ingredients_image_data,
          barcode_image: this.captured_barcode_image_data, 
        });

        if (res) {
          createToast('Food submitted!', { type: 'success', position: 'bottom-right' });
        } else {
          this.saveOffline();
          await this.checkIfDatabaseHasData();
        }

        this.isSubmitting = false;
        this.clearForm();

        this.updateCurrentLabel();

      } else {

        this.saveOffline();

        this.clearForm();
        createToast('Temporarily saved food locally.', { type: 'warning', position: 'bottom-right' });
        
      }      
    },


    saveOffline() {
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

      if (this.captured_ingredients_image_data) {
        
        imagesData.push({
          field: 'ingredients',
          value: this.captured_ingredients_image_data
        });
      }

      if (this.captured_barcode_image_data) {
        
        imagesData.push({
          field: 'barcode',
          value: this.captured_barcode_image_data
        });
      }

      this.saveImagesWithGroup(imagesData, group_key);

      this.storedFoodCount = this.storedFoodCount + 1;
    },


    async saveFoods(data) {
      const processedData = await Promise.all(data.map(async item => {
        const result = await this.saveFood(item, false);
        return result;
      }));

      return processedData;
    },


    async saveFood (data, alert_enabled = true) {
      const ip_address = localStorage.getItem('ip_address');
      const api_key = localStorage.getItem('api_key');

      if (ip_address && api_key) {

        try {
          const { title_image, nutrition_label_image, ingredients_image, barcode_image } = data;
          const res = await axios.post(`http://${ip_address}/api/food-labels`, 
            { // http://pinoy-food-api.test/api/food-labels | https://ewrxlas7zf.sharedwithexpose.com/api/food-labels
              title_image,
              nutrition_label_image,
              ingredients_image,
              barcode_image,
            }, 
            {
              timeout: 5000,
              headers: {
                'x-api-key': api_key, 
              }
            }
          );

          return res.data;

        } catch (err) {
          console.log('error saving food: ', err);

          if (alert_enabled) {
            createToast(
              { 
                title: 'Error occurred while submitting food', 
                description: "It's now stored locally. Submit it later once you have a more reliable connection." 
              }, 
              { type: 'danger', position: 'bottom-right' }
            );
          }

          return false;
        }

      } else {
        if (alert_enabled) {
          createToast('NO API key and IP address provided. Please login first.', { type: 'danger', position: 'bottom-right' });
        }
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
        const ingredients_image = this.findItemByField(itm, 'field', 'ingredients');
        const barcode_image = this.findItemByField(itm, 'field', 'barcode');

        const data = {
          title_image,
          nutrition_label_image
        };

        if (barcode_image) {
          Object.assign(data, { 'barcode_image': barcode_image.value });
        }

        if (ingredients_image) {
          Object.assign(data, { 'ingredients_image': ingredients_image.value });
        }

        return data;
      });

      const saved_foods = await this.saveFoods(foods_data);
      console.log('saved foods: ', saved_foods);

      const saved_food_count = saved_foods.filter(itm => itm === true).length;

      if (saved_food_count > 0) {
        createToast('Submitted foods to the server!', { type: 'success', position: 'bottom-right' });
     
        this.isSubmittingStoredFoods = false;

        await this.clearObjectStore('foods');

        this.hasStoredFoods = false;
        this.storedFoodCount = 0;

      } else {
        this.isSubmittingStoredFoods = false;
        createToast('Error occurred while submitting foods. Please try again later.', { type: 'danger', position: 'bottom-right' });
      }
      
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
<template>
    <v-container class="fill-height">
        <v-responsive class="align-center fill-height pt-10">
            
            <v-alert
              v-if="!hasApiKey"
              text="API key not yet supplied. Please login first."
              type="warning"
            ></v-alert>

            <WebCamUI :fullscreenState="false" @photoTaken="photoTaken" />
            <select @change="setCamera" v-model="deviceId">
              <option v-for="camera in cameras" :value="camera.deviceId">{{camera.label}}</option>
            </select>
          
            
            <div class="mt-2 mb-3">
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

                  <div v-if="barcode">Barcode: {{barcode}}</div>

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

            <div class="mt-2">
              <v-btn block size="x-small" variant="text" @click="clearAllLocal" v-if="hasStoredFoods">Clear all local data</v-btn>
            </div>
    
        </v-responsive>
    </v-container>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { WebCamUI } from 'vue-camera-lib'

import generateUniqueId from 'generate-unique-id'
import Compressor from 'compressorjs'

import { BrowserMultiFormatReader } from '@zxing/browser'

import { createToast, clearToasts } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

const API_BASE_URI = import.meta.env.VITE_API_URI;


export default {
  inject: ['dbPromise'],

  data() {
    return {
      barcode: '',
      reader: null,
      captured_title_image_data: null,
      captured_foodlabel_image_data: null,
      captured_ingredients_image_data: null,
      captured_barcode_image_data: null,
      
      cameras: [],
      deviceId: '',

      currentLabel: 'Upload or take picture of food or title',

      online: navigator.onLine,

      isSubmitting: false,
      isSubmittingStoredFoods: false, 

      hasStoredFoods: false,
      storedFoodCount: 0,

      goes_online: false,

      hasApiKey: false,
    };
  },

  async created() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    await this.checkIfDatabaseHasData();
    console.log('naria');
    this.reader = new BrowserMultiFormatReader();
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

    this.hasApiKey = localStorage.getItem('api_key') ? true : false;
    
  },


  methods: {

    async clearAllLocal() {
      await this.clearObjectStore('foods');

      createToast(
        {
          title: 'All clear',
          description: 'Cleared local storage'
        }, 
        { type: 'success', position: 'bottom-right' }
      );
    },

    async previewImage(name, file_input_name, event) {
      console.log('file input name: ', file_input_name);
      const file = event.target.files[0];
      const d = await this.optimizeImage(file);
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this[name] = e.target.result;
          this.updateCurrentLabel();

          if (file_input_name === 'barcode_image_file_input') {
            console.log('noto');
            this.decodeBarcode(e.target.result);
          }

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

    async optimizeImage(blob) {
      return new Promise((resolve, reject) => {
        new Compressor(blob, {
          quality: 0.6,
          width: 640,

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


    decodeBarcode(dataUrl) {
      console.log('wasu')

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        console.log('sein')
        this.reader.decodeFromImageUrl(dataUrl)
          .then(result => {
            console.log('barcode detected!', result);
            this.barcode = result.text;
           // URL.revokeObjectURL(url); 
          })
          .catch(err => {
            console.log("Barcode not detected", err);
            //URL.revokeObjectURL(url); 
          }); 
      }
    },

    
    async photoTaken(data) {
      console.log('photo take: ', data);
      if (this.captured_title_image_data === null) {
        this.captured_title_image_data = await this.optimizeImage(data.blob);
      } else if (this.captured_foodlabel_image_data === null) {
        this.captured_foodlabel_image_data = await this.optimizeImage(data.blob);
      } else if (this.captured_ingredients_image_data === null) {
        this.captured_ingredients_image_data = await this.optimizeImage(data.blob);
      } else {
        this.captured_barcode_image_data = await this.optimizeImage(data.blob);
        console.log('sho: ', data.image_data_url);
        this.decodeBarcode(data.image_data_url);
        console.log('shi');
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
      if (this.captured_barcode_image_data !== null) {
        this.currentLabel = 'Please review the images and click on the submit if all is good.';
      } else if (this.captured_title_image_data === null) {
        this.currentLabel = 'Upload or take picture of food or title';
      } else if (this.captured_foodlabel_image_data === null) {
        this.currentLabel = 'Upload or take picture of food label';
      } else if (this.captured_ingredients_image_data === null) {
        this.currentLabel = 'Upload or take picture of ingredients';
      } else {
        this.currentLabel = 'Upload or take picture of barcode (optional)';
      }

      createToast(
        `Done! ${this.currentLabel}`, 
        { type: 'success', position: 'bottom-right' }
      );
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
        const result = await this.saveFood(item);
        return result;
      }));

      return processedData;
    },


    async saveFood (data, alert_enabled = true) {
      const api_key = localStorage.getItem('api_key');

      if (api_key) {

        try {
          const { title_image, nutrition_label_image, ingredients_image, barcode_image } = data;
          const res = await axios.post(`${API_BASE_URI}/food-labels`, 
            { 
              title_image,
              nutrition_label_image,
              ingredients_image,
              barcode_image,
            }, 
            {
              timeout: 30000,
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
                title: `Error occurred while submitting food: ${err}`, 
                description: "It's now stored locally. Submit it later once you have a more reliable connection" 
              }, 
              { type: 'danger', position: 'bottom-right' }
            );
          }

          return false;
        }

      } else {
        if (alert_enabled) {
          createToast('NO API key provided. Please login first.', { type: 'danger', position: 'bottom-right' });
        }

        return false;
      }

      return false;
    
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

      const saved_food_count = saved_foods.filter(itm => typeof itm == 'object').length;
      
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

.front {
  margin-top: 10px;
  height: 80px !important;
  background-color: #1CD760;
  text-align: center;
}

.back {
  margin-top: 10px;
  height: 80px !important;
  background-color: #1AC9FC;
  text-align: center;
}
</style>
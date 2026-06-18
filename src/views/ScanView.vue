<template>
  <v-container class="scan-page py-8 mt-8">
    <v-row class="ga-0">
      <v-col cols="12" lg="5" class="d-flex flex-column ga-6">
        <NutritionLabelImageUploader
          :file="productLabelImage"
          :is-loading="productLabelOcrStatus === 'loading'"
          :preview-url="productLabelPreviewUrl"
          description="Upload the front-of-pack product image. We'll use OCR to suggest a product name that you can still edit."
          input-label="Choose product label image"
          loading-text="Reading product label..."
          title="Product label image"
          @select="handleProductLabelSelected"
        />

        <NutritionLabelImageUploader
          :file="nutritionLabelImage"
          :is-loading="ocrStatus === 'loading'"
          :preview-url="nutritionLabelPreviewUrl"
          @select="handleNutritionLabelSelected"
        />

        <NutritionLabelImageUploader
          :file="ingredientsImage"
          :preview-url="ingredientsPreviewUrl"
          description="Upload the ingredients panel image. This is required for the temp food submission."
          input-label="Choose ingredients image"
          title="Ingredients image"
          @select="handleIngredientsImageSelected"
        />
      </v-col>

      <v-col cols="12" lg="7" class="d-flex flex-column ga-6">
        <v-card class="scan-card" rounded="xl" elevation="2">
          <v-card-title class="text-h6">Product details</v-card-title>
          <v-card-text class="d-flex flex-column ga-4">
            <v-alert
              v-if="productLabelOcrStatus === 'loading'"
              text="Reading product name from the product label..."
              type="info"
              variant="tonal"
            />

            <v-alert
              v-else-if="productLabelOcrStatus === 'failed'"
              text="We couldn't confidently detect the product name. Please enter it manually."
              type="warning"
              variant="tonal"
            />

            <v-alert
              v-else-if="productLabelOcrStatus === 'success'"
              text="Product name detected. Please review it before saving."
              type="success"
              variant="tonal"
            />

            <v-text-field
              v-model="productName"
              clearable
              label="Product name"
              :rules="[requiredTextRule]"
            />
          </v-card-text>
        </v-card>

        <v-card class="scan-card" rounded="xl" elevation="2">
          <v-card-title class="text-h6">Ingredients text</v-card-title>
          <v-card-text class="d-flex flex-column ga-4">
            <v-alert
              v-if="ingredientsOcrStatus === 'loading'"
              text="Reading ingredients text from the image..."
              type="info"
              variant="tonal"
            />

            <v-alert
              v-else-if="ingredientsOcrStatus === 'failed'"
              text="We couldn't read the ingredients text clearly. Please enter it manually."
              type="warning"
              variant="tonal"
            />

            <v-alert
              v-else-if="ingredientsOcrStatus === 'success'"
              text="Ingredients text detected. Please correct it before saving."
              type="success"
              variant="tonal"
            />

            <v-textarea
              v-model="ingredientsImageText"
              auto-grow
              clearable
              label="Ingredients text"
              :rules="[requiredTextRule]"
              rows="4"
            />
          </v-card-text>
        </v-card>

        <NutritionFactsCorrectionForm
          :can-submit="canSubmit"
          :confidence="ocrResult?.confidence ?? null"
          :is-submitting="isSubmitting"
          :ocr-engine="ocrResult?.engine ?? ''"
          :ocr-status="ocrStatus"
          :optional-nutrients="optionalNutrients"
          :required-nutrients="requiredNutrients"
          submit-label="Save submission"
          @submit="submitScan"
          @update-value="handleValueUpdate"
        />

        <OcrRawTextPreview :raw-text="ocrResult?.rawText ?? ''" />
        <OcrRawTextPreview :raw-text="ingredientsImageOcrText" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import Compressor from 'compressorjs'
import { createToast } from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import NutritionLabelImageUploader from '@/components/scan/NutritionLabelImageUploader.vue'
import NutritionFactsCorrectionForm from '@/components/scan/NutritionFactsCorrectionForm.vue'
import OcrRawTextPreview from '@/components/scan/OcrRawTextPreview.vue'
import {
  OPTIONAL_NUTRIENT_FIELDS,
  REQUIRED_NUTRIENT_FIELDS,
  createDefaultNutrients,
} from '@/constants/nutritionFields'
import { runProductLabelOcr } from '@/services/productLabelOcr'
import {
  hydrateNutrientsFromOcr,
  runNutritionLabelOcr,
} from '@/services/nutritionLabelOcr'
import { submitScannedNutritionLabel } from '@/services/submitScannedNutritionLabel'

const productLabelImage = ref(null)
const nutritionLabelImage = ref(null)
const ingredientsImage = ref(null)
const productLabelPreviewUrl = ref('')
const nutritionLabelPreviewUrl = ref('')
const ingredientsPreviewUrl = ref('')
const productName = ref('')
const productLabelOcrStatus = ref('idle')
const productLabelOcrText = ref('')
const ingredientsOcrStatus = ref('idle')
const ingredientsImageOcrText = ref('')
const ingredientsImageText = ref('')
const ocrStatus = ref('idle')
const ocrResult = ref(null)
const correctedNutrients = ref(createDefaultNutrients())
const isSubmitting = ref(false)

const requiredKeys = new Set(REQUIRED_NUTRIENT_FIELDS.map((item) => item.key))
const optionalKeys = new Set(OPTIONAL_NUTRIENT_FIELDS.map((item) => item.key))

const requiredNutrients = computed(() =>
  correctedNutrients.value.filter((item) => requiredKeys.has(item.key)),
)

const optionalNutrients = computed(() =>
  correctedNutrients.value.filter((item) => optionalKeys.has(item.key)),
)

const nutrientMap = computed(() =>
  correctedNutrients.value.reduce((accumulator, nutrient) => {
    accumulator[nutrient.key] = nutrient
    return accumulator
  }, {}),
)

const validationWarnings = computed(() => {
  const warnings = []
  const nutrients = nutrientMap.value

  const totalFat = numericValue(nutrients.total_fat_g)
  const saturatedFat = numericValue(nutrients.saturated_fat_g)
  const transFat = numericValue(nutrients.trans_fat_g)
  const totalSugars = numericValue(nutrients.total_sugars_g)
  const addedSugars = numericValue(nutrients.added_sugars_g)
  const totalCarbs = numericValue(nutrients.total_carbohydrate_g)
  const dietaryFiber = numericValue(nutrients.dietary_fiber_g)
  const calories = numericValue(nutrients.energy_kcal)
  const sodium = numericValue(nutrients.sodium_mg)

  if (totalFat !== null && saturatedFat !== null && saturatedFat > totalFat) {
    warnings.push('Saturated fat should not be greater than total fat.')
  }

  if (totalFat !== null && transFat !== null && transFat > totalFat) {
    warnings.push('Trans fat should not be greater than total fat.')
  }

  if (totalSugars !== null && addedSugars !== null && addedSugars > totalSugars) {
    warnings.push('Added sugars should not be greater than total sugars.')
  }

  if (totalCarbs !== null && dietaryFiber !== null && dietaryFiber > totalCarbs) {
    warnings.push('Dietary fiber should not be greater than total carbohydrate.')
  }

  if (calories !== null && calories > 1200) {
    warnings.push('Calories seem unusually high for one serving.')
  }

  if (sodium !== null && sodium > 3000) {
    warnings.push('Sodium seems unusually high for one serving.')
  }

  if (sodium !== null && sodium <= 20) {
    warnings.push('Sodium should usually be in mg, not g. Please double-check the unit and value.')
  }

  REQUIRED_NUTRIENT_FIELDS.forEach((field) => {
    const nutrient = nutrients[field.key]

    if (!nutrient) {
      return
    }

    const isMissingText = field.unit === 'text' && !String(nutrient.correctedValue || '').trim()
    const isMissingNumber = field.unit !== 'text' && nutrient.correctedValue === null
    if (nutrient.status !== 'not_listed_on_label' && (isMissingText || isMissingNumber)) {
      warnings.push(`${field.label} is missing but appears commonly required on nutrition labels.`)
    }
  })

  return warnings
})

const nutrientsForSubmission = computed(() =>
  correctedNutrients.value
    .filter((nutrient) => nutrient.correctedValue !== null && nutrient.correctedValue !== '')
    .map((nutrient) => ({
      name: nutrient.label,
      amount: nutrient.correctedValue,
      unit: nutrient.unit,
    })),
)

const canSubmit = computed(
  () =>
    Boolean(
      productLabelImage.value &&
        nutritionLabelImage.value &&
        ingredientsImage.value &&
        productName.value.trim() &&
        ingredientsImageText.value.trim() &&
        nutrientsForSubmission.value.length > 0,
    ),
)

const requiredTextRule = (value) => Boolean(String(value || '').trim()) || 'This field is required.'

function numericValue(nutrient) {
  if (!nutrient) {
    return null
  }

  const value = nutrient.correctedValue
  return typeof value === 'number' && !Number.isNaN(value) ? value : null
}

function resetScanState() {
  ocrStatus.value = 'idle'
  ocrResult.value = null
  correctedNutrients.value = createDefaultNutrients()
}

function resetProductLabelState() {
  productLabelOcrStatus.value = 'idle'
  productLabelOcrText.value = ''
}

function resetIngredientsState() {
  ingredientsOcrStatus.value = 'idle'
  ingredientsImageOcrText.value = ''
  ingredientsImageText.value = ''
}

function revokePreviewUrl(url) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

async function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      width: 1000,
      success(result) {
        const compressedFile = new File([result], file.name, {
          type: result.type || file.type,
          lastModified: Date.now(),
        })

        resolve(compressedFile)
      },
      error(error) {
        reject(error)
      },
    })
  })
}

async function handleProductLabelSelected(file) {
  revokePreviewUrl(productLabelPreviewUrl.value)
  productLabelImage.value = null
  productLabelPreviewUrl.value = ''
  productName.value = ''
  resetProductLabelState()

  if (file) {
    try {
      productLabelImage.value = await optimizeImage(file)
      productLabelPreviewUrl.value = URL.createObjectURL(productLabelImage.value)
    } catch (error) {
      console.error(error)
      productLabelImage.value = file
      productLabelPreviewUrl.value = URL.createObjectURL(file)
    }

    await readProductLabel()
  }
}

async function handleNutritionLabelSelected(file) {
  revokePreviewUrl(nutritionLabelPreviewUrl.value)
  nutritionLabelImage.value = null
  nutritionLabelPreviewUrl.value = ''
  resetScanState()

  if (file) {
    try {
      nutritionLabelImage.value = await optimizeImage(file)
      nutritionLabelPreviewUrl.value = URL.createObjectURL(nutritionLabelImage.value)
    } catch (error) {
      console.error(error)
      nutritionLabelImage.value = file
      nutritionLabelPreviewUrl.value = URL.createObjectURL(file)
    }

    await readNutritionLabel()
  }
}

async function handleIngredientsImageSelected(file) {
  revokePreviewUrl(ingredientsPreviewUrl.value)
  ingredientsImage.value = null
  ingredientsPreviewUrl.value = ''
  resetIngredientsState()

  if (!file) {
    return
  }

  try {
    ingredientsImage.value = await optimizeImage(file)
    ingredientsPreviewUrl.value = URL.createObjectURL(ingredientsImage.value)
  } catch (error) {
    console.error(error)
    ingredientsImage.value = file
    ingredientsPreviewUrl.value = URL.createObjectURL(file)
  }

  await readIngredientsImage()
}

function parseInputValue(unit, value) {
  if (value === '' || value === null || value === undefined) {
    return null
  }

  if (unit === 'text') {
    return value
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

function handleValueUpdate({ key, value }) {
  correctedNutrients.value = correctedNutrients.value.map((nutrient) => {
    if (nutrient.key !== key) {
      return nutrient
    }

    return {
      ...nutrient,
      correctedValue: parseInputValue(nutrient.unit, value),
      status: nutrient.status === 'not_listed_on_label' ? 'not_detected' : nutrient.status,
    }
  })
}

async function readProductLabel() {
  if (!productLabelImage.value) {
    return
  }

  productLabelOcrStatus.value = 'loading'

  try {
    const result = await runProductLabelOcr(productLabelImage.value)
    productLabelOcrText.value = result.rawText || ''

    productName.value = result.suggestedName || ''

    productLabelOcrStatus.value = result.suggestedName ? 'success' : 'failed'
  } catch (error) {
    console.error(error)
    productLabelOcrStatus.value = 'failed'
    productLabelOcrText.value = ''
    createToast(
      {
        title: 'Product name OCR unavailable',
        description: 'You can still enter the product name manually.',
      },
      { type: 'warning', position: 'bottom-right' },
    )
  }
}

async function readNutritionLabel() {
  if (!nutritionLabelImage.value) {
    return
  }

  ocrStatus.value = 'loading'

  try {
    const result = await runNutritionLabelOcr(nutritionLabelImage.value)
    ocrResult.value = result
    correctedNutrients.value = hydrateNutrientsFromOcr(result.parsedNutrients)
    ocrStatus.value = 'success'
  } catch (error) {
    console.error(error)
    ocrStatus.value = 'failed'
    correctedNutrients.value = createDefaultNutrients()
    createToast(
      {
        title: 'OCR unavailable',
        description: 'You can still review and enter the values manually.',
      },
      { type: 'warning', position: 'bottom-right' },
    )
  }
}

async function readIngredientsImage() {
  if (!ingredientsImage.value) {
    return
  }

  ingredientsOcrStatus.value = 'loading'

  try {
    const result = await runProductLabelOcr(ingredientsImage.value)
    ingredientsImageOcrText.value = result.rawText || ''
    ingredientsImageText.value = result.rawText || ''
    ingredientsOcrStatus.value = result.rawText ? 'success' : 'failed'
  } catch (error) {
    console.error(error)
    ingredientsOcrStatus.value = 'failed'
    ingredientsImageOcrText.value = ''
    ingredientsImageText.value = ''
    createToast(
      {
        title: 'Ingredients OCR unavailable',
        description: 'You can still enter the ingredients text manually.',
      },
      { type: 'warning', position: 'bottom-right' },
    )
  }
}

async function submitScan() {
  if (!canSubmit.value || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    await submitScannedNutritionLabel({
      name: productName.value.trim(),
      productLabelImage: productLabelImage.value,
      nutritionLabelImage: nutritionLabelImage.value,
      ingredientsImage: ingredientsImage.value,
      productLabelOcrText: productLabelOcrText.value,
      nutritionLabelOcrText: ocrResult.value?.rawText ?? '',
      ingredientsImageOcrText: ingredientsImageOcrText.value,
      ingredientsImageText: ingredientsImageText.value.trim(),
      nutrients: nutrientsForSubmission.value,
    })

    createToast(
      {
        title: 'Submission saved',
        description: 'The temp food submission was sent to the server successfully.',
      },
      { type: 'success', position: 'bottom-right' },
    )
  } catch (error) {
    console.error(error)
    createToast(
      {
        title: 'Submission failed',
        description: 'We could not save the temp food submission. Please try again.',
      },
      { type: 'danger', position: 'bottom-right' },
    )
  } finally {
    isSubmitting.value = false
  }
}

onBeforeUnmount(() => {
  revokePreviewUrl(productLabelPreviewUrl.value)
  revokePreviewUrl(nutritionLabelPreviewUrl.value)
  revokePreviewUrl(ingredientsPreviewUrl.value)
})
</script>

<style scoped>
.scan-page {
  max-width: 1180px;
}

.scan-hero {
  background:
    radial-gradient(circle at top left, rgba(247, 196, 95, 0.18), transparent 38%),
    linear-gradient(135deg, rgba(255, 250, 239, 0.95), rgba(244, 248, 251, 0.98));
  border: 1px solid rgba(44, 62, 80, 0.08);
  border-radius: 28px;
  padding: 28px;
}

.scan-eyebrow {
  color: #b76a16;
  letter-spacing: 0.12em;
}

.scan-intro {
  max-width: 760px;
}

.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}
</style>

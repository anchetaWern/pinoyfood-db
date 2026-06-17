<template>
  <v-container class="scan-page py-8 mt-8">
    

    <v-row class="ga-0">
      <v-col cols="12" lg="5" class="d-flex flex-column ga-6">
        <NutritionLabelImageUploader
          :file="nutritionLabelImage"
          :is-loading="ocrStatus === 'loading'"
          :preview-url="previewUrl"
          @select="handleFileSelected"
        />
      </v-col>

      <v-col cols="12" lg="7" class="d-flex flex-column ga-6">
        <NutritionFactsCorrectionForm
          :can-submit="canSubmit"
          :confidence="ocrResult?.confidence ?? null"
          :ocr-engine="ocrResult?.engine ?? ''"
          :ocr-status="ocrStatus"
          :optional-nutrients="optionalNutrients"
          :required-nutrients="requiredNutrients"
          @submit="submitScan"
          @update-value="handleValueUpdate"
        />

        <OcrRawTextPreview :raw-text="ocrResult?.rawText ?? ''" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
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
import {
  hydrateNutrientsFromOcr,
  runNutritionLabelOcr,
} from '@/services/nutritionLabelOcr'
import { submitScannedNutritionLabel } from '@/services/submitScannedNutritionLabel'

const nutritionLabelImage = ref(null)
const previewUrl = ref('')
const ocrStatus = ref('idle')
const ocrResult = ref(null)
const correctedNutrients = ref(createDefaultNutrients())

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

const canSubmit = computed(() => Boolean(nutritionLabelImage.value))

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

function revokePreviewUrl() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
}

async function handleFileSelected(file) {
  revokePreviewUrl()
  nutritionLabelImage.value = file
  previewUrl.value = file ? URL.createObjectURL(file) : ''
  resetScanState()

  if (file) {
    await readNutritionLabel()
  }
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

async function submitScan() {
  const payload = {
    nutritionLabelImage: nutritionLabelImage.value
      ? {
          name: nutritionLabelImage.value.name,
          size: nutritionLabelImage.value.size,
          type: nutritionLabelImage.value.type,
          lastModified: nutritionLabelImage.value.lastModified,
        }
      : null,
    ocr: {
      engine: ocrResult.value?.engine ?? null,
      rawText: ocrResult.value?.rawText ?? '',
      confidence: ocrResult.value?.confidence ?? null,
      parsedNutrients: ocrResult.value?.parsedNutrients ?? [],
    },
    correctedNutrients: correctedNutrients.value,
    validationWarnings: validationWarnings.value,
    contributorConfirmedValues: true,
  }

  await submitScannedNutritionLabel(payload)

  createToast(
    {
      title: 'Scan payload prepared',
      description: 'The frontend-only payload was sent to the placeholder submit handler.',
    },
    { type: 'success', position: 'bottom-right' },
  )
}

onBeforeUnmount(() => {
  revokePreviewUrl()
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

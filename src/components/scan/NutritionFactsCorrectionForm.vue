<template>
  <v-card class="scan-card" rounded="xl" elevation="2">
    <v-card-title class="text-h6">Review detected nutrition values</v-card-title>
    <v-card-text class="d-flex flex-column ga-6">
      <section class="d-flex flex-column ga-4">
       

        <v-alert
          v-if="ocrStatus === 'loading'"
          text="Reading nutrition label..."
          type="info"
          variant="tonal"
        />

        <v-alert
          v-else-if="ocrStatus === 'failed'"
          text="We couldn't read the label clearly. You can still enter the values manually."
          type="error"
          variant="tonal"
        />

        <v-alert
          v-else-if="ocrStatus === 'success'"
          text="Review detected nutrition values below and correct anything that does not match the label."
          type="success"
          variant="tonal"
        />

        <div v-if="ocrEngine" class="text-body-2 text-medium-emphasis">
          Engine: {{ ocrEngine }}
          <template v-if="confidenceDisplay"> · Confidence: {{ confidenceDisplay }}</template>
        </div>
      </section>

      <section>
        <h3 class="text-subtitle-1 font-weight-medium mb-3">Required fields</h3>
        <div class="d-flex flex-column ga-4">
          <div
            v-for="nutrient in requiredNutrients"
            :key="nutrient.key"
            class="nutrient-row"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <div class="text-body-1 font-weight-medium">{{ nutrient.label }}</div>
                <div class="text-caption text-medium-emphasis">
                  OCR: {{ formatOcrValue(nutrient) }}
                </div>
              </div>

              <v-chip size="small" variant="outlined">
                {{ nutrient.unit }}
              </v-chip>
            </div>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  :label="valueLabel(nutrient)"
                  :model-value="formatInputValue(nutrient.correctedValue)"
                  type="text"
                  @update:model-value="updateValue(nutrient.key, $event)"
                />
              </v-col>
            </v-row>
          </div>
        </div>
      </section>

      <section>
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>Other nutrients</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex flex-column ga-4">
                <div
                  v-for="nutrient in optionalNutrients"
                  :key="nutrient.key"
                  class="nutrient-row"
                >
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div>
                      <div class="text-body-1 font-weight-medium">{{ nutrient.label }}</div>
                      <div class="text-caption text-medium-emphasis">
                        OCR: {{ formatOcrValue(nutrient) }}
                      </div>
                    </div>

                    <v-chip size="small" variant="outlined">
                      {{ nutrient.unit }}
                    </v-chip>
                  </div>

                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :label="valueLabel(nutrient)"
                        :model-value="formatInputValue(nutrient.correctedValue)"
                        type="text"
                        @update:model-value="updateValue(nutrient.key, $event)"
                      />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </section>

      <section class="d-flex flex-column ga-4">
        <div class="d-flex flex-wrap ga-3">
          <v-btn
            color="grey-darken-4"
            :disabled="!canSubmit"
            @click="emit('submit')"
          >
            Submit label
          </v-btn>
        </div>
      </section>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  requiredNutrients: {
    type: Array,
    default: () => [],
  },
  optionalNutrients: {
    type: Array,
    default: () => [],
  },
  canSubmit: {
    type: Boolean,
    default: false,
  },
  ocrStatus: {
    type: String,
    default: 'idle',
  },
  ocrEngine: {
    type: String,
    default: '',
  },
  confidence: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update-value', 'submit'])

const confidenceDisplay = computed(() => {
  if (props.confidence === null || props.confidence === undefined) {
    return ''
  }

  const confidenceValue = props.confidence <= 1 ? props.confidence * 100 : props.confidence
  return `${Math.round(confidenceValue)}%`
})

function formatInputValue(value) {
  return value === null || value === undefined ? '' : String(value)
}

function formatOcrValue(nutrient) {
  if (nutrient.ocrValue === null || nutrient.ocrValue === undefined || nutrient.ocrValue === '') {
    return 'Not detected'
  }

  return nutrient.unit === 'text' ? nutrient.ocrValue : `${nutrient.ocrValue} ${nutrient.unit}`
}

function valueLabel(nutrient) {
  return nutrient.unit === 'text' ? 'Corrected value' : `Corrected value (${nutrient.unit})`
}

function updateValue(key, value) {
  emit('update-value', { key, value })
}
</script>

<style scoped>
.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}

.nutrient-row {
  border: 1px solid rgba(44, 62, 80, 0.08);
  border-radius: 18px;
  padding: 16px;
}
</style>

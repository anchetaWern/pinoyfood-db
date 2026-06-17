<template>
  <v-card class="scan-card" rounded="xl" elevation="2">
    <v-card-title class="text-h6">OCR scan</v-card-title>
    <v-card-text class="d-flex flex-column ga-4">
      

      <v-alert
        v-if="status === 'idle'"
        text='Upload a clear photo of the nutrition facts label, then click "Read nutrition label" to prefill the form.'
        type="info"
        variant="tonal"
      />

      <v-alert
        v-else-if="status === 'loading'"
        text="Reading nutrition label..."
        type="info"
        variant="tonal"
      />

      <v-alert
        v-else-if="status === 'failed'"
        text="We couldn't read the label clearly. You can still enter the values manually."
        type="error"
        variant="tonal"
      />

      <v-alert
        v-else-if="status === 'success'"
        :text="successText"
        type="success"
        variant="tonal"
      />

      <div class="d-flex flex-wrap ga-3">
        <v-btn
          color="grey-darken-4"
          :disabled="!hasImage || status === 'loading'"
          :loading="status === 'loading'"
          @click="emit('run-ocr')"
        >
          Read nutrition label
        </v-btn>

        <span v-if="ocrEngine" class="text-body-2 text-medium-emphasis align-self-center">
          Engine: {{ ocrEngine }}
          <template v-if="confidenceDisplay"> · Confidence: {{ confidenceDisplay }}</template>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hasImage: {
    type: Boolean,
    default: false,
  },
  status: {
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

const emit = defineEmits(['run-ocr'])

const confidenceDisplay = computed(() => {
  if (props.confidence === null || props.confidence === undefined) {
    return ''
  }

  const confidenceValue = props.confidence <= 1 ? props.confidence * 100 : props.confidence
  return `${Math.round(confidenceValue)}%`
})

const successText = computed(() => 'Review detected nutrition values below and correct anything that does not match the label.')
</script>

<style scoped>
.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}
</style>

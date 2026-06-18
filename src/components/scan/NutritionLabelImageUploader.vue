<template>
  <v-card class="scan-card" rounded="xl" elevation="2">
    <v-card-title class="text-h6">{{ title }}</v-card-title>
    <v-card-text>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ description }}
      </p>

      <v-file-input
        accept="image/*"
        clearable
        density="comfortable"
        :label="inputLabel"
        :prepend-icon="icon"
        @update:model-value="handleFileChange"
      />

      <v-sheet
        v-if="previewUrl"
        border
        class="preview-frame mt-4"
        color="grey-lighten-5"
        rounded="lg"
      >
        <v-img
          :class="{ 'preview-image--loading': isLoading }"
          :src="previewUrl"
          alt="Nutrition label preview"
          cover
          height="320"
        />

        <div v-if="isLoading" class="preview-loader">
          <div class="preview-loader-content">
            <v-progress-circular
              color="grey-darken-4"
              indeterminate
              size="56"
              width="4"
            />

            <div class="preview-loader-text">{{ loadingText }}</div>
          </div>
        </div>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  file: {
    type: File,
    default: null,
  },
  title: {
    type: String,
    default: 'Nutrition label image',
  },
  description: {
    type: String,
    default:
      'Upload a clear photo of the nutrition facts label, then review the detected values below.',
  },
  inputLabel: {
    type: String,
    default: 'Choose nutrition label image',
  },
  loadingText: {
    type: String,
    default: 'Reading nutrition label...',
  },
  icon: {
    type: String,
    default: 'mdi-camera',
  },
  previewUrl: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

function handleFileChange(value) {
  if (Array.isArray(value)) {
    emit('select', value[0] || null)
    return
  }

  emit('select', value || null)
}
</script>

<style scoped>
.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}

.preview-frame {
  overflow: hidden;
  position: relative;
}

.preview-image--loading {
  opacity: 0.38;
  transition: opacity 0.2s ease;
}

.preview-loader {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
}

.preview-loader-content {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-loader-text {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>

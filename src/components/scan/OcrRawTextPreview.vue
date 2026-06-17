<template>
  <v-card class="scan-card" rounded="xl" elevation="2">
    <v-card-title class="text-h6">OCR raw text preview</v-card-title>
    <v-card-text>
      <v-expansion-panels variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>Show OCR debug text</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-sheet border class="raw-text-sheet" color="grey-lighten-5" rounded="lg">
              <pre>{{ rawText || 'No OCR text yet.' }}</pre>
            </v-sheet>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  rawText: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}

.raw-text-sheet {
  max-height: 280px;
  overflow: auto;
  padding: 16px;
}

pre {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 12px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

<template>
  <v-card class="scan-card" rounded="xl" elevation="2">
    <v-card-title class="text-h6">Validation warnings</v-card-title>
    <v-card-text>
      <v-alert
        v-if="!warnings.length"
        text="No validation warnings right now. Keep reviewing the values against the uploaded label."
        type="success"
        variant="tonal"
      />

      <v-list v-else class="warning-list" lines="two">
        <v-list-item
          v-for="warning in warnings"
          :key="warning"
          prepend-icon="mdi-alert-outline"
        >
          <v-list-item-title>{{ warning }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  warnings: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.scan-card {
  border: 1px solid rgba(44, 62, 80, 0.08);
}

.warning-list {
  background: transparent;
  padding: 0;
}
</style>

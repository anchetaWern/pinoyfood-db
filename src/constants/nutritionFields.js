export const NUTRIENT_STATUS_OPTIONS = [
  { title: 'Detected', value: 'detected' },
  { title: 'Not detected', value: 'not_detected' },
  { title: 'Not listed on label', value: 'not_listed_on_label' },
]

export const REQUIRED_NUTRIENT_FIELDS = [
  { key: 'serving_size', label: 'Serving size', unit: 'text' },
  { key: 'servings_per_container', label: 'Servings per container', unit: 'serving' },
  { key: 'energy_kcal', label: 'Calories', unit: 'kcal' },
  { key: 'total_fat_g', label: 'Total fat', unit: 'g' },
  { key: 'saturated_fat_g', label: 'Saturated fat', unit: 'g' },
  { key: 'trans_fat_g', label: 'Trans fat', unit: 'g' },
  { key: 'cholesterol_mg', label: 'Cholesterol', unit: 'mg' },
  { key: 'sodium_mg', label: 'Sodium', unit: 'mg' },
  { key: 'total_carbohydrate_g', label: 'Total carbohydrate', unit: 'g' },
  { key: 'dietary_fiber_g', label: 'Dietary fiber', unit: 'g' },
  { key: 'total_sugars_g', label: 'Total sugars', unit: 'g' },
  { key: 'added_sugars_g', label: 'Added sugars', unit: 'g' },
  { key: 'protein_g', label: 'Protein', unit: 'g' },
]

export const OPTIONAL_NUTRIENT_FIELDS = [
  { key: 'calcium_mg', label: 'Calcium', unit: 'mg' },
  { key: 'iron_mg', label: 'Iron', unit: 'mg' },
  { key: 'potassium_mg', label: 'Potassium', unit: 'mg' },
  { key: 'vitamin_a_mcg', label: 'Vitamin A', unit: 'mcg' },
  { key: 'vitamin_c_mg', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitamin_d_mcg', label: 'Vitamin D', unit: 'mcg' },
]

export const ALL_NUTRIENT_FIELDS = [
  ...REQUIRED_NUTRIENT_FIELDS,
  ...OPTIONAL_NUTRIENT_FIELDS,
]

export function createNutrientField(field) {
  return {
    key: field.key,
    label: field.label,
    unit: field.unit,
    ocrValue: null,
    correctedValue: null,
    status: 'not_detected',
    confidence: null,
  }
}

export function createDefaultNutrients() {
  return ALL_NUTRIENT_FIELDS.map(createNutrientField)
}

export function getNutrientFieldMap() {
  return ALL_NUTRIENT_FIELDS.reduce((accumulator, field) => {
    accumulator[field.key] = field
    return accumulator
  }, {})
}

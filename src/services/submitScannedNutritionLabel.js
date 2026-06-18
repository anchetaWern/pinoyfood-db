import axios from 'axios'

const API_BASE_URI = import.meta.env.VITE_API_URI

function appendFile(formData, key, file) {
  if (file) {
    formData.append(key, file)
  }
}

export async function submitScannedNutritionLabel(payload) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('ocr_name', payload.productLabelOcrText || '')
  formData.append('ocr_nutrients', payload.nutritionLabelOcrText || '')
  formData.append('ocr_ingredients', payload.ingredientsImageOcrText || '')
  formData.append('ingredients', payload.ingredientsImageText || '')
  formData.append('nutrients', JSON.stringify(payload.nutrients))

  appendFile(formData, 'product_label_image', payload.productLabelImage)
  appendFile(formData, 'nutrition_label_image', payload.nutritionLabelImage)
  appendFile(formData, 'ingredients_image', payload.ingredientsImage)

  const response = await axios.post(`${API_BASE_URI}/tmp-foods`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

import { readonly, ref } from 'vue'

const isOpen = ref(false)
const source = ref('other')

export function useDonationModal() {
  function openDonationModal(nextSource = 'other') {
    source.value = nextSource
    isOpen.value = true
  }

  function closeDonationModal() {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    source: readonly(source),
    openDonationModal,
    closeDonationModal,
  }
}


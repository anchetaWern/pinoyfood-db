<template>
  <v-dialog
    :model-value="isOpen"
    max-width="760"
    scrollable
    @update:model-value="handleDialogUpdate"
    @after-leave="resetModal"
  >
    <v-card class="donation-dialog" rounded="xl">
      <v-card-title class="donation-dialog__header">
        <span>{{ step === 'success' ? 'Thank you!' : 'Support Juan Nutrisyon' }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          aria-label="Close donation dialog"
          @click="closeDonationModal"
        />
      </v-card-title>

      <v-card-text v-if="step === 'payment'" class="donation-dialog__body">
        <p class="donation-dialog__intro">
          Thank you so much for supporting Juan Nutrisyon. Your support means a lot to an independent project like this.
        </p>
        <p class="donation-dialog__intro">
          Scan a QR code below to donate via GCash or Maya. Any amount is appreciated. 🙏
        </p>

        <div class="qr-grid">
          <figure class="qr-card">
            <img src="/images/gcash-donation-qr.jpeg" alt="GCash QR code for supporting Juan Nutrisyon" />
            <figcaption>GCash</figcaption>
            <v-btn
              href="/images/gcash-donation-qr.jpeg"
              download="juan-nutrisyon-gcash-qr.jpeg"
              variant="text"
              color="primary"
              prepend-icon="mdi-download"
            >
              Download GCash QR
            </v-btn>
          </figure>
          <figure class="qr-card">
            <img src="/images/maya-donation-qr.jpeg" alt="Maya QR code for supporting Juan Nutrisyon" />
            <figcaption>Maya</figcaption>
            <v-btn
              href="/images/maya-donation-qr.jpeg"
              download="juan-nutrisyon-maya-qr.jpeg"
              variant="text"
              color="primary"
              prepend-icon="mdi-download"
            >
              Download Maya QR
            </v-btn>
          </figure>
        </div>

        <v-btn
          block
          size="large"
          color="primary"
          prepend-icon="mdi-check-circle-outline"
          @click="startNotification"
        >
          I sent a donation
        </v-btn>
      </v-card-text>

      <v-card-text v-else-if="step === 'form'" class="donation-dialog__body">
        <button type="button" class="back-button" @click="step = 'payment'">
          <v-icon icon="mdi-arrow-left" size="small" />
          Back to QR codes
        </button>

        <p class="form-intro">Let us know about your donation so we can thank you appropriately.</p>

        <v-form ref="formRef" v-model="formValid" @submit.prevent="submitDonation">
          <div class="honeypot" aria-hidden="true">
            <label for="company">Company</label>
            <input id="company" v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
          </div>

          <v-select
            v-model="form.payment_method"
            label="Payment method"
            :items="paymentMethods"
            :rules="[requiredRule]"
            required
          />

          <v-text-field
            v-model="form.amount"
            label="Amount (optional)"
            prefix="₱"
            type="number"
            min="0.01"
            step="0.01"
            inputmode="decimal"
            :rules="[positiveAmountRule]"
          />

          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="[namedAcknowledgementRule]"
            persistent-hint
            hint="You can leave this blank if you prefer, unless you choose named acknowledgment."
          />

          <v-text-field
            v-model="form.contact"
            label="Email or social media handle"
            persistent-hint
            hint="So we can thank you or contact you if needed. This will not be displayed publicly."
          />

          <fieldset class="acknowledgement-fieldset">
            <legend>How should we acknowledge you? <span aria-hidden="true">*</span></legend>
            <v-radio-group v-model="form.acknowledgement" :rules="[requiredRule]">
              <v-radio label="Use my name or nickname" value="named" />
              <v-radio label="Acknowledge me anonymously" value="anonymous" />
              <v-radio label="Please don't acknowledge me publicly" value="private" />
            </v-radio-group>
            <p class="field-help">
              Your choice only affects public acknowledgment. Any contact information you provide will remain private.
            </p>
          </fieldset>

          <v-textarea
            v-model="form.message"
            label="Message"
            rows="3"
            auto-grow
            persistent-hint
            hint="Anything you'd like to share with us."
          />

          <v-alert v-if="submitError" type="error" variant="tonal" class="mb-4" role="alert">
            {{ submitError }}
          </v-alert>

          <v-btn block size="large" color="primary" type="submit" :loading="submitting">
            Let us know
          </v-btn>
        </v-form>
      </v-card-text>

      <v-card-text v-else class="donation-dialog__success">
        <v-icon icon="mdi-heart-circle" size="72" color="primary" />
        <h3>Your donation note was sent.</h3>
        <p>We appreciate your support for Juan Nutrisyon.</p>
        <v-btn color="primary" variant="tonal" @click="closeDonationModal">Close</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from 'axios'
import { captureEvent } from '@/services/analytics'
import { useDonationModal } from '@/composables/useDonationModal'

const API_BASE_URI = import.meta.env.VITE_API_URI || 'https://api.juanutrisyon.info/api'
const { isOpen, source, closeDonationModal } = useDonationModal()

const step = ref('payment')
const formRef = ref(null)
const formValid = ref(false)
const submitting = ref(false)
const submitError = ref('')
const form = reactive(initialForm())
const paymentMethods = [
  { title: 'GCash', value: 'gcash' },
  { title: 'Maya', value: 'maya' },
]

function initialForm() {
  return {
    payment_method: null,
    amount: '',
    name: '',
    contact: '',
    acknowledgement: null,
    message: '',
    company: '',
  }
}

watch(isOpen, (open) => {
  if (open) {
    captureEvent('donation_modal_opened', { source: source.value })
  }
})

const requiredRule = (value) => Boolean(value) || 'This field is required.'
const positiveAmountRule = (value) => !value || Number(value) > 0 || 'Enter an amount greater than zero.'
const namedAcknowledgementRule = (value) => {
  return form.acknowledgement !== 'named' || Boolean(value?.trim()) || 'Enter the name or nickname to acknowledge.'
}

function handleDialogUpdate(value) {
  if (!value) closeDonationModal()
}

function startNotification() {
  step.value = 'form'
  captureEvent('donation_notification_started')
}

function resetModal() {
  step.value = 'payment'
  submitting.value = false
  submitError.value = ''
  Object.assign(form, initialForm())
  formRef.value?.resetValidation()
}

async function submitDonation() {
  submitError.value = ''
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  // Silently accept bot-filled submissions without sending them to the API.
  if (form.company) {
    step.value = 'success'
    return
  }

  submitting.value = true
  try {
    await axios.post(`${API_BASE_URI}/donation`, {
      name: form.name,
      amount: form.amount ? Number(form.amount) : null,
      payment_method: form.payment_method,
      acknowledgement: form.acknowledgement,
      message: form.message,
      contact: form.contact,
    })

    captureEvent('donation_notification_submitted', {
      payment_method: form.payment_method,
      acknowledgement: form.acknowledgement,
    })
    step.value = 'success'
  } catch {
    submitError.value = 'We could not send your donation note. Please try again in a moment.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.donation-dialog {
  overflow: hidden;
}

.donation-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 12px;
  color: #173c2b;
  font-size: 1.35rem;
  font-weight: 750;
}

.donation-dialog__body {
  padding: 10px 28px 28px;
}

.donation-dialog__intro {
  margin: 0 0 10px;
  color: #42594e;
  line-height: 1.6;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 22px 0;
}

.qr-card {
  margin: 0;
  padding: 12px;
  border: 1px solid #dce5df;
  border-radius: 8px;
  background: #f8fbf9;
  text-align: center;
}

.qr-card img {
  display: block;
  width: min(100%, 240px);
  max-height: 320px;
  margin-inline: auto;
  border-radius: 8px;
  object-fit: contain;
}

.qr-card figcaption {
  margin-top: 10px;
  color: #173c2b;
  font-weight: 750;
}

.qr-card .v-btn {
  margin-top: 6px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 18px;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: #17633e;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.form-intro {
  margin: 0 0 20px;
  color: #42594e;
}

.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.acknowledgement-fieldset {
  margin: 2px 0 20px;
  padding: 16px;
  border: 1px solid #c7d4cd;
  border-radius: 12px;
}

.acknowledgement-fieldset legend {
  padding: 0 5px;
  color: #273c32;
  font-weight: 650;
}

.field-help {
  margin: -10px 0 0;
  color: #5d6e65;
  font-size: 0.82rem;
  line-height: 1.5;
}

.donation-dialog__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 34px 28px 42px;
  text-align: center;
}

.donation-dialog__success h3,
.donation-dialog__success p {
  margin: 0;
}

@media (max-width: 600px) {
  .donation-dialog__body {
    padding: 8px 18px 22px;
  }

  .qr-grid {
    grid-template-columns: 1fr;
  }
}
</style>

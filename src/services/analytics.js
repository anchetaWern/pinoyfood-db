import posthog from 'posthog-js'

const posthogKey = import.meta.env.VITE_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

let initialized = false

export function initializeAnalytics() {
  if (!posthogKey || initialized) return

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
  })
  initialized = true
}

export function captureEvent(event, properties = {}) {
  if (!initialized) return
  posthog.capture(event, properties)
}


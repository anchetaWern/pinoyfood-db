import { captureEvent } from './analytics'

export async function shareContent({ url, title, text, contentType = 'project', foodId }) {
  const canonicalUrl = new URL(url, window.location.origin).href
  const commonProperties = {
    content_type: contentType,
    ...(foodId ? { food_id: foodId } : {}),
  }

  if (navigator.share) {
    captureEvent('share_initiated', { ...commonProperties, method: 'web_share' })
    try {
      await navigator.share({ title, text, url: canonicalUrl })
      captureEvent('share_completed', { ...commonProperties, method: 'web_share' })
      return 'shared'
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled'
      // Fall through when Web Share exists but cannot handle the request.
    }
  }

  await copyToClipboard(canonicalUrl)
  captureEvent('share_initiated', { ...commonProperties, method: 'copy_link' })
  captureEvent('share_completed', { ...commonProperties, method: 'copy_link' })
  return 'copied'
}

async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  const copied = document.execCommand('copy')
  textArea.remove()
  if (!copied) throw new Error('Clipboard unavailable')
}

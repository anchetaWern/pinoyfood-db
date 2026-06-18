function normalizeLines(rawText) {
  return rawText
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function scoreLine(line) {
  const lowerLine = line.toLowerCase()

  if (lowerLine.length < 3 || lowerLine.length > 60) {
    return -10
  }

  if (/\b(nutrition|facts|ingredients|barcode|distributed by|manufactured by|serving size)\b/i.test(lowerLine)) {
    return -8
  }

  let score = 0

  if (/[a-z]/i.test(line)) {
    score += 2
  }

  if (/^[a-z0-9][a-z0-9\s'&(),.-]+$/i.test(line)) {
    score += 2
  }

  if (!/\d{4,}/.test(line)) {
    score += 1
  }

  if (line === line.toUpperCase()) {
    score += 1
  }

  return score
}

export function extractProductNameFromRawText(rawText = '') {
  const lines = normalizeLines(rawText)
  const candidates = lines
    .map((line, index) => ({ line, index, score: scoreLine(line) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.index - right.index
    })

  return candidates[0]?.line || ''
}

export async function runProductLabelOcr(file) {
  const { createWorker, PSM } = await import('tesseract.js')
  const worker = await createWorker('eng')

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: String(PSM.AUTO),
      preserve_interword_spaces: '1',
    })

    const result = await worker.recognize(file)
    const rawText = result?.data?.text?.trim() || ''
    const confidence = Number.isFinite(result?.data?.confidence) ? result.data.confidence : null

    return {
      engine: 'tesseract-js',
      rawText,
      confidence,
      suggestedName: extractProductNameFromRawText(rawText),
    }
  } finally {
    await worker.terminate()
  }
}

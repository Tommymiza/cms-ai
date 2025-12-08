export function setDateExpiration(duration: string): Date {
  const now = Date.now()
  // convert duration to milliseconds
  const durationMs = parseDuration(duration)
  return new Date(now + durationMs)
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(s|min|h|d|month|year)$/)
  if (!match) {
    throw new Error('Durée invalide.')
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]

  switch (unit) {
    case 's':
      return value * 1000 // secondes
    case 'min':
      return value * 60 * 1000 // minutes
    case 'h':
      return value * 60 * 60 * 1000 // hours
    case 'd':
      return value * 24 * 60 * 60 * 1000 // days
    case 'month':
      return value * 30 * 24 * 60 * 60 * 1000 // months (approximation)
    case 'year':
      return value * 365 * 24 * 60 * 60 * 1000 // years (approximation)
    default:
      throw new Error('Unité de durée invalide.')
  }
}

export function isExpiredDate(expirationDate: Date): boolean {
  const now = Date.now()
  return now > expirationDate.getTime()
}

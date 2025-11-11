// utils/sanitize.ts

export interface SanitizeOptions {
  maxLength?: number
  allowedChars?: RegExp
  trim?: boolean
}

/**
 * Универсальная функция санитизации строк
 */
export function sanitizeString(
  input: string | null | undefined,
  options: SanitizeOptions = {}
): string {
  if (!input) return ''
  
  const {
    maxLength = 200,
    allowedChars = /[^a-zA-Zа-яА-ЯёЁ가-힣0-9\s-]/g,
    trim = true
  } = options
  
  let sanitized = input
  
  // Удаляем недопустимые символы
  sanitized = sanitized.replace(allowedChars, '')
  
  // Trim
  if (trim) {
    sanitized = sanitized.trim()
  }
  
  // Ограничиваем длину
  sanitized = sanitized.substring(0, maxLength)
  
  return sanitized
}

/**
 * Санитизация для поиска
 */
export function sanitizeSearchQuery(query: string): string {
  return sanitizeString(query, {
    maxLength: 100,
    allowedChars: /[^a-zA-Zа-яА-ЯёЁ가-힣0-9\s-]/g,
    trim: true
  })
}

/**
 * Санитизация для slug
 */
export function sanitizeSlug(slug: string): string {
  return sanitizeString(slug, {
    maxLength: 50,
    allowedChars: /[^a-z0-9-]/g,
    trim: true
  }).toLowerCase()
}

/**
 * Валидация UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Валидация email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Валидация числа в диапазоне
 */
export function validateNumber(
  value: string | number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number | null {
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(num)) return null
  if (num < min || num > max) return null
  
  return num
}
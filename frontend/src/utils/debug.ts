/**
 * Environment detection utilities for debugging
 */

export const isDev = (): boolean => {
  return (
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
  )
}

export const isProd = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('umamily')
  )
}

/**
 * Console log only in development environment with nice formatting
 * @param data - Any data to log to console
 */
export const consoleLogDev = (label: string, ...data: unknown[]): void => {
  if (isDev()) {
    console.log(`[DEBUG] ${label}`, ...data)
  }
}

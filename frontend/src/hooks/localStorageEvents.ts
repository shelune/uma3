// Custom event system for localStorage changes
type LocalStorageEventHandler = (key: string, newValue: unknown) => void

class LocalStorageEventManager {
  private listeners: Map<string, Set<LocalStorageEventHandler>> = new Map()

  subscribe(key: string, handler: LocalStorageEventHandler) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(handler)

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(key)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  emit(key: string, newValue: unknown) {
    const handlers = this.listeners.get(key)
    if (handlers) {
      handlers.forEach(handler => handler(key, newValue))
    }
  }
}

export const localStorageEvents = new LocalStorageEventManager()

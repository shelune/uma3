import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Uma } from '../types/uma'

export interface SavedUma extends Uma {
  savedAt: number
  nickname: string // Now required
}

/**
 * Hook for managing saved Uma cards in localStorage
 */
export function useSavedUmas() {
  const [savedUmas, setSavedUmas] = useLocalStorage<SavedUma[]>(
    'saved-umas',
    []
  )

  /**
   * Check if a nickname is already taken
   */
  const isNicknameTaken = useCallback(
    (nickname: string): boolean => {
      return savedUmas.some(
        uma => uma.nickname.toLowerCase() === nickname.toLowerCase()
      )
    },
    [savedUmas]
  )

  /**
   * Save an Uma card with nickname
   */
  const saveUma = useCallback(
    (uma: Uma, nickname: string): boolean => {
      if (!nickname.trim()) {
        return false // Nickname is required
      }

      if (isNicknameTaken(nickname)) {
        return false // Nickname already exists
      }

      const savedUma: SavedUma = {
        ...uma,
        savedAt: Date.now(),
        nickname: nickname.trim(),
      }

      setSavedUmas(prev => {
        // Remove existing uma with same nickname if it exists (shouldn't happen due to check above)
        const filtered = prev.filter(
          existing => existing.nickname.toLowerCase() !== nickname.toLowerCase()
        )
        return [...filtered, savedUma].sort((a, b) => b.savedAt - a.savedAt)
      })

      return true // Success
    },
    [setSavedUmas, isNicknameTaken]
  )

  /**
   * Remove a saved Uma by nickname
   */
  const removeSavedUma = useCallback(
    (nickname: string): void => {
      setSavedUmas(prev =>
        prev.filter(
          uma => uma.nickname.toLowerCase() !== nickname.toLowerCase()
        )
      )
    },
    [setSavedUmas]
  )

  /**
   * Check if an Uma is saved by uma ID (check if any saved uma has this ID)
   */
  const isUmaSaved = useCallback(
    (umaId: string): boolean => {
      return savedUmas.some(uma => uma.id === umaId)
    },
    [savedUmas]
  )

  /**
   * Get a saved Uma by nickname
   */
  const getSavedUmaByNickname = useCallback(
    (nickname: string): SavedUma | undefined => {
      return savedUmas.find(
        uma => uma.nickname.toLowerCase() === nickname.toLowerCase()
      )
    },
    [savedUmas]
  )

  /**
   * Get saved Uma by uma ID (returns first match)
   */
  const getSavedUmaByUmaId = useCallback(
    (umaId: string): SavedUma | undefined => {
      return savedUmas.find(uma => uma.id === umaId)
    },
    [savedUmas]
  )

  /**
   * Update a saved Uma's nickname
   */
  const updateUmaNickname = useCallback(
    (oldNickname: string, newNickname: string): boolean => {
      if (!newNickname.trim()) {
        return false
      }

      if (
        oldNickname.toLowerCase() !== newNickname.toLowerCase() &&
        isNicknameTaken(newNickname)
      ) {
        return false // New nickname already exists
      }

      setSavedUmas(prev =>
        prev.map(uma =>
          uma.nickname.toLowerCase() === oldNickname.toLowerCase()
            ? { ...uma, nickname: newNickname.trim() }
            : uma
        )
      )

      return true
    },
    [setSavedUmas, isNicknameTaken]
  )

  /**
   * Clear all saved umas
   */
  const clearSavedUmas = useCallback((): void => {
    setSavedUmas([])
  }, [setSavedUmas])

  /**
   * Get saved umas statistics
   */
  const getSavedUmasStats = useCallback(() => {
    return {
      total: savedUmas.length,
      hasAny: savedUmas.length > 0,
    }
  }, [savedUmas])

  return {
    savedUmas,
    saveUma,
    removeSavedUma,
    isUmaSaved,
    isNicknameTaken,
    getSavedUmaByNickname,
    getSavedUmaByUmaId,
    updateUmaNickname,
    clearSavedUmas,
    getSavedUmasStats,
  }
}

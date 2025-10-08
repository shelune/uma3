import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Uma } from '../types/uma'

export interface SavedUma extends Uma {
  savedAt: number
  nickname: string // Now required
}

export interface SavedUmasData {
  [nickname: string]: SavedUma
}

/**
 * Migrate saved umas from array format to object format
 * @returns Object with migrated data and success status
 */
export function migrateSavedUmas(): {
  success: boolean
  migratedCount: number
  error?: string
} {
  try {
    const rawData = localStorage.getItem('saved-umas')
    if (!rawData) {
      console.log('Nothing to migrate')
      return { success: true, migratedCount: 0 }
    }

    const parsedData = JSON.parse(rawData)

    // Check if it's the old array format
    if (!Array.isArray(parsedData)) {
      console.log('Saved umas already in new format, no migration needed')
      return { success: true, migratedCount: 0 }
    }

    const migratedData: SavedUmasData = {}

    parsedData.forEach((uma: SavedUma, index: number) => {
      // Ensure uma has required properties
      if (uma && typeof uma === 'object' && uma.nickname) {
        // Use nickname as key, but ensure uniqueness if there are duplicates
        let key = uma.nickname
        let counter = 1

        // Handle duplicate nicknames by appending numbers
        while (migratedData[key]) {
          key = `${uma.nickname}-(${counter})`
          counter++
        }

        migratedData[key] = {
          ...uma,
          nickname: key, // Update nickname to match key if it was modified
        }
      } else if (uma && typeof uma === 'object') {
        // Handle old umas without nickname - create one based on name or ID
        const fallbackNickname = uma.name || uma.id || `Uma ${index + 1}`
        let key = fallbackNickname
        let counter = 1

        while (migratedData[key]) {
          key = `${fallbackNickname}-(${counter})`
          counter++
        }

        migratedData[key] = {
          ...uma,
          nickname: key,
          savedAt: uma.savedAt || Date.now(), // Ensure savedAt exists
        }
      }
    })

    // Save the migrated data back to localStorage
    localStorage.setItem('saved-umas', JSON.stringify(migratedData))

    const migratedCount = Object.keys(migratedData).length
    console.log(`Successfully migrated ${migratedCount} saved umas`)

    return { success: true, migratedCount }
  } catch (error) {
    const errorMessage = `Error during saved umas migration: ${error}`
    console.error(errorMessage)
    return { success: false, migratedCount: 0, error: errorMessage }
  }
}

/**
 * Hook for managing saved Uma cards in localStorage
 */
export function useSavedUmas() {
  // Initialize with migration logic
  const [savedUmasData, setSavedUmasData] = useLocalStorage<SavedUmasData>(
    'saved-umas',
    {}
  )

  /**
   * Manually trigger migration and refresh the hook data
   */
  const doMigration = useCallback((): {
    success: boolean
    migratedCount: number
    error?: string
  } => {
    const result = migrateSavedUmas()

    if (result.success && result.migratedCount > 0) {
      // Reload the data from localStorage after migration
      const rawData = localStorage.getItem('saved-umas')
      if (rawData) {
        try {
          const migratedData = JSON.parse(rawData)
          setSavedUmasData(migratedData)
        } catch (error) {
          console.error('Error reloading migrated data:', error)
        }
      }
    }

    return result
  }, [setSavedUmasData])

  // Helper to get all saved umas as array
  const savedUmas = Object.values(savedUmasData)

  /**
   * Check if a nickname is already taken
   */
  const isNicknameTaken = useCallback(
    (nickname: string): boolean => {
      const lowerCaseKeys = Object.keys(savedUmasData).map(key =>
        key.toLowerCase()
      )
      return lowerCaseKeys.includes(nickname.toLowerCase())
    },
    [savedUmasData]
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

      setSavedUmasData(prev => ({
        ...prev,
        [nickname.trim()]: savedUma,
      }))

      return true // Success
    },
    [setSavedUmasData, isNicknameTaken]
  )

  /**
   * Remove a saved Uma by nickname
   */
  const removeSavedUma = useCallback(
    (nickname: string): void => {
      setSavedUmasData(prev => {
        const newData = { ...prev }
        // Find the exact key match (case-insensitive)
        const keyToDelete = Object.keys(newData).find(
          key => key.toLowerCase() === nickname.toLowerCase()
        )
        if (keyToDelete) {
          delete newData[keyToDelete]
        }
        return newData
      })
    },
    [setSavedUmasData]
  )

  /**
   * Check if an Uma is saved by uma ID (check if any saved uma has this ID)
   */
  const isUmaSaved = useCallback(
    (umaId: string): boolean => {
      return Object.values(savedUmasData).some(uma => uma.id === umaId)
    },
    [savedUmasData]
  )

  /**
   * Get a saved Uma by nickname
   */
  const getSavedUmaByNickname = useCallback(
    (nickname: string): SavedUma | undefined => {
      const key = Object.keys(savedUmasData).find(
        key => key.toLowerCase() === nickname.toLowerCase()
      )
      return key ? savedUmasData[key] : undefined
    },
    [savedUmasData]
  )

  /**
   * Get saved Uma by uma ID (returns first match)
   */
  const getSavedUmaByUmaId = useCallback(
    (umaId: string): SavedUma | undefined => {
      return Object.values(savedUmasData).find(uma => uma.id === umaId)
    },
    [savedUmasData]
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

      setSavedUmasData(prev => {
        const newData = { ...prev }
        const oldKey = Object.keys(newData).find(
          key => key.toLowerCase() === oldNickname.toLowerCase()
        )

        if (oldKey && newData[oldKey]) {
          // Update the uma's nickname and move it to the new key
          const updatedUma = {
            ...newData[oldKey],
            nickname: newNickname.trim(),
          }
          delete newData[oldKey]
          newData[newNickname.trim()] = updatedUma
        }

        return newData
      })

      return true
    },
    [setSavedUmasData, isNicknameTaken]
  )

  /**
   * Clear all saved umas
   */
  const clearSavedUmas = useCallback((): void => {
    setSavedUmasData({})
  }, [setSavedUmasData])

  /**
   * Get saved umas statistics
   */
  const getSavedUmasStats = useCallback(() => {
    const count = Object.keys(savedUmasData).length
    return {
      total: count,
      hasAny: count > 0,
    }
  }, [savedUmasData])

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
    doMigration,
  }
}

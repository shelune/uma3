import { useCallback } from 'react'
import { useTreeData } from './useTreeData'
import type { TreeData } from '../contexts/TreeDataContext'
import type { Uma } from '../types/uma'

/**
 * Enhanced hook for TreeData operations with localStorage utilities
 */
export function useTreeDataWithStorage() {
  const {
    treeData,
    updateTreeData,
    clearTree,
    clearTreeData,
    getUmaAtPosition,
    setTree,
  } = useTreeData()

  /**
   * Export the current tree data as JSON
   */
  const exportTreeData = useCallback((): string => {
    return JSON.stringify(treeData, null, 2)
  }, [treeData])

  /**
   * Import tree data from JSON string
   */
  const importTreeData = useCallback(
    (jsonData: string, override: boolean = false): boolean => {
      try {
        const parsedData: TreeData = JSON.parse(jsonData)
        // Validate the structure
        if (typeof parsedData !== 'object' || parsedData === null) {
          throw new Error('Invalid tree data format')
        }

        clearTree()
        setTree(parsedData)

        // Object.entries(parsedData).forEach(([levelStr, levelData]) => {
        //   const level = parseInt(levelStr, 10)
        //   if (typeof levelData === 'object' && levelData !== null) {
        //     Object.entries(levelData).forEach(([positionStr, uma]) => {
        //       const position = parseInt(positionStr, 10)
        //       if (uma && typeof uma === 'object') {
        //         updateTreeData(level, position, uma as Uma, override)
        //       }
        //     })
        //   }
        // })

        return true
      } catch (error) {
        console.error('Error importing tree data:', error)
        return false
      }
    },
    [clearTree, setTree]
  )

  /**
   * Check if there's any data in the tree
   */
  const hasTreeData = useCallback((): boolean => {
    return Object.keys(treeData).length > 0
  }, [treeData])

  /**
   * Get tree data statistics
   */
  const getTreeStats = useCallback(() => {
    let totalUmas = 0
    let levelsCount = 0
    let maxLevel = -1
    let minLevel = Infinity

    Object.entries(treeData).forEach(([levelStr, levelData]) => {
      const level = parseInt(levelStr, 10)
      levelsCount++
      maxLevel = Math.max(maxLevel, level)
      minLevel = Math.min(minLevel, level)
      totalUmas += Object.keys(levelData).length
    })

    return {
      totalUmas,
      levelsCount,
      maxLevel: maxLevel === -1 ? 0 : maxLevel,
      minLevel: minLevel === Infinity ? 0 : minLevel,
      isEmpty: totalUmas === 0,
    }
  }, [treeData])

  return {
    // Original TreeData functionality
    treeData,
    updateTreeData,
    clearTree,
    clearTreeData,
    getUmaAtPosition,

    // Enhanced functionality
    exportTreeData,
    importTreeData,
    hasTreeData,
    getTreeStats,
  }
}

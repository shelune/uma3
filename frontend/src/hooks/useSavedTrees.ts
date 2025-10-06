import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { TreeData } from '../contexts/TreeDataContext'

export interface SavedTree {
  id: string
  name: string
  treeData: TreeData
  savedAt: number
  updatedAt: number
}

export interface TreeSummary {
  totalUmas: number
  levelCounts: { [level: number]: number }
  maxLevel: number
}

/**
 * Hook for managing saved breeding trees in localStorage
 */
export function useSavedTrees() {
  const [savedTrees, setSavedTrees] = useLocalStorage<SavedTree[]>(
    'saved-breeding-trees',
    []
  )

  /**
   * Generate tree summary statistics
   */
  const getTreeSummary = useCallback((treeData: TreeData): TreeSummary => {
    let totalUmas = 0
    const levelCounts: { [level: number]: number } = {}
    let maxLevel = 0

    Object.keys(treeData).forEach(levelKey => {
      const level = parseInt(levelKey)
      const levelData = treeData[level]
      const umasInLevel = Object.keys(levelData).length

      totalUmas += umasInLevel
      levelCounts[level] = umasInLevel
      maxLevel = Math.max(maxLevel, level)
    })

    return { totalUmas, levelCounts, maxLevel }
  }, [])

  /**
   * Check if a tree name is already taken
   */
  const isTreeNameTaken = useCallback(
    (name: string, excludeId?: string): boolean => {
      return savedTrees.some(
        tree =>
          tree.name.toLowerCase() === name.toLowerCase() &&
          tree.id !== excludeId
      )
    },
    [savedTrees]
  )

  /**
   * Save a new breeding tree
   */
  const saveTree = useCallback(
    (name: string, treeData: TreeData): boolean => {
      if (!name.trim()) {
        return false // Name is required
      }

      if (isTreeNameTaken(name)) {
        return false // Name already exists
      }

      const newTree: SavedTree = {
        id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        treeData: { ...treeData }, // Deep copy
        savedAt: Date.now(),
        updatedAt: Date.now(),
      }

      setSavedTrees(prev => {
        // Keep only the 4 most recent trees, then add the new one (max 5 total)
        const sorted = [...prev].sort((a, b) => b.updatedAt - a.updatedAt)
        const limited = sorted.slice(0, 4)
        return [newTree, ...limited]
      })

      return true // Success
    },
    [setSavedTrees, isTreeNameTaken]
  )

  /**
   * Update an existing tree
   */
  const updateTree = useCallback(
    (id: string, name: string, treeData: TreeData): boolean => {
      if (!name.trim()) {
        return false
      }

      if (isTreeNameTaken(name, id)) {
        return false // Name already exists
      }

      setSavedTrees(prev =>
        prev.map(tree =>
          tree.id === id
            ? {
                ...tree,
                name: name.trim(),
                treeData: { ...treeData },
                updatedAt: Date.now(),
              }
            : tree
        )
      )

      return true
    },
    [setSavedTrees, isTreeNameTaken]
  )

  /**
   * Delete a saved tree
   */
  const deleteTree = useCallback(
    (id: string): void => {
      setSavedTrees(prev => prev.filter(tree => tree.id !== id))
    },
    [setSavedTrees]
  )

  /**
   * Get a tree by ID
   */
  const getTreeById = useCallback(
    (id: string): SavedTree | undefined => {
      return savedTrees.find(tree => tree.id === id)
    },
    [savedTrees]
  )

  /**
   * Load a tree (returns the tree data)
   */
  const loadTree = useCallback(
    (id: string): TreeData | null => {
      const tree = getTreeById(id)
      return tree ? { ...tree.treeData } : null
    },
    [getTreeById]
  )

  /**
   * Clear all saved trees
   */
  const clearAllTrees = useCallback((): void => {
    setSavedTrees([])
  }, [setSavedTrees])

  /**
   * Get saved trees statistics
   */
  const getSavedTreesStats = useCallback(() => {
    return {
      total: savedTrees.length,
      hasAny: savedTrees.length > 0,
      maxReached: savedTrees.length >= 5,
    }
  }, [savedTrees])

  return {
    savedTrees,
    saveTree,
    updateTree,
    deleteTree,
    getTreeById,
    loadTree,
    clearAllTrees,
    getSavedTreesStats,
    getTreeSummary,
    isTreeNameTaken,
  }
}

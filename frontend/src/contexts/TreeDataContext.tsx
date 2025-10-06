import React, { createContext, useCallback, ReactNode } from 'react'
import type { Uma } from '../types/uma'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface TreeSlot {
  level: number
  position: number
}

export interface TreeData {
  [level: number]: {
    [position: number]: Uma
  }
}

interface TreeDataContextType {
  treeData: TreeData
  updateTreeData: (
    level: number,
    position: number,
    updates: Partial<Uma> | null
  ) => void
  clearTree: () => void
  clearTreeData: () => void
  getUmaAtPosition: (position: string | TreeSlot) => Uma | null
}

// eslint-disable-next-line react-refresh/only-export-components
export const TreeDataContext = createContext<TreeDataContextType | undefined>(
  undefined
)

interface TreeDataProviderProps {
  children: ReactNode
}

export const TreeDataProvider: React.FC<TreeDataProviderProps> = ({
  children,
}) => {
  const [treeData, setTreeData, removeTreeData] = useLocalStorage<TreeData>(
    'uma-breeding-tree-data',
    {}
  )

  const clearTree = useCallback(() => {
    setTreeData({})
  }, [setTreeData])

  const clearTreeData = useCallback(() => {
    removeTreeData()
  }, [removeTreeData])

  const updateTreeData = useCallback(
    (level: number, position: number, updates: Partial<Uma> | null) => {
      setTreeData(prev => {
        const newTree = { ...prev }

        if (!newTree[level]) {
          newTree[level] = {}
        }

        if (updates === null) {
          // Remove the Uma at this position
          delete newTree[level][position]

          // Clean up empty levels
          if (Object.keys(newTree[level]).length === 0) {
            delete newTree[level]
          }
        } else {
          // Add or update the Uma
          const existingUma = newTree[level][position]
          if (existingUma) {
            // Update existing Uma
            newTree[level][position] = { ...existingUma, ...updates }
          } else {
            // Create new Uma with defaults
            newTree[level][position] = {
              id: '',
              baseId: '',
              name: '',
              imagePath: '',
              blueSpark: {},
              pinkSpark: {},
              greenSpark: {},
              whiteSpark: [],
              raceSpark: [],
              races: [],
              ...updates,
            } as Uma
          }
        }

        return newTree
      })
    },
    [setTreeData]
  )

  const getUmaAtPosition = useCallback(
    (position: string | TreeSlot): Uma | null => {
      const [level, pos] =
        typeof position === 'string'
          ? position.split('-').map(Number)
          : [position.level, position.position]
      if (level === null || pos === null) return null
      return treeData[level]?.[pos] || null
    },
    [treeData]
  )

  const value: TreeDataContextType = {
    treeData,
    clearTree,
    clearTreeData,
    updateTreeData,
    getUmaAtPosition,
  }

  return (
    <TreeDataContext.Provider value={value}>
      {children}
    </TreeDataContext.Provider>
  )
}

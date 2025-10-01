import { useContext } from 'react'
import { TreeDataContext } from '../contexts/TreeDataContext'

export const useTreeData = () => {
  const context = useContext(TreeDataContext)
  if (context === undefined) {
    throw new Error('useTreeData must be used within a TreeDataProvider')
  }
  return context
}

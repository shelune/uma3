import { Button } from '@/ui/base/button'
import { Input } from '@/ui/base/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/base/dialog'
import { Save } from 'lucide-react'
import { useState } from 'react'
import type { TreeData } from '../../contexts/TreeDataContext'
import { useSavedTrees } from '../../hooks/useSavedTrees'

interface SaveTreeModalProps {
  isOpen: boolean
  onClose: () => void
  treeData: TreeData
  onSaveSuccess?: () => void
}

export default function SaveTreeModal({
  isOpen,
  onClose,
  treeData,
  onSaveSuccess,
}: SaveTreeModalProps) {
  const { saveTree, isTreeNameTaken, getSavedTreesStats } = useSavedTrees()
  const [treeName, setTreeName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const stats = getSavedTreesStats()

  const handleSave = async () => {
    if (!treeName.trim()) {
      setError('Tree name is required')
      return
    }

    if (treeName.length > 100) {
      setError('Tree name must be 100 characters or less')
      return
    }

    if (isTreeNameTaken(treeName)) {
      setError('This tree name is already taken')
      return
    }

    if (stats.maxReached) {
      setError(
        'Maximum of 5 saved trees reached. Delete one to save a new tree.'
      )
      return
    }

    setIsLoading(true)

    try {
      const success = saveTree(treeName, treeData)
      if (success) {
        setTreeName('')
        setError('')
        onSaveSuccess?.()
        onClose()
      } else {
        setError('Failed to save tree')
      }
    } catch {
      setError('An error occurred while saving')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setTreeName('')
    setError('')
    onClose()
  }

  const handleNameChange = (value: string) => {
    setTreeName(value)
    setError('') // Clear error when typing
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Breeding Tree
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tree-name" className="text-sm font-medium">
              Tree Name (required)
            </label>
            <Input
              id="tree-name"
              value={treeName}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Enter a name for this tree..."
              maxLength={100}
              autoFocus
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{treeName.length}/100 characters</span>
              <span>{stats.total}/5 trees saved</span>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>

          {stats.maxReached && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Warning:</strong> You have reached the maximum of 5
                saved trees. You'll need to delete an existing tree before
                saving a new one.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || stats.maxReached}>
            {isLoading ? 'Saving...' : 'Save Tree'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

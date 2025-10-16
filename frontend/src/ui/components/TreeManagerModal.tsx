import { Button } from '@/ui/base/button'
import { Input } from '@/ui/base/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Badge } from '@/ui/base/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/base/tabs'
import {
  FolderOpen,
  Trash2,
  Users,
  Layers,
  RefreshCw,
  Save,
  Plus,
  Disc2,
} from 'lucide-react'
import { useState } from 'react'
import { useSavedTrees, SavedTree } from '../../hooks/useSavedTrees'
import { useTreeData } from '../../hooks'
import { TreeData } from '../../contexts/TreeDataContext'

interface TreeManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TreeManagerModal({
  isOpen,
  onClose,
}: TreeManagerModalProps) {
  const {
    savedTrees,
    loadTree,
    deleteTree,
    updateTree,
    saveTree,
    isTreeNameTaken,
    getTreeSummary,
    getSavedTreesStats,
  } = useSavedTrees()
  const { setTree, treeData } = useTreeData()

  // Tab state
  const [activeTab, setActiveTab] = useState<'load' | 'save'>('save')

  // Load tab state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [overwritingId, setOverwritingId] = useState<string | null>(null)

  // Save tab state
  const [treeName, setTreeName] = useState('')
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const stats = getSavedTreesStats()

  // Load tab handlers
  const handleLoadTree = (tree: TreeData) => {
    setTree(tree)
    onClose()
  }

  const handleDeleteTree = async (tree: SavedTree) => {
    if (deletingId) return

    if (window.confirm(`Are you sure you want to delete "${tree.name}"?`)) {
      setDeletingId(tree.id)
      try {
        deleteTree(tree.id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleOverwriteTree = async (tree: SavedTree) => {
    if (overwritingId) return

    if (
      window.confirm(
        `Are you sure you want to overwrite "${tree.name}" with the current breeding tree?`
      )
    ) {
      setOverwritingId(tree.id)
      try {
        const success = updateTree(tree.id, tree.name, treeData)
        if (success) {
          console.log(`Successfully updated "${tree.name}"`)
        }
      } finally {
        setOverwritingId(null)
      }
    }
  }

  // Save tab handlers
  const handleSaveNew = async () => {
    if (!treeName.trim()) {
      setSaveError('Tree name is required')
      return
    }

    if (treeName.length > 100) {
      setSaveError('Tree name must be 100 characters or less')
      return
    }

    if (isTreeNameTaken(treeName)) {
      setSaveError('This tree name is already taken')
      return
    }

    if (stats.maxReached) {
      setSaveError(
        'Maximum of 5 saved trees reached. Delete one to save a new tree.'
      )
      return
    }

    setIsSaving(true)

    try {
      const success = saveTree(treeName, treeData)
      if (success) {
        setTreeName('')
        setSaveError('')
        // Switch to load tab to show the newly saved tree
        setActiveTab('load')
      } else {
        setSaveError('Failed to save tree')
      }
    } catch {
      setSaveError('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNameChange = (value: string) => {
    setTreeName(value)
    setSaveError('') // Clear error when typing
  }

  const handleTabChange = (tab: 'load' | 'save') => {
    setActiveTab(tab)
    // Clear save form when switching tabs
    if (tab === 'load') {
      setTreeName('')
      setSaveError('')
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Save & Load Breeding Trees
            <Badge variant="secondary">{stats.total}/5</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs>
          <TabsList className="w-full">
            <TabsTrigger
              isActive={activeTab === 'save'}
              onClick={() => handleTabChange('save')}
              className="flex-1 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save New Tree
            </TabsTrigger>
            <TabsTrigger
              isActive={activeTab === 'load'}
              onClick={() => handleTabChange('load')}
              className="flex-1 flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Load Trees ({stats.total})
            </TabsTrigger>
          </TabsList>

          {/* Load Trees Tab */}
          <TabsContent isActive={activeTab === 'load'}>
            <div className="mt-6">
              {!stats.hasAny ? (
                <div className="text-center py-12 text-gray-500">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No saved trees</h3>
                  <p className="text-sm">
                    Save your current breeding tree to access it later.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedTrees
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map(tree => {
                      const summary = getTreeSummary(tree.treeData)
                      const isDeleting = deletingId === tree.id
                      const isOverwriting = overwritingId === tree.id

                      return (
                        <div
                          key={tree.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {tree.name}
                              </h3>

                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    {summary.totalUmas} Uma
                                    {summary.totalUmas !== 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Layers className="w-4 h-4" />
                                  <span>{summary.maxLevel} levels</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Saved: {formatDate(tree.savedAt)}
                                {tree.savedAt !== tree.updatedAt && (
                                  <> • Updated: {formatDate(tree.updatedAt)}</>
                                )}
                              </p>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleLoadTree(loadTree(tree.id) ?? {})
                                }
                                className="whitespace-nowrap"
                              >
                                Load Tree
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOverwriteTree(tree)}
                                disabled={isOverwriting}
                                className="text-white-600 hover:text-black hover:bg-gray-50 border-gray-200 hover:border-gray-300 whitespace-nowrap"
                              >
                                {isOverwriting ? 'Updating...' : 'Overwrite'}
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTree(tree)}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Save New Tree Tab */}
          <TabsContent isActive={activeTab === 'save'}>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="tree-name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Tree Name (required)
                </label>
                <Input
                  id="tree-name"
                  value={treeName}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Enter a name for this tree..."
                  maxLength={100}
                  autoFocus
                  disabled={isSaving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{treeName.length}/100 characters</span>
                  <span>{stats.total}/5 trees saved</span>
                </div>
                {saveError && (
                  <div className="text-sm text-red-500">{saveError}</div>
                )}
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

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveNew}
                  disabled={isSaving || stats.maxReached}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Tree'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

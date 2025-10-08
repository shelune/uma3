import { Button } from '@/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Badge } from '@/ui/base/badge'
import { FolderOpen, Trash2, Users, Layers } from 'lucide-react'
import { useState } from 'react'
import { useSavedTrees, SavedTree } from '../../hooks/useSavedTrees'
import { useTreeData } from '../../hooks'
import { TreeData } from '../../contexts/TreeDataContext'

interface SavedTreesModalProps {
  isOpen?: boolean
  toggleOpen: (state: boolean) => void
}

export default function SavedTreesModal({
  isOpen,
  toggleOpen,
}: SavedTreesModalProps) {
  const {
    savedTrees,
    loadTree,
    deleteTree,
    getTreeSummary,
    getSavedTreesStats,
  } = useSavedTrees()
  const { setTree } = useTreeData()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const stats = getSavedTreesStats()

  const handleLoadTree = (tree: TreeData) => {
    setTree(tree)
    toggleOpen(false)
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
    <>
      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Saved Breeding Trees
              <Badge variant="secondary">{stats.total}/5</Badge>
            </DialogTitle>
          </DialogHeader>

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

          {stats.maxReached && (
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> You have reached the maximum of 5 saved
                trees. Delete some trees to save new ones.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

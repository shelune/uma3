import { Button } from '@/ui/base/button'
import { Badge } from '@/ui/base/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Heart, Edit2, Trash2, Save, X, Folder } from 'lucide-react'
import { useState } from 'react'
import { useSavedUmas } from '../../hooks/useSavedUmas'
import {
  getImagePath,
  getUmaNameById,
  renderSparkInfo,
} from '../../utils/formatting'
import { TreeData } from '../../contexts/TreeDataContext'
import SavedTreesModal from './SavedTreesModal'

interface BreedingTreeHeaderProps {
  isMobile: boolean
  onSaveTree: () => void
  onClearTree: () => void
  onLoadTree: (treeData: TreeData) => void
}

const BreedingTreeHeader: React.FC<BreedingTreeHeaderProps> = ({
  isMobile,
  onSaveTree,
  onClearTree,
  onLoadTree,
}) => {
  const { savedUmas, removeSavedUma, updateUmaNickname, getSavedUmasStats } =
    useSavedUmas()

  const [savedUmasDialogOpen, setSavedUmasDialogOpen] = useState(false)
  const [editingUma, setEditingUma] = useState<string | null>(null)
  const [editNickname, setEditNickname] = useState('')
  const [notification, setNotification] = useState('')

  const savedUmasStats = getSavedUmasStats()

  // Handler functions for saved umas
  const handleEditStart = (nickname: string) => {
    setEditingUma(nickname)
    setEditNickname(nickname)
  }

  const handleEditSave = () => {
    if (editingUma && editNickname.trim() && editNickname !== editingUma) {
      const success = updateUmaNickname(editingUma, editNickname.trim())
      if (success) {
        setNotification('Nickname updated successfully')
      } else {
        setNotification('Failed to update nickname (may already exist)')
      }
      setTimeout(() => setNotification(''), 3000)
    }
    setEditingUma(null)
    setEditNickname('')
  }

  const handleEditCancel = () => {
    setEditingUma(null)
    setEditNickname('')
  }

  const handleDelete = (nickname: string) => {
    if (confirm(`Delete saved Uma "${nickname}"?`)) {
      removeSavedUma(nickname)
      setNotification('Saved Uma deleted')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Desktop header actions */}
      {!isMobile && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSavedUmasDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Folder className="w-4 h-4" />
            Manage Umas
            {savedUmasStats.hasAny && (
              <Badge variant="secondary" className="ml-1">
                {savedUmasStats.total}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveTree}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Tree
          </Button>
          <SavedTreesModal onLoadTree={onLoadTree} />
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearTree}
            className="flex items-center gap-2 text-white"
          >
            <Trash2 className="w-4 h-4" />
            Clear Tree
          </Button>
        </div>
      )}

      {/* Saved Umas Dialog */}
      <Dialog open={savedUmasDialogOpen} onOpenChange={setSavedUmasDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="w-5 h-5" />
              Saved Umas ({savedUmasStats.total})
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3">
            {savedUmasStats.hasAny ? (
              savedUmas.map(uma => (
                <div
                  key={uma.nickname}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card dark:bg-gray-800 hover:bg-accent/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Uma Image */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted dark:bg-gray-700">
                      {uma.id ? (
                        <img
                          src={getImagePath(uma.id)}
                          alt={getUmaNameById(uma.id)}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uma Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      {uma.name || getUmaNameById(uma.id) || 'Unknown Uma'}
                    </div>

                    {/* Nickname - Editable */}
                    {editingUma === uma.nickname ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={editNickname}
                          onChange={e => setEditNickname(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="Enter nickname"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEditSave()
                            if (e.key === 'Escape') handleEditCancel()
                          }}
                        />
                        <Button size="sm" onClick={handleEditSave}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="font-medium text-sm truncate dark:text-white">
                        {uma.nickname}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                      {`${renderSparkInfo(uma.blueSpark)} | ${renderSparkInfo(
                        uma.pinkSpark
                      )} | ${uma.races.length} races won | ${uma.whiteSpark?.length} white spark(s)`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {editingUma !== uma.nickname && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(uma.nickname)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(uma.nickname)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground dark:text-gray-400">
                  No saved Umas yet
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                  Save Umas from the breeding tree to manage them here
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BreedingTreeHeader

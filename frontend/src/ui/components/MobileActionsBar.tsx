import { Button } from '@/ui/base/button'
import { Save, Share, Trash2, FolderOpen } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTreeDataWithStorage } from '../../hooks'
import { useUrlSharing } from '../../hooks/useUrlSharing'

interface MobileActionsBarProps {
  onSaveTree: () => void
  onClearTree: () => void
  onOpenSavedTrees: () => void
  onOpenSavedUmas: () => void
}

const MobileActionsBar = ({
  onSaveTree,
  onClearTree,
  onOpenSavedTrees,
  onOpenSavedUmas,
}: MobileActionsBarProps) => {
  const { hasTreeData } = useTreeDataWithStorage()
  const [notification, setNotification] = useState('')
  const { copyShareUrl } = useUrlSharing()

  const onShare = useCallback(async () => {
    if (hasTreeData()) {
      const success = await copyShareUrl()
      if (success) {
        setNotification('URL copied to clipboard')
        setTimeout(() => setNotification(''), 3000)
      } else {
        setNotification('Failed to copy URL to clipboard')
        setTimeout(() => setNotification(''), 3000)
      }
    }
  }, [copyShareUrl, hasTreeData])
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {notification}
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex justify-around">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-2 flex flex-col items-center leading-[0.5]"
          onClick={onSaveTree}
          title="Save Tree"
        >
          <Save className="w-4 h-4" />
          <span className="text-[10px]">Save Tree</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-2 flex flex-col items-center leading-[0.5]"
          onClick={onOpenSavedTrees}
          title="Load Saved Trees"
        >
          <FolderOpen className="w-4 h-4" />
          <span className="text-[10px]">Load Tree</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-2 flex flex-col items-center leading-[0.5]"
          onClick={onShare}
          title="Share"
        >
          <Share className="w-4 h-4" />
          <span className="text-[10px]">Share Tree</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-2 flex flex-col items-center leading-[0.5]"
          onClick={onClearTree}
          title="Clear Tree"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[10px]">Clear Tree</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-2 flex flex-col items-center leading-[0.5]"
          onClick={onOpenSavedUmas}
          title="Load Saved Umas"
        >
          <FolderOpen className="w-4 h-4" />
          <span className="text-[10px]">Umas</span>
        </Button>
      </div>
    </div>
  )
}

export default MobileActionsBar

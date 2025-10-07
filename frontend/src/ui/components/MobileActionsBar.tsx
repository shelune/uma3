import { Button } from '@/ui/base/button'
import { Save, Share, Trash2, FolderOpen } from 'lucide-react'

interface MobileActionsBarProps {
  onSaveTree: () => void
  onLoadTrees: () => void
  onShare: () => void
  onClearTree: () => void
}

const MobileActionsBar = ({
  onSaveTree,
  onLoadTrees,
  onShare,
  onClearTree,
}: MobileActionsBarProps) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-white rounded-full shadow-lg border p-2 flex justify-around">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-3"
          onClick={onSaveTree}
          title="Save Tree"
        >
          <Save className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-3"
          onClick={onLoadTrees}
          title="Load Trees"
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-3"
          onClick={onShare}
          title="Share"
        >
          <Share className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full p-3"
          onClick={onClearTree}
          title="Clear Tree"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default MobileActionsBar

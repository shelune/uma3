import { Button } from '@/ui/base/button'
import { Badge } from '@/ui/base/badge'
import { Folder, FolderOpen, Trash2 } from 'lucide-react'
import { useSavedUmas } from '../../hooks/useSavedUmas'
import { useSavedTrees } from '../../hooks/useSavedTrees'
import { TreeData } from '../../contexts/TreeDataContext'

interface BreedingTreeHeaderProps {
  isMobile: boolean
  onClearTree: () => void
  onLoadTree: (treeData: TreeData) => void
  onOpenTreeManagerModal: () => void
  onOpenSavedUmasModal: () => void
}

const BreedingTreeHeader: React.FC<BreedingTreeHeaderProps> = ({
  isMobile,
  onClearTree,
  onOpenTreeManagerModal,
  onOpenSavedUmasModal,
}) => {
  const { getSavedUmasStats } = useSavedUmas()
  const { getSavedTreesStats } = useSavedTrees()
  const { total } = getSavedTreesStats()

  const savedUmasStats = getSavedUmasStats()

  return (
    <>
      {/* Desktop header actions */}
      {!isMobile && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSavedUmasModal}
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
            onClick={onOpenTreeManagerModal}
            className="flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            Manage Trees
            {total > 0 && (
              <Badge variant="secondary" className="ml-1">
                {total}
              </Badge>
            )}
          </Button>
          <Button
            size="sm"
            onClick={onClearTree}
            className="flex items-center gap-2 text-white bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Clear Tree
          </Button>
        </div>
      )}
    </>
  )
}

export default BreedingTreeHeader

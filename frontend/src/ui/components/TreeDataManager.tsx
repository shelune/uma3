import { Button } from '@/ui/base/button'
import { Popover, PopoverTrigger } from '@/ui/base/popover'
import { Badge } from '@/ui/base/badge'
import { Database, MoreVertical } from 'lucide-react'
import { useTreeDataWithStorage } from '../../hooks/useTreeDataWithStorage'

interface TreeDataManagerProps {
  className?: string
}

export default function TreeDataManager({
  className = '',
}: TreeDataManagerProps) {
  const { hasTreeData, getTreeStats } = useTreeDataWithStorage()

  const stats = getTreeStats()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Tree Stats Badge */}
      {hasTreeData() && (
        <Badge variant="secondary" className="text-xs">
          {stats.totalUmas} Uma{stats.totalUmas !== 1 ? 's' : ''} {` | `}
          {stats.levelsCount} Level{stats.levelsCount !== 1 ? 's' : ''}
        </Badge>
      )}

      {/* Storage Management Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled
          >
            <Database className="w-4 h-4" />
            Storage
            <MoreVertical className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
      </Popover>
    </div>
  )
}

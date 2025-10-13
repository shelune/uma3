import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import {
  pickBadgeColorBySparkType,
  renderSparkType,
  getUmaNameById,
  to2Decimal,
} from '@/utils/formatting'
import {
  SquareArrowUpRightIcon,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-react'
import { useCallback, useContext, useState } from 'react'
import { TreeDataContext } from '../../contexts/TreeDataContext'
import { LOCALE_EN } from '../../locale/en'
import { Input } from '@/ui/base/input'
import {
  buildSparks,
  getSparkAtLeastOnceChances,
  groupSparks,
} from '../../utils/inspiration'
import { Badge } from '@/ui/base/badge'

interface SparkProcDisplayProps {
  level: number
  position: number
}

type SortColumn = 'name' | 'type' | 'chance'
type SortDirection = 'asc' | 'desc'

export default function SparkProcDisplay({
  level,
  position,
}: SparkProcDisplayProps) {
  const treeDataContext = useContext(TreeDataContext)
  const { treeData } = treeDataContext || {}
  const [showSparkProcPopover, setShowSparkProcPopover] = useState(false)
  const [sortColumn, setSortColumn] = useState<SortColumn>('chance')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  const getBadgeBySpark = (sparkType: string) => {
    return (
      <Badge
        variant="secondary"
        className={`text-[10px] px-1 py-0 ${pickBadgeColorBySparkType(sparkType ?? '')}`}
      >
        {renderSparkType(sparkType)}
      </Badge>
    )
  }

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    )
  }

  const getSparkProcContent = useCallback(() => {
    if (!showSparkProcPopover || !treeData) return null
    const sparkSet = buildSparks(treeData, { level, position })
    const groupedSpark = groupSparks(sparkSet)
    const sparkAtLeastOnceChances = getSparkAtLeastOnceChances(groupedSpark)

    // filtering by name
    const filteredSparks = Object.entries(sparkAtLeastOnceChances).filter(
      ([stat, sparkDetail]) => {
        if (searchQuery.trim()) {
          const name =
            sparkDetail.type === 'greenSpark' ? getUmaNameById(stat) : stat
          return name.toLowerCase().includes(searchQuery.toLowerCase().trim())
        }
        return true
      }
    )

    // sorting
    const sortedSparks = filteredSparks.sort(
      ([statA, sparkA], [statB, sparkB]) => {
        if (sortColumn === 'name') {
          const nameA =
            sparkA.type === 'greenSpark' ? getUmaNameById(statA) : statA
          const nameB =
            sparkB.type === 'greenSpark' ? getUmaNameById(statB) : statB
          const comparison = nameA.localeCompare(nameB)
          return sortDirection === 'asc' ? comparison : -comparison
        }
        if (sortColumn === 'type') {
          const typeA = sparkA.type ?? ''
          const typeB = sparkB.type ?? ''
          const comparison = typeA.localeCompare(typeB)
          return sortDirection === 'asc' ? comparison : -comparison
        }
        if (sortColumn === 'chance') {
          const comparison = sparkA.chanceAtLeastOnce - sparkB.chanceAtLeastOnce
          return sortDirection === 'asc' ? comparison : -comparison
        }
        return 0
      }
    )

    return sortedSparks.map(([stat, sparkDetail]) => (
      <div
        key={stat}
        className="flex w-full gap-2 py-1 items-center text-xs font-medium"
      >
        <div className="flex-1/2">
          {sparkDetail.type === 'greenSpark' ? getUmaNameById(stat) : stat}
        </div>
        <div className="flex-1/4">
          {getBadgeBySpark(sparkDetail.type ?? '')}
        </div>
        <div className="flex-1/4">
          {to2Decimal(sparkDetail.chanceAtLeastOnce)}%
        </div>
      </div>
    ))
  }, [
    level,
    position,
    showSparkProcPopover,
    treeData,
    sortColumn,
    sortDirection,
    searchQuery,
  ])

  return (
    <>
      <div className="flex justify-between">
        <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-50">
          {LOCALE_EN.SPARK_PROCS}
        </div>
        <div className="text-xs inline-flex gap-1">
          <Popover
            open={showSparkProcPopover}
            onOpenChange={setShowSparkProcPopover}
          >
            <PopoverTrigger asChild>
              <span className="cursor-pointer flex items-center gap-1">
                <SquareArrowUpRightIcon className="w-4 h-4" />
              </span>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={16}
              side="right"
              align="end"
              className="p-3 w-full max-w-dvw max-h-[300px] overflow-y-auto"
            >
              <div className="text-xs font-semibold mb-2">
                Inspiration Chance List (per career)
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-7 text-xs h-7"
                />
              </div>
              <div className="flex gap-2 text-xs font-bold uppercase border-b pb-1 mb-1">
                <button
                  className="flex-1/2 flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded transition-colors cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <span>Name</span>
                  {getSortIcon('name')}
                </button>
                <button
                  className="flex-1/4 flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded transition-colors cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <span>Type</span>
                  {getSortIcon('type')}
                </button>
                <button
                  className="flex-1/4 flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded transition-colors cursor-pointer"
                  onClick={() => handleSort('chance')}
                >
                  <span>Chance</span>
                  {getSortIcon('chance')}
                </button>
              </div>
              <div className="divide-y">{getSparkProcContent()}</div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}

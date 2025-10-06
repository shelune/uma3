import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import {
  pickBadgeColorBySparkType,
  renderSparkType,
  getUmaNameById,
  to2Decimal,
} from '@/utils/formatting'
import { SquareArrowUpRightIcon } from 'lucide-react'
import { useCallback, useContext, useState } from 'react'
import { TreeDataContext } from '../../contexts/TreeDataContext'
import { LOCALE_EN } from '../../locale/en'
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

export default function SparkProcDisplay({
  level,
  position,
}: SparkProcDisplayProps) {
  const treeDataContext = useContext(TreeDataContext)
  const { treeData } = treeDataContext || {}
  const [showSparkProcPopover, setShowSparkProcPopover] = useState(false)

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

  const getSparkProcContent = useCallback(() => {
    if (!showSparkProcPopover || !treeData) return null
    const sparkSet = buildSparks(treeData, { level, position })
    const groupedSpark = groupSparks(sparkSet)
    const sparkAtLeastOnceChances = getSparkAtLeastOnceChances(groupedSpark)
    console.log({ sparkAtLeastOnceChances })
    const sortedSparks = Object.entries(sparkAtLeastOnceChances).sort(
      ([, a], [, b]) => b.chanceAtLeastOnce - a.chanceAtLeastOnce
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
  }, [level, position, showSparkProcPopover, treeData])

  return (
    <>
      <div className="flex justify-between">
        <div className="text-xs uppercase tracking-wide font-semibold text-gray-600">
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
              className="p-3 w-min-[300px] w-[600px] max-w-none"
              style={{ maxHeight: '220px', overflowY: 'auto' }}
            >
              <div className="text-xs font-semibold mb-2">
                Inspiration Chance List (per career)
              </div>
              <div className="flex gap-2 text-xs font-bold uppercase border-b pb-1 mb-1">
                <span className="flex-1/2">Name</span>
                <span className="flex-1/4">Type</span>
                <span className="flex-1/4">Chance</span>
              </div>
              <div className="divide-y">{getSparkProcContent()}</div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}

import { Badge } from '@/ui/base/badge'
import { Button } from '@/ui/base/button'
import { Card, CardContent, CardHeader } from '@/ui/base/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import { getBaseAffinity, getRaceAffinity } from '@/utils/affinity'
import {
  getImagePath,
  pickBadgeColorBySparkType,
  renderSparkType,
  renderUmaName,
  renderUmaNameById,
  to2Decimal,
} from '@/utils/formatting'
import {
  Settings,
  User,
  CircleDot,
  Circle,
  Triangle,
  SquareArrowUpRightIcon,
} from 'lucide-react'
import React, { useCallback, useContext, useState } from 'react'
import type {
  BlueSparkData,
  GreenSparkData,
  PinkSparkData,
  RacesData,
  Uma,
  WhiteSparkData,
} from '../../types/uma'
import { TreeDataContext } from '../../contexts/TreeDataContext'
import Tooltip from '../base/tooltip'
import { LOCALE_EN } from '../../locale/en'
import {
  buildSparks,
  getSparkAtLeastOnceChances,
  groupSparks,
} from '../../utils/inspiration'
import BlueSparkSelector from '../components/BlueSparkSelector'
import PinkSparkSelector from '../components/PinkSparkSelector'
import GreenSparkSelector from '../components/GreenSparkSelector'
import WhiteSparkSelector from '../components/WhiteSparkSelector'

export interface UmaCardProps {
  uma?: Uma | null
  name?: string
  onSelectUma: (level: number, position: number) => void
  size: 'big' | 'small'
  level: number
  position: number
}

interface ExtendedUmaCardProps extends UmaCardProps {
  onBlueSparkChange?: (
    value: BlueSparkData,
    meta: { level: number; position: number }
  ) => void
  onPinkSparkChange?: (
    value: PinkSparkData,
    meta: { level: number; position: number }
  ) => void
  onGreenSparkChange?: (
    value: GreenSparkData,
    meta: { level: number; position: number }
  ) => void
  onRacesWonChange?: (
    value: RacesData,
    meta: { level: number; position: number }
  ) => void
  onWhiteSparkChange?: (
    value: WhiteSparkData[],
    meta: { level: number; position: number }
  ) => void
}

const UmaCard: React.FC<ExtendedUmaCardProps> = ({
  uma,
  onSelectUma,
  level,
  size = 'big',
  position,
  onBlueSparkChange,
  onPinkSparkChange,
  onGreenSparkChange,
  onRacesWonChange,
  onWhiteSparkChange,
}) => {
  const treeDataContext = useContext(TreeDataContext)
  const { treeData } = treeDataContext || {}
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races = [] } = uma || {}

  const [showSparkProcPopover, setShowSparkProcPopover] = useState(false)

  const getSparkProcContent = useCallback(() => {
    if (!showSparkProcPopover || !treeData) return null
    const sparkSet = buildSparks(treeData, { level, position })
    const groupedSpark = groupSparks(sparkSet)
    const sparkAtLeastOnceChances = getSparkAtLeastOnceChances(groupedSpark)
    console.log({ sparkAtLeastOnceChances })
    return Object.entries(sparkAtLeastOnceChances).map(
      ([stat, sparkDetail]) => (
        <div
          key={stat}
          className="flex w-full gap-2 py-1 items-center text-xs font-medium"
        >
          <div className="flex-1/2">
            {sparkDetail.type === 'greenSpark' ? renderUmaNameById(stat) : stat}
          </div>
          <div className="flex-1/4">
            {getBadgeBySpark(sparkDetail.type ?? '')}
          </div>
          <div className="flex-1/4">
            {to2Decimal(sparkDetail.chanceAtLeastOnce)}%
          </div>
        </div>
      )
    )
  }, [level, position, showSparkProcPopover, treeData])

  const handleBlueSparkChange = (value: Partial<BlueSparkData>) => {
    if (!onBlueSparkChange) return
    onBlueSparkChange(
      {
        ...blueSpark,
        stat: value.stat ?? blueSpark?.stat ?? '',
        level: value.level ?? blueSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handlePinkSparkChange = (value: Partial<PinkSparkData>) => {
    if (!onPinkSparkChange) return
    onPinkSparkChange(
      {
        ...pinkSpark,
        stat: value.stat ?? pinkSpark?.stat ?? '',
        level: value.level ?? pinkSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handleGreenSparkChange = (value: Partial<GreenSparkData>) => {
    if (!onGreenSparkChange) return
    onGreenSparkChange(
      {
        ...greenSpark,
        stat: value.stat ?? greenSpark?.stat ?? '',
        level: value.level ?? greenSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handleWhiteSparkChange = (value: WhiteSparkData[]) => {
    onWhiteSparkChange?.(value, { level, position })
  }

  const handleRacesWonChange = (value: RacesData) => {
    onRacesWonChange?.(value, { level, position })
  }

  const getAffinityIcon = (affinity: number) => {
    if (affinity < 51) {
      return <Triangle className="w-4 h-4 text-red-400" />
    } else if (affinity < 151) {
      return <Circle className="w-4 h-4 text-yellow-400" />
    } else {
      return <CircleDot className="w-4 h-4 text-green-400" />
    }
  }

  const getAffinity = () => {
    if (!uma || !treeData) {
      return { total: 0, base: 0, race: 0 }
    }
    const baseAffinity =
      getBaseAffinity(treeData, {
        level,
        position,
      })?.total ?? 0

    const raceAffinity = getRaceAffinity(treeData, {
      level,
      position,
    })

    return {
      total: baseAffinity + raceAffinity,
      base: baseAffinity,
      race: raceAffinity,
    }
  }

  const affinity = getAffinity()

  // Dynamic sizing based on level
  const getCardSize = () => {
    if (size === 'big') {
      return 'min-h-48'
    } else {
      return 'min-h-32'
    }
  }

  const isSmallSize = size === 'small'

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

  return (
    <Card
      className={`h-full ${getCardSize()} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-start">
          {
            <div className="flex items-center gap-2 flex-1 mr-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {uma?.id ? (
                  <img
                    src={getImagePath(uma.id)}
                    alt={uma?.name || 'Uma Musume'}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100"
                    style={{ width: 32, height: 32 }}
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-800">
                {renderUmaName(uma?.name)}
              </span>
            </div>
          }
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => onSelectUma(level, position)}
            title="Select Uma"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        className={`${isSmallSize ? 'p-2 pt-0' : 'p-3 pt-0'} space-y-2`}
      >
        <div className={`grid ${isSmallSize ? 'gap-0.5' : 'gap-1'} relative`}>
          <BlueSparkSelector
            blueSpark={blueSpark}
            onBlueSparkChange={handleBlueSparkChange}
          />
        </div>
        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'} relative`}
        >
          <PinkSparkSelector
            pinkSpark={pinkSpark}
            onPinkSparkChange={handlePinkSparkChange}
          />
        </div>
        {/* GREEN SPARK SECTOR */}
        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}
        >
          <GreenSparkSelector
            greenSpark={greenSpark}
            onGreenSparkChange={handleGreenSparkChange}
            uma={uma}
          />
        </div>

        {/* WHITE SPARK SECTOR */}
        <WhiteSparkSelector
          whiteSpark={whiteSpark}
          races={races}
          onWhiteSparkChange={handleWhiteSparkChange}
          onRacesWonChange={handleRacesWonChange}
          isSmallSize={isSmallSize}
        />
        {/* AFFINITY SECTOR */}
        <Separator
          orientation="horizontal"
          className="my-4 w-auto self-stretch"
        />
        <div className="flex justify-between">
          <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
            {LOCALE_EN.AFFINITY}
          </div>
          <div className="text-xs inline-flex gap-1">
            <Tooltip
              content={`From parents: ${affinity.base} | From races: ${affinity.race}`}
            >
              <span className="cursor-pointer font-bold underline">
                {affinity.total}
              </span>
            </Tooltip>
            <span>{getAffinityIcon(affinity.total) ?? null}</span>
          </div>
        </div>
        {/* INSPIRATION CHANCE SECTOR */}
        <Separator
          orientation="horizontal"
          className="my-2 w-auto self-stretch"
        />
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
      </CardContent>
    </Card>
  )
}

export default UmaCard

import { Button } from '@/ui/base/button'
import { Card, CardContent, CardFooter } from '@/ui/base/card'
import { ChevronDown, Trash2, User } from 'lucide-react'
import React, { useState } from 'react'
import { useTreeData } from '../../hooks/useTreeData'
import type {
  BlueSparkData,
  GreenSparkData,
  PinkSparkData,
  RacesData,
  Uma,
  WhiteSparkData,
} from '../../types/uma'
import BlueSparkSelector from '../components/BlueSparkSelector'
import PinkSparkSelector from '../components/PinkSparkSelector'
import GreenSparkSelector from '../components/GreenSparkSelector'
import WhiteSparkSelector from '../components/WhiteSparkSelector'
import RaceSparkSelector from '../components/RaceSparkSelector'
import AffinityDisplay from '../components/AffinityDisplay'
import SparkProcDisplay from '../components/SparkProcDisplay'
import SaveUmaButton from '../components/SaveUmaButton'
import UmaImage from '../components/UmaImage'
import { getUmaNameById } from '../../utils/formatting'

interface CompactUmaCardProps {
  uma?: Uma | null
  onSelectUma: (level: number, position: number) => void
  level: number
  position: number
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

const CompactUmaCard: React.FC<CompactUmaCardProps> = ({
  uma,
  onSelectUma,
  level,
  position,
  onBlueSparkChange,
  onPinkSparkChange,
  onGreenSparkChange,
  onRacesWonChange,
  onWhiteSparkChange,
}) => {
  const { updateTreeData } = useTreeData()
  const [isExpanded, setIsExpanded] = useState(true)
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races = [] } = uma || {}

  const handleClearUma = () => {
    updateTreeData(level, position, null)
  }

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
    if (!onWhiteSparkChange) return
    onWhiteSparkChange(value, { level, position })
  }

  if (!uma?.id) {
    return (
      <Card className="p-2 border-dashed border-2 border-gray-300">
        <CardContent className="p-2">
          <Button
            variant="ghost"
            className="w-full h-16 flex flex-col items-center justify-center gap-1 text-gray-500"
            onClick={() => onSelectUma(level, position)}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Select Uma</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-2">
      <CardContent className="p-2 space-y-2">
        {/* Compact header with key info */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex-shrink-0">
            <UmaImage charaId={uma.id} alt={uma.name || 'Uma'} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {getUmaNameById(uma.id, false)}
            </div>
          </div>
        </div>

        {/* Simple expandable details */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Details & Sparks</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </Button>

          {isExpanded && (
            <div className="space-y-2 mt-2">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <BlueSparkSelector
                  blueSpark={blueSpark}
                  onBlueSparkChange={handleBlueSparkChange}
                />
                <PinkSparkSelector
                  pinkSpark={pinkSpark}
                  onPinkSparkChange={handlePinkSparkChange}
                />
                <GreenSparkSelector
                  greenSpark={greenSpark}
                  onGreenSparkChange={handleGreenSparkChange}
                  uma={uma}
                />
                <RaceSparkSelector
                  races={races}
                  onRacesWonChange={value =>
                    onRacesWonChange?.(value, { level, position })
                  }
                />
                <WhiteSparkSelector
                  whiteSpark={whiteSpark}
                  onWhiteSparkChange={handleWhiteSparkChange}
                />
              </div>

              {/* Affinity and proc displays */}
              <div className="grid grid-cols-2 gap-2">
                <AffinityDisplay level={level} position={position} />
                <SparkProcDisplay level={level} position={position} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 space-y-2">
        <div className="w-full flex gap-1">
          <SaveUmaButton className="flex-1" uma={uma} />
          <Button
            onClick={handleClearUma}
            variant="outline"
            size="sm"
            className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 dark:bg-red-600 dark:text-white w-1/2"
            title="Clear all data for this position"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CompactUmaCard

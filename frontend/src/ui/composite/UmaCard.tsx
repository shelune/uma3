import { Button } from '@/ui/base/button'
import { Card, CardContent, CardHeader } from '@/ui/base/card'
import { getImagePath, getUmaNameById } from '@/utils/formatting'
import { User, Trash2 } from 'lucide-react'
import React from 'react'
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
import { Separator } from '../base/separator'

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
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races = [] } = uma || {}

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

  const { updateTreeData } = useTreeData()

  const handleClearData = () => {
    // Clear all data for this specific level/position
    updateTreeData(level, position, null, true)
  }

  // Dynamic sizing based on level
  const getCardSize = () => {
    if (size === 'big') {
      return 'min-h-48 min-w-[180px]'
    } else {
      return 'min-h-32'
    }
  }

  const isSmallSize = size === 'small'

  return (
    <Card
      className={`h-full ${getCardSize()} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-center">
          {
            <div className="flex items-center gap-2 flex-1 mr-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 transition-opacity cursor-pointer"
                  onClick={() => onSelectUma(level, position)}
                  title="Select Uma"
                >
                  {uma?.id ? (
                    <img
                      src={getImagePath(uma.id)}
                      alt={uma?.name || 'Uma Musume'}
                      className="w-8 h-8 rounded-full object-cover"
                      style={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </Button>
              </div>
              <span
                className="text-sm text-gray-800 cursor-pointer"
                onClick={() => onSelectUma(level, position)}
              >
                {uma?.id
                  ? getUmaNameById(uma.id, false)
                  : 'Click to select Uma'}
              </span>
            </div>
          }
        </div>
      </CardHeader>

      <CardContent
        className={`${isSmallSize ? 'p-2 pt-0' : 'p-3 pt-0'} space-y-2`}
      >
        {/* BLUE SPARK SECTION */}
        <div className={`grid ${isSmallSize ? 'gap-0.5' : 'gap-1'} relative`}>
          <BlueSparkSelector
            blueSpark={blueSpark}
            onBlueSparkChange={handleBlueSparkChange}
          />
        </div>

        {/* PINK SPARK SECTION */}
        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'} relative`}
        >
          <PinkSparkSelector
            pinkSpark={pinkSpark}
            onPinkSparkChange={handlePinkSparkChange}
          />
        </div>

        {/* GREEN SPARK SECTION */}
        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}
        >
          <GreenSparkSelector
            greenSpark={greenSpark}
            onGreenSparkChange={handleGreenSparkChange}
            uma={uma}
          />
        </div>
        {/* WHITE SPARK SECTION */}
        <div className={`grid grid-cols-2 gap-0.5`}>
          <RaceSparkSelector
            races={races}
            onRacesWonChange={handleRacesWonChange}
          />
          <WhiteSparkSelector
            whiteSpark={whiteSpark}
            onWhiteSparkChange={handleWhiteSparkChange}
            isSmallSize={isSmallSize}
          />
        </div>
        <Separator
          orientation="horizontal"
          className="my-2 w-auto self-stretch"
        />
        {/* AFFINITY SECTION */}
        <AffinityDisplay uma={uma} level={level} position={position} />
        <Separator
          orientation="horizontal"
          className="my-2 w-auto self-stretch"
        />
        {/* INSPIRATION CHANCE SECTION */}
        <SparkProcDisplay level={level} position={position} />
        <Separator
          orientation="horizontal"
          className="my-2 w-auto self-stretch"
        />
        {/* DELETE / SAVE BUTTONS */}
        <div className={`flex gap-2 justify-between`}>
          <SaveUmaButton className="w-1/2" uma={uma} />
          <Button
            onClick={handleClearData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 w-1/2"
            title="Clear all data for this position"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default UmaCard

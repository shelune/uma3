import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { getBaseAffinity, getImagePath, renderUmaName } from '@/utils'
import { Settings, Star, User, CircleDot, Circle, Triangle } from 'lucide-react'
import React, { useState } from 'react'
import { WHITE_SPARK_RACES } from '../assets/white-sparks'
import type {
  BlueSparkSelection,
  GreenSparkSelection,
  PinkSparkSelection,
  RacesWonSelection,
  Uma,
} from '../types/uma'

export interface UmaCardProps {
  uma?: Uma | null
  name?: string
  onSelectUma: (level: number, position: number) => void
  size: 'big' | 'small'
  level: number
  position: number
}

interface InternalSelectionState {
  stat: string | null
  level: number | null
}

const stats = ['Speed', 'Stamina', 'Power', 'Guts', 'Wits']
const pinkCategories = [
  'Turf',
  'Dirt',
  'Sprint',
  'Mile',
  'Medium',
  'Long',
  'Front Runner',
  'Pace Chaser',
  'Late Surger',
  'End Closer',
]
const starLevels = [1, 2, 3]

interface ExtendedUmaCardProps extends UmaCardProps {
  blueSparkValue?: BlueSparkSelection | null
  onBlueSparkChange?: (
    value: BlueSparkSelection,
    meta: { level: number; position: number }
  ) => void
  pinkSparkValue?: PinkSparkSelection | null
  onPinkSparkChange?: (
    value: PinkSparkSelection,
    meta: { level: number; position: number }
  ) => void
  greenSparkValue?: GreenSparkSelection | null
  onGreenSparkChange?: (
    value: GreenSparkSelection,
    meta: { level: number; position: number }
  ) => void
  onRacesWonChange?: (
    value: RacesWonSelection,
    meta: { level: number; position: number }
  ) => void
}

const UmaCard: React.FC<ExtendedUmaCardProps> = ({
  uma,
  onSelectUma,
  level,
  size = 'big',
  position,
  blueSparkValue,
  onBlueSparkChange,
  pinkSparkValue,
  onPinkSparkChange,
  greenSparkValue,
  onGreenSparkChange,
  onRacesWonChange,
}) => {
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races } = uma || {}

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
    console.log('uma?.id,', uma?.baseId)
    console.log('uma?.parents?.[1]?.id,', uma?.parents?.[1]?.id)
    console.log('uma?.grandParents?.[1]?.id,', uma?.grandParents?.[1]?.id)
    if (!uma || !uma.parents) {
      return 0
    }
    const { baseId, grandParents, parents } = uma
    if (baseId && (parents || grandParents)) {
      const baseAffinityLeft_1 = getBaseAffinity(
        baseId,
        parents?.[1]?.id,
        grandParents?.[1]?.id
      )
      const baseAffinityLeft_2 = getBaseAffinity(
        baseId,
        parents?.[1]?.id,
        grandParents?.[2]?.id
      )
      const baseAffinityRight_1 = getBaseAffinity(
        baseId,
        parents?.[2]?.id,
        grandParents?.[1]?.id
      )
      const baseAffinityRight_2 = getBaseAffinity(
        baseId,
        parents?.[2]?.id,
        grandParents?.[2]?.id
      )
      console.log({ baseAffinityLeft_1 })
      return (
        baseAffinityLeft_1 +
        baseAffinityLeft_2 +
        baseAffinityRight_1 +
        baseAffinityRight_2
      )
    }
    return 0
  }

  // Dynamic sizing based on level
  const getCardSize = () => {
    if (size === 'big') {
      return 'w-56 min-h-48'
    } else {
      return 'w-40 min-h-32'
    }
  }

  const isSmallSize = size === 'small'

  // Selection states (handled by popovers)
  const [blueSparkSelection, setBlueSparkSelection] =
    useState<InternalSelectionState>({
      stat: blueSparkValue?.stat || null,
      level: blueSparkValue?.level || null,
    })
  const [pinkSparkSelection, setPinkSparkSelection] =
    useState<InternalSelectionState>({
      stat: pinkSparkValue?.stat || null,
      level: pinkSparkValue?.level || null,
    })
  const [greenSparkSelection, setGreenSparkSelection] = useState<number | null>(
    greenSparkValue?.level || null
  )
  const [racesWonSelection, setRacesWonSelection] = useState<string[]>(
    races || []
  )

  const commitIfComplete = (next: InternalSelectionState) => {
    if (next.stat && next.level && onBlueSparkChange) {
      onBlueSparkChange(
        { stat: next.stat, level: next.level },
        { level, position }
      )
    }
  }
  const commitPinkIfComplete = (next: InternalSelectionState) => {
    if (next.stat && next.level && onPinkSparkChange) {
      onPinkSparkChange(
        { stat: next.stat, level: next.level },
        { level, position }
      )
    }
  }

  const selectStat = (s: string) => {
    setBlueSparkSelection(prev => {
      const next = { ...prev, stat: s }
      commitIfComplete(next)
      return next
    })
  }

  const selectLevel = (lvl: number) => {
    setBlueSparkSelection(prev => {
      const next = { ...prev, level: lvl }
      commitIfComplete(next)
      return next
    })
  }

  const selectPinkStat = (s: string) => {
    setPinkSparkSelection(prev => {
      const next = { ...prev, stat: s }
      commitPinkIfComplete(next)
      return next
    })
  }

  const selectPinkLevel = (lvl: number) => {
    setPinkSparkSelection(prev => {
      const next = { ...prev, level: lvl }
      commitPinkIfComplete(next)
      return next
    })
  }

  const selectGreenLevel = (lvl: number) => {
    setGreenSparkSelection(lvl)
    if (onGreenSparkChange) {
      onGreenSparkChange({ level: lvl }, { level, position })
    }
  }

  const toggleRace = (race: string) => {
    setRacesWonSelection(prev => {
      const newSelection = prev.includes(race)
        ? prev.filter(r => r !== race)
        : [...prev, race]

      if (onRacesWonChange) {
        onRacesWonChange({ races: newSelection }, { level, position })
      }

      return newSelection
    })
  }

  const clearAllRaces = () => {
    if (onRacesWonChange) {
      onRacesWonChange({ races: [] }, { level, position })
    }
  }

  // Dialog (shadcn) handles outside click & escape to close. We only manage selection.

  return (
    <Card
      className={`${getCardSize()} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
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
            className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
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
          {/* Blue Spark Popover using shadcn */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center bg-blue-50 border-blue-200 cursor-pointer select-none`}
                title="Set Blue Spark Stat & Level"
              >
                {blueSparkSelection.stat && blueSparkSelection.level ? (
                  <span className="flex items-center gap-0.5">
                    <span>{blueSparkSelection.stat}</span>
                    <span className="flex">
                      {Array.from({ length: blueSparkSelection.level }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-blue-400 text-blue-400"
                          />
                        )
                      )}
                    </span>
                  </span>
                ) : (
                  'Stats'
                )}
              </Badge>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-3 w-64 max-w-none border-blue-200"
            >
              <div className="text-[10px] uppercase tracking-wide font-semibold text-blue-600 mb-1">
                Blue Spark
              </div>
              <div className="flex gap-2">
                {/* Stats Column */}
                <div className="flex flex-col gap-1 w-1/2">
                  {stats.map(s => {
                    const active = blueSparkSelection.stat === s
                    return (
                      <button
                        key={s}
                        onClick={() => selectStat(s)}
                        className={`text-xs rounded-full px-2 py-1 border transition-colors text-left truncate ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-1 h-auto self-stretch"
                />
                {/* Levels Column */}
                <div className="flex flex-col gap-1 w-1/2 items-stretch">
                  {starLevels.map(lvl => {
                    const active = blueSparkSelection.level === lvl
                    return (
                      <button
                        key={lvl}
                        onClick={() => selectLevel(lvl)}
                        className={`text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors ${active ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'}`}
                      >
                        {Array.from({ length: lvl }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </button>
                    )
                  })}
                </div>
              </div>
              {blueSparkSelection.stat && blueSparkSelection.level && (
                <div className="mt-1 text-[10px] text-green-700 font-medium flex items-center gap-1">
                  Set: {blueSparkSelection.stat} – {blueSparkSelection.level}★
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'} relative`}
        >
          {/* Pink Spark Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center bg-pink-50 border-pink-200 cursor-pointer select-none`}
                title="Set Pink Spark Category & Level"
              >
                {pinkSparkSelection.stat && pinkSparkSelection.level ? (
                  <span className="flex items-center gap-0.5">
                    <span>
                      {pinkSparkSelection.stat.length > 6
                        ? pinkSparkSelection.stat.slice(0, 6) + '…'
                        : pinkSparkSelection.stat}
                    </span>
                    <span className="flex">
                      {Array.from({ length: pinkSparkSelection.level }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-pink-400 text-pink-400"
                          />
                        )
                      )}
                    </span>
                  </span>
                ) : (
                  'Aptitudes'
                )}
              </Badge>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-3 w-72 max-w-none border-pink-200"
            >
              <div className="text-[10px] uppercase tracking-wide font-semibold text-pink-600 mb-1">
                Pink Spark
              </div>
              <div className="flex gap-2">
                {/* Categories Column (two-column grid) */}
                <div className="w-1/2 max-h-56 overflow-auto pr-1 grid grid-cols-2 gap-1 content-start">
                  {pinkCategories.map(cat => {
                    const active = pinkSparkSelection.stat === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => selectPinkStat(cat)}
                        className={`min-w-0 text-xs rounded-full px-2 py-1 border transition-colors text-left truncate ${active ? 'bg-pink-600 text-white border-pink-600' : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700'}`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
                <Separator
                  orientation="vertical"
                  className="mx-1 h-auto self-stretch"
                />
                {/* Levels Column */}
                <div className="flex flex-col gap-1 w-1/2 items-stretch">
                  {starLevels.map(lvl => {
                    const active = pinkSparkSelection.level === lvl
                    return (
                      <button
                        key={lvl}
                        onClick={() => selectPinkLevel(lvl)}
                        className={`text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors ${active ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'}`}
                      >
                        {Array.from({ length: lvl }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </button>
                    )
                  })}
                </div>
              </div>
              {pinkSparkSelection.stat && pinkSparkSelection.level && (
                <div className="mt-1 text-[10px] text-green-700 font-medium flex items-center gap-1">
                  Set: {pinkSparkSelection.stat} – {pinkSparkSelection.level}★
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div
          className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}
        >
          {/* Green Spark Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center bg-green-50 border-green-200 cursor-pointer select-none`}
                title="Set Green Spark Level"
              >
                {greenSparkSelection ? (
                  <span className="flex items-center gap-0.5">
                    <span>Unique Skill</span>
                    <span className="flex">
                      {Array.from({ length: greenSparkSelection }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-green-400 text-green-400"
                          />
                        )
                      )}
                    </span>
                  </span>
                ) : (
                  'Unique Skill'
                )}
              </Badge>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-3 w-48 max-w-none border-green-200"
            >
              <div className="text-[10px] uppercase tracking-wide font-semibold text-green-600 mb-1">
                Green Spark
              </div>
              <div className="flex flex-col gap-1 items-stretch">
                {starLevels.map(lvl => {
                  const active = greenSparkSelection === lvl
                  return (
                    <button
                      key={lvl}
                      onClick={() => selectGreenLevel(lvl)}
                      className={`text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors ${active ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'}`}
                    >
                      {Array.from({ length: lvl }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </button>
                  )
                })}
              </div>
              {greenSparkSelection && (
                <div className="mt-1 text-[10px] text-green-700 font-medium flex items-center gap-1">
                  Set: Unique Skill – {greenSparkSelection}★
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <div
          className={`grid grid-cols-2 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}
        >
          {/* White Spark Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center cursor-pointer select-none bg-yellow-500 hover:bg-yellow-600 text-yellow-900`}
                title="Set White Spark Races"
              >
                <span className="flex items-center gap-0.5">
                  <span>G1 wins ({racesWonSelection.length})</span>
                </span>
              </Badge>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-3 w-80 max-w-none">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
                  White Spark Races
                </div>
                <button
                  className="cursor-pointer text-xs uppercase tracking-wide font-semibold text-red-600 mb-2"
                  onClick={clearAllRaces}
                >
                  Clear All Races
                </button>
              </div>
              <div className="max-h-64 overflow-auto pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {WHITE_SPARK_RACES.map(race => {
                    const isSelected = racesWonSelection.includes(race)
                    return (
                      <label
                        key={race}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded text-xs"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRace(race)}
                        />
                        <span className="text-xs leading-tight">{race}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              {racesWonSelection.length > 0 && (
                <div className="mt-2 text-[10px] text-green-700 font-medium flex items-center gap-1">
                  Selected: {racesWonSelection.length} race
                  {racesWonSelection.length !== 1 ? 's' : ''}
                </div>
              )}
            </PopoverContent>
          </Popover>
          <Badge
            className={`w-full justify-center bg-white text-black ${isSmallSize ? 'text-xs py-0.5' : ''}`}
          >
            White Sparks {races}
          </Badge>
        </div>
        <Separator
          orientation="horizontal"
          className="my-4 w-auto self-stretch"
        />
        <div className="flex justify-between">
          <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
            Affinity
          </div>
          <div className="text-xs inline-flex gap-1">
            <span>{getAffinity()}</span>
            <span>{getAffinityIcon(getAffinity()) ?? null}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UmaCard

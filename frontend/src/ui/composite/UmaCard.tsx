import { Badge } from '@/ui/base/badge'
import { Button } from '@/ui/base/button'
import { Card, CardContent, CardHeader } from '@/ui/base/card'
import { Checkbox } from '@/ui/base/checkbox'
import { Input } from '@/ui/base/input'
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
  Star,
  User,
  CircleDot,
  Circle,
  Triangle,
  SquareArrowUpRightIcon,
  X,
} from 'lucide-react'
import React, { useCallback, useContext, useState } from 'react'
import {
  WHITE_SPARK_RACES,
  WHITE_SPARK_SKILLS,
} from '../../assets/white-sparks'
import type {
  BlueSparkData,
  GreenSparkData,
  PinkSparkData,
  RacesData,
  SparkData,
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

export interface UmaCardProps {
  uma?: Uma | null
  name?: string
  onSelectUma: (level: number, position: number) => void
  size: 'big' | 'small'
  level: number
  position: number
}

const starLevels = [1, 2, 3]

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

  // White spark state
  const [whiteSparkSelection, setWhiteSparkSelection] = useState<SparkData[]>(
    whiteSpark || []
  )
  const [whiteSparkSearch, setWhiteSparkSearch] = useState('')
  const [currentWhiteSpark, setWhiteSparkEditingState] = useState<{
    spark: SparkData | null
    level: number
  }>({
    spark: null,
    level: 1,
  })

  // Create white spark data array
  const ALL_WHITE_SPARKS = React.useMemo(() => {
    const raceData: SparkData[] = WHITE_SPARK_RACES.map(race => ({
      stat: race,
      level: 1,
      isRace: true,
    }))
    const skillData: SparkData[] = WHITE_SPARK_SKILLS.map(skill => ({
      stat: skill,
      level: 1,
      isRace: false,
    }))
    return [...raceData, ...skillData]
  }, [])

  // Filter white spark data based on search
  const filteredWhiteSparkData = React.useMemo(() => {
    if (!whiteSparkSearch.trim()) return ALL_WHITE_SPARKS
    return ALL_WHITE_SPARKS.filter(spark =>
      spark.stat.toLowerCase().includes(whiteSparkSearch.toLowerCase())
    )
  }, [ALL_WHITE_SPARKS, whiteSparkSearch])

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

  const toggleRace = (race: string) => {
    const newSelection = races.includes(race)
      ? races.filter(r => r !== race)
      : [...races, race]

    if (onRacesWonChange) {
      onRacesWonChange({ races: newSelection }, { level, position })
    }
  }

  const clearAllRaces = () => {
    if (onRacesWonChange) {
      onRacesWonChange({ races: [] }, { level, position })
    }
  }

  const selectWhiteSpark = (spark: SparkData) => {
    setWhiteSparkEditingState({
      spark,
      level: currentWhiteSpark.level,
    })
  }

  const selectWhiteSparkLevel = (level: number) => {
    setWhiteSparkEditingState(prev => ({
      ...prev,
      level,
    }))
  }

  const addWhiteSpark = () => {
    if (!currentWhiteSpark.spark) return

    // Remove any existing spark with same stat and type
    const filteredSelection = whiteSparkSelection.filter(
      s => !(s.stat === currentWhiteSpark.spark!.stat)
    )
    const newSpark: SparkData = {
      ...currentWhiteSpark.spark,
      level: currentWhiteSpark.level,
    }

    setWhiteSparkSelection([...filteredSelection, newSpark])

    // Reset editing state
    setWhiteSparkEditingState({ spark: null, level: 1 })
    onWhiteSparkChange?.([...filteredSelection, newSpark], { level, position })
  }

  const removeWhiteSpark = (spark: SparkData) => {
    setWhiteSparkSelection(prev => prev.filter(s => !(s.stat === spark.stat)))
  }

  const clearAllWhiteSparks = () => {
    setWhiteSparkSelection([])
    setWhiteSparkEditingState({ spark: null, level: 1 })
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
                {renderUmaName(uma?.name)} {level}-{position}
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
        <div
          className={`grid grid-cols-2 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center cursor-pointer select-none bg-yellow-500 hover:bg-yellow-600 text-yellow-900`}
                title="Set White Spark Races"
              >
                <span className="flex items-center gap-0.5">
                  <span>
                    {LOCALE_EN.G1_WINS} ({races.length})
                  </span>
                </span>
              </Badge>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-3 w-80 max-w-none">
              <div className="flex justify-between items-center">
                <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 mb-2">
                  Races Won
                </div>
                <button
                  className="cursor-pointer text-xs uppercase tracking-wide font-semibold text-red-600 mb-2"
                  onClick={clearAllRaces}
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-64 overflow-auto pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {WHITE_SPARK_RACES.map(race => {
                    const isSelected = races.includes(race)
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
              <div className="mt-2 text-[10px] text-green-700 font-medium flex items-center gap-1">
                Selected: {races.length} race(s)
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                role="button"
                className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} w-full justify-center cursor-pointer select-none bg-gray-50 hover:bg-gray-100 border-gray-200`}
                title="Set White Spark Skills/Races"
              >
                {whiteSparkSelection.length > 0 ? (
                  <span className="flex items-center gap-0.5 truncate">
                    <span className="truncate">White Sparks</span>
                    <span className="text-[10px] bg-gray-200 px-1 rounded">
                      {whiteSparkSelection.length}
                    </span>
                  </span>
                ) : (
                  <span>{LOCALE_EN.WHITE_SPARKS}</span>
                )}
              </Badge>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-3 w-[520px] max-w-none">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs uppercase tracking-wide font-semibold text-gray-600">
                  White Sparks
                </div>
                <button
                  className="cursor-pointer text-xs uppercase tracking-wide font-semibold text-red-600"
                  onClick={clearAllWhiteSparks}
                >
                  Clear All
                </button>
              </div>

              {/* Selection Section */}
              <div className="flex gap-2 mb-3">
                {/* Sparks Column */}
                <div className="w-2/3">
                  <div className="mb-2">
                    <Input
                      placeholder="Race / Skill Name"
                      value={whiteSparkSearch}
                      onChange={e => setWhiteSparkSearch(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div className="max-h-48 overflow-auto pr-1">
                    <div className="grid grid-cols-1 gap-1">
                      {filteredWhiteSparkData.map(spark => {
                        const active =
                          currentWhiteSpark.spark?.stat === spark.stat
                        const disabled = whiteSparkSelection.some(
                          selection => selection.stat === spark.stat
                        )
                        return (
                          <button
                            key={`${spark.stat}`}
                            onClick={() => selectWhiteSpark(spark)}
                            className={`flex items-center gap-2 p-1 rounded text-xs transition-colors text-left ${active ? 'bg-gray-600 text-white' : 'hover:bg-gray-100'} ${disabled ? 'bg-gray-200 text-gray-600 opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={disabled}
                          >
                            <span className="flex-1 truncate">
                              {spark.stat}
                            </span>
                            {getBadgeBySpark(
                              spark.isRace ? 'raceSpark' : 'whiteSpark'
                            )}
                          </button>
                        )
                      })}
                    </div>
                    {filteredWhiteSparkData.length === 0 && (
                      <div className="text-xs text-gray-500 text-center py-4">
                        No sparks found matching "{whiteSparkSearch}"
                      </div>
                    )}
                  </div>
                </div>

                <Separator
                  orientation="vertical"
                  className="mx-1 h-auto self-stretch"
                />

                {/* Levels Column */}
                <div className="w-1/3">
                  <div className="text-[10px] text-gray-600 mb-2">Level</div>
                  <div className="flex flex-col gap-1">
                    {starLevels.map(lvl => {
                      const active = currentWhiteSpark.level === lvl
                      return (
                        <button
                          key={lvl}
                          onClick={() => selectWhiteSparkLevel(lvl)}
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
                  <button
                    onClick={addWhiteSpark}
                    disabled={!currentWhiteSpark.spark}
                    className="w-full mt-2 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-2 py-1 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Sparks Display */}
              {whiteSparkSelection.length > 0 && (
                <div className="border-t pt-2">
                  <div className="text-[10px] text-gray-600 mb-1">
                    Selected ({whiteSparkSelection.length}):
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-auto">
                    {whiteSparkSelection.map((spark, index) => (
                      <Badge
                        key={`selected-${spark.stat}-${index}`}
                        variant="outline"
                        className="text-[10px] px-1 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-red-50"
                        onClick={() => removeWhiteSpark(spark)}
                      >
                        <span className="truncate max-w-20">{spark.stat}</span>
                        <span className="flex">
                          {Array.from({ length: spark.level }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-2 h-2 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </span>
                        <span className="text-red-500 hover:text-red-700">
                          <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentWhiteSpark.spark && currentWhiteSpark.level && (
                <div className="mt-2 text-[10px] text-green-700 font-medium flex items-center gap-1">
                  Ready to add: {currentWhiteSpark.spark.stat} –{' '}
                  {currentWhiteSpark.level}★
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
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

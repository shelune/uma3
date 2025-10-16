import { Badge } from '@/ui/base/badge'
import { Input } from '@/ui/base/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import { pickBadgeColorBySparkType, renderSparkType } from '@/utils/formatting'
import { Star, X } from 'lucide-react'
import React, { useState } from 'react'
import {
  BASE_WHITE_SPARK_RACES,
  WHITE_SPARK_SCENARIOS,
  WHITE_SPARK_SKILLS,
} from '../../assets/white-sparks'
import type { SparkData, WhiteSparkData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface WhiteSparkSelectorProps {
  whiteSpark?: WhiteSparkData[]
  onWhiteSparkChange?: (value: WhiteSparkData[]) => void
  isSmallSize?: boolean
}

const starLevels = [1, 2, 3]

export default function WhiteSparkSelector({
  whiteSpark = [],
  onWhiteSparkChange,
}: WhiteSparkSelectorProps) {
  const [whiteSparkSearch, setWhiteSparkSearch] = useState('')
  const [currentWhiteSpark, setWhiteSparkEditingState] = useState<{
    spark: SparkData | null
    level: number
  }>({
    spark: null,
    level: 1,
  })

  // Create white spark data array (skills only)
  const ALL_WHITE_SPARKS = React.useMemo(() => {
    const raceData: SparkData[] = BASE_WHITE_SPARK_RACES.map(
      (race: string) => ({
        stat: race,
        level: 1,
        isRace: true,
      })
    )
    const skillData: SparkData[] = [
      ...WHITE_SPARK_SKILLS,
      ...WHITE_SPARK_SCENARIOS,
    ].map((skill: string) => ({
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
    const filteredSelection = whiteSpark.filter(
      spark => spark.stat !== currentWhiteSpark.spark!.stat
    )
    const newSpark: SparkData = {
      ...currentWhiteSpark.spark,
      level: currentWhiteSpark.level,
    }

    const newSelection = [...filteredSelection, newSpark]
    onWhiteSparkChange?.(newSelection)

    // Reset editing state
    setWhiteSparkEditingState({ spark: null, level: 1 })
  }

  const removeWhiteSpark = (spark: SparkData) => {
    const newSelection = whiteSpark.filter(s => s.stat !== spark.stat)
    onWhiteSparkChange?.(newSelection)
  }

  const clearAllWhiteSparks = () => {
    setWhiteSparkEditingState({ spark: null, level: 1 })
    onWhiteSparkChange?.([])
  }

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
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="button"
          className={
            'text-xs w-full justify-center cursor-pointer select-none bg-gray-50 dark:bg-gray-400 hover:bg-gray-100 border-gray-200'
          }
          title="Set White Spark Skills"
        >
          {whiteSpark.length > 0 ? (
            <span className="flex items-center gap-0.5 truncate">
              <span className="truncate">White Sparks</span>
              <span className="ml-1 text-[10px] bg-gray-200 dark:bg-gray-600 px-1 rounded">
                {whiteSpark.length}
              </span>
            </span>
          ) : (
            <span>{LOCALE_EN.WHITE_SPARKS}</span>
          )}
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-3 w-full max-w-dvw"
        avoidCollisions={false}
      >
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
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-auto pr-1">
              <div className="grid grid-cols-1 gap-1">
                {filteredWhiteSparkData.map(spark => {
                  const active = currentWhiteSpark.spark?.stat === spark.stat
                  const disabled = whiteSpark.some(
                    selection => selection.stat === spark.stat
                  )
                  const activeClass = active
                    ? 'bg-gray-600 text-white'
                    : 'hover:bg-gray-100'
                  const disabledClass = disabled
                    ? 'bg-gray-200 text-gray-600 opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  return (
                    <button
                      key={`${spark.stat}`}
                      onClick={() => selectWhiteSpark(spark)}
                      className={mergeTwClass(
                        'flex items-center gap-2 p-1 rounded text-xs transition-colors text-left dark:hover:bg-gray-400',
                        activeClass,
                        disabledClass
                      )}
                      disabled={disabled}
                    >
                      <span className="flex-1 truncate">{spark.stat}</span>
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
                const activeClass = active
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                return (
                  <button
                    key={lvl}
                    onClick={() => selectWhiteSparkLevel(lvl)}
                    className={mergeTwClass(
                      `text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors}`,
                      activeClass
                    )}
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
        {whiteSpark.length > 0 && (
          <div className="border-t pt-2">
            <div className="text-[10px] text-gray-600 mb-1">
              Selected ({whiteSpark.length}):
            </div>
            <div className="flex flex-wrap gap-1 max-h-20">
              {whiteSpark.map((spark, index) => (
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
  )
}

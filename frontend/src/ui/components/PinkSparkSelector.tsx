import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import { Star } from 'lucide-react'
import React from 'react'
import type { PinkSparkData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface PinkSparkSelectorProps {
  pinkSpark?: PinkSparkData | null
  onPinkSparkChange?: (value: Partial<PinkSparkData>) => void
  isSmallSize?: boolean
}

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

const PinkSparkSelector = ({
  pinkSpark,
  onPinkSparkChange,
}: PinkSparkSelectorProps) => {
  const handlePinkSparkChange = (value: Partial<PinkSparkData>) => {
    if (!onPinkSparkChange) return
    onPinkSparkChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="button"
          className="text-xs w-full justify-center bg-pink-50 border-pink-200 cursor-pointer select-none"
          title="Set Pink Spark Category & Level"
        >
          {pinkSpark && pinkSpark.stat && pinkSpark.level ? (
            <span className="flex items-center gap-0.5">
              <span>{pinkSpark.stat}</span>
              <span className="flex">
                {Array.from({ length: pinkSpark.level }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-pink-400 text-pink-400"
                  />
                ))}
              </span>
            </span>
          ) : (
            LOCALE_EN.APTITUDES
          )}
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-3 min-w-96 max-w-none border-pink-200"
      >
        <div className="text-[10px] uppercase tracking-wide font-semibold text-pink-600 mb-1">
          {LOCALE_EN.PINK_SPARKS}
        </div>
        <div className="flex gap-2">
          {/* Categories Column (two-column grid) */}
          <div className="w-3/4 max-h-56 overflow-auto pr-1 grid grid-cols-2 gap-1 content-start">
            {pinkCategories.map(cat => {
              const active = pinkSpark && pinkSpark.stat === cat
              return (
                <button
                  key={cat}
                  onClick={() => handlePinkSparkChange({ stat: cat })}
                  className={mergeTwClass(
                    'min-w-0 text-xs rounded-full px-2 py-1 border transition-colors text-left bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
                    {
                      'bg-pink-600 text-white border-pink-600': active,
                    }
                  )}
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
          <div className="flex flex-col gap-1 w-1/4 items-stretch">
            {starLevels.map(level => {
              const active = pinkSpark && pinkSpark.level === level
              return (
                <button
                  key={level}
                  onClick={() => handlePinkSparkChange({ level })}
                  className={mergeTwClass(
                    'text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800',
                    {
                      'bg-amber-500 text-white border-amber-500': active,
                    }
                  )}
                >
                  {Array.from({ length: level }).map((_, i) => (
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
        <div className="mt-1 text-[10px] text-green-700 font-medium flex items-center gap-1">
          <span>
            Stat Spark: {pinkSpark && pinkSpark.stat ? pinkSpark.stat : '?'}.
            Level: {pinkSpark && pinkSpark.level ? pinkSpark.level : '?'}★
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PinkSparkSelector

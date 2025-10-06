import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import { Star } from 'lucide-react'
import React from 'react'
import type { BlueSparkData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface BlueSparkSelectorProps {
  blueSpark?: BlueSparkData | null
  onBlueSparkChange?: (value: Partial<BlueSparkData>) => void
}

const stats = ['Speed', 'Stamina', 'Power', 'Guts', 'Wits']
const starLevels = [1, 2, 3]

const BlueSparkSelector = ({
  blueSpark,
  onBlueSparkChange,
}: BlueSparkSelectorProps) => {
  const handleBlueSparkChange = (value: Partial<BlueSparkData>) => {
    if (!onBlueSparkChange) return
    onBlueSparkChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="button"
          className={`text-xs w-full justify-center bg-blue-50 border-blue-200 cursor-pointer select-none`}
          title="Set Blue Spark Stat & Level"
        >
          {blueSpark && blueSpark.stat && blueSpark.level ? (
            <span className="flex items-center gap-0.5">
              <span>{blueSpark.stat}</span>
              <span className="flex">
                {Array.from({ length: blueSpark.level }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-blue-400 text-blue-400"
                  />
                ))}
              </span>
            </span>
          ) : (
            LOCALE_EN.STATS
          )}
        </Badge>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-3 w-64 max-w-none border-blue-200"
      >
        <div className="text-[10px] uppercase tracking-wide font-semibold text-blue-600 mb-1">
          {LOCALE_EN.BLUE_SPARKS}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-3/4">
            {stats.map(stat => {
              const active = blueSpark && blueSpark.stat === stat
              return (
                <button
                  key={stat}
                  onClick={() => handleBlueSparkChange({ stat: stat })}
                  className={mergeTwClass(
                    'text-xs rounded-full px-2 py-1 border transition-colors text-left truncate bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
                    {
                      'bg-blue-600 text-white border-blue-600': active,
                    }
                  )}
                >
                  {stat}
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
              const active = blueSpark && blueSpark.level === level
              return (
                <button
                  key={level}
                  onClick={() => handleBlueSparkChange({ level: level })}
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
            Stat Spark: {blueSpark && blueSpark.stat ? blueSpark.stat : '?'}.
            Level: {blueSpark && blueSpark.level ? blueSpark.level : '?'}★
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default BlueSparkSelector

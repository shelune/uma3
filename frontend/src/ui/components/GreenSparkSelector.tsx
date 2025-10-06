import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Star } from 'lucide-react'
import React from 'react'
import type { GreenSparkData, Uma } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface GreenSparkSelectorProps {
  greenSpark?: GreenSparkData | null
  onGreenSparkChange?: (value: Partial<GreenSparkData>) => void
  uma?: Uma | null
}

const starLevels = [1, 2, 3]

const GreenSparkSelector = ({
  greenSpark,
  onGreenSparkChange,
  uma,
}: GreenSparkSelectorProps) => {
  const handleGreenSparkChange = (value: Partial<GreenSparkData>) => {
    if (!onGreenSparkChange) return
    onGreenSparkChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="button"
          className={
            'text-xs w-full justify-center bg-green-50 border-green-200 cursor-pointer select-none'
          }
          title="Set Green Spark Level"
        >
          {greenSpark ? (
            <span className="flex items-center gap-0.5">
              <span>Unique Skill</span>
              <span className="flex">
                {Array.from({ length: greenSpark.level }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-green-400 text-green-400"
                  />
                ))}
              </span>
            </span>
          ) : (
            LOCALE_EN.UNIQUE
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
            const active = greenSpark && greenSpark.level === lvl
            const disabled = !uma || !uma.baseId
            return (
              <button
                key={lvl}
                onClick={() =>
                  uma
                    ? handleGreenSparkChange({ stat: uma.id, level: lvl })
                    : undefined
                }
                className={mergeTwClass(
                  `text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors`,
                  active
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800',
                  disabled
                    ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed hover:bg-gray-200 hover:text-gray-400'
                    : ''
                )}
                disabled={disabled}
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
          {!uma || !uma.baseId ? (
            <div className="text-[10px] text-red-600 font-medium flex items-center gap-1">
              Select a character first
            </div>
          ) : null}
        </div>
        {greenSpark && greenSpark.level ? (
          <div className="mt-1 text-[10px] text-green-700 font-medium flex items-center gap-1">
            Set: Unique Skill
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export default GreenSparkSelector

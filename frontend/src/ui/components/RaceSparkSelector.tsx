import { Badge } from '@/ui/base/badge'
import { Checkbox } from '@/ui/base/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { WHITE_SPARK_RACES } from '../../assets/white-sparks'
import type { RacesData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'

interface RaceSparkSelectorProps {
  races?: string[]
  onRacesWonChange?: (value: RacesData) => void
  isSmallSize?: boolean
}

export default function RaceSparkSelector({
  races = [],
  onRacesWonChange,
}: RaceSparkSelectorProps) {
  const toggleRace = (race: string) => {
    const newSelection = races.includes(race)
      ? races.filter(r => r !== race)
      : [...races, race]

    if (onRacesWonChange) {
      onRacesWonChange({ races: newSelection })
    }
  }

  const clearAllRaces = () => {
    if (onRacesWonChange) {
      onRacesWonChange({ races: [] })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          role="button"
          className={
            'text-xs w-full justify-center cursor-pointer select-none bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
          }
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
            {WHITE_SPARK_RACES.map((race: string) => {
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
  )
}

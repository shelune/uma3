import { getBaseAffinity, getRaceAffinity } from '@/utils/affinity'
import { CircleDot, Circle, Triangle } from 'lucide-react'
import { useContext } from 'react'
import { TreeDataContext } from '../../contexts/TreeDataContext'
import Tooltip from '../base/tooltip'
import { LOCALE_EN } from '../../locale/en'
import type { Uma } from '../../types/uma'

interface AffinityDisplayProps {
  uma?: Uma | null
  level: number
  position: number
}

export default function AffinityDisplay({
  uma,
  level,
  position,
}: AffinityDisplayProps) {
  const treeDataContext = useContext(TreeDataContext)
  const { treeData } = treeDataContext || {}

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

  return (
    <>
      <div className="flex justify-between">
        <div className="text-xs uppercase tracking-wide font-semibold text-gray-600 dark:text-gray-50">
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
    </>
  )
}

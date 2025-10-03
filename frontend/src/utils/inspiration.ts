import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { EnhanceSparkData, SparkData, Uma } from '../types/uma'
import { getBaseAffinity, getFamilyPositionSet } from './affinity'
import { getUmaByPosition } from './uma'

const BASE_CHANCE: Record<string, Record<number, number>> = {
  blueSpark: { 1: 70, 2: 80, 3: 90 },
  pinkSpark: { 1: 1, 2: 3, 3: 5 },
  greenSpark: { 1: 5, 2: 10, 3: 15 },
  whiteSpark: { 1: 3, 2: 6, 3: 9 },
  raceSpark: { 1: 1, 2: 2, 3: 3 },
  scenario: { 1: 3, 2: 6, 3: 9 },
}

export const getSparkChance = (
  spark: SparkData,
  affinity: number,
  type: keyof typeof BASE_CHANCE
) => {
  const baseChance = BASE_CHANCE[type][spark.level]
  const result = Math.min(100, baseChance * (1 + affinity / 100))
  return result.toFixed(2)
}

const RELEVANT_SPARKS: (keyof Pick<
  Uma,
  'pinkSpark' | 'greenSpark' | 'whiteSpark' | 'raceSpark'
>)[] = ['pinkSpark', 'greenSpark', 'whiteSpark', 'raceSpark']

export const buildSparks = (treeData: TreeData, meta: TreeSlot) => {
  if (meta.level === null || meta.position === null) return []
  const umaFamilyPosition = getFamilyPositionSet(meta)
  const affinitySet = getBaseAffinity(treeData, meta)
  if (!umaFamilyPosition || !affinitySet) return []
  console.log({ umaFamilyPosition, affinitySet })
  const sparkSet = []

  for (const [side, group] of Object.entries(umaFamilyPosition)) {
    for (const [relation, pos] of Object.entries(group)) {
      const uma = getUmaByPosition(treeData, pos)
      if (!uma) continue
      for (const sparkName of RELEVANT_SPARKS) {
        const affinity =
          affinitySet[side as 'left' | 'right'][
            relation as 'parent' | 'grandParentPos1' | 'grandParentPos2'
          ]
        const data = uma[sparkName] ?? null
        const sparkData: EnhanceSparkData = { data, affinity, type: sparkName }
        if (
          !data ||
          (Array.isArray(data) && data.length === 0) ||
          (typeof data === 'object' && Object.keys(data).length === 0)
        ) {
          continue
        }
        sparkSet.push(sparkData)
      }
    }
  }
  console.log({ sparkSet })
  return sparkSet
}

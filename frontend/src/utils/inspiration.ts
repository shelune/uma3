import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { EnhanceSparkData, SparkData, Uma } from '../types/uma'
import {
  FamilyTreePosition,
  getBaseAffinity,
  getFamilyPositionSet,
  getRaceAffinity,
} from './affinity'
import { consoleLogDev } from './debug'
import { getUmaByPosition } from './uma'

export const BASE_CHANCE: Record<string, Record<number, number>> = {
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
  return result
}

const RELEVANT_SPARKS: (keyof Pick<
  Uma,
  'pinkSpark' | 'greenSpark' | 'whiteSpark' | 'raceSpark'
>)[] = ['pinkSpark', 'greenSpark', 'whiteSpark', 'raceSpark']

export const buildSparks = (treeData: TreeData, meta: TreeSlot) => {
  if (meta.level === null || meta.position === null) return []
  const umaFamilyPosition = getFamilyPositionSet(meta)
  const baseAffinitySet = getBaseAffinity(treeData, meta)
  const raceAffinitySet = getRaceAffinity(treeData, meta)
  if (!umaFamilyPosition || !baseAffinitySet) return []
  const sparkSet = []
  consoleLogDev('baseAffinitySet', baseAffinitySet)
  for (const [side, group] of Object.entries(umaFamilyPosition) as [
    side: 'left' | 'right',
    group: FamilyTreePosition,
  ][]) {
    for (const [relation, pos] of Object.entries(group) as [
      relation: 'parent' | 'grandParentPos1' | 'grandParentPos2',
      pos: string,
    ][]) {
      const uma = getUmaByPosition(treeData, pos)
      if (!uma) continue
      for (const sparkName of RELEVANT_SPARKS) {
        const isParent = relation === 'parent'
        const baseAffinity = !isParent
          ? // is grandparent, only takes from that grandparent x parent node
            baseAffinitySet[side][relation]
          : // if parent, takes from both parents and both grandparents of that parent
            baseAffinitySet[side].parent +
            baseAffinitySet.parents +
            baseAffinitySet[side].grandParentPos1 +
            baseAffinitySet[side].grandParentPos2
        const raceAffinity = !isParent
          ? raceAffinitySet[side][
              relation as 'grandParentPos1' | 'grandParentPos2'
            ]
          : raceAffinitySet.parents +
            raceAffinitySet[side].grandParentPos1 +
            raceAffinitySet[side].grandParentPos2
        const affinity = baseAffinity + raceAffinity
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
  return sparkSet
}

export type SparkWithChance = {
  stat: string
  chancePerInspiration: number[]
  type: string
}

export const groupSparks = (sparks: EnhanceSparkData[]): SparkWithChance[] => {
  const sparkWithChanceMap = new Map<string, SparkWithChance>()

  for (const enhanceSpark of sparks) {
    const { data, affinity, type } = enhanceSpark

    if (!data) continue

    // Handle both single SparkData and array of SparkData
    const sparkDataArray = Array.isArray(data) ? data : [data]
    for (const sparkData of sparkDataArray) {
      const { stat, isRace } = sparkData
      const innerType = type === 'whiteSpark' && isRace ? 'raceSpark' : type
      const chancePerInspiration = getSparkChance(
        sparkData,
        affinity,
        innerType
      )

      // If we already have this stat, add the chances together
      const existing = sparkWithChanceMap.get(stat)
      if (existing) {
        existing.chancePerInspiration.push(chancePerInspiration)
      } else {
        sparkWithChanceMap.set(stat, {
          stat,
          chancePerInspiration: [chancePerInspiration],
          type: innerType,
        })
      }
    }
  }

  return Array.from(sparkWithChanceMap.values())
}

const getChanceNotHappenPerInspiration = (chance: number) => {
  return 100 - chance
}

const getChanceNotHappenInTotal = (chances: number[]) => {
  return chances.reduce(
    (acc, chance) => (acc * getChanceNotHappenPerInspiration(chance)) / 100,
    100
  )
}

const getChanceHappenAtLeastOnce = (chances: number[]) => {
  // two inspirations per career
  return 100 - Math.pow(getChanceNotHappenInTotal(chances), 2) / 100
}

type SparkChanceResult = {
  chanceAtLeastOnce: number
  type: string
}

export const getSparkAtLeastOnceChances = (sparks: SparkWithChance[]) => {
  const result: Record<string, SparkChanceResult> = {}
  for (const spark of sparks) {
    result[spark.stat] = {
      chanceAtLeastOnce: getChanceHappenAtLeastOnce(spark.chancePerInspiration),
      type: spark.type,
    }
  }
  return result
}

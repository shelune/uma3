import UMA_AFFINITY_MAPPING from '../assets/home/affinity-mapping.json'
import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { getUmaByPosition } from './uma'

const umaAffinityTable: Record<string, number> = UMA_AFFINITY_MAPPING

type FamilyTreePosition = {
  parent: string
  grandParentPos1: string
  grandParentPos2: string
}

type FamilyTreePositionSet = {
  left: FamilyTreePosition
  right: FamilyTreePosition
}

export const getFamilyPositionSet = (
  meta: TreeSlot
): FamilyTreePositionSet | null => {
  if (!meta.level || !meta.position) {
    return null
  }
  const parentLeftPos = `${meta.level + 1}-${meta.position * 2 - 1}`
  const parentRightPos = `${meta.level + 1}-${meta.position * 2}`
  const grandparentLeftPos1 = `${meta.level + 2}-${(meta.position * 2 - 1) * 2 - 1}`
  const grandparentLeftPos2 = `${meta.level + 2}-${(meta.position * 2 - 1) * 2}`
  const grandparentRightPos1 = `${meta.level + 2}-${meta.position * 2 * 2 - 1}`
  const grandparentRightPos2 = `${meta.level + 2}-${meta.position * 2 * 2}`
  return {
    left: {
      parent: parentLeftPos,
      grandParentPos1: grandparentLeftPos1,
      grandParentPos2: grandparentLeftPos2,
    },
    right: {
      parent: parentRightPos,
      grandParentPos1: grandparentRightPos1,
      grandParentPos2: grandparentRightPos2,
    },
  }
}

const sortId = (id: (string | null | undefined)[]) => {
  const sorted = [...id].sort((a, b) => a!.localeCompare(b!)).join(',')
  return sorted
}

const getSafeAffinity = (id: string | null | undefined) => {
  if (!id) return 0
  return umaAffinityTable[id] || 0
}

type AffinityResult = {
  total: number
  left: {
    parent: number
    grandParentPos1: number
    grandParentPos2: number
  }
  right: {
    parent: number
    grandParentPos1: number
    grandParentPos2: number
  }
}

export const getBaseAffinity = (
  treeData: TreeData,
  meta: TreeSlot
): AffinityResult | null => {
  if (meta.level === null || meta.position === null) return null

  const familyTreePositionSet = getFamilyPositionSet(meta)
  if (!familyTreePositionSet) return null

  const { left, right } = familyTreePositionSet
  const childId = getUmaByPosition(treeData, meta)?.baseId
  const parentLeftId = getUmaByPosition(treeData, left.parent)?.baseId
  const parentRightId = getUmaByPosition(treeData, right.parent)?.baseId
  const grandparentLeftPos1 = getUmaByPosition(
    treeData,
    left.grandParentPos1
  )?.baseId
  const grandparentLeftPos2 = getUmaByPosition(
    treeData,
    left.grandParentPos2
  )?.baseId
  const grandparentRightPos1 = getUmaByPosition(
    treeData,
    right.grandParentPos1
  )?.baseId
  const grandparentRightPos2 = getUmaByPosition(
    treeData,
    right.grandParentPos2
  )?.baseId

  const parentLeftAffinity = getSafeAffinity(sortId([childId, parentLeftId]))
  const parentRightAffinity = getSafeAffinity(sortId([childId, parentRightId]))
  const bothParentsAffinity = getSafeAffinity(
    sortId([parentLeftId, parentRightId])
  )
  const grandparentLeftAffinity1 = getSafeAffinity(
    sortId([childId, parentLeftId, grandparentLeftPos1])
  )
  const grandparentLeftAffinity2 = getSafeAffinity(
    sortId([childId, parentLeftId, grandparentLeftPos2])
  )
  const grandparentRightAffinity1 = getSafeAffinity(
    sortId([childId, parentRightId, grandparentRightPos1])
  )
  const grandparentRightAffinity2 = getSafeAffinity(
    sortId([childId, parentRightId, grandparentRightPos2])
  )

  const total =
    parentLeftAffinity +
    parentRightAffinity +
    bothParentsAffinity +
    grandparentLeftAffinity1 +
    grandparentLeftAffinity2 +
    grandparentRightAffinity1 +
    grandparentRightAffinity2

  return {
    total,
    left: {
      parent: parentLeftAffinity,
      grandParentPos1: grandparentLeftAffinity1,
      grandParentPos2: grandparentLeftAffinity2,
    },
    right: {
      parent: parentRightAffinity,
      grandParentPos1: grandparentRightAffinity1,
      grandParentPos2: grandparentRightAffinity2,
    },
  }
}

export const getSharedRacesCount = (
  racesLeft: string[] | undefined,
  racesRight: string[] | undefined
) => {
  if (!racesLeft || !racesRight || !racesLeft.length || !racesRight.length)
    return 0
  const sourceSet = new Set(
    racesLeft.length < racesRight.length ? racesLeft : racesRight
  )
  const count = racesRight.filter(race => sourceSet.has(race)).length
  return count
}

// TODO: check for undefined occurrences and type it better
export const getRaceAffinity = (treeData: TreeData, meta: TreeSlot): number => {
  if (meta.level === null || meta.position === null) return 0

  const familyTreePositionSet = getFamilyPositionSet(meta)
  if (!familyTreePositionSet) return 0

  const { left, right } = familyTreePositionSet
  const parentLeftRaces = getUmaByPosition(treeData, left.parent)?.races
  const parentRightRaces = getUmaByPosition(treeData, right.parent)?.races
  const grandparentLeftPos1Races = getUmaByPosition(
    treeData,
    left.grandParentPos1
  )?.races
  const grandparentLeftPos2Races = getUmaByPosition(
    treeData,
    left.grandParentPos2
  )?.races
  const grandparentRightPos1Races = getUmaByPosition(
    treeData,
    right.grandParentPos1
  )?.races
  const grandparentRightPos2Races = getUmaByPosition(
    treeData,
    right.grandParentPos2
  )?.races

  const parentsSharedRaces = getSharedRacesCount(
    parentLeftRaces,
    parentRightRaces
  )
  const parentsLeftSideRaces =
    getSharedRacesCount(parentLeftRaces, grandparentLeftPos1Races) +
    getSharedRacesCount(parentLeftRaces, grandparentLeftPos2Races)

  const parentsRightSideRaces =
    getSharedRacesCount(parentRightRaces, grandparentRightPos1Races) +
    getSharedRacesCount(parentRightRaces, grandparentRightPos2Races)

  return parentsSharedRaces + parentsLeftSideRaces + parentsRightSideRaces
}

export const getParentAffinityCombosById = (id: string, sorted = true) => {
  const combos = Object.entries(umaAffinityTable)
    .filter(([key]) => key.includes(id) && !/^(\d+),(\d+),(\d+)$/.test(key))
    .map(([key, affinity]) => ({
      id: key.replace(id, '').replace(',', ''),
      affinity,
    }))
    .reduce(
      (acc, curr) => {
        acc[curr.id] = curr.affinity
        return acc
      },
      {} as Record<string, number>
    )
  return combos
}

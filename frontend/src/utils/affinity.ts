import UMA_AFFINITY_MAPPING from '../assets/home/affinity-mapping.json'
import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { getUmaByPosition } from './uma'

const umaAffinityTable: Record<string, number> = UMA_AFFINITY_MAPPING

const MAX_TREE_LEVEL = 4
const MAX_TREE_WIDTH = 2 ** (MAX_TREE_LEVEL - 1)

export type FamilyTreePosition = {
  parent: string
  grandParentPos1: string
  grandParentPos2: string
}

export type FamilyTreePositionSet = {
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
  parents: number
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
    parents: bothParentsAffinity,
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

export type RaceAffinitySet = {
  total: number
  parents: number
  left: {
    grandParentPos1: number
    grandParentPos2: number
  }
  right: {
    grandParentPos1: number
    grandParentPos2: number
  }
}

// TODO: check for undefined occurrences and type it better
export const getRaceAffinity = (
  treeData: TreeData,
  meta: TreeSlot
): RaceAffinitySet => {
  const DEFAULT_RESULT = {
    total: 0,
    left: {
      grandParentPos1: 0,
      grandParentPos2: 0,
    },
    right: {
      grandParentPos1: 0,
      grandParentPos2: 0,
    },
    parents: 0,
  }
  if (meta.level === null || meta.position === null) return DEFAULT_RESULT

  const familyTreePositionSet = getFamilyPositionSet(meta)
  if (!familyTreePositionSet) return DEFAULT_RESULT

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

  const grandparentLeftPos1SharedRaces = getSharedRacesCount(
    parentLeftRaces,
    grandparentLeftPos1Races
  )
  const grandparentLeftPos2SharedRaces = getSharedRacesCount(
    parentLeftRaces,
    grandparentLeftPos2Races
  )
  const grandparentRightPos1SharedRaces = getSharedRacesCount(
    parentRightRaces,
    grandparentRightPos1Races
  )
  const grandparentRightPos2SharedRaces = getSharedRacesCount(
    parentRightRaces,
    grandparentRightPos2Races
  )

  const total =
    parentsSharedRaces +
    grandparentLeftPos1SharedRaces +
    grandparentLeftPos2SharedRaces +
    grandparentRightPos1SharedRaces +
    grandparentRightPos2SharedRaces

  return {
    total: total,
    parents: parentsSharedRaces,
    left: {
      grandParentPos1: grandparentLeftPos1SharedRaces,
      grandParentPos2: grandparentLeftPos2SharedRaces,
    },
    right: {
      grandParentPos1: grandparentRightPos1SharedRaces,
      grandParentPos2: grandparentRightPos2SharedRaces,
    },
  }
}

export const getParentAffinityCombosById = (id: string) => {
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

export const getGrandparentAffinityCombosByIds = (
  parent: string,
  grandparent: string
) => {
  if (!parent || !grandparent) return {}
  const combos = Object.entries(umaAffinityTable)
    .filter(
      ([key]) =>
        key.includes(parent) &&
        key.includes(grandparent) &&
        /^(\d+),(\d+),(\d+)$/.test(key)
    )
    .map(([key, affinity]) => ({
      id: key
        .replace(new RegExp(`${parent}|${grandparent}`, 'g'), '')
        .replace(/,/g, ''),
      affinity: affinity ?? 0,
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

type FamilyPositionAroundSelf = {
  parent: {
    left?: string
    right?: string
  }
  grandchild?: string
  child?: string
}

export const getBasicFamilyAroundPosition = (
  meta: TreeSlot
): FamilyPositionAroundSelf | null => {
  const { level, position } = meta
  if (level === null || position === null) return null
  const result: FamilyPositionAroundSelf = { parent: {} }
  const familyTreePositionSet = getFamilyPositionSet(meta)
  if (
    familyTreePositionSet &&
    level < MAX_TREE_LEVEL &&
    position <= MAX_TREE_WIDTH
  ) {
    result.parent.left = familyTreePositionSet.left.parent
    result.parent.right = familyTreePositionSet.right.parent
  }
  // child
  const childLevel = level - 1
  const childPos = Math.max(1, Math.floor((position + 1) / 2))
  if (childLevel > 1) {
    result.child = `${childLevel}-${childPos}`
  }
  // grandchild
  const grandchildLevel = level - 2
  const grandchildPos = Math.max(1, Math.floor((position + 3) / 4))
  if (grandchildLevel > 1) {
    result.grandchild = `${grandchildLevel}-${grandchildPos}`
  }
  return result
}

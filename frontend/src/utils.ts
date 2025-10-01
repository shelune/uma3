import { get } from 'http'
import UMA_AFFINITY_MAPPING from './assets/home/affinity-mapping.json'
import { TreeData, TreeSlot } from './contexts/TreeDataContext'

const umaAffinityTable: Record<string, number> = UMA_AFFINITY_MAPPING

export const renderUmaName = (input: string | undefined): string => {
  if (!input) return '-'
  const match = input.match(/\[.*?\]\s*(.*)$/)
  return match ? match[1] : input
}

export const getImagePath = (charaId: string): string => {
  try {
    // Try to get the image from assets using Vite's URL constructor
    return new URL(
      `./assets/home/images/characters/${charaId}.png`,
      import.meta.url
    ).href
  } catch (error) {
    // Fallback to public directory path
    return `https://placehold.co/256x256?text=404`
  }
}

type FamilyTreePosition = {
  parent: string
  grandParents: string[]
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
      grandParents: [grandparentLeftPos1, grandparentLeftPos2],
    },
    right: {
      parent: parentRightPos,
      grandParents: [grandparentRightPos1, grandparentRightPos2],
    },
  }
}

export const getUmaByPosition = (
  data: TreeData,
  position: string | TreeSlot
) => {
  const [level, pos] =
    typeof position === 'string'
      ? position.split('-').map(Number)
      : [position.level, position.position]
  if (level === null || pos === null) return null
  return data[level]?.[pos]
}

const sortId = (id: (string | null | undefined)[]) => {
  const sorted = [...id].sort((a, b) => a!.localeCompare(b!)).join(',')
  return sorted
}

const getSafeAffinity = (id: string | null | undefined) => {
  if (!id) return 0
  return umaAffinityTable[id] || 0
}

export const getBaseAffinity = (treeData: TreeData, meta: TreeSlot): number => {
  if (meta.level === null || meta.position === null) return 0

  const familyTreePositionSet = getFamilyPositionSet(meta)
  if (!familyTreePositionSet) return 0

  const { left, right } = familyTreePositionSet
  const childId = getUmaByPosition(treeData, meta)?.baseId
  const parentLeftId = getUmaByPosition(treeData, left.parent)?.baseId
  const parentRightId = getUmaByPosition(treeData, right.parent)?.baseId
  const grandparentLeftPos1 = getUmaByPosition(
    treeData,
    left.grandParents[0]
  )?.baseId
  const grandparentLeftPos2 = getUmaByPosition(
    treeData,
    left.grandParents[1]
  )?.baseId
  const grandparentRightPos1 = getUmaByPosition(
    treeData,
    right.grandParents[0]
  )?.baseId
  const grandparentRightPos2 = getUmaByPosition(
    treeData,
    right.grandParents[1]
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
  if (meta.level === 1) {
    console.log('Child - Parent 1:', parentLeftAffinity)
    console.log('Child - Parent 2', parentRightAffinity)
    console.log('Parent 1 - Parent 2', bothParentsAffinity)
    console.log('Child - Parent 1 - GParent 1:', grandparentLeftAffinity1)
    console.log('Child - Parent 1 - GParent 2:', grandparentLeftAffinity2)
    console.log('Child - Parent 2 - GParent 1:', grandparentRightAffinity1)
    console.log('Child - Parent 2 - GParent 2:', grandparentRightAffinity2)
  }
  return (
    parentLeftAffinity +
    parentRightAffinity +
    bothParentsAffinity +
    grandparentLeftAffinity1 +
    grandparentLeftAffinity2 +
    grandparentRightAffinity1 +
    grandparentRightAffinity2
  )
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
    left.grandParents[0]
  )?.races
  const grandparentLeftPos2Races = getUmaByPosition(
    treeData,
    left.grandParents[1]
  )?.races
  const grandparentRightPos1Races = getUmaByPosition(
    treeData,
    right.grandParents[0]
  )?.races
  const grandparentRightPos2Races = getUmaByPosition(
    treeData,
    right.grandParents[1]
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

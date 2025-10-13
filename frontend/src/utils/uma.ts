import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { SavedUma } from '../hooks/useSavedUmas'
import { Uma } from '../types/uma'
import UMA_LIST_WITH_ID from '../assets/home/chara-names-with-id.json'
import { CharacterNameID } from '../types/characterNameId'

const umaListWithId: CharacterNameID[] = UMA_LIST_WITH_ID
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

export const convertSavedUmaToUma = (savedUma: SavedUma): Uma | null => {
  if (!savedUma || !savedUma.id) return null
  return {
    id: savedUma.id,
    baseId: savedUma.baseId,
    name: savedUma.name,
    blueSpark: savedUma.blueSpark || undefined,
    pinkSpark: savedUma.pinkSpark || undefined,
    greenSpark: savedUma.greenSpark || undefined,
    whiteSpark: savedUma.whiteSpark || [],
    raceSpark: savedUma.raceSpark || [],
    races: savedUma.races || [],
  }
}

export const getChildByPosition = (
  treeData: TreeData,
  meta: TreeSlot
): Uma | null => {
  const { level, position } = meta
  if (level === null || position === null || level === 1) return null
  const childLevel = level - 1
  const childPos = Math.max(1, Math.floor((position + 1) / 2))
  return treeData[childLevel]?.[childPos] || null
}

export const getGrandchildByPosition = (
  treeData: TreeData,
  meta: TreeSlot
): Uma | null => {
  const { level, position } = meta
  if (level === null || position === null || level < 3) return null
  const grandchildLevel = level - 2
  const grandchildPos = Math.max(1, Math.floor((position + 3) / 4))
  return treeData[grandchildLevel]?.[grandchildPos] || null
}

export const getUmaBasicInfoById = (id: string) => {
  return umaListWithId.find(uma => uma.chara_id === id) || null
}

import { TreeData, TreeSlot } from '../contexts/TreeDataContext'
import { SavedUma } from '../hooks/useSavedUmas'
import { Uma } from '../types/uma'

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

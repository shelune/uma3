import { TreeData, TreeSlot } from '../contexts/TreeDataContext'

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

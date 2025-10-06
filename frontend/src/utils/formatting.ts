import { CharacterNameID } from '../../../types/characterNameId'
import UMA_LIST_WITH_ID from '../assets/home/chara_names_with_id.json'
import { BASE_CHANCE } from './inspiration'

const umaWithIdList: CharacterNameID[] = UMA_LIST_WITH_ID

const SPARK_TYPE_MAPPING: Record<string, string> = {
  greenSpark: 'Unique',
  blueSpark: 'Stat',
  pinkSpark: 'Aptitude',
  whiteSpark: 'Skill',
  raceSpark: 'Race',
}

export const renderUmaName = (input: string | undefined): string => {
  if (!input) return '-'
  const match = input.match(/\[.*?\]\s*(.*)$/)
  return match ? match[1] : input
}

export const getImagePath = (charaId: string): string => {
  try {
    // Try to get the image from assets using Vite's URL constructor
    return new URL(
      `../assets/home/images/characters/${charaId}.png`,
      import.meta.url
    ).href
  } catch {
    // Fallback to public directory path
    return `https://placehold.co/256x256?text=404`
  }
}

export const to2Decimal = (num: number): string => {
  return num.toFixed(2)
}

export const getUmaBasicsById = (id: string): CharacterNameID | null => {
  const uma = umaWithIdList.find(uma => uma.chara_id === id)
  return uma || null
}

export const getUmaNameById = (
  input: string,
  isUniqueSkill: boolean = true
) => {
  if (!input) return '-'
  const uma = getUmaBasicsById(input)
  return uma
    ? `${renderUmaName(uma.chara_name)}${isUniqueSkill ? "'s Unique" : ''}`
    : input
}

export const renderSparkType = (type: keyof typeof BASE_CHANCE): string => {
  return SPARK_TYPE_MAPPING[type] || type
}

export const pickBadgeColorBySparkType = (type: string): string => {
  if (type === 'greenSpark') return 'bg-green-100 text-green-700'
  if (type === 'blueSpark') return 'bg-blue-100 text-blue-700'
  if (type === 'pinkSpark') return 'bg-pink-100 text-pink-700'
  if (type === 'whiteSpark') return 'bg-gray-100 text-gray-700'
  if (type === 'raceSpark') return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-700'
}

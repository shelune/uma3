export type SparkData = {
  stat: string
  level: number
  isRace?: boolean
}

export type EnhanceSparkData = {
  data: SparkData | SparkData[] | null
  affinity: number
  type: 'pinkSpark' | 'greenSpark' | 'whiteSpark' | 'raceSpark'
}

export type AncestorData = {
  id: string
  races: string[]
  blueSpark?: SparkData
  pinkSpark?: SparkData
  greenSpark?: SparkData
  whiteSpark?: SparkData[]
} | null

export type UmaParent = Record<string, AncestorData>
export interface Uma {
  id: string
  baseId: string
  name?: string
  image?: string
  parents?: UmaParent
  grandParents?: UmaParent
  affinity?: number
  blueSpark?: SparkData
  pinkSpark?: SparkData
  greenSpark?: SparkData
  whiteSpark?: SparkData[]
  raceSpark?: SparkData[]
  races: string[]
}

export type BlueSparkData = SparkData
export type PinkSparkData = SparkData
export type WhiteSparkData = SparkData
export type GreenSparkData = SparkData

export interface RacesData {
  races: string[]
}

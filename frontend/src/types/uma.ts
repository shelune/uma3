export type AncestorData = { id: string; races: string[] } | null
export type UmaParent = Record<string, AncestorData>
export interface Uma {
  id: string
  baseId: string
  name?: string
  image?: string
  parents?: UmaParent
  grandParents?: UmaParent
  affinity?: number
  blueSpark?: {
    stat: string
    level: number
  }
  pinkSpark?: {
    stat: string
    level: number
  }
  greenSpark?: {
    level: number
  }
  whiteSpark?: {
    stat: string
    level: number
  }
  races?: string[]
}
// Blue spark stat/level selection for a given card position
export interface BlueSparkSelection {
  stat: string // e.g. "Speed", "Stamina", "Power", "Guts", "Wits"
  level: number // 1-3
}

// Pink spark selection (same shape) for aptitude/running style categories
export type PinkSparkSelection = BlueSparkSelection

export interface GreenSparkSelection {
  level: number
}

export interface RacesWonSelection {
  races: string[]
}

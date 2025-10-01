import UMA_AFFINITY_MAPPING from './assets/home/affinity-mapping.json'

const umaAffinityTable: Record<string, number> = UMA_AFFINITY_MAPPING

export function renderUmaName(input: string | undefined): string {
  if (!input) return '-'
  const match = input.match(/\[.*?\]\s*(.*)$/)
  return match ? match[1] : input
}

export function getImagePath(charaId: string): string {
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

export function getBaseAffinity(
  childId: string,
  parentId?: string,
  grandParentId?: string
): number {
  if (childId && grandParentId && !parentId) {
    return 0
  }
  const sorted = [childId, parentId, grandParentId]
    .filter(Boolean)
    .sort((a, b) => a!.localeCompare(b!))
  const mappingKey = `${sorted.join(',')}`
  return umaAffinityTable[mappingKey] || 0
}

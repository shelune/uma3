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

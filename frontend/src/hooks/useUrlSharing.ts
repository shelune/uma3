/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import { useTreeDataWithStorage } from './useTreeDataWithStorage'
import type { TreeData } from '../contexts/TreeDataContext'
import type { Uma, WhiteSparkData } from '../types/uma'
import { getUmaNameById } from '../utils/formatting'

/**
 * Hook for sharing tree data via URL parameters
 * Uses compression and base64 encoding to keep URLs manageable
 */
export function useUrlSharing() {
  const { importTreeData, treeData } = useTreeDataWithStorage()

  /**
   * Compress and encode tree data for URL sharing
   */
  const encodeTreeDataForUrl = useCallback((data: TreeData): string => {
    try {
      // Create a minimal representation of the tree data
      const minimalData: Record<string, Record<string, any>> = {}

      Object.entries(data).forEach(([level, levelData]) => {
        const minimalLevel: Record<string, any> = {}

        Object.entries(levelData).forEach(([position, uma]) => {
          // Only include non-empty/meaningful data to reduce size
          const minimalUma: any = {}
          const typedUma = uma as Uma

          if (typedUma.id) minimalUma.i = typedUma.id
          if (typedUma.baseId && typedUma.baseId !== typedUma.id)
            minimalUma.b = typedUma.baseId

          // Sparks - only include if they have meaningful data
          if (typedUma.blueSpark?.stat) {
            minimalUma.bs = {
              s: typedUma.blueSpark.stat,
              l: typedUma.blueSpark.level || 0,
            }
          }

          if (typedUma.pinkSpark?.stat) {
            minimalUma.ps = {
              s: typedUma.pinkSpark.stat,
              l: typedUma.pinkSpark.level || 0,
            }
          }

          if (typedUma.greenSpark?.stat) {
            minimalUma.gs = {
              s: typedUma.greenSpark.stat,
              l: typedUma.greenSpark.level || 0,
            }
          }

          if (typedUma.whiteSpark && typedUma.whiteSpark.length > 0) {
            minimalUma.ws = typedUma.whiteSpark.map((ws: WhiteSparkData) => ({
              s: ws.stat,
              l: ws.level || 0,
            }))
          }

          if (typedUma.races && typedUma.races.length > 0) {
            minimalUma.r = typedUma.races
          }

          // Only add if there's actual data
          if (Object.keys(minimalUma).length > 0) {
            minimalLevel[position] = minimalUma
          }
        })

        if (Object.keys(minimalLevel).length > 0) {
          minimalData[level] = minimalLevel
        }
      })

      // Convert to JSON and encode
      const jsonString = JSON.stringify(minimalData)

      // Use btoa for base64 encoding (browser built-in)
      const encoded = btoa(jsonString)

      // Replace URL-unsafe characters
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    } catch (error) {
      console.error('Error encoding tree data for URL:', error)
      return ''
    }
  }, [])

  /**
   * Decode tree data from URL parameter
   */
  const decodeTreeDataFromUrl = useCallback(
    (encodedData: string): TreeData | null => {
      try {
        // Restore URL-safe characters
        let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/')

        // Add padding if needed
        while (base64.length % 4) {
          base64 += '='
        }

        // Decode from base64
        const jsonString = atob(base64)
        const minimalData = JSON.parse(jsonString)

        // Convert back to full TreeData format
        const fullData: TreeData = {}
        Object.entries(minimalData).forEach(([level, levelData]) => {
          const levelNum = parseInt(level, 10)
          fullData[levelNum] = {}

          Object.entries(levelData as Record<string, unknown>).forEach(
            ([position, minimalUma]) => {
              const positionNum = parseInt(position, 10)
              const data = minimalUma as any

              // Reconstruct full Uma object
              const uma: Uma = {
                id: data.i || '',
                baseId: data.b || data.i || '',
                name: getUmaNameById(data.i, false),
                races: data.r || [],
              }

              // Restore sparks
              if (data.bs) {
                uma.blueSpark = {
                  stat: data.bs.s,
                  level: data.bs.l,
                }
              }

              if (data.ps) {
                uma.pinkSpark = {
                  stat: data.ps.s,
                  level: data.ps.l,
                }
              }

              if (data.gs) {
                uma.greenSpark = {
                  stat: data.gs.s,
                  level: data.gs.l,
                }
              }

              if (data.ws) {
                uma.whiteSpark = data.ws.map(
                  (ws: { s: string; l: number }) => ({
                    stat: ws.s,
                    level: ws.l,
                  })
                )
              }

              fullData[levelNum][positionNum] = uma
            }
          )
        })
        return fullData
      } catch (error) {
        console.error('Error decoding tree data from URL:', error)
        return null
      }
    },
    []
  )

  /**
   * Generate a shareable URL with current tree data
   */
  const generateShareUrl = useCallback((): string => {
    const encodedData = encodeTreeDataForUrl(treeData)
    if (!encodedData) return window.location.href

    const url = new URL(window.location.href)
    url.searchParams.set('data', encodedData)
    return url.toString()
  }, [treeData, encodeTreeDataForUrl])

  /**
   * Load tree data from URL parameter if present
   */
  const loadFromUrl = useCallback((): boolean => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('data')

    if (!encodedData) return false

    const decodedData = decodeTreeDataFromUrl(encodedData)
    if (!decodedData) return false

    const jsonData = JSON.stringify(decodedData)
    return importTreeData(jsonData, true)
  }, [decodeTreeDataFromUrl, importTreeData])

  /**
   * Copy share URL to clipboard
   */
  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const shareUrl = generateShareUrl()
      await navigator.clipboard.writeText(shareUrl)
      return true
    } catch (error) {
      console.error('Error copying URL to clipboard:', error)
      return false
    }
  }, [generateShareUrl])

  /**
   * Check if current URL has tree data
   */
  const hasUrlData = useCallback((): boolean => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.has('data')
  }, [])

  /**
   * Clear data parameter from URL
   */
  const clearUrlData = useCallback((): void => {
    const url = new URL(window.location.href)
    url.searchParams.delete('data')
    window.history.replaceState({}, '', url.toString())
  }, [])

  return {
    generateShareUrl,
    loadFromUrl,
    copyShareUrl,
    hasUrlData,
    clearUrlData,
    encodeTreeDataForUrl,
    decodeTreeDataFromUrl,
  }
}

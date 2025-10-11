import fs from 'fs'
import path from 'path'
import { CharacterNameID } from '../types/characterNameId'
import { AffinityGroup } from '../types/relation'

interface TupleResult {
  tuple: string[]
  totalRelationPoint: number
  matchedGroups: Array<{
    id: number
    relationType: number
    relationPoint: number
  }>
}

// Read data files
const charaData: CharacterNameID[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../home/chara_names_with_id.json'),
    'utf-8'
  )
)

const affinityTable: AffinityGroup[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../home/affinity-table.json'), 'utf-8')
)

const calculateAffinity = async () => {
  // Extract unique chara_id_base values
  const uniqueCharaIdBases = Array.from(
    new Set(charaData.map(chara => chara.chara_id_base))
  ).sort()

  // Function to generate combinations
  function getCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 1) return arr.map(el => [el])

    const result: T[][] = []
    for (let i = 0; i <= arr.length - size; i++) {
      const head = arr[i]
      const tailCombinations = getCombinations(arr.slice(i + 1), size - 1)
      tailCombinations.forEach(tail => {
        result.push([head, ...tail])
      })
    }
    return result
  }

  // Function to calculate relation points for a tuple
  function calculateRelationPoints(tuple: string[]): TupleResult {
    let totalRelationPoint = 0
    const matchedGroups: Array<{
      id: number
      relationType: number
      relationPoint: number
    }> = []

    for (const group of affinityTable) {
      // Check if all members of the tuple are in this group's members array
      const allInGroup = tuple.every(charaId =>
        group.members.includes(parseInt(charaId))
      )

      if (allInGroup && group.members.length > 0) {
        totalRelationPoint += group.relationPoint
        matchedGroups.push({
          id: group.id,
          relationType: group.relationType,
          relationPoint: group.relationPoint,
        })
      }
    }

    return {
      tuple,
      totalRelationPoint,
      matchedGroups,
    }
  }

  // Generate all 2-tuples
  console.log('Generating 2-tuples...')
  const twoTuples = getCombinations(uniqueCharaIdBases, 2)
  const twoTupleResults: TupleResult[] = twoTuples.map(calculateRelationPoints)

  // Generate all 3-tuples
  console.log('Generating 3-tuples...')
  const threeTuples = getCombinations(uniqueCharaIdBases, 3)
  const threeTupleResults: TupleResult[] = threeTuples.map(
    calculateRelationPoints
  )

  // Sort results by total relation points (descending)
  const sortedTwoTuples = twoTupleResults.sort(
    (a, b) => b.totalRelationPoint - a.totalRelationPoint
  )
  const sortedThreeTuples = threeTupleResults.sort(
    (a, b) => b.totalRelationPoint - a.totalRelationPoint
  )

  // Save results to files
  const outputDir = path.join(__dirname, '../home')

  // Save 2-tuple results
  const twoTupleOutput = sortedTwoTuples.map(result => ({
    tuple: result.tuple,
    totalRelationPoint: result.totalRelationPoint,
  }))

  // Save 3-tuple results
  const threeTupleOutput = sortedThreeTuples.map(result => ({
    tuple: result.tuple,
    totalRelationPoint: result.totalRelationPoint,
  }))

  const combinedOutput = [...twoTupleOutput, ...threeTupleOutput]
  const combinedOutputDetailed = [...sortedTwoTuples, ...sortedThreeTuples]

  // Write files sequentially using promises
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.join(outputDir, 'affinity-combined.json'),
      JSON.stringify(combinedOutput, null, 2),
      'utf-8',
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })

  await new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.join(outputDir, 'affinity-combined-detailed.json'),
      JSON.stringify(combinedOutputDetailed, null, 2),
      'utf-8',
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })

  const tupleMap: Record<string, number> = {}
  sortedTwoTuples.forEach(result => {
    const tupleKey = result.tuple.join(',')
    tupleMap[tupleKey] = result.totalRelationPoint
  })
  sortedThreeTuples.forEach(result => {
    const tupleKey = result.tuple.join(',')
    tupleMap[tupleKey] = result.totalRelationPoint
  })

  await new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.join(outputDir, 'affinity-mapping.json'),
      JSON.stringify(tupleMap, null, 2),
      'utf-8',
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

// Run the function directly
calculateAffinity().catch(error => {
  console.error('Error calculating affinity:', error)
  process.exit(1)
})

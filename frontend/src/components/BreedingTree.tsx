import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CharacterNameID } from '~/types/characterNameId'
import UMA_LIST_WITH_ID from '../assets/home/chara_names_with_id.json'
import type {
  BlueSparkSelection,
  GreenSparkSelection,
  PinkSparkSelection,
  RacesWonSelection,
} from '../types/uma'
import { useTreeData } from '../hooks/useTreeData'
import UmaCard from './UmaCard'
import UmaModal from './UmaModal'
import { TreeSlot } from '../contexts/TreeDataContext'

const umaList: CharacterNameID[] = UMA_LIST_WITH_ID

const BreedingTree = () => {
  // Use TreeData context
  const { treeData, updateTreeData, clearTree } = useTreeData()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedSlot, setSelectedSlot] = useState<TreeSlot>({
    level: null,
    position: null,
  })

  const handleSelectUma = (level: number, position: number): void => {
    setSelectedSlot({ level, position })
    setModalOpen(true)
  }

  const handleUmaSelection = (
    umaId: string,
    baseUmaId: string,
    level: number,
    position: number
  ): void => {
    updateTreeData(level, position, {
      id: umaId,
      baseId: baseUmaId,
      name: umaList.find(uma => uma.chara_id === umaId)?.chara_name,
    })
    setModalOpen(false)
  }

  const handleCloseModal = (): void => {
    setModalOpen(false)
    setSelectedSlot({ level: null, position: null })
  }

  const handleBlueSparkChange = (
    value: BlueSparkSelection,
    meta: { level: number; position: number }
  ) => {
    updateTreeData(meta.level, meta.position, {
      blueSpark: value,
    })
  }

  const handlePinkSparkChange = (
    value: PinkSparkSelection,
    meta: { level: number; position: number }
  ) => {
    updateTreeData(meta.level, meta.position, {
      pinkSpark: value,
    })
  }

  const handleGreenSparkChange = (
    value: GreenSparkSelection,
    meta: { level: number; position: number }
  ) => {
    updateTreeData(meta.level, meta.position, {
      greenSpark: value,
    })
  }

  const handleRacesWonChange = (
    value: RacesWonSelection,
    meta: { level: number; position: number }
  ) => {
    console.log({ value })
    updateTreeData(meta.level, meta.position, { races: value.races })
  }

  const renderTreeLevel = (level: number) => {
    const cardsInLevel = Math.pow(2, level - 1)
    const levelData = treeData[level] || {}

    // Create array of cards with their positions
    const cards = Array.from({ length: cardsInLevel }, (_, idx) => ({
      card: levelData[idx + 1] || null,
      position: idx + 1,
    }))

    // Split cards into rows of maximum 8 cards each
    const rows = []
    for (let i = 0; i < cardsInLevel; i += 8) {
      const rowSize = Math.min(8, cardsInLevel - i)
      rows.push({ cards: cards.slice(i, i + rowSize), size: rowSize })
    }

    return (
      <div key={level} className="mb-12 relative">
        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] auto-rows-auto gap-4 mx-auto justify-items-center items-center`}
            >
              {row.cards.map(({ position }) => (
                <div key={`${level}-${position}`} className="relative h-full">
                  <UmaCard
                    uma={
                      treeData[level] && treeData[level][position]
                        ? treeData[level][position]
                        : null
                    }
                    onSelectUma={handleSelectUma}
                    level={level}
                    position={position}
                    size={level >= 3 ? 'small' : 'big'}
                    onBlueSparkChange={handleBlueSparkChange}
                    onPinkSparkChange={handlePinkSparkChange}
                    onRacesWonChange={handleRacesWonChange}
                    onGreenSparkChange={handleGreenSparkChange}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  console.log({ treeData })
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="max-w-8xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Uma Musume Breeding Tree
          </CardTitle>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearTree}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Tree
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8 overflow-x-auto overflow-y-auto p-4">
            {[1, 2, 3, 4].map(level => (
              <div key={level}>{renderTreeLevel(level)}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UmaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSelectUma={handleUmaSelection}
        level={selectedSlot.level}
        position={selectedSlot.position}
      />
    </div>
  )
}

export default BreedingTree

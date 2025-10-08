import { Button } from '@/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/base/card'
import { Trash2, Save } from 'lucide-react'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { CharacterNameID } from '@/types/characterNameId'
import type {
  BlueSparkData,
  GreenSparkData,
  PinkSparkData,
  RacesData,
  WhiteSparkData,
} from '../../types/uma'
import { useTreeData } from '../../hooks/useTreeData'
import { useIsMobile } from '../../hooks/useIsMobile'
import UmaCard from './UmaCard'
import CompactUmaCard from '../components/CompactUmaCard'
import UmaModal from '../components/UmaModal'
import TreeDataManager from '../components/TreeDataManager'
import SaveTreeModal from '../components/SaveTreeModal'
import SavedTreesModal from '../components/SavedTreesModal'
import MobileActionsBar from '../components/MobileActionsBar'
import MobileLevelNavigator from '../components/MobileLevelNavigator'
import { TreeSlot, TreeData } from '../../contexts/TreeDataContext'
import UMA_LIST_WITH_ID from '../../assets/home/chara_names_with_id.json'

const umaList: CharacterNameID[] = UMA_LIST_WITH_ID

const BreedingTree = () => {
  // Use TreeData context
  const { treeData, updateTreeData, clearTree, setTree } = useTreeData()
  const isMobile = useIsMobile()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [saveTreeModalOpen, setSaveTreeModalOpen] = useState<boolean>(false)
  const [savedTreesModalOpen, setSavedTreesModalOpen] = useState<boolean>(false)
  // level 0 and position 0 indicates no selection
  const [selectedSlot, setSelectedSlot] = useState<TreeSlot>({
    level: 0,
    position: 0,
  })

  // Mobile navigation state
  const [currentMobileLevel, setCurrentMobileLevel] = useState(1)
  const maxLevel = 4

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
    setSelectedSlot({ level: 0, position: 0 })
  }

  const handleBlueSparkChange = (value: BlueSparkData, meta: TreeSlot) => {
    updateTreeData(meta.level, meta.position, {
      blueSpark: value,
    })
  }

  const handlePinkSparkChange = (value: PinkSparkData, meta: TreeSlot) => {
    updateTreeData(meta.level, meta.position, {
      pinkSpark: value,
    })
  }

  const handleGreenSparkChange = (value: GreenSparkData, meta: TreeSlot) => {
    updateTreeData(meta.level, meta.position, {
      greenSpark: value,
    })
  }

  const handleWhiteSparkChange = (value: WhiteSparkData[], meta: TreeSlot) => {
    updateTreeData(meta.level, meta.position, {
      whiteSpark: value,
    })
  }

  const handleRacesWonChange = (value: RacesData, meta: TreeSlot) => {
    console.log({ value })
    updateTreeData(meta.level, meta.position, { races: value.races })
  }

  const handleSaveTree = () => {
    setSaveTreeModalOpen(true)
  }

  const handleLoadTree = (newTreeData: TreeData) => {
    setTree(newTreeData)
  }

  const handleShare = () => {
    // Get current URL and copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: 'Uma Musume Breeding Tree',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Mobile swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && currentMobileLevel < maxLevel) {
        setCurrentMobileLevel(prev => Math.min(prev + 1, maxLevel))
      }
    },
    onSwipedRight: () => {
      if (isMobile && currentMobileLevel > 1) {
        setCurrentMobileLevel(prev => Math.max(prev - 1, 1))
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

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
                    onWhiteSparkChange={handleWhiteSparkChange}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMobileTreeLevel = (level: number) => {
    const cardsInLevel = Math.pow(2, level - 1)
    const levelData = treeData[level] || {}

    // Create array of cards with their positions
    const cards = Array.from({ length: cardsInLevel }, (_, idx) => ({
      card: levelData[idx + 1] || null,
      position: idx + 1,
    }))

    return (
      <div key={level} className="space-y-3">
        {cards.map(({ position }) => (
          <CompactUmaCard
            key={`${level}-${position}`}
            uma={
              treeData[level] && treeData[level][position]
                ? treeData[level][position]
                : null
            }
            onSelectUma={handleSelectUma}
            level={level}
            position={position}
            onBlueSparkChange={handleBlueSparkChange}
            onPinkSparkChange={handlePinkSparkChange}
            onRacesWonChange={handleRacesWonChange}
            onGreenSparkChange={handleGreenSparkChange}
            onWhiteSparkChange={handleWhiteSparkChange}
          />
        ))}
      </div>
    )
  }

  console.log({ treeData })
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-8xl mx-auto rounded-none shadow-none border-none bg-gray-50 dark:bg-gray-800 grid-pattern-light dark:grid-pattern-dark">
        <CardHeader className="text-center">
          <CardTitle
            className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
          >
            Uma Musume Breeding Tree
          </CardTitle>

          {/* Desktop header actions */}
          {!isMobile && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveTree}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Tree
              </Button>
              <SavedTreesModal onLoadTree={handleLoadTree} />
              <Button
                size="sm"
                onClick={clearTree}
                className="flex items-center gap-2 text-white bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Clear Tree
              </Button>
              <TreeDataManager />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Mobile level navigator */}
          {isMobile && (
            <MobileLevelNavigator
              currentLevel={currentMobileLevel}
              maxLevel={maxLevel}
              onLevelChange={setCurrentMobileLevel}
            />
          )}

          {/* Desktop view */}
          {!isMobile && (
            <div className="space-y-8 overflow-x-auto overflow-y-auto p-4 min-h-[600px]">
              {[1, 2, 3, 4].map(level => (
                <div key={level}>{renderTreeLevel(level)}</div>
              ))}
            </div>
          )}

          {/* Mobile view with swipe support */}
          {isMobile && (
            <div {...swipeHandlers} className="p-2 min-h-[400px] pb-20">
              {renderMobileTreeLevel(currentMobileLevel)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile actions bar */}
      {isMobile && (
        <MobileActionsBar
          onSaveTree={handleSaveTree}
          onLoadTrees={() => setSavedTreesModalOpen(true)}
          onShare={handleShare}
          onClearTree={clearTree}
        />
      )}

      <UmaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSelectUma={handleUmaSelection}
        level={selectedSlot.level || 1}
        position={selectedSlot.position || 1}
      />

      <SaveTreeModal
        isOpen={saveTreeModalOpen}
        onClose={() => setSaveTreeModalOpen(false)}
        treeData={treeData}
      />

      {/* Mobile SavedTreesModal */}
      {isMobile && savedTreesModalOpen && (
        <SavedTreesModal
          onLoadTree={data => {
            handleLoadTree(data)
            setSavedTreesModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default BreedingTree

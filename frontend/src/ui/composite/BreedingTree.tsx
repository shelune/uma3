import { Card, CardContent, CardHeader, CardTitle } from '@/ui/base/card'
import { Button } from '@/ui/base/button'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import CompactUmaCard from './CompactUmaCard'
import UmaModal from '../components/UmaModal'
import TreeDataManager from '../components/TreeDataManager'
import TreeManagerModal from '../components/TreeManagerModal'
import SavedUmasModal from '../components/SavedUmasModal'
import MobileActionsBar from '../components/MobileActionsBar'
import MobileLevelNavigator from '../components/MobileLevelNavigator'
import BreedingTreeHeader from '../components/BreedingTreeHeader'
import { TreeSlot, TreeData } from '../../contexts/TreeDataContext'
import UMA_LIST_WITH_ID from '../../assets/home/chara-names-with-id.json'
import { mergeTwClass } from '../../lib/utils'

const umaList: CharacterNameID[] = UMA_LIST_WITH_ID

const BreedingTree = () => {
  // Use TreeData context
  const { treeData, updateTreeData, clearTree, setTree } = useTreeData()
  const isMobile = useIsMobile()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [treeManagerModalOpen, setTreeManagerModalOpen] =
    useState<boolean>(false)
  const [savedUmasModalOpen, setSavedUmasModalOpen] = useState<boolean>(false)

  // level 0 and position 0 indicates no selection
  const [selectedSlot, setSelectedSlot] = useState<TreeSlot>({
    level: 0,
    position: 0,
  })

  const [currentMobileLevel, setCurrentMobileLevel] = useState(1)
  const MAX_LEVEL = 4

  // Check if level 4 has any data, show on start if yes
  const hasLevel4Data = () => {
    const level4Data = treeData[4]
    if (!level4Data) return false
    return Object.values(level4Data).some(card => card && card.id)
  }

  const [showLevel4, setShowLevel4] = useState(() => hasLevel4Data())
  const [showUpdateBanner, setShowUpdateBanner] = useState(true)

  // Update banner content - you can customize this
  const updateBannerText = (
    <div>
      <strong>CHANGELOG 14/01/2026:</strong>
      <ul>
        <li>
          + Added umas up to <strong>Mejiro Dober</strong>
        </li>
      </ul>
    </div>
  )

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
    updateTreeData(meta.level, meta.position, { races: value.races })
  }

  const handleLoadTree = (newTreeData: TreeData) => {
    setTree(newTreeData)
  }

  // Mobile swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && currentMobileLevel < MAX_LEVEL) {
        setCurrentMobileLevel(prev => Math.min(prev + 1, MAX_LEVEL))
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

    // Split cards into rows - level 4 uses 4 cards per row, others use 8
    const cardsPerRow = level >= 4 ? 4 : 8
    const rows = []
    for (let i = 0; i < cardsInLevel; i += cardsPerRow) {
      const rowSize = Math.min(cardsPerRow, cardsInLevel - i)
      rows.push({ cards: cards.slice(i, i + rowSize), size: rowSize })
    }

    return (
      <div key={level} className="mb-12 relative">
        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`grid ${level >= 4 ? 'grid-cols-4' : 'grid-cols-[repeat(auto-fit,minmax(100px,1fr))]'} auto-rows-auto gap-4 mx-auto justify-items-center items-center`}
            >
              {row.cards.map(({ position }) => (
                <div
                  key={`${level}-${position}`}
                  className={mergeTwClass('relative h-full min-w-[300px]', {
                    'w-full': cardsInLevel > 4,
                  })}
                >
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

  return (
    <div className=" bg-purple-50 dark:bg-gray-900">
      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="bg-yellow-600 text-white h-min-10 flex items-center justify-between px-4 py-2 shadow-sm">
          <div className="text-sm font-medium truncate">{updateBannerText}</div>
          <button
            onClick={() => setShowUpdateBanner(false)}
            className="ml-2 hover:bg-blue-700 rounded p-1 flex-shrink-0 transition-colors"
            aria-label="Close update banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4">
        <Card className="max-w-8xl mx-auto rounded-none shadow-none border-none bg-gray-50 dark:bg-gray-800 grid-pattern-light dark:grid-pattern-dark">
          <CardHeader className="text-center">
            <CardTitle
              className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-[#DA3C57]`}
            >
              Uma Musume Pedigree Maker
            </CardTitle>

            <BreedingTreeHeader
              isMobile={isMobile}
              onClearTree={clearTree}
              onLoadTree={handleLoadTree}
              onOpenTreeManagerModal={() => setTreeManagerModalOpen(true)}
              onOpenSavedUmasModal={() => setSavedUmasModalOpen(true)}
            />

            {/* Keep additional desktop actions */}
            {!isMobile && (
              <div className="flex justify-center items-center gap-4 mt-2">
                <TreeDataManager />
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Mobile level navigator */}
            {isMobile && (
              <MobileLevelNavigator
                currentLevel={currentMobileLevel}
                maxLevel={MAX_LEVEL}
                onLevelChange={setCurrentMobileLevel}
              />
            )}

            {/* Desktop view */}
            {!isMobile && (
              <div className="space-y-8 overflow-x-auto overflow-y-auto p-4 min-h-[600px]">
                {/* Render levels 1-3 */}
                {[1, 2, 3].map(level => (
                  <div key={level}>{renderTreeLevel(level)}</div>
                ))}

                {/* Toggle button for level 4 */}
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowLevel4(!showLevel4)}
                    className="flex items-center gap-2"
                  >
                    {showLevel4 ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Level 4
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Level 4
                      </>
                    )}
                  </Button>
                </div>

                {/* Conditionally render level 4 */}
                {showLevel4 && <div>{renderTreeLevel(4)}</div>}
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
            onOpenTreeManager={() => setTreeManagerModalOpen(true)}
            onOpenSavedUmas={() => setSavedUmasModalOpen(true)}
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

        <TreeManagerModal
          isOpen={treeManagerModalOpen}
          onClose={() => setTreeManagerModalOpen(false)}
        />
        <SavedUmasModal
          isOpen={savedUmasModalOpen}
          onClose={() => setSavedUmasModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default BreedingTree

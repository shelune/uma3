import { Card, CardContent } from '@/ui/base/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Checkbox } from '@/ui/base/checkbox'
import { Button } from '@/ui/base/button'
import { Search, Heart, BookMarkedIcon, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CharacterNameID } from '@/types/characterNameId'
import UMA_LIST_WITH_ID from '../../assets/home/chara_names_with_id.json'
import UmaImage from '../../ui/components/UmaImage'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/base/tabs'
import { SavedUma, useSavedUmas } from '@/hooks/useSavedUmas'
import { getUmaNameById as getUmaNameById } from '../../utils/formatting'
import { useTreeData } from '../../hooks'
import {
  convertSavedUmaToUma,
  getChildByPosition,
  getGrandchildByPosition,
  getUmaBasicInfoById,
} from '../../utils/uma'
import {
  getGrandparentAffinityCombosByIds,
  getParentAffinityCombosById,
} from '../../utils/affinity'

const umaWithIdList: CharacterNameID[] = UMA_LIST_WITH_ID

interface UmaModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUma: (
    uma: string,
    baseUmaId: string,
    level: number,
    position: number
  ) => void
  level: number
  position: number
}

const UmaModal = ({
  isOpen,
  onClose,
  onSelectUma,
  level,
  position,
}: UmaModalProps) => {
  const { updateTreeData, treeData } = useTreeData()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')
  const [sortByAffinity, setSortByAffinity] = useState<boolean>(true)
  const [parentVisibleCount, setParentVisibleCount] = useState<number>(6)
  const [grandparentVisibleCount, setGrandparentVisibleCount] =
    useState<number>(6)
  const { savedUmas } = useSavedUmas()

  const child = getChildByPosition(treeData, { level, position })
  const grandChild = getGrandchildByPosition(treeData, { level, position })

  const filteredUmas = umaWithIdList.filter(uma =>
    uma.chara_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedFilteredParentUmas = useMemo(() => {
    if (!sortByAffinity) return filteredUmas
    const child = getChildByPosition(treeData, { level, position })
    if (!child) return filteredUmas
    const parentAffinityCombos = getParentAffinityCombosById(child.baseId)
    // Sort filteredUmas by the order and value of parentAffinityCombos
    const affinityComboMap = new Map<string, number>()
    Object.entries(parentAffinityCombos).forEach(([id, value]) => {
      affinityComboMap.set(id, value)
    })
    const sorted = [...filteredUmas].sort((a, b) => {
      const aValue = affinityComboMap.get(a.chara_id_base) ?? -Infinity
      const bValue = affinityComboMap.get(b.chara_id_base) ?? -Infinity
      // Higher val§ue first, then fallback to name
      if (aValue !== bValue) return bValue - aValue
      return a.chara_name.localeCompare(b.chara_name)
    })
    return sorted
  }, [sortByAffinity, filteredUmas, treeData, level, position])

  const sortedFilteredGrandParentUmas = useMemo(() => {
    if (!sortByAffinity) return filteredUmas
    const grandchild = getGrandchildByPosition(treeData, { level, position })
    const child = getChildByPosition(treeData, { level, position })
    if (!child || !grandchild) return []
    const grandparentAffinityCombos = getGrandparentAffinityCombosByIds(
      child.baseId,
      grandchild.baseId
    )
    // Sort filteredUmas by the order and value of parentAffinityCombos
    const affinityComboMap = new Map<string, number>()
    Object.entries(grandparentAffinityCombos).forEach(([id, value]) => {
      affinityComboMap.set(id, value)
    })
    const sorted = [...filteredUmas].sort((a, b) => {
      const aValue = affinityComboMap.get(a.chara_id_base) ?? -Infinity
      const bValue = affinityComboMap.get(b.chara_id_base) ?? -Infinity
      if (aValue !== bValue) return bValue - aValue
      return a.chara_name.localeCompare(b.chara_name)
    })
    return sorted
  }, [sortByAffinity, filteredUmas, treeData, level, position])

  const savedUmasList = useMemo(() => {
    return savedUmas.filter(uma => {
      const name = getUmaNameById(uma.id, false)
      return name?.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [searchTerm, savedUmas])

  const handleSelectUma = (uma: CharacterNameID): void => {
    if (level !== null && position !== null) {
      onSelectUma(uma.chara_id, uma.chara_id_base, level, position)
      setSearchTerm('')
      onClose()
    }
  }

  const handleSelectSavedUma = (savedUma: SavedUma): void => {
    if (level !== null && position !== null) {
      onSelectUma(savedUma.id, savedUma.baseId, level, position)
      const standardUma = convertSavedUmaToUma(savedUma)
      updateTreeData(level, position, { ...standardUma })
      setSearchTerm('')
      onClose()
    }
  }

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value)
    // Reset visible counts when search changes
    setParentVisibleCount(6)
    setGrandparentVisibleCount(6)
  }

  const handleTabChange = (tab: 'all' | 'saved'): void => {
    setActiveTab(tab)
    // Reset visible counts when tab changes
    setParentVisibleCount(6)
    setGrandparentVisibleCount(6)
  }

  const handleSortChange = (checked: boolean): void => {
    setSortByAffinity(checked)
    // Reset visible counts when sorting changes
    setParentVisibleCount(6)
    setGrandparentVisibleCount(6)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Select Uma Musume
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search Uma Musume..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sort-affinity"
              checked={sortByAffinity}
              onCheckedChange={handleSortChange}
            />
            <label
              htmlFor="sort-affinity"
              className="text-sm font-medium text-gray-400 dark:text-gray-50"
            >
              Sort by affinity
            </label>
          </div>

          <Tabs className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                isActive={activeTab === 'all'}
                onClick={() => handleTabChange('all')}
                className="flex-1"
              >
                All Uma ({filteredUmas.length})
              </TabsTrigger>
              <TabsTrigger
                isActive={activeTab === 'saved'}
                onClick={() => handleTabChange('saved')}
                className="flex-1"
              >
                <BookMarkedIcon className="w-4 h-4 mr-1" />
                Saved ({savedUmasList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent isActive={activeTab === 'all'}>
              <div className="h-[400px] overflow-y-auto">
                {/** Parent-based affinity **/}
                <div className="mb-6">
                  {child && sortByAffinity ? (
                    <h3 className="font-semibold mb-2 text-lg leading-tight">
                      As Parent for
                      <span
                        className="text-bold"
                        style={{
                          color:
                            getUmaBasicInfoById(child.id)?.dress_color_main ||
                            '#000000',
                        }}
                      >
                        {' '}
                        {getUmaNameById(child?.id, false)}
                      </span>
                    </h3>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {sortedFilteredParentUmas
                      .slice(0, parentVisibleCount)
                      .map(uma => (
                        <Card
                          key={uma.chara_id}
                          className="cursor-pointer transition-all hover:shadow-md"
                          onClick={() => handleSelectUma(uma)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <UmaImage
                                charaId={uma.chara_id}
                                alt={uma.chara_name}
                                className="w-16 h-20 object-cover rounded-lg border-1 border-amber-200 flex-shrink-0"
                              />
                              <div className="flex-1 space-y-2 flex flex-col">
                                <h3 className="font-semibold text-md leading-tight">
                                  {uma.chara_name}
                                </h3>
                                <h4 className="text-sm text-gray-500 mt-auto">
                                  Affinity:{' '}
                                  {child
                                    ? (getParentAffinityCombosById(
                                      child?.baseId
                                    )[uma.chara_id_base] ?? 0)
                                    : null}
                                </h4>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  {sortedFilteredParentUmas.length > parentVisibleCount && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setParentVisibleCount(prev => prev + 6)}
                        className="flex items-center gap-2"
                      >
                        <ChevronDown className="w-4 h-4" />
                        Load More (
                        {sortedFilteredParentUmas.length -
                          parentVisibleCount}{' '}
                        remaining)
                      </Button>
                    </div>
                  )}
                </div>
                {/** Grandparent-based affinity **/}
                <div>
                  {child && grandChild && sortByAffinity ? (
                    <div className="sticky top-0 z-10 py-2 -mx-6 px-6 mb-2 border-b dark:border-gray-700">
                      <h3 className="font-semibold text-lg leading-tight">
                        As grandparent for
                        <span className="text-bold">
                          <span
                            style={{
                              color:
                                getUmaBasicInfoById(grandChild.id)
                                  ?.dress_color_main || '#000000',
                            }}
                          >{` ${getUmaNameById(grandChild?.id, false)} `}</span>
                        </span>
                        <span className="text-bold">
                          with
                          <span
                            style={{
                              color:
                                getUmaBasicInfoById(child.id)
                                  ?.dress_color_main || '#000000',
                            }}
                          >{` ${getUmaNameById(child?.id, false)} `}</span>
                          parent
                        </span>
                      </h3>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {sortedFilteredGrandParentUmas
                      .slice(0, grandparentVisibleCount)
                      .map(uma => (
                        <Card
                          key={uma.chara_id}
                          className="cursor-pointer transition-all hover:shadow-md"
                          onClick={() => handleSelectUma(uma)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <UmaImage
                                charaId={uma.chara_id}
                                alt={uma.chara_name}
                                className="w-16 h-20 object-cover rounded-lg border-1 border-amber-200 flex-shrink-0"
                              />
                              <div className="flex-1 space-y-2 flex flex-col">
                                <h3 className="font-semibold text-md leading-tight">
                                  {uma.chara_name}
                                </h3>
                                <h4 className="text-sm text-gray-500 mt-auto">
                                  Affinity:{' '}
                                  {child && grandChild
                                    ? (getGrandparentAffinityCombosByIds(
                                      child.baseId,
                                      grandChild.baseId
                                    )[uma.chara_id_base] ?? 0)
                                    : null}
                                </h4>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                  {sortedFilteredGrandParentUmas.length >
                    grandparentVisibleCount && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setGrandparentVisibleCount(prev => prev + 6)
                          }
                          className="flex items-center gap-2"
                        >
                          <ChevronDown className="w-4 h-4" />
                          Load More (
                          {sortedFilteredGrandParentUmas.length -
                            grandparentVisibleCount}{' '}
                          remaining)
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </TabsContent>

            <TabsContent isActive={activeTab === 'saved'}>
              <div className="h-[400px] overflow-y-auto">
                {savedUmasList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Heart className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">No saved Uma Musume</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedUmasList.sort().map(uma => (
                      <Card
                        key={uma.id}
                        className="cursor-pointer transition-all hover:shadow-md"
                        onClick={() => handleSelectSavedUma(uma)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <UmaImage
                              charaId={uma.id}
                              alt={getUmaNameById(uma.id, false)}
                              className="w-16 h-20 object-cover rounded-lg border-1 border-amber-200 flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                              <h3 className="font-semibold text-lg leading-tight">
                                {uma.nickname}
                              </h3>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default UmaModal

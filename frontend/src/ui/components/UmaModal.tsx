import { Card, CardContent } from '@/ui/base/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Checkbox } from '@/ui/base/checkbox'
import { Search, Heart, BookMarkedIcon } from 'lucide-react'
import { useState } from 'react'

import { CharacterNameID } from '~/types/characterNameId'
import UMA_LIST_WITH_ID from '../../assets/home/chara_names_with_id.json'
import UmaImage from '../../ui/components/UmaImage'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/base/tabs'
import { SavedUma, useSavedUmas } from '@/hooks/useSavedUmas'
import { getUmaNameById as getUmaNameById } from '../../utils/formatting'
import { useTreeData } from '../../hooks'
import { convertSavedUmaToUma } from '../../utils/uma'

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
  level: number | null
  position: number | null
}

const UmaModal = ({
  isOpen,
  onClose,
  onSelectUma,
  level,
  position,
}: UmaModalProps) => {
  const { updateTreeData } = useTreeData()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')
  const [sortByAffinity, setSortByAffinity] = useState<boolean>(false)
  const { savedUmas } = useSavedUmas()

  const filteredUmas = umaWithIdList.filter(uma =>
    uma.chara_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const savedUmasList = savedUmas.filter(uma => {
    const name = getUmaNameById(uma.id, false)
    return name?.toLowerCase().includes(searchTerm.toLowerCase())
  })

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
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Uma Musume..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sort-affinity"
              checked={sortByAffinity}
              onCheckedChange={setSortByAffinity}
            />
            <label htmlFor="sort-affinity" className="text-sm font-medium">
              Sort by affinity
            </label>
          </div>

          <Tabs className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                isActive={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                className="flex-1"
              >
                All Uma ({filteredUmas.length})
              </TabsTrigger>
              <TabsTrigger
                isActive={activeTab === 'saved'}
                onClick={() => setActiveTab('saved')}
                className="flex-1"
              >
                <BookMarkedIcon className="w-4 h-4 mr-1" />
                Saved ({savedUmasList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent isActive={activeTab === 'all'}>
              <div className="h-[400px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUmas.sort().map(uma => (
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
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg leading-tight">
                              {uma.chara_name}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent isActive={activeTab === 'saved'}>
              <div className="h-[400px] overflow-y-auto">
                {savedUmasList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Heart className="w-12 h-12 mb-4 text-gray-300" />
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

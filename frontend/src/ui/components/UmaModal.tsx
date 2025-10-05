import { Card, CardContent } from '@/ui/base/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Search } from 'lucide-react'
import { useState } from 'react'

import { CharacterNameID } from '~/types/characterNameId'
import UMA_LIST_WITH_ID from '../assets/home/chara_names_with_id.json'
import UmaImage from '../ui/components/UmaImage'

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
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredUmas = umaWithIdList.filter(uma =>
    uma.chara_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectUma = (uma: CharacterNameID): void => {
    if (level !== null && position !== null) {
      onSelectUma(uma.chara_id, uma.chara_id_base, level, position)
      setSearchTerm('')
      onClose()
    }
  }

  const handleClose = (): void => {
    setSearchTerm('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Select Uma Musume
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
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
        </div>

        <div className="flex-1 h-[500px] overflow-y-auto p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUmas.map(uma => (
              <Card
                key={uma.chara_id}
                className={`cursor-pointer transition-all hover:shadow-md`}
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
      </DialogContent>
    </Dialog>
  )
}
export default UmaModal

import { Button } from '@/ui/base/button'
import { Input } from '@/ui/base/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/base/dialog'
import { Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Uma } from '../../types/uma'
import { useSavedUmas } from '../../hooks/useSavedUmas'

interface SaveUmaButtonProps {
  uma: Uma | null | undefined
  className?: string
}

export default function SaveUmaButton({
  uma,
  className = '',
}: SaveUmaButtonProps) {
  const { saveUma, isUmaSaved, isNicknameTaken } = useSavedUmas()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const hasUmaData = uma && uma.id

  const handleSaveClick = () => {
    setNickname('')
    setError('')
    setShowNicknameModal(true)
  }

  const handleSaveWithNickname = () => {
    if (!nickname.trim()) {
      setError('Nickname is required')
      return
    }

    if (nickname.length > 60) {
      setError('Nickname must be 60 characters or less')
      return
    }

    if (isNicknameTaken(nickname)) {
      setError('This nickname is already taken')
      return
    }

    const success = saveUma(uma, nickname)
    if (success) {
      setShowNicknameModal(false)
    } else {
      setError('Failed to save Uma')
    }
  }

  const handleCancel = () => {
    setShowNicknameModal(false)
    setNickname('')
    setError('')
  }

  return (
    <>
      <div className={`flex justify-center ${className}`}>
        <Button
          onClick={handleSaveClick}
          variant="outline"
          size="sm"
          className={'flex items-center gap-2 w-full'}
          disabled={!hasUmaData}
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </Button>
      </div>

      <Dialog open={showNicknameModal} onOpenChange={setShowNicknameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as preset</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                Nickname (required)
              </label>
              <Input
                id="nickname"
                value={nickname}
                onChange={e => {
                  setNickname(e.target.value)
                  setError('') // Clear error when typing
                }}
                placeholder="Enter a nickname for this Uma..."
                maxLength={60}
                autoFocus
              />
              <div className="text-xs text-gray-500">
                {nickname.length}/60 characters
              </div>
              {error && <div className="text-sm text-red-500">{error}</div>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSaveWithNickname}>Save Uma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { Button } from '@/ui/base/button'
import { Input } from '@/ui/base/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/base/dialog'
import { Save, AlertTriangle } from 'lucide-react'
import { getUmaNameById } from '../../utils/formatting'
import { useState } from 'react'
import type { Uma } from '../../types/uma'
import { useSavedUmas, type SavedUma } from '../../hooks/useSavedUmas'

interface SaveUmaButtonProps {
  uma: Uma | null | undefined
  className?: string
}

export default function SaveUmaButton({
  uma,
  className = '',
}: SaveUmaButtonProps) {
  const { saveUma, overrideUma, isNicknameTaken, getSavedUmaByNickname } =
    useSavedUmas()
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showOverrideConfirmation, setShowOverrideConfirmation] =
    useState(false)
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [existingUma, setExistingUma] = useState<SavedUma | null>(null)

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
    if (!uma) {
      setError('No Uma data to save')
      return
    }

    if (isNicknameTaken(nickname)) {
      // Show override confirmation
      const existing = getSavedUmaByNickname(nickname)
      setExistingUma(existing || null)
      setShowOverrideConfirmation(true)
      return
    }

    const success = saveUma(uma, nickname)
    if (success) {
      setShowNicknameModal(false)
      setNickname('')
      setError('')
    } else {
      setError('Failed to save Uma')
    }
  }

  const handleOverrideConfirm = () => {
    if (!uma) {
      setError('No Uma data to save')
      return
    }

    const success = overrideUma(uma, nickname)
    if (success) {
      setShowNicknameModal(false)
      setShowOverrideConfirmation(false)
      setNickname('')
      setError('')
      setExistingUma(null)
    } else {
      setError('Failed to override Uma')
    }
  }

  const handleOverrideCancel = () => {
    setShowOverrideConfirmation(false)
    setExistingUma(null)
  }

  const handleCancel = () => {
    setShowNicknameModal(false)
    setShowOverrideConfirmation(false)
    setNickname('')
    setError('')
    setExistingUma(null)
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
            {/* Show current Uma info if available */}
            {uma && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Current Uma:{' '}
                  <span className="font-medium">
                    {getUmaNameById(uma.id, false)}
                  </span>
                </div>
              </div>
            )}

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

      {/* Override Confirmation Dialog */}
      <Dialog
        open={showOverrideConfirmation}
        onOpenChange={setShowOverrideConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Override Existing Uma?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              A Uma with the nickname{' '}
              <span className="font-semibold">"{nickname}"</span> already
              exists.
            </div>

            {existingUma && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Current: {getUmaNameById(existingUma.id, false)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Saved: {new Date(existingUma.savedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Do you want to override it with the current Uma configuration?
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleOverrideCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleOverrideConfirm}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

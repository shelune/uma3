import { Button } from '@/ui/base/button'
import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Separator } from '@/ui/base/separator'
import {
  Database,
  MoreVertical,
  Share2,
  Copy,
  FileArchive,
  AlertCircle,
  Check,
  Heart,
  Edit2,
  Trash2,
  Save,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTreeDataWithStorage } from '../../hooks/useTreeDataWithStorage'
import { useUrlSharing } from '../../hooks/useUrlSharing'
import { useSavedUmas } from '../../hooks/useSavedUmas'
import { getImagePath, getUmaNameById } from '../../utils/formatting'

interface TreeDataManagerProps {
  className?: string
}

export default function TreeDataManager({
  className = '',
}: TreeDataManagerProps) {
  const { hasTreeData, getTreeStats } = useTreeDataWithStorage()
  const {
    doMigration,
    savedUmas,
    removeSavedUma,
    updateUmaNickname,
    getSavedUmasStats,
  } = useSavedUmas()
  const {
    generateShareUrl,
    generateShortShareUrl,
    copyShareUrl,
    copyLongShareUrl,
    loadFromUrl,
    hasUrlData,
    clearUrlData,
  } = useUrlSharing()
  const [shareUrl, setShareUrl] = useState('')
  const [shortShareUrl, setShortShareUrl] = useState('')
  const [isGeneratingShortUrl, setIsGeneratingShortUrl] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notification, setNotification] = useState('')
  const [savedUmasDialogOpen, setSavedUmasDialogOpen] = useState(false)
  const [editingUma, setEditingUma] = useState<string | null>(null)
  const [editNickname, setEditNickname] = useState('')

  const stats = getTreeStats()
  const savedUmasStats = getSavedUmasStats()

  // Handler functions for saved umas
  const handleEditStart = (nickname: string) => {
    setEditingUma(nickname)
    setEditNickname(nickname)
  }

  const handleEditSave = () => {
    if (editingUma && editNickname.trim() && editNickname !== editingUma) {
      const success = updateUmaNickname(editingUma, editNickname.trim())
      if (success) {
        setNotification('Nickname updated successfully')
      } else {
        setNotification('Failed to update nickname (may already exist)')
      }
      setTimeout(() => setNotification(''), 3000)
    }
    setEditingUma(null)
    setEditNickname('')
  }

  const handleEditCancel = () => {
    setEditingUma(null)
    setEditNickname('')
  }

  const handleDelete = (nickname: string) => {
    if (confirm(`Delete saved Uma "${nickname}"?`)) {
      removeSavedUma(nickname)
      setNotification('Saved Uma deleted')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  // Load data from URL on component mount
  useEffect(() => {
    if (hasUrlData()) {
      const success = loadFromUrl()
      if (success) {
        setNotification('Tree data loaded from URL')
        // Optionally clear URL data after loading
        clearUrlData()
        setTimeout(() => setNotification(''), 3000)
      } else {
        setNotification('Failed to load tree data from URL')
        setTimeout(() => setNotification(''), 3000)
      }
    }
  }, [hasUrlData, loadFromUrl, clearUrlData])

  // Generate share URLs when popover opens
  useEffect(() => {
    if (isOpen && hasTreeData()) {
      const url = generateShareUrl()
      setShareUrl(url)

      // Generate short URL asynchronously
      setIsGeneratingShortUrl(true)
      generateShortShareUrl()
        .then(shortUrl => {
          setShortShareUrl(shortUrl)
          setIsGeneratingShortUrl(false)
        })
        .catch(() => {
          setShortShareUrl(url) // Fallback to long URL
          setIsGeneratingShortUrl(false)
        })
    }
  }, [isOpen, hasTreeData, generateShareUrl, generateShortShareUrl])

  const handleCopyShortUrl = async () => {
    const success = await copyShareUrl()
    if (success) {
      setCopied(true)
      setNotification('Short URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setNotification(''), 3000)
    } else {
      setNotification('Failed to copy short URL to clipboard')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  const handleCopyLongUrl = async () => {
    const success = await copyLongShareUrl()
    if (success) {
      setCopied(true)
      setNotification('Full URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setNotification(''), 3000)
    } else {
      setNotification('Failed to copy full URL to clipboard')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {notification}
        </div>
      )}
      {/* Tree Stats Badge */}
      {hasTreeData() && (
        <Badge variant="secondary" className="text-xs">
          {stats.totalUmas} Uma{stats.totalUmas !== 1 ? 's' : ''} {` | `}
          {stats.levelsCount} Level{stats.levelsCount !== 1 ? 's' : ''}
        </Badge>
      )}

      {/* Storage & URL Sharing Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Share & Store
            <MoreVertical className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Share Tree Data</h4>
              <p className="text-sm text-muted-foreground">
                Share your breeding tree via URL
              </p>
            </div>

            {hasTreeData() ? (
              <div className="space-y-3">
                {/* URL Sharing Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share URLs</span>
                  </div>

                  {/* Short URL Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Short URL (Recommended)
                      </span>
                    </div>

                    {isGeneratingShortUrl ? (
                      <div className="p-2 bg-muted rounded text-xs text-center">
                        Generating short URL...
                      </div>
                    ) : shortShareUrl ? (
                      <div className="space-y-2">
                        <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                          {shortShareUrl}
                        </div>
                        <Button
                          onClick={handleCopyShortUrl}
                          size="sm"
                          className="w-full"
                          variant={copied ? 'default' : 'outline'}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Short URL
                            </>
                          )}
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  {/* Full URL Section */}
                  {shareUrl && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Full URL
                        </span>
                      </div>

                      <div className="p-2 bg-muted rounded text-xs font-mono break-all max-h-20 overflow-y-auto">
                        {shareUrl}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Length: {shareUrl.length} chars</span>
                        {shareUrl.length > 2000 && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Could be too long</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handleCopyLongUrl}
                        size="sm"
                        className="w-full"
                        variant="outline"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Full URL
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Storage Section - Placeholder for future features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Local Storage</span>
                  </div>

                  <div className="grid gap-2">
                    <Button size="sm" onClick={doMigration}>
                      <FileArchive className="w-4 h-4 mr-2" />
                      Migrate saved umas
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No tree data to share. Add some Uma cards first!
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Saved Umas Dialog */}
      <Dialog open={savedUmasDialogOpen} onOpenChange={setSavedUmasDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Saved Umas ({savedUmasStats.total})
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3">
            {savedUmasStats.hasAny ? (
              savedUmas.map(uma => (
                <div
                  key={uma.nickname}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* Uma Image */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      {uma.id ? (
                        <img
                          src={getImagePath(uma.id)}
                          alt={getUmaNameById(uma.id)}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uma Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-muted-foreground">
                      {uma.name || getUmaNameById(uma.id) || 'Unknown Uma'}
                    </div>

                    {/* Nickname - Editable */}
                    {editingUma === uma.nickname ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={editNickname}
                          onChange={e => setEditNickname(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="Enter nickname"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEditSave()
                            if (e.key === 'Escape') handleEditCancel()
                          }}
                        />
                        <Button size="sm" onClick={handleEditSave}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCancel}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="font-medium text-sm truncate">
                        {uma.nickname}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-1">
                      Saved {new Date(uma.savedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {editingUma !== uma.nickname && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditStart(uma.nickname)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(uma.nickname)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No saved Umas yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Save Umas from the breeding tree to manage them here
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Button } from '@/ui/base/button'
import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import {
  Database,
  MoreVertical,
  Share2,
  Copy,
  Download,
  Upload,
  AlertCircle,
  Check,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTreeDataWithStorage } from '../../hooks/useTreeDataWithStorage'
import { useUrlSharing } from '../../hooks/useUrlSharing'

interface TreeDataManagerProps {
  className?: string
}

export default function TreeDataManager({
  className = '',
}: TreeDataManagerProps) {
  const { hasTreeData, getTreeStats } = useTreeDataWithStorage()
  const {
    generateShareUrl,
    copyShareUrl,
    loadFromUrl,
    hasUrlData,
    clearUrlData,
  } = useUrlSharing()
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notification, setNotification] = useState('')

  const stats = getTreeStats()

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

  // Generate share URL when popover opens
  useEffect(() => {
    if (isOpen && hasTreeData()) {
      const url = generateShareUrl()
      setShareUrl(url)
    }
  }, [isOpen, hasTreeData, generateShareUrl])

  const handleCopyUrl = async () => {
    const success = await copyShareUrl()
    if (success) {
      setCopied(true)
      setNotification('URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
      setTimeout(() => setNotification(''), 3000)
    } else {
      setNotification('Failed to copy URL to clipboard')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  const urlLength = shareUrl.length
  const isUrlTooLong = urlLength > 2000 // Conservative limit for URLs

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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share URL</span>
                  </div>

                  {shareUrl && (
                    <div className="space-y-2">
                      <div className="p-2 bg-muted rounded text-xs font-mono break-all max-h-20 overflow-y-auto">
                        {shareUrl}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Length: {urlLength} chars</span>
                        {isUrlTooLong && (
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>URL might be too long</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handleCopyUrl}
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
                            Copy URL
                          </>
                        )}
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

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Export/Import features coming soon
                  </p>
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
    </div>
  )
}

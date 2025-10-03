import React, { useState } from 'react'
import { getImagePath } from '../utils/formatting'

interface UmaImageProps {
  charaId: string
  alt: string
  className?: string
  fallbackSrc?: string
}

const UmaImage: React.FC<UmaImageProps> = ({
  charaId,
  alt,
  className = '',
  fallbackSrc = 'https://placehold.co/150x150/ccc/',
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const imagePath = getImagePath(charaId)

  const handleImageError = (): void => {
    setHasError(true)
    setIsLoading(false)
  }

  const handleImageLoad = (): void => {
    setIsLoading(false)
    setHasError(false)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : imagePath}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}

export default UmaImage

import React, { useState } from 'react'
import BreedingTree from './ui/composite/BreedingTree'
import Instructions from './ui/pages/Instructions'
import Navigation from './ui/components/Navigation'
import { TreeDataProvider } from './contexts/TreeDataContext'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    'breeding-tree' | 'instructions'
  >('breeding-tree')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'breeding-tree':
        return (
          <TreeDataProvider>
            <div className="min-h-screen bg-gray-50">
              <BreedingTree />
            </div>
          </TreeDataProvider>
        )
      case 'instructions':
        return <Instructions />
      default:
        return (
          <TreeDataProvider>
            <div className="min-h-screen bg-gray-50">
              <BreedingTree />
            </div>
          </TreeDataProvider>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  )
}

export default App

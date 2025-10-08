import React, { useState } from 'react'
import BreedingTree from './ui/composite/BreedingTree'
import Instructions from './ui/pages/Instructions'
import Navigation from './ui/components/Navigation'
import { TreeDataProvider } from './contexts/TreeDataContext'
import { ThemeProvider } from './contexts/ThemeContext'

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    'breeding-tree' | 'instructions'
  >('breeding-tree')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'breeding-tree':
        return (
          <TreeDataProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
              <BreedingTree />
            </div>
          </TreeDataProvider>
        )
      case 'instructions':
        return <Instructions />
      default:
        return (
          <TreeDataProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
              <BreedingTree />
            </div>
          </TreeDataProvider>
        )
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  )
}

export default App

import React from 'react'
import BreedingTree from './components/BreedingTree'
import { TreeDataProvider } from './contexts/TreeDataContext'

const App: React.FC = () => {
  return (
    <TreeDataProvider>
      <div className="min-h-screen bg-gray-50">
        <BreedingTree />
      </div>
    </TreeDataProvider>
  )
}

export default App

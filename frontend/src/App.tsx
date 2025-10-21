import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import BreedingTree from './ui/composite/BreedingTree'
import Instructions from './ui/pages/Instructions'
import Navigation from './ui/components/Navigation'
import { TreeDataProvider } from './contexts/TreeDataContext'
import { ThemeProvider } from './contexts/ThemeContext'

const AppContent: React.FC = () => {
  const location = useLocation()
  const currentPage =
    location.pathname === '/instructions' ? 'instructions' : 'breeding-tree'

  // Handle hash scrolling when location changes
  useEffect(() => {
    if (location.hash) {
      // Wait a bit for the component to render
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [location])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navigation currentPage={currentPage} onPageChange={() => {}} />
      <Routes>
        <Route
          path="/"
          element={
            <TreeDataProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
                <BreedingTree />
              </div>
            </TreeDataProvider>
          }
        />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App

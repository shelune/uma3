import { Button } from '@/ui/base/button'
import { BookOpen } from 'lucide-react'

interface NavigationProps {
  currentPage: 'breeding-tree' | 'instructions'
  onPageChange: (page: 'breeding-tree' | 'instructions') => void
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img
              src="/logo.gif"
              alt="Gold Ship Uma Musume"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h1 className="text-xl font-bold text-gray-900">
              Uma Breeding Tree
            </h1>
          </div>

          <nav className="flex space-x-1">
            <Button
              variant={currentPage === 'breeding-tree' ? 'default' : 'ghost'}
              onClick={() => onPageChange('breeding-tree')}
              className="flex items-center gap-2"
            >
              Breeding Tree
            </Button>

            <Button
              variant={currentPage === 'instructions' ? 'default' : 'ghost'}
              onClick={() => onPageChange('instructions')}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              How To Use
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navigation

import { Button } from '@/ui/base/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../../components/ThemeToggle'

interface NavigationProps {
  currentPage: 'breeding-tree' | 'instructions'
  onPageChange?: (page: 'breeding-tree' | 'instructions') => void
}

const Navigation = ({ currentPage }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <a href="https://umamily.moe" rel="noopener noreferrer">
              <img
                src="/logo.gif"
                alt="Gold Ship Uma Musume"
                className="w-10 h-10 rounded-lg object-cover"
              />
            </a>
            <h1 className="max-sm:hidden text-xl font-bold text-gray-900 dark:text-white">
              Uma Pedigree Maker
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <Link to="/">
                <Button
                  variant={
                    currentPage === 'breeding-tree' ? 'default' : 'ghost'
                  }
                  className="flex items-center gap-2"
                >
                  Breeding Tree
                </Button>
              </Link>

              <Link to="/instructions">
                <Button
                  variant={currentPage === 'instructions' ? 'default' : 'ghost'}
                  className="flex items-center gap-2"
                >
                  How To Use
                </Button>
              </Link>
            </nav>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant={
                    currentPage === 'breeding-tree' ? 'default' : 'ghost'
                  }
                  className="w-full justify-start flex items-center gap-2"
                >
                  Breeding Tree
                </Button>
              </Link>

              <Link
                to="/instructions"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={currentPage === 'instructions' ? 'default' : 'ghost'}
                  className="w-full justify-start flex items-center gap-2"
                >
                  How To Use
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navigation

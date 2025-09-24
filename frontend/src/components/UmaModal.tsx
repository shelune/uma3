import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import type { Uma, UmaModalProps } from '../types/uma';

// Sample Uma data for demonstration
const sampleUmas: Uma[] = [
  {
    id: 1,
    name: 'Special Week',
    image: 'https://via.placeholder.com/150x200/4a90e2/ffffff?text=Special+Week',
    affinity: 85,
    blueSpark: 3,
    pinkSpark: 2,
    greenSpark: 4,
    whiteSpark: 1,
    racesWon: 12
  },
  {
    id: 2,
    name: 'Silence Suzuka',
    image: 'https://via.placeholder.com/150x200/e91e63/ffffff?text=Silence+Suzuka',
    affinity: 92,
    blueSpark: 4,
    pinkSpark: 3,
    greenSpark: 2,
    whiteSpark: 3,
    racesWon: 15
  },
  {
    id: 3,
    name: 'Tokai Teio',
    image: 'https://via.placeholder.com/150x200/4caf50/ffffff?text=Tokai+Teio',
    affinity: 88,
    blueSpark: 2,
    pinkSpark: 4,
    greenSpark: 3,
    whiteSpark: 2,
    racesWon: 10
  },
  {
    id: 4,
    name: 'Vodka',
    image: 'https://via.placeholder.com/150x200/ff9800/ffffff?text=Vodka',
    affinity: 90,
    blueSpark: 3,
    pinkSpark: 1,
    greenSpark: 4,
    whiteSpark: 4,
    racesWon: 14
  },
  {
    id: 5,
    name: 'Daiwa Scarlet',
    image: 'https://via.placeholder.com/150x200/9c27b0/ffffff?text=Daiwa+Scarlet',
    affinity: 87,
    blueSpark: 4,
    pinkSpark: 2,
    greenSpark: 1,
    whiteSpark: 2,
    racesWon: 11
  },
];

const UmaModal: React.FC<UmaModalProps> = ({ isOpen, onClose, onSelectUma, level, position }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUma, setSelectedUma] = useState<Uma | null>(null);

  const filteredUmas = sampleUmas.filter(uma =>
    uma.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUma = (uma: Uma): void => {
    setSelectedUma(uma);
  };

  const handleConfirmSelection = (): void => {
    if (selectedUma && level !== null && position !== null) {
      onSelectUma(selectedUma, level, position);
      setSelectedUma(null);
      setSearchTerm('');
      onClose();
    }
  };

  const handleClose = (): void => {
    setSelectedUma(null);
    setSearchTerm('');
    onClose();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/150x200/ccc/999?text=No+Image';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Select Uma Musume
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Uma Musume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUmas.map((uma) => (
              <Card
                key={uma.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedUma?.id === uma.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                onClick={() => handleSelectUma(uma)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={uma.image}
                      alt={uma.name}
                      className="w-16 h-20 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                      onError={handleImageError}
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg leading-tight">
                        {uma.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Affinity:</span>
                        <Badge variant="secondary" className="font-bold text-blue-700">
                          {uma.affinity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs bg-blue-50">
                          💙{uma.blueSpark}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-pink-50">
                          💖{uma.pinkSpark}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50">
                          💚{uma.greenSpark}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          🤍{uma.whiteSpark}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-yellow-50">
                          🏆{uma.racesWon}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedUma}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Select Uma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; export default UmaModal;
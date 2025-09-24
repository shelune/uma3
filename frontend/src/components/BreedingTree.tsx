import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { TreeData, TreeSlot, Uma } from '../types/uma';
import UmaCard from './UmaCard';
import UmaModal from './UmaModal';

const BreedingTree: React.FC = () => {
  // Initialize tree structure with levels 0-4 (up to 16 cards at bottom level)
  const [treeData, setTreeData] = useState<TreeData>(() => {
    const initialTree: TreeData = {};
    // Level 0: 1 card (top)
    // Level 1: 2 cards
    // Level 2: 4 cards
    // Level 3: 8 cards

    for (let level = 0; level <= 4; level++) {
      initialTree[level] = [];
      const cardsInLevel = Math.pow(2, level);
      for (let position = 0; position < cardsInLevel; position++) {
        initialTree[level][position] = null; // Empty slot
      }
    }
    return initialTree;
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TreeSlot>({ level: null, position: null });

  const handleSelectUma = (level: number, position: number): void => {
    setSelectedSlot({ level, position });
    setModalOpen(true);
  };

  const handleUmaSelection = (uma: Uma, level: number, position: number): void => {
    setTreeData(prev => ({
      ...prev,
      [level]: [
        ...prev[level].slice(0, position),
        uma,
        ...prev[level].slice(position + 1)
      ]
    }));
    setModalOpen(false);
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedSlot({ level: null, position: null });
  };

  const renderTreeLevel = (level: number) => {
    const cardsInLevel = Math.pow(2, level);
    const cards = treeData[level] || [];

    // Split cards into rows of maximum 8 cards each
    const rows = [];
    for (let i = 0; i < cardsInLevel; i += 8) {
      const rowSize = Math.min(8, cardsInLevel - i);
      rows.push({ cards: Array.from({ length: rowSize }, (_, idx) => ({ card: cards[i + idx], position: i + idx })), size: rowSize });
    }

    const getGridCols = (size: number) => {
      switch (size) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-4';
        case 5: return 'grid-cols-5';
        case 6: return 'grid-cols-6';
        case 7: return 'grid-cols-7';
        case 8: return 'grid-cols-8';
        default: return 'grid-cols-8';
      }
    };

    return (
      <div key={level} className="mb-12 relative">
        <div className="text-center mb-6">
          <Badge variant="outline" className="px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 border-blue-200">
            Level {level + 1}
          </Badge>
        </div>

        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={`grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] auto-rows-auto gap-4 mx-auto justify-items-center items-center`}>
              {row.cards.map(({ card, position }) => (
                <div key={`${level}-${position}`} className="relative">
                  <UmaCard
                    uma={card}
                    onSelectUma={handleSelectUma}
                    level={level}
                    position={position}
                    size={level >= 3 ? "small" : "big"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const clearTree = (): void => {
    setTreeData(() => {
      const clearedTree: TreeData = {};
      for (let level = 0; level <= 4; level++) {
        clearedTree[level] = [];
        const cardsInLevel = Math.pow(2, level);
        for (let position = 0; position < cardsInLevel; position++) {
          clearedTree[level][position] = null;
        }
      }
      return clearedTree;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="max-w-8xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Uma Musume Breeding Tree
          </CardTitle>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearTree}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Tree
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-8 overflow-x-auto overflow-y-auto p-4">
            {[0, 1, 2, 3].map(level => (
              <div key={level}>
                {renderTreeLevel(level)}

              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UmaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSelectUma={handleUmaSelection}
        level={selectedSlot.level}
        position={selectedSlot.position}
      />
    </div>
  );
};

export default BreedingTree;
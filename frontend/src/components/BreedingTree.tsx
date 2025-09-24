import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import type { TreeData, TreeSlot, Uma } from '../types/uma';
import UmaCard from './UmaCard';
import UmaModal from './UmaModal';

const BreedingTree: React.FC = () => {
  // Initialize tree structure with levels 0-5 (up to 32 cards at bottom level)
  const [treeData, setTreeData] = useState<TreeData>(() => {
    const initialTree: TreeData = {};
    // Level 0: 1 card (top)
    // Level 1: 2 cards
    // Level 2: 4 cards
    // Level 3: 8 cards
    // Level 4: 16 cards
    // Level 5: 32 cards (max)

    for (let level = 0; level <= 5; level++) {
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

    return (
      <div key={level} className="mb-12 relative">
        <div className="text-center mb-6">
          <Badge variant="outline" className="px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 border-blue-200">
            Level {level + 1}
          </Badge>
        </div>

        <div className={`flex flex-wrap justify-center ${level === 0 ? 'gap-8' :
          level === 1 ? 'gap-24' :
            level === 2 ? 'gap-12' :
              level === 3 ? 'gap-6' :
                level === 4 ? 'gap-4' :
                  'gap-2'
          }`}>
          {Array.from({ length: cardsInLevel }, (_, position) => (
            <div key={`${level}-${position}`} className="relative">
              <UmaCard
                uma={cards[position]}
                onSelectUma={handleSelectUma}
                level={level}
                position={position}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const clearTree = (): void => {
    setTreeData(() => {
      const clearedTree: TreeData = {};
      for (let level = 0; level <= 5; level++) {
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
      <Card className="max-w-7xl mx-auto">
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
          <div className="space-y-8 overflow-x-auto max-h-[70vh] overflow-y-auto p-4">
            {[0, 1, 2, 3, 4, 5].map(level => (
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
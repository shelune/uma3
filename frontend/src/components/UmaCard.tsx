import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings, User } from 'lucide-react';
import React from 'react';
import type { Uma } from '../types/uma';

export interface UmaCardProps {
  uma?: Uma | null;
  onSelectUma: (level: number, position: number) => void;
  size: "big" | "small";
  level: number
  position: number;
}

const UmaCard: React.FC<UmaCardProps> = ({ uma, onSelectUma, level, size = "big", position }) => {
  const {
    name = '',
    blueSpark = 0,
    pinkSpark = 0,
    greenSpark = 0,
    whiteSpark = 0,
    racesWon = 0
  } = uma || {};

  // Dynamic sizing based on level
  const getCardSize = () => {
    if (size === "big") {
      return 'w-56 min-h-48';
    } else {
      return 'w-40 min-h-32';
    }
  };

  const isSmallSize = size === "small"

  return (
    <Card className={`${getCardSize()} transition-all duration-300 hover:scale-105 hover:shadow-lg group`}>
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-start">
          {uma ? (
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
              {name}
            </h3>
          ) : (
            <div className="flex items-center gap-2 flex-1 mr-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <span className="text-sm text-gray-400">Name</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100 transition-opacity"
            onClick={() => onSelectUma(level, position)}
            title="Select Uma"
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className={`${isSmallSize ? 'p-2 pt-0' : 'p-3 pt-0'} space-y-2`}>
        <div className={`grid grid-cols-2 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}>
          <Badge variant="outline" className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} justify-center bg-blue-50 border-blue-200`}>
            {blueSpark}
          </Badge>
          <Badge variant="outline" className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} justify-center bg-pink-50 border-pink-200`}>
            {pinkSpark}
          </Badge>
        </div>
        <div className={`grid grid-cols-1 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}>
          <Badge variant="outline" className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} justify-center bg-green-50 border-green-200`}>
            {greenSpark}
          </Badge>
        </div>
        <div className={`grid grid-cols-2 ${isSmallSize ? 'gap-0.5' : 'gap-1'}`}>
          <Badge variant="outline" className={`${isSmallSize ? 'text-xs px-1' : 'text-xs'} justify-center`}>
            {whiteSpark}
          </Badge>
          <Badge className={`w-full justify-center bg-yellow-500 hover:bg-yellow-600 text-yellow-900 ${isSmallSize ? 'text-xs py-0.5' : ''}`}>
            🏆 {racesWon}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UmaCard;
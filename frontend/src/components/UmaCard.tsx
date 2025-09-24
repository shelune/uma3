import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings } from 'lucide-react';
import React from 'react';
import type { UmaCardProps } from '../types/uma';

const UmaCard: React.FC<UmaCardProps> = ({ uma, onSelectUma, level, position }) => {
  const {
    name = '',
    blueSpark = 0,
    pinkSpark = 0,
    greenSpark = 0,
    whiteSpark = 0,
    racesWon = 0
  } = uma || {};

  return (
    <Card className="w-48 h-40 transition-all duration-300 hover:scale-105 hover:shadow-lg group">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
            {name || 'Empty Slot'}
          </h3>
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

      <CardContent className="p-3 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-1">
          <Badge variant="outline" className="text-xs justify-center bg-blue-50 border-blue-200">
            💙 {blueSpark}
          </Badge>
          <Badge variant="outline" className="text-xs justify-center bg-pink-50 border-pink-200">
            💖 {pinkSpark}
          </Badge>
          <Badge variant="outline" className="text-xs justify-center bg-green-50 border-green-200">
            💚 {greenSpark}
          </Badge>
          <Badge variant="outline" className="text-xs justify-center bg-gray-50 border-gray-200">
            🤍 {whiteSpark}
          </Badge>
        </div>

        <Badge className="w-full justify-center bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
          🏆 {racesWon} Wins
        </Badge>
      </CardContent>
    </Card>
  );
};

export default UmaCard;
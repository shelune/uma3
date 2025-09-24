export interface Uma {
  id: number;
  name: string;
  image?: string;
  affinity: number;
  blueSpark: number;
  pinkSpark: number;
  greenSpark: number;
  whiteSpark: number;
  racesWon: number;
}

export interface TreeSlot {
  level: number | null;
  position: number | null;
}

export interface TreeData {
  [level: number]: (Uma | null)[];
}

export interface UmaCardProps {
  uma?: Uma | null;
  onSelectUma: (level: number, position: number) => void;
  level: number;
  position: number;
}

export interface UmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUma: (uma: Uma, level: number, position: number) => void;
  level: number | null;
  position: number | null;
}

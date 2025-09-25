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

// Blue spark stat/level selection for a given card position
export interface BlueSparkSelection {
  stat: string; // e.g. "Speed", "Stamina", "Power", "Guts", "Wits"
  level: number; // 1-3
}

// Pink spark selection (same shape) for aptitude/running style categories
export type PinkSparkSelection = BlueSparkSelection;

export interface TreeSlot {
  level: number | null;
  position: number | null;
}

export interface TreeData {
  [level: number]: (Uma | null)[];
}

export interface UmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUma: (uma: Uma, level: number, position: number) => void;
  level: number | null;
  position: number | null;
}

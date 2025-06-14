
import { DifficultyLevel } from '@/types/gameTypes';

export const difficultySettings: Record<DifficultyLevel, { time: number; aiLevel: number }> = {
  easy: { time: 10, aiLevel: 0.3 },
  medium: { time: 7, aiLevel: 0.5 },
  hard: { time: 5, aiLevel: 0.7 },
  nightmare: { time: 3.5, aiLevel: 0.85 },
  insane: { time: 2, aiLevel: 0.95 },
  godlike: { time: 1.2, aiLevel: 0.98 },
  armageddon: { time: 0.6, aiLevel: 1.0 }
};

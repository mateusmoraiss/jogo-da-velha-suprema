
import { DifficultyLevel } from '@/types/gameTypes';

export const difficultySettings: Record<DifficultyLevel, { time: number; aiLevel: number }> = {
  easy: { time: Infinity, aiLevel: 0.3 },    // Tempo infinito - misses blocks often
  medium: { time: 7, aiLevel: 0.5 },         // 50% accuracy - basic strategic play
  hard: { time: 5, aiLevel: 0.7 },           // 70% accuracy - good tactical awareness
  nightmare: { time: 2, aiLevel: 0.85 },     // 85% accuracy - advanced minimax play
  insane: { time: 1.2, aiLevel: 0.95 },      // 95% accuracy - deep strategic analysis
  godlike: { time: 0.9, aiLevel: 0.98 },     // 98% accuracy - near-perfect play
  armageddon: { time: 0.6, aiLevel: 1.0 }    // 100% base accuracy - perfect play with rare long-term errors
};

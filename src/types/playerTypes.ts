
export interface PlayerProgress {
  name: string;
  levelProgress: Record<string, {
    consecutiveWins: number;
    totalLosses: number;
    isCleared: boolean;
  }>;
}

export interface GameStorage {
  players: PlayerProgress[];
  currentPlayer: string;
}

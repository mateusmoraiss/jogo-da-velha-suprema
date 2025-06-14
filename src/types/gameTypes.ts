
export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface GameState {
  board: Board;
  currentPlayer: 'X' | 'O';
  winner: Player;
  isGameActive: boolean;
  playerScore: number;
  computerScore: number;
  moveHistory: string[];
  moveCount: number;
  timeLeft: number;
  difficulty: DifficultyLevel;
  selectedPosition: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'nightmare' | 'insane' | 'godlike' | 'armageddon';


export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface GameState {
  board: Board;
  currentPlayer: 'X' | 'O';
  winner: Player;
  isGameActive: boolean;
  playerScore: number;
  computerScore: number;
  moveCount: number;
  timeLeft: number;
  difficulty: DifficultyLevel;
  selectedPosition: number;
  // New statistics fields
  survivedMoves: number;
  totalMoveTime: number;
  moveTimes: number[];
  averageAPM: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'nightmare' | 'insane' | 'godlike' | 'armageddon';

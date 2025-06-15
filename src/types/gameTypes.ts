
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

export type ConfirmKey = 'space' | 'enter' | 'shift' | 'ctrl' | 'alt' | 'tab' | 'escape' | 'backspace';

export const CONFIRM_KEY_OPTIONS: { value: ConfirmKey; label: string; key: string }[] = [
  { value: 'space', label: 'Espaço', key: ' ' },
  { value: 'enter', label: 'Enter', key: 'Enter' },
  { value: 'shift', label: 'Shift', key: 'Shift' },
  { value: 'ctrl', label: 'Ctrl', key: 'Control' },
  { value: 'alt', label: 'Alt', key: 'Alt' },
  { value: 'tab', label: 'Tab', key: 'Tab' },
  { value: 'escape', label: 'Esc', key: 'Escape' },
  { value: 'backspace', label: 'Backspace', key: 'Backspace' }
];

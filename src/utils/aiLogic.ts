
import { Board, DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { canWinNextMove } from '@/utils/gameLogic';

export const getComputerMove = (board: Board, difficulty: DifficultyLevel): number => {
  const aiLevel = difficultySettings[difficulty].aiLevel;
  
  // Always try to win first
  const winMove = canWinNextMove(board, 'O');
  if (winMove !== -1) return winMove;

  // Block player win based on AI level
  if (Math.random() < aiLevel) {
    const blockMove = canWinNextMove(board, 'X');
    if (blockMove !== -1) return blockMove;
  }

  // Smart moves based on AI level
  if (Math.random() < aiLevel) {
    // Take center if available
    if (!board[4]) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !board[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
  }

  // Random move
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
  return availableSpots[Math.floor(Math.random() * availableSpots.length)] as number;
};


import { Board, Player } from '@/types/gameTypes';

export const checkWinner = (board: Board): Player => {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const canWinNextMove = (board: Board, player: Player): number => {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (checkWinner(testBoard) === player) {
        return i;
      }
    }
  }
  return -1;
};

export const removeOldestMoves = (board: Board, player: 'X' | 'O'): Board => {
  const newBoard = [...board];
  const playerPositions: number[] = [];
  const opponent = player === 'X' ? 'O' : 'X';
  
  // Find all positions of the current player
  for (let i = 0; i < 9; i++) {
    if (newBoard[i] === player) {
      playerPositions.push(i);
    }
  }
  
  // If player has less than 2 pieces, don't remove anything
  if (playerPositions.length < 2) {
    return newBoard;
  }
  
  let removedCount = 0;
  
  // Try to remove 2 pieces, but avoid removing pieces that would create winning opportunities
  for (let i = 0; i < playerPositions.length && removedCount < 2; i++) {
    const pos = playerPositions[i];
    const testBoard = [...newBoard];
    testBoard[pos] = null;
    
    // Check if removing this piece would allow opponent to win immediately
    const opponentCanWin = canWinNextMove(testBoard, opponent) !== -1;
    
    // Also check if removing this piece would prevent current player from winning
    const playerCouldWin = canWinNextMove(newBoard, player) !== -1;
    const playerStillCanWin = canWinNextMove(testBoard, player) !== -1;
    const wouldPreventWin = playerCouldWin && !playerStillCanWin;
    
    // Only remove if it doesn't create immediate winning opportunity for opponent
    // and doesn't prevent current player from winning
    if (!opponentCanWin && !wouldPreventWin) {
      newBoard[pos] = null;
      removedCount++;
    }
  }
  
  // If we couldn't remove 2 pieces safely, try to remove at least 1
  if (removedCount === 0) {
    for (let i = 0; i < playerPositions.length; i++) {
      const pos = playerPositions[i];
      const testBoard = [...newBoard];
      testBoard[pos] = null;
      
      // Check if removing this piece would allow opponent to win immediately
      const opponentCanWin = canWinNextMove(testBoard, opponent) !== -1;
      
      if (!opponentCanWin) {
        newBoard[pos] = null;
        break;
      }
    }
  }
  
  return newBoard;
};

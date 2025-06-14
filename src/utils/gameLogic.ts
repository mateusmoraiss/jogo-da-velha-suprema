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

// Improved function to count potential winning lines for a player
export const countWinningOpportunities = (board: Board, player: Player): number => {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  let opportunities = 0;
  const opponent = player === 'X' ? 'O' : 'X';

  for (const [a, b, c] of winningLines) {
    const lineValues = [board[a], board[b], board[c]];
    const playerCount = lineValues.filter(v => v === player).length;
    const opponentCount = lineValues.filter(v => v === opponent).length;
    const emptyCount = lineValues.filter(v => v === null).length;

    // Count lines where player can still win (no opponent pieces)
    if (opponentCount === 0 && (playerCount > 0 || emptyCount === 3)) {
      opportunities++;
    }
  }

  return opportunities;
};

// Check if removing a piece would create a fork opportunity for opponent
export const wouldCreateOpponentFork = (board: Board, position: number, player: Player): boolean => {
  const testBoard = [...board];
  testBoard[position] = null;
  const opponent = player === 'X' ? 'O' : 'X';

  let winningMoves = 0;
  for (let i = 0; i < 9; i++) {
    if (!testBoard[i]) {
      const forkTestBoard = [...testBoard];
      forkTestBoard[i] = opponent;
      if (canWinNextMove(forkTestBoard, opponent) !== -1) {
        winningMoves++;
      }
    }
  }

  return winningMoves >= 2;
};

// Get all positions of a player, sorted by strategic importance
export const getPlayerPositionsByImportance = (board: Board, player: Player): number[] => {
  const positions: number[] = [];
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === player) {
      positions.push(i);
    }
  }

  // Sort positions by strategic importance (corners > center > edges)
  return positions.sort((a, b) => {
    const getImportance = (pos: number) => {
      if ([0, 2, 6, 8].includes(pos)) return 3; // corners
      if (pos === 4) return 2; // center
      return 1; // edges
    };
    
    return getImportance(a) - getImportance(b); // Remove least important first
  });
};

// Helper function to get strategic value of a position
function getStrategicValue(position: number): number {
  if (position === 4) return 3; // center is most valuable
  if ([0, 2, 6, 8].includes(position)) return 2; // corners are valuable
  return 1; // edges are least valuable
}


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

export const removeOldestMoves = (board: Board, player: 'X' | 'O'): Board => {
  const newBoard = [...board];
  const opponent = player === 'X' ? 'O' : 'X';
  
  // Find all positions of the current player, sorted by importance
  const playerPositions = getPlayerPositionsByImportance(newBoard, player);
  
  // If player has less than 3 pieces, don't remove anything
  if (playerPositions.length < 3) {
    return newBoard;
  }
  
  let removedCount = 0;
  const maxRemove = Math.min(2, playerPositions.length - 1); // Never remove all pieces
  
  // Evaluate each position for removal safety
  const removalCandidates = playerPositions.map(pos => {
    const testBoard = [...newBoard];
    testBoard[pos] = null;
    
    // Check various factors
    const wouldAllowOpponentWin = canWinNextMove(testBoard, opponent) !== -1;
    const wouldPreventPlayerWin = canWinNextMove(newBoard, player) !== -1 && canWinNextMove(testBoard, player) === -1;
    const wouldCreateFork = wouldCreateOpponentFork(newBoard, pos, player);
    const playerOpportunitiesBefore = countWinningOpportunities(newBoard, player);
    const playerOpportunitiesAfter = countWinningOpportunities(testBoard, player);
    const wouldReduceOpportunities = playerOpportunitiesAfter < playerOpportunitiesBefore;
    
    return {
      position: pos,
      safe: !wouldAllowOpponentWin && !wouldPreventPlayerWin && !wouldCreateFork,
      opportunityLoss: playerOpportunitiesBefore - playerOpportunitiesAfter,
      strategicValue: getStrategicValue(pos)
    };
  });

  // Sort by safety first, then by opportunity loss, then by strategic value
  removalCandidates.sort((a, b) => {
    if (a.safe !== b.safe) return a.safe ? -1 : 1; // Safe moves first
    if (a.opportunityLoss !== b.opportunityLoss) return a.opportunityLoss - b.opportunityLoss; // Less opportunity loss first
    return a.strategicValue - b.strategicValue; // Remove less strategic pieces first
  });

  // Remove pieces starting with the safest candidates
  for (const candidate of removalCandidates) {
    if (removedCount >= maxRemove) break;
    
    if (candidate.safe || removedCount === 0) { // Always remove at least one if needed
      newBoard[candidate.position] = null;
      removedCount++;
    }
  }
  
  // If we couldn't remove enough pieces safely, remove the least strategic ones
  if (removedCount < maxRemove) {
    const remainingPositions = playerPositions.filter(pos => newBoard[pos] === player);
    for (let i = 0; i < remainingPositions.length && removedCount < maxRemove; i++) {
      newBoard[remainingPositions[i]] = null;
      removedCount++;
    }
  }
  
  return newBoard;
};

// Helper function to get strategic value of a position
function getStrategicValue(position: number): number {
  if (position === 4) return 3; // center is most valuable
  if ([0, 2, 6, 8].includes(position)) return 2; // corners are valuable
  return 1; // edges are least valuable
}

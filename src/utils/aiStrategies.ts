
import { Board, Player } from '@/types/gameTypes';

export interface AIMove {
  position: number;
  priority: number;
  reason: string;
}

export const evaluatePosition = (board: Board, player: Player): number => {
  const opponent = player === 'X' ? 'O' : 'X';
  let score = 0;

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const line of winningLines) {
    const [a, b, c] = line;
    const lineValues = [board[a], board[b], board[c]];
    
    const playerCount = lineValues.filter(v => v === player).length;
    const opponentCount = lineValues.filter(v => v === opponent).length;
    const emptyCount = lineValues.filter(v => v === null).length;

    if (playerCount === 3) score += 100;
    else if (playerCount === 2 && emptyCount === 1) score += 10;
    else if (playerCount === 1 && emptyCount === 2) score += 1;

    if (opponentCount === 3) score -= 100;
    else if (opponentCount === 2 && emptyCount === 1) score -= 10;
    else if (opponentCount === 1 && emptyCount === 2) score -= 1;
  }

  return score;
};

export const minimax = (board: Board, depth: number, isMaximizing: boolean, player: Player, maxDepth: number = 6): number => {
  const opponent = player === 'X' ? 'O' : 'X';
  const score = evaluatePosition(board, player);

  if (Math.abs(score) >= 100 || depth >= maxDepth) {
    return score;
  }

  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  
  if (availableSpots.length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const spot of availableSpots) {
      const newBoard = [...board];
      newBoard[spot] = player;
      const currentScore = minimax(newBoard, depth + 1, false, player, maxDepth);
      bestScore = Math.max(bestScore, currentScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const spot of availableSpots) {
      const newBoard = [...board];
      newBoard[spot] = opponent;
      const currentScore = minimax(newBoard, depth + 1, true, player, maxDepth);
      bestScore = Math.min(bestScore, currentScore);
    }
    return bestScore;
  }
};

export const getStrategicMoves = (board: Board, player: Player): AIMove[] => {
  const moves: AIMove[] = [];
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];

  for (const spot of availableSpots) {
    const testBoard = [...board];
    testBoard[spot] = player;
    
    const score = evaluatePosition(testBoard, player);
    const minimaxScore = minimax(testBoard, 0, false, player, 4);
    
    let priority = score + minimaxScore;
    let reason = 'Strategic move';

    // Center control bonus
    if (spot === 4) {
      priority += 5;
      reason = 'Center control';
    }

    // Corner preference
    if ([0, 2, 6, 8].includes(spot)) {
      priority += 3;
      reason = 'Corner control';
    }

    // Edge penalty
    if ([1, 3, 5, 7].includes(spot)) {
      priority -= 2;
    }

    moves.push({ position: spot, priority, reason });
  }

  return moves.sort((a, b) => b.priority - a.priority);
};

export const getTacticalMoves = (board: Board, player: Player): AIMove[] => {
  const opponent = player === 'X' ? 'O' : 'X';
  const moves: AIMove[] = [];

  // Check for winning moves
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (evaluatePosition(testBoard, player) >= 100) {
        moves.push({ position: i, priority: 1000, reason: 'Winning move' });
      }
    }
  }

  // Check for blocking moves
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = opponent;
      if (evaluatePosition(testBoard, opponent) >= 100) {
        moves.push({ position: i, priority: 900, reason: 'Block opponent win' });
      }
    }
  }

  // Check for fork opportunities
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      let winningMoves = 0;
      
      for (let j = 0; j < 9; j++) {
        if (!testBoard[j]) {
          const forkTestBoard = [...testBoard];
          forkTestBoard[j] = player;
          if (evaluatePosition(forkTestBoard, player) >= 100) {
            winningMoves++;
          }
        }
      }
      
      if (winningMoves >= 2) {
        moves.push({ position: i, priority: 800, reason: 'Create fork' });
      }
    }
  }

  // Check for blocking opponent forks
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = opponent;
      let winningMoves = 0;
      
      for (let j = 0; j < 9; j++) {
        if (!testBoard[j]) {
          const forkTestBoard = [...testBoard];
          forkTestBoard[j] = opponent;
          if (evaluatePosition(forkTestBoard, opponent) >= 100) {
            winningMoves++;
          }
        }
      }
      
      if (winningMoves >= 2) {
        moves.push({ position: i, priority: 700, reason: 'Block opponent fork' });
      }
    }
  }

  return moves.sort((a, b) => b.priority - a.priority);
};

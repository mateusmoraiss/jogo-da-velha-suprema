
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

    // Winning position
    if (playerCount === 3) score += 1000;
    // Two in a row with empty space
    else if (playerCount === 2 && emptyCount === 1) score += 100;
    // One in a row with two empty spaces
    else if (playerCount === 1 && emptyCount === 2) score += 10;
    // Three empty spaces (potential)
    else if (emptyCount === 3) score += 1;

    // Opponent threats
    if (opponentCount === 3) score -= 1000;
    else if (opponentCount === 2 && emptyCount === 1) score -= 100;
    else if (opponentCount === 1 && emptyCount === 2) score -= 10;
  }

  // Add positional bonuses
  if (board[4] === player) score += 30; // center control
  
  // Corner control
  const corners = [0, 2, 6, 8];
  const playerCorners = corners.filter(pos => board[pos] === player).length;
  score += playerCorners * 15;

  return score;
};

export const minimax = (board: Board, depth: number, isMaximizing: boolean, player: Player, maxDepth: number = 8): number => {
  const opponent = player === 'X' ? 'O' : 'X';
  const score = evaluatePosition(board, player);

  // Terminal conditions
  if (Math.abs(score) >= 1000 || depth >= maxDepth) {
    return score - (depth * (isMaximizing ? 1 : -1)); // Prefer faster wins
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
    
    const positionScore = evaluatePosition(testBoard, player);
    const minimaxScore = minimax(testBoard, 0, false, player, 6);
    
    let priority = positionScore + minimaxScore;
    let reason = 'Strategic move';

    // Position-based bonuses
    if (spot === 4) {
      priority += 20;
      reason = 'Center control';
    } else if ([0, 2, 6, 8].includes(spot)) {
      priority += 15;
      reason = 'Corner control';
    } else if ([1, 3, 5, 7].includes(spot)) {
      priority += 5;
      reason = 'Edge position';
    }

    // Pattern recognition bonuses
    const patternBonus = getPatternBonus(board, spot, player);
    priority += patternBonus.bonus;
    if (patternBonus.bonus > 0) reason = patternBonus.reason;

    moves.push({ position: spot, priority, reason });
  }

  return moves.sort((a, b) => b.priority - a.priority);
};

// Enhanced pattern recognition
function getPatternBonus(board: Board, position: number, player: Player): { bonus: number; reason: string } {
  const opponent = player === 'X' ? 'O' : 'X';
  let bonus = 0;
  let reason = 'Basic move';

  // Check for setup patterns
  const patterns = [
    // Fork setups
    { positions: [0, 8], center: 4, bonus: 25, reason: 'Diagonal fork setup' },
    { positions: [2, 6], center: 4, bonus: 25, reason: 'Diagonal fork setup' },
    { positions: [0, 2], center: 1, bonus: 20, reason: 'Top row setup' },
    { positions: [6, 8], center: 7, bonus: 20, reason: 'Bottom row setup' },
    { positions: [0, 6], center: 3, bonus: 20, reason: 'Left column setup' },
    { positions: [2, 8], center: 5, bonus: 20, reason: 'Right column setup' },
  ];

  for (const pattern of patterns) {
    if (position === pattern.center && 
        pattern.positions.every(pos => board[pos] === player) &&
        !board[pattern.center]) {
      bonus = Math.max(bonus, pattern.bonus);
      reason = pattern.reason;
    }
  }

  // Blocking opponent patterns
  for (const pattern of patterns) {
    if (position === pattern.center && 
        pattern.positions.every(pos => board[pos] === opponent) &&
        !board[pattern.center]) {
      bonus = Math.max(bonus, pattern.bonus - 5);
      reason = 'Block opponent ' + pattern.reason.toLowerCase();
    }
  }

  return { bonus, reason };
}

export const getTacticalMoves = (board: Board, player: Player): AIMove[] => {
  const opponent = player === 'X' ? 'O' : 'X';
  const moves: AIMove[] = [];

  // Priority 1: Winning moves
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      if (evaluatePosition(testBoard, player) >= 1000) {
        moves.push({ position: i, priority: 2000, reason: 'Winning move' });
      }
    }
  }

  // Priority 2: Block immediate opponent wins
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = opponent;
      if (evaluatePosition(testBoard, opponent) >= 1000) {
        moves.push({ position: i, priority: 1900, reason: 'Block opponent win' });
      }
    }
  }

  // Priority 3: Create multiple threats (forks)
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      let winningMoves = 0;
      
      for (let j = 0; j < 9; j++) {
        if (!testBoard[j]) {
          const forkTestBoard = [...testBoard];
          forkTestBoard[j] = player;
          if (evaluatePosition(forkTestBoard, player) >= 1000) {
            winningMoves++;
          }
        }
      }
      
      if (winningMoves >= 2) {
        moves.push({ position: i, priority: 1800, reason: 'Create double threat' });
      }
    }
  }

  // Priority 4: Block opponent forks
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = opponent;
      let winningMoves = 0;
      
      for (let j = 0; j < 9; j++) {
        if (!testBoard[j]) {
          const forkTestBoard = [...testBoard];
          forkTestBoard[j] = opponent;
          if (evaluatePosition(forkTestBoard, opponent) >= 1000) {
            winningMoves++;
          }
        }
      }
      
      if (winningMoves >= 2) {
        moves.push({ position: i, priority: 1700, reason: 'Block opponent double threat' });
      }
    }
  }

  // Priority 5: Setup moves (two in a row)
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const testBoard = [...board];
      testBoard[i] = player;
      const score = evaluatePosition(testBoard, player);
      if (score >= 100 && score < 1000) {
        moves.push({ position: i, priority: 1600 + score, reason: 'Setup threat' });
      }
    }
  }

  return moves.sort((a, b) => b.priority - a.priority);
};

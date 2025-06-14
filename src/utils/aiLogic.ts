
import { Board, DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { canWinNextMove } from '@/utils/gameLogic';
import { getStrategicMoves, getTacticalMoves, minimax } from '@/utils/aiStrategies';

export const getComputerMove = (board: Board, difficulty: DifficultyLevel): number => {
  const aiLevel = difficultySettings[difficulty].aiLevel;
  const player = 'O';
  
  // Get tactical moves (wins, blocks, forks)
  const tacticalMoves = getTacticalMoves(board, player);
  
  // Different AI behaviors based on difficulty
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, tacticalMoves, aiLevel);
    
    case 'medium':
      return getMediumMove(board, tacticalMoves, aiLevel);
    
    case 'hard':
      return getHardMove(board, tacticalMoves, aiLevel);
    
    case 'nightmare':
      return getNightmareMove(board, tacticalMoves, aiLevel);
    
    case 'insane':
      return getInsaneMove(board, tacticalMoves, aiLevel);
    
    case 'godlike':
      return getGodlikeMove(board, tacticalMoves, aiLevel);
    
    case 'armageddon':
      return getArmageddonMove(board, tacticalMoves, aiLevel);
    
    default:
      return getRandomMove(board);
  }
};

const getEasyMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Always try to win
  const winMove = tacticalMoves.find(move => move.priority >= 1000);
  if (winMove) return winMove.position;

  // Sometimes block (30% chance)
  if (Math.random() < aiLevel) {
    const blockMove = tacticalMoves.find(move => move.priority >= 900);
    if (blockMove) return blockMove.position;
  }

  // Random move otherwise
  return getRandomMove(board);
};

const getMediumMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Always try to win
  const winMove = tacticalMoves.find(move => move.priority >= 1000);
  if (winMove) return winMove.position;

  // Usually block (50% chance)
  if (Math.random() < aiLevel) {
    const blockMove = tacticalMoves.find(move => move.priority >= 900);
    if (blockMove) return blockMove.position;
  }

  // Basic strategic moves
  if (Math.random() < aiLevel) {
    const strategicMoves = getStrategicMoves(board, 'O');
    if (strategicMoves.length > 0) {
      return strategicMoves[0].position;
    }
  }

  return getRandomMove(board);
};

const getHardMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Always handle tactical moves
  if (tacticalMoves.length > 0 && Math.random() < aiLevel) {
    return tacticalMoves[0].position;
  }

  // Use strategic analysis
  const strategicMoves = getStrategicMoves(board, 'O');
  if (strategicMoves.length > 0) {
    // Sometimes pick suboptimal move (30% chance)
    if (Math.random() > aiLevel && strategicMoves.length > 1) {
      return strategicMoves[1].position;
    }
    return strategicMoves[0].position;
  }

  return getRandomMove(board);
};

const getNightmareMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Almost always handle all tactical situations
  if (tacticalMoves.length > 0) {
    // 15% chance to miss a tactical move (85% accuracy)
    if (Math.random() < aiLevel) {
      return tacticalMoves[0].position;
    }
  }

  // Advanced strategic play with minimax
  const strategicMoves = getStrategicMoves(board, 'O');
  if (strategicMoves.length > 0) {
    // Use minimax to evaluate deeper
    let bestMove = strategicMoves[0];
    let bestScore = -Infinity;

    for (const move of strategicMoves.slice(0, 3)) { // Check top 3 moves
      const testBoard = [...board];
      testBoard[move.position] = 'O';
      const score = minimax(testBoard, 0, false, 'O', 3);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove.position;
  }

  return getRandomMove(board);
};

const getInsaneMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Rarely miss tactical moves (5% miss rate)
  if (tacticalMoves.length > 0) {
    if (Math.random() < aiLevel) {
      return tacticalMoves[0].position;
    }
  }

  // Deep strategic analysis
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  let bestMove = availableSpots[0];
  let bestScore = -Infinity;

  for (const spot of availableSpots) {
    const testBoard = [...board];
    testBoard[spot] = 'O';
    const score = minimax(testBoard, 0, false, 'O', 5); // Deeper search
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = spot;
    }
  }

  // 5% chance to make suboptimal move
  if (Math.random() > aiLevel && availableSpots.length > 1) {
    const alternatives = availableSpots.filter(spot => spot !== bestMove);
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }

  return bestMove;
};

const getGodlikeMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Almost never miss tactical moves (2% miss rate)
  if (tacticalMoves.length > 0) {
    if (Math.random() < aiLevel) {
      return tacticalMoves[0].position;
    }
  }

  // Perfect strategic play
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  let bestMove = availableSpots[0];
  let bestScore = -Infinity;

  // Evaluate all possible moves with deep minimax
  for (const spot of availableSpots) {
    const testBoard = [...board];
    testBoard[spot] = 'O';
    const score = minimax(testBoard, 0, false, 'O', 6); // Very deep search
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = spot;
    }
  }

  // 2% chance to make mistake
  if (Math.random() > aiLevel && availableSpots.length > 1) {
    const alternatives = availableSpots.filter(spot => spot !== bestMove);
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }

  return bestMove;
};

const getArmageddonMove = (board: Board, tacticalMoves: any[], aiLevel: number): number => {
  // Near-perfect play - only makes mistakes after very long sequences
  const gameLength = board.filter(cell => cell !== null).length;
  const errorChance = Math.max(0, (1 - aiLevel) * Math.pow(0.95, gameLength)); // Error rate decreases with game length

  // Handle tactical moves with near-perfect accuracy
  if (tacticalMoves.length > 0) {
    if (Math.random() > errorChance) {
      return tacticalMoves[0].position;
    }
  }

  // Perform exhaustive analysis
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  const moveAnalysis: { position: number; score: number; }[] = [];

  // Analyze each move with maximum depth
  for (const spot of availableSpots) {
    const testBoard = [...board];
    testBoard[spot] = 'O';
    
    // Use maximum depth minimax
    const score = minimax(testBoard, 0, false, 'O', 8);
    
    // Add positional bonuses for perfect play
    let adjustedScore = score;
    
    // Center preference in early game
    if (spot === 4 && gameLength < 4) adjustedScore += 0.5;
    
    // Corner preference
    if ([0, 2, 6, 8].includes(spot)) adjustedScore += 0.3;
    
    moveAnalysis.push({ position: spot, score: adjustedScore });
  }

  // Sort by score and pick the best
  moveAnalysis.sort((a, b) => b.score - a.score);
  
  // Extremely rare mistakes (only after long games and with tiny probability)
  if (Math.random() < errorChance && moveAnalysis.length > 1) {
    // Even mistakes are strategic - pick second best move
    return moveAnalysis[1].position;
  }

  return moveAnalysis[0].position;
};

const getRandomMove = (board: Board): number => {
  const availableSpots = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  return availableSpots[Math.floor(Math.random() * availableSpots.length)];
};

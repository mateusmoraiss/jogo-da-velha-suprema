import { useState, useEffect, useCallback } from 'react';
import { DifficultyLevel } from '@/components/DifficultySelector';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface GameState {
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

export const difficultySettings = {
  easy: { time: 10, aiLevel: 0.3 },
  medium: { time: 7, aiLevel: 0.5 },
  hard: { time: 5, aiLevel: 0.7 },
  nightmare: { time: 3.5, aiLevel: 0.85 },
  insane: { time: 2, aiLevel: 0.95 },
  godlike: { time: 1.2, aiLevel: 0.98 },
  armageddon: { time: 0.6, aiLevel: 1.0 }
};

export const useInfiniteTicTacToe = (playerName: string, difficulty: DifficultyLevel = 'medium') => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isGameActive: true,
    playerScore: 0,
    computerScore: 0,
    moveHistory: [],
    moveCount: 0,
    timeLeft: difficultySettings[difficulty].time,
    difficulty,
    selectedPosition: 4 // Start at center
  });

  const checkWinner = useCallback((board: Board): Player => {
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
  }, []);

  const canWinNextMove = useCallback((board: Board, player: Player): number => {
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
  }, [checkWinner]);

  const getComputerMove = useCallback((board: Board): number => {
    const aiLevel = difficultySettings[gameState.difficulty].aiLevel;
    
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
  }, [canWinNextMove, gameState.difficulty]);

  const removeOldestMoves = useCallback((board: Board, player: 'X' | 'O'): Board => {
    const newBoard = [...board];
    let removedCount = 0;
    
    // Remove 2 oldest pieces of the current player
    for (let i = 0; i < 9 && removedCount < 2; i++) {
      if (newBoard[i] === player) {
        const testBoard = [...newBoard];
        testBoard[i] = null;
        
        // Check if removing this piece would allow opponent to win
        const opponent = player === 'X' ? 'O' : 'X';
        const wouldLose = canWinNextMove(testBoard, opponent) !== -1;
        
        if (!wouldLose) {
          newBoard[i] = null;
          removedCount++;
        }
      }
    }
    
    // If we couldn't remove 2 pieces safely, remove at least 1
    if (removedCount === 0) {
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === player) {
          newBoard[i] = null;
          break;
        }
      }
    }
    
    return newBoard;
  }, [canWinNextMove]);

  const makeMove = useCallback((index: number) => {
    setGameState(prevState => {
      if (!prevState.isGameActive || prevState.board[index] || prevState.winner) {
        return prevState;
      }

      let newBoard = [...prevState.board];
      let newMoveCount = prevState.moveCount + 1;
      
      // Check if board is full (all 9 positions filled)
      const filledCells = newBoard.filter(cell => cell !== null).length;
      if (filledCells >= 9) {
        // Remove 2 oldest moves of current player before placing new one
        newBoard = removeOldestMoves(newBoard, prevState.currentPlayer);
      }

      newBoard[index] = prevState.currentPlayer;
      
      const winner = checkWinner(newBoard);
      const newHistory = [...prevState.moveHistory];
      const playerDisplayName = prevState.currentPlayer === 'X' ? playerName : 'Computador';
      newHistory.push(`${playerDisplayName} jogou na posição ${index + 1}`);

      let newPlayerScore = prevState.playerScore;
      let newComputerScore = prevState.computerScore;
      
      if (winner === 'X') {
        newPlayerScore++;
      } else if (winner === 'O') {
        newComputerScore++;
      }

      return {
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
        winner,
        isGameActive: !winner,
        playerScore: newPlayerScore,
        computerScore: newComputerScore,
        moveHistory: newHistory,
        moveCount: newMoveCount,
        timeLeft: difficultySettings[prevState.difficulty].time
      };
    });
  }, [checkWinner, removeOldestMoves, playerName]);

  const updateSelectedPosition = useCallback((newPosition: number) => {
    setGameState(prev => ({
      ...prev,
      selectedPosition: newPosition
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.isGameActive && !gameState.winner && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 0.1
        }));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner]);

  // When time runs out, player loses the turn (no auto-move)
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.timeLeft <= 0 && gameState.isGameActive) {
      // Player loses turn, computer gets to play
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time
      }));
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive]);

  // Computer move effect
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(gameState.board);
        if (computerMoveIndex !== undefined) {
          makeMove(computerMoveIndex);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.isGameActive, gameState.winner, gameState.board, getComputerMove, makeMove]);

  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameActive: true,
      moveHistory: [],
      moveCount: 0,
      timeLeft: difficultySettings[prevState.difficulty].time,
      selectedPosition: 4
    }));
  }, []);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGameState(prevState => ({
      ...prevState,
      difficulty: newDifficulty,
      timeLeft: difficultySettings[newDifficulty].time,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isGameActive: true,
      moveHistory: [],
      moveCount: 0,
      selectedPosition: 4
    }));
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    isGameActive: gameState.isGameActive,
    playerScore: gameState.playerScore,
    computerScore: gameState.computerScore,
    moveHistory: gameState.moveHistory,
    timeLeft: gameState.timeLeft,
    difficulty: gameState.difficulty,
    selectedPosition: gameState.selectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
    updateSelectedPosition
  };
};

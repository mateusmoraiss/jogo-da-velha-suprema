
import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner, removeOldestMoves } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

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

  const makeMove = useCallback((index: number) => {
    setGameState(prevState => {
      if (!prevState.isGameActive || prevState.board[index] || prevState.winner) {
        return prevState;
      }

      let newBoard = [...prevState.board];
      let newMoveCount = prevState.moveCount + 1;
      
      // Check if board has 6 or more pieces (time to start removing)
      const filledCells = newBoard.filter(cell => cell !== null).length;
      if (filledCells >= 6) {
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
  }, [playerName]);

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
        const computerMoveIndex = getComputerMove(gameState.board, gameState.difficulty);
        if (computerMoveIndex !== undefined) {
          makeMove(computerMoveIndex);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.isGameActive, gameState.winner, gameState.board, gameState.difficulty, makeMove]);

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

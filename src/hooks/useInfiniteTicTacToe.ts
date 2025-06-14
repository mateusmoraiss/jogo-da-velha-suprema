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
      
      // Check if we need to remove old pieces (when board gets crowded)
      const filledCells = newBoard.filter(cell => cell !== null).length;
      
      // Start removing pieces when board has 6+ pieces, but be more strategic about it
      if (filledCells >= 6) {
        // Only remove if the current player has 3+ pieces
        const currentPlayerPieces = newBoard.filter(cell => cell === prevState.currentPlayer).length;
        if (currentPlayerPieces >= 3) {
          newBoard = removeOldestMoves(newBoard, prevState.currentPlayer);
        }
      }

      // Place new piece
      newBoard[index] = prevState.currentPlayer;
      
      // Check for winner after the move
      const winner = checkWinner(newBoard);
      
      // Update move history with more detailed information
      const newHistory = [...prevState.moveHistory];
      const playerDisplayName = prevState.currentPlayer === 'X' ? playerName : 'Computador';
      const moveDescription = `${playerDisplayName} jogou na posição ${index + 1}`;
      
      if (winner) {
        newHistory.push(`${moveDescription} - VITÓRIA!`);
      } else {
        newHistory.push(moveDescription);
      }

      // Keep only last 10 moves in history
      if (newHistory.length > 10) {
        newHistory.splice(0, newHistory.length - 10);
      }

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

  // Enhanced timer effect with more precise timing
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.isGameActive && !gameState.winner && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 0.1)
        }));
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner]);

  // Time out effect - player loses turn when time runs out
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.timeLeft <= 0 && gameState.isGameActive && !gameState.winner) {
      const newHistory = [...gameState.moveHistory, `${playerName} perdeu o turno - tempo esgotado!`];
      
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time,
        moveHistory: newHistory.slice(-10) // Keep only last 10 moves
      }));
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner, playerName]);

  // Enhanced computer move effect with better timing and move selection
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      // Variable delay based on difficulty - harder difficulties "think" longer
      const thinkingTime = gameState.difficulty === 'easy' ? 500 : 
                          gameState.difficulty === 'medium' ? 750 :
                          gameState.difficulty === 'hard' ? 1000 :
                          gameState.difficulty === 'nightmare' ? 1250 :
                          gameState.difficulty === 'insane' ? 1500 :
                          gameState.difficulty === 'godlike' ? 1750 : 2000;

      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(gameState.board, gameState.difficulty);
        if (computerMoveIndex !== undefined && computerMoveIndex >= 0 && computerMoveIndex < 9) {
          makeMove(computerMoveIndex);
        }
      }, thinkingTime);

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

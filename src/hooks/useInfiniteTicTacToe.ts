import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel, Player } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner } from '@/utils/gameLogic';
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
    selectedPosition: 4
  });
  const [pieceOrder, setPieceOrder] = useState<{ position: number; player: Player }[]>([]);

  const makeMove = useCallback((index: number) => {
    if (!gameState.isGameActive || gameState.board[index] || gameState.winner) {
      return;
    }

    let newBoard = [...gameState.board];
    let currentPieceOrder = [...pieceOrder];
    const currentPlayer = gameState.currentPlayer;
    const opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // 1. Adiciona a nova peça ao tabuleiro e ao histórico de ordem
    newBoard[index] = currentPlayer;
    currentPieceOrder.push({ position: index, player: currentPlayer });

    // 2. Verifica se o jogador atual agora tem 4 ou mais peças
    const playerPieces = currentPieceOrder.filter(p => p.player === currentPlayer);
    if (playerPieces.length >= 4) {
      // Identifica as 2 peças mais antigas do jogador atual
      const playerPiecesToRemove = playerPieces.slice(0, 2);
      
      // Identifica as 2 peças mais antigas do oponente
      const opponentPieces = currentPieceOrder.filter(p => p.player === opponentPlayer);
      const opponentPiecesToRemove = opponentPieces.slice(0, 2);

      // Combina todas as peças a serem removidas
      const allPiecesToRemove = [...playerPiecesToRemove, ...opponentPiecesToRemove];
      const positionsToRemove = allPiecesToRemove.map(p => p.position);

      // 3. Remove as peças do tabuleiro
      positionsToRemove.forEach(pos => {
        newBoard[pos] = null;
      });
      
      // 4. Atualiza o histórico de ordem das peças
      currentPieceOrder = currentPieceOrder.filter(p => !positionsToRemove.includes(p.position));
    }
    
    // Verifica o vencedor com o novo estado do tabuleiro
    const winner = checkWinner(newBoard);
    
    // Atualiza o histórico de jogadas
    const newHistory = [...gameState.moveHistory];
    const playerDisplayName = currentPlayer === 'X' ? playerName : 'Computador';
    const moveDescription = `${playerDisplayName} jogou na posição ${index + 1}`;
    
    if (winner) {
      newHistory.push(`${moveDescription} - VITÓRIA!`);
    } else {
      newHistory.push(moveDescription);
    }

    if (newHistory.length > 10) {
      newHistory.splice(0, newHistory.length - 10);
    }

    // Atualiza o placar
    let newPlayerScore = gameState.playerScore;
    let newComputerScore = gameState.computerScore;
    if (winner === 'X') {
      newPlayerScore++;
    } else if (winner === 'O') {
      newComputerScore++;
    }

    // Atualiza os estados de uma vez
    setPieceOrder(currentPieceOrder);
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isGameActive: !winner,
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      moveHistory: newHistory,
      moveCount: prevState.moveCount + 1,
      timeLeft: difficultySettings[prevState.difficulty].time,
    }));
  }, [gameState, pieceOrder, playerName]);

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

  // Computer move effect - plays instantly
  useEffect(() => {
    if (gameState.currentPlayer === 'O' && gameState.isGameActive && !gameState.winner) {
      const computerMoveIndex = getComputerMove(gameState.board, gameState.difficulty);
      if (computerMoveIndex !== undefined && computerMoveIndex >= 0 && computerMoveIndex < 9) {
        makeMove(computerMoveIndex);
      }
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
    setPieceOrder([]);
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
    setPieceOrder([]);
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

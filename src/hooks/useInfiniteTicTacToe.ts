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
    moveCount: 0,
    timeLeft: difficultySettings[difficulty].time,
    difficulty,
    selectedPosition: 4,
    survivedMoves: 0,
    totalMoveTime: 0,
    moveTimes: [],
    averageAPM: 0
  });
  const [pieceOrder, setPieceOrder] = useState<{ position: number; player: Player }[]>([]);
  const [removalCycle, setRemovalCycle] = useState<3 | 4>(3);
  const [moveStartTime, setMoveStartTime] = useState<number>(Date.now());

  const calculateAPM = useCallback((moveTimes: number[]) => {
    if (moveTimes.length === 0) return 0;
    const totalSeconds = moveTimes.reduce((sum, time) => sum + time, 0) / 1000;
    const minutes = totalSeconds / 60;
    return minutes > 0 ? Math.round(moveTimes.length / minutes) : 0;
  }, []);

  const makeMove = useCallback((index: number) => {
    if (!gameState.isGameActive || gameState.board[index] || gameState.winner) {
      return;
    }

    const moveEndTime = Date.now();
    const moveTime = moveEndTime - moveStartTime;
    const newMoveTimes = [...gameState.moveTimes, moveTime];
    const newTotalMoveTime = gameState.totalMoveTime + moveTime;

    let newBoard = [...gameState.board];
    let currentPieceOrder = [...pieceOrder];
    const currentPlayer = gameState.currentPlayer;

    // 1. Adiciona a nova peça ao tabuleiro e ao histórico de ordem
    newBoard[index] = currentPlayer;
    currentPieceOrder.push({ position: index, player: currentPlayer });

    // 2. Verifica se o tabuleiro está cheio para remover as peças mais antigas
    const isBoardFull = !newBoard.includes(null);

    if (isBoardFull) {
      // Identifica as peças mais antigas de cada jogador baseado no ciclo atual
      const playerXPieces = currentPieceOrder.filter(p => p.player === 'X');
      const piecesToRemoveX = playerXPieces.slice(0, removalCycle);
      
      const playerOPieces = currentPieceOrder.filter(p => p.player === 'O');
      const piecesToRemoveO = playerOPieces.slice(0, removalCycle);

      // Combina todas as peças a serem removidas
      const allPiecesToRemove = [...piecesToRemoveX, ...piecesToRemoveO];
      const positionsToRemove = allPiecesToRemove.map(p => p.position);

      // 3. Remove as peças do tabuleiro
      positionsToRemove.forEach(pos => {
        newBoard[pos] = null;
      });
      
      // 4. Atualiza o histórico de ordem das peças
      currentPieceOrder = currentPieceOrder.filter(p => !positionsToRemove.includes(p.position));

      // 5. Alterna o ciclo de remoção para a próxima vez
      setRemovalCycle(prev => prev === 3 ? 4 : 3);
    }
    
    const winner = checkWinner(newBoard);

    let newPlayerScore = gameState.playerScore;
    let newComputerScore = gameState.computerScore;
    let newSurvivedMoves = gameState.survivedMoves;
    
    if (winner === 'X') {
      newPlayerScore++;
    } else if (winner === 'O') {
      newComputerScore++;
    } else if (currentPlayer === 'X') {
      // Jogador sobreviveu mais uma jogada
      newSurvivedMoves++;
    }

    const newAverageAPM = calculateAPM(newMoveTimes);

    setPieceOrder(currentPieceOrder);
    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isGameActive: !winner,
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      moveCount: prevState.moveCount + 1,
      timeLeft: difficultySettings[prevState.difficulty].time,
      survivedMoves: newSurvivedMoves,
      totalMoveTime: newTotalMoveTime,
      moveTimes: newMoveTimes,
      averageAPM: newAverageAPM
    }));
    
    // Reset timer for next move
    setMoveStartTime(Date.now());
  }, [gameState, pieceOrder, removalCycle, moveStartTime, calculateAPM]);

  const updateSelectedPosition = useCallback((newPosition: number) => {
    setGameState(prev => ({
      ...prev,
      selectedPosition: newPosition
    }));
  }, []);

  // Reset move timer when it's player's turn
  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.isGameActive && !gameState.winner) {
      setMoveStartTime(Date.now());
    }
  }, [gameState.currentPlayer, gameState.isGameActive, gameState.winner]);

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

  useEffect(() => {
    if (gameState.currentPlayer === 'X' && gameState.timeLeft <= 0 && gameState.isGameActive && !gameState.winner) {
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time
      }));
    }
  }, [gameState.timeLeft, gameState.currentPlayer, gameState.isGameActive, gameState.winner]);

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
      moveCount: 0,
      timeLeft: difficultySettings[prevState.difficulty].time,
      selectedPosition: 4,
      survivedMoves: 0,
      totalMoveTime: 0,
      moveTimes: [],
      averageAPM: 0
    }));
    setPieceOrder([]);
    setRemovalCycle(3);
    setMoveStartTime(Date.now());
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
      moveCount: 0,
      selectedPosition: 4,
      survivedMoves: 0,
      totalMoveTime: 0,
      moveTimes: [],
      averageAPM: 0
    }));
    setPieceOrder([]);
    setRemovalCycle(3);
    setMoveStartTime(Date.now());
  }, []);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    isGameActive: gameState.isGameActive,
    playerScore: gameState.playerScore,
    computerScore: gameState.computerScore,
    timeLeft: gameState.timeLeft,
    difficulty: gameState.difficulty,
    selectedPosition: gameState.selectedPosition,
    survivedMoves: gameState.survivedMoves,
    averageAPM: gameState.averageAPM,
    averageMoveTime: gameState.moveTimes.length > 0 ? gameState.totalMoveTime / gameState.moveTimes.length : 0,
    makeMove,
    resetGame,
    changeDifficulty,
    updateSelectedPosition
  };
};

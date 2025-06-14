
import { useState, useEffect, useCallback } from 'react';
import { GameState, DifficultyLevel, Player, Board } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner, removeOldestMoves } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

const createInitialState = (difficulty: DifficultyLevel): GameState => ({
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
  selectedPosition: 4,
});

export const useDualTicTacToe = (playerName: string, difficulty: DifficultyLevel) => {
  const [game1, setGame1] = useState<GameState>(() => createInitialState(difficulty));
  const [game2, setGame2] = useState<GameState>(() => createInitialState(difficulty));
  const [sharedSelectedPosition, setSharedSelectedPosition] = useState(4);
  const [activeBoard, setActiveBoard] = useState<1 | 2>(1); // Which board the player should play on

  // Função auxiliar para encontrar o próximo tabuleiro ativo para o jogador X
  function getNextActiveBoard(current: 1 | 2, g1: GameState, g2: GameState): 1 | 2 | null {
    if ((current === 1 && g2.isGameActive) || (!g1.isGameActive && g2.isGameActive)) return 2;
    if ((current === 2 && g1.isGameActive) || (!g2.isGameActive && g1.isGameActive)) return 1;
    return null; // Ambos encerrados
  }
  
  // Faz a jogada do player no tabuleiro ativo, e alterna para outro tabuleiro ativo se houver.
  const makeMove = useCallback((boardIndex: 1 | 2, cellIndex: number) => {
    // O jogador só pode jogar no tabuleiro ativo e ativo
    const g1 = game1;
    const g2 = game2;
    if (boardIndex === 1 && !(activeBoard === 1 && g1.isGameActive)) return;
    if (boardIndex === 2 && !(activeBoard === 2 && g2.isGameActive)) return;
    const game = boardIndex === 1 ? g1 : g2;
    const setGame = boardIndex === 1 ? setGame1 : setGame2;

    // Bloqueia jogada inválida
    if (!game.isGameActive || game.board[cellIndex] || game.winner || game.currentPlayer !== 'X') return;

    setGame(prevState => {
      let newBoard = [...prevState.board];
      let newMoveCount = prevState.moveCount + 1;
      const filledCells = newBoard.filter(cell => cell !== null).length;
      if (filledCells >= 6) {
        newBoard = removeOldestMoves(newBoard, 'X');
      }
      newBoard[cellIndex] = 'X';
      const winner = checkWinner(newBoard);
      const newHistory = [...prevState.moveHistory, `${playerName} jogou na posição ${cellIndex + 1}`];
      let newPlayerScore = prevState.playerScore;
      if (winner === 'X') newPlayerScore++;
      return {
        ...prevState,
        board: newBoard,
        winner,
        isGameActive: !winner,
        playerScore: newPlayerScore,
        moveHistory: newHistory,
        moveCount: newMoveCount,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prevState.difficulty].time,
      };
    });

    // Seleciona próximo tabuleiro ativo para o jogador X, se existir
    const nextBoard = getNextActiveBoard(boardIndex, 
      boardIndex === 1 ? { ...g1, isGameActive: false } : g1, // Marcar o jogado agora como inativo se foi terminado
      boardIndex === 2 ? { ...g2, isGameActive: false } : g2
    );
    if (nextBoard) setActiveBoard(nextBoard);

  }, [playerName, game1, game2, activeBoard]);
  

  // Efeito para jogada do computador no board 1
  useEffect(() => {
    if (game1.currentPlayer === 'O' && game1.isGameActive && !game1.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(game1.board, game1.difficulty);
        if (computerMoveIndex !== undefined) {
          setGame1(prevState => {
            let newBoard = [...prevState.board];
            const filledCells = newBoard.filter(cell => cell !== null).length;
            if (filledCells >= 6) {
              newBoard = removeOldestMoves(newBoard, 'O');
            }
            newBoard[computerMoveIndex] = 'O';
            const winner = checkWinner(newBoard);
            let newComputerScore = prevState.computerScore;
            if (winner === 'O') newComputerScore++;
            
            return {
              ...prevState,
              board: newBoard,
              winner,
              isGameActive: !winner,
              computerScore: newComputerScore,
              moveHistory: [...prevState.moveHistory, `Computador jogou na posição ${computerMoveIndex + 1}`],
              currentPlayer: 'X', // Troca para o X, mas cuidado com board ativo
            };
          });
          // Após jogada do computador, ativa o outro tabuleiro se for possível
          setTimeout(() => {
            if (game2.isGameActive && activeBoard !== 2) setActiveBoard(2);
          }, 300);
        }
      }, 450); // Mais rápido para dual
      return () => clearTimeout(timer);
    }
  }, [game1.currentPlayer, game1.isGameActive, game1.winner, game1.board, game1.difficulty, activeBoard, game2.isGameActive]);

  // Efeito para jogada do computador no board 2
  useEffect(() => {
    if (game2.currentPlayer === 'O' && game2.isGameActive && !game2.winner) {
      const timer = setTimeout(() => {
        const computerMoveIndex = getComputerMove(game2.board, game2.difficulty);
        if (computerMoveIndex !== undefined) {
          setGame2(prevState => {
            let newBoard = [...prevState.board];
            const filledCells = newBoard.filter(cell => cell !== null).length;
            if (filledCells >= 6) {
              newBoard = removeOldestMoves(newBoard, 'O');
            }
            newBoard[computerMoveIndex] = 'O';
            const winner = checkWinner(newBoard);
            let newComputerScore = prevState.computerScore;
            if (winner === 'O') newComputerScore++;
            
            return {
              ...prevState,
              board: newBoard,
              winner,
              isGameActive: !winner,
              computerScore: newComputerScore,
              moveHistory: [...prevState.moveHistory, `Computador jogou na posição ${computerMoveIndex + 1}`],
              currentPlayer: 'X', // Troca para o X, mas cuidado com board ativo
            };
          });
          // Após jogada do computador, ativa o outro tabuleiro se for possível
          setTimeout(() => {
            if (game1.isGameActive && activeBoard !== 1) setActiveBoard(1);
          }, 300);
        }
      }, 450); // Mais rápido para dual
      return () => clearTimeout(timer);
    }
  }, [game2.currentPlayer, game2.isGameActive, game2.winner, game2.board, game2.difficulty, activeBoard, game1.isGameActive]);

  // Timer só para o board ativo e player X
  useEffect(() => {
    const activeGame = activeBoard === 1 ? game1 : game2;
    const setActiveGame = activeBoard === 1 ? setGame1 : setGame2;

    if (activeGame.currentPlayer === 'X' && activeGame.isGameActive && !activeGame.winner && activeGame.timeLeft > 0) {
      const timer = setTimeout(() => {
        setActiveGame(prev => ({ ...prev, timeLeft: prev.timeLeft - 0.1 }));
      }, 100);
      return () => clearTimeout(timer);
    } else if (activeGame.currentPlayer === 'X' && activeGame.isGameActive && activeGame.timeLeft <= 0) {
      // Acabou o tempo, passa vez pro computador apenas nesse board
      setActiveGame(prev => ({
        ...prev,
        currentPlayer: 'O',
        timeLeft: difficultySettings[prev.difficulty].time
      }));
    }
  }, [game1, game2, activeBoard]);
  
  // Mantém posição selecionada no tabuleiro ativo e válido
  useEffect(() => {
    // Se mudar para um board inativo, tenta mudar para o ativo
    if (activeBoard === 1 && !game1.isGameActive && game2.isGameActive) {
      setActiveBoard(2);
    } else if (activeBoard === 2 && !game2.isGameActive && game1.isGameActive) {
      setActiveBoard(1);
    }
  }, [game1.isGameActive, game2.isGameActive, activeBoard]);

  const resetGame = useCallback(() => {
    setGame1(createInitialState(difficulty));
    setGame2(createInitialState(difficulty));
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGame1(createInitialState(newDifficulty));
    setGame2(createInitialState(newDifficulty));
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, []);

  return {
    game1,
    game2,
    activeBoard,
    sharedSelectedPosition,
    updateSelectedPosition: setSharedSelectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
  };
};

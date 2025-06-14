
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, DifficultyLevel } from '@/types/gameTypes';
import { difficultySettings } from '@/constants/difficultySettings';
import { checkWinner, removeOldestMoves } from '@/utils/gameLogic';
import { getComputerMove } from '@/utils/aiLogic';

const createInitialGameState = (difficulty: DifficultyLevel): GameState => ({
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
  // Duas instâncias, cada uma independente
  const [games, setGames] = useState<[GameState, GameState]>(() => [
    createInitialGameState(difficulty),
    createInitialGameState(difficulty),
  ]);
  // Qual tabuleiro está ativo para o jogador (1 ou 2)
  const [activeBoard, setActiveBoard] = useState<1 | 2>(1);
  // Posição selecionada é compartilhada só pelo board ativo
  const [sharedSelectedPosition, setSharedSelectedPosition] = useState(4);

  // Timer ref para garantir que só um timer atue a cada vez
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Próximo tabuleiro que ainda esteja ativo e aguarde o jogador
  const getNextActiveBoard = useCallback(
    (exclude?: number): 1 | 2 | null => {
      // Procura tabuleiro ativo (isGameActive=true) com currentPlayer='X'
      for (let i = 0; i < 2; i++) {
        if ((exclude == null || exclude !== i + 1) && games[i].isGameActive && games[i].currentPlayer === 'X') {
          return (i + 1) as 1 | 2;
        }
      }
      // Se não houver nenhum board em que seja a vez do X e esteja ativo
      for (let i = 0; i < 2; i++) {
        if ((exclude == null || exclude !== i + 1) && games[i].isGameActive) {
          return (i + 1) as 1 | 2;
        }
      }
      return null;
    },
    [games]
  );

  // Jogada do jogador humano sempre no tabuleiro ativo
  const makeMove = useCallback(
    (boardIndex: 1 | 2, cellIndex: number) => {
      setGames(prevGames => {
        const idx = boardIndex - 1;
        const game = prevGames[idx];
        if (!game.isGameActive || game.currentPlayer !== 'X' || game.board[cellIndex] || game.winner) return prevGames;

        let newBoard = [...game.board];
        if (newBoard.filter(cell => cell !== null).length >= 6) {
          newBoard = removeOldestMoves(newBoard, 'X');
        }
        newBoard[cellIndex] = 'X';
        const winner = checkWinner(newBoard);
        const playerScore = winner === 'X' ? game.playerScore + 1 : game.playerScore;

        const updatedGame: GameState = {
          ...game,
          board: newBoard,
          moveCount: game.moveCount + 1,
          winner,
          isGameActive: !winner,
          playerScore,
          moveHistory: [...game.moveHistory, `${playerName} jogou na posição ${cellIndex + 1}`],
          currentPlayer: winner ? 'X' : 'O', // trava para X se venceu (fim), senão passa para O
          timeLeft: difficultySettings[game.difficulty].time,
        };

        const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
        newGames[idx] = updatedGame;
        return newGames;
      });

      // Após jogada, mudar pro outro tabuleiro se ele estiver disponível para o X jogar, senão continua, senão acabou
      // Atualizado no useEffect abaixo após render
    },
    [playerName]
  );

  // Jogada do computador, chamada por effect quando for vez do O em qualquer tabuleiro
  const doComputerMove = useCallback(
    (boardIdx: 0 | 1) => {
      setGames(prevGames => {
        const game = prevGames[boardIdx];
        if (!game.isGameActive || game.currentPlayer !== 'O' || game.winner) return prevGames;

        const moveIndex = getComputerMove(game.board, game.difficulty);
        let newBoard = [...game.board];
        if (newBoard.filter(cell => cell !== null).length >= 6) {
          newBoard = removeOldestMoves(newBoard, 'O');
        }
        newBoard[moveIndex] = 'O';
        const winner = checkWinner(newBoard);
        const computerScore = winner === 'O' ? game.computerScore + 1 : game.computerScore;

        const updatedGame: GameState = {
          ...game,
          board: newBoard,
          moveCount: game.moveCount + 1,
          winner,
          isGameActive: !winner,
          computerScore,
          moveHistory: [...game.moveHistory, `Computador jogou na posição ${moveIndex + 1}`],
          currentPlayer: winner ? 'O' : 'X',
          timeLeft: difficultySettings[game.difficulty].time,
        };

        const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
        newGames[boardIdx] = updatedGame;
        return newGames;
      });
    },
    []
  );

  // Effect: Detecta se é vez do computador em algum tabuleiro — executa a jogada se necessário
  useEffect(() => {
    // Se algum tabuleiro ativo está esperando o computador (currentPlayer==='O' e isGameActive)
    for (let i = 0; i < 2; i++) {
      if (games[i].isGameActive && games[i].currentPlayer === 'O' && !games[i].winner) {
        const moveTimeout = setTimeout(() => {
          doComputerMove(i as 0 | 1);
        }, 450);
        return () => clearTimeout(moveTimeout);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games, doComputerMove]);

  // Effect: Gerencia o timer de X apenas no tabuleiro ativo e na vez do X
  useEffect(() => {
    // Descubra o board atualmente ativo para X, e se está ativo e aguardando X, decrementa timer
    const idx = activeBoard - 1;
    if (
      games[idx].isGameActive &&
      games[idx].currentPlayer === 'X' &&
      !games[idx].winner &&
      games[idx].timeLeft > 0
    ) {
      timerRef.current && clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setGames((prevGames) => {
          const g = prevGames[idx];
          if (!g.isGameActive || g.currentPlayer !== 'X') return prevGames;
          const updatedGame = {
            ...g,
            timeLeft: Math.max(0, g.timeLeft - 0.1)
          };
          const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
          newGames[idx] = updatedGame;
          return newGames;
        });
      }, 100);
      return () => timerRef.current && clearTimeout(timerRef.current);
    }
    // Se acabou o tempo, passar a vez para computador
    if (
      games[idx].isGameActive &&
      games[idx].currentPlayer === 'X' &&
      !games[idx].winner &&
      games[idx].timeLeft <= 0
    ) {
      setGames((prevGames) => {
        const g = prevGames[idx];
        if (!g.isGameActive || g.currentPlayer !== 'X') return prevGames;
        const updatedGame = {
          ...g,
          currentPlayer: 'O',
          timeLeft: difficultySettings[g.difficulty].time
        };
        const newGames: [GameState, GameState] = [...prevGames] as [GameState, GameState];
        newGames[idx] = updatedGame;
        return newGames;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBoard, games]);

  // Effect: Quando qualquer game termina ou turno muda, decide qual deve ser o próximo tabuleiro ativo
  useEffect(() => {
    // Se o board ativo acabou ou mudou de vez, procure outro board ativo para X, senão mantém
    let nextBoard: 1 | 2 | null = null;

    // Só troca se o game atual não pode jogar (venceu/empatou/ou é O)
    const idx = activeBoard - 1;
    if (
      !games[idx].isGameActive ||
      games[idx].currentPlayer !== 'X' ||
      games[idx].winner
    ) {
      nextBoard = getNextActiveBoard(activeBoard);
      if (nextBoard) setActiveBoard(nextBoard);
    }
    // Se ambos acabaram, não faz nada, interface cuida
  }, [games, activeBoard, getNextActiveBoard]);

  // Reset e troca de dificuldade
  const resetGame = useCallback(() => {
    setGames([
      createInitialGameState(difficulty),
      createInitialGameState(difficulty),
    ]);
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, [difficulty]);

  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setGames([
      createInitialGameState(newDifficulty),
      createInitialGameState(newDifficulty),
    ]);
    setActiveBoard(1);
    setSharedSelectedPosition(4);
  }, []);

  return {
    game1: games[0],
    game2: games[1],
    activeBoard,
    sharedSelectedPosition,
    updateSelectedPosition: setSharedSelectedPosition,
    makeMove,
    resetGame,
    changeDifficulty,
  };
};

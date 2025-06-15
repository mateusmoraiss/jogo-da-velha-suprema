import { useState } from "react";
import TicTacToeGame from "@/components/TicTacToeGame";
import PlayerNameDialog from "@/components/PlayerNameDialog";
import GameOptions from "@/components/GameOptions";
import DifficultySelector from "@/components/DifficultySelector";
import Tutorial from "@/components/Tutorial";
import Credits from "@/components/Credits";
import { DifficultyLevel, ConfirmKey } from "@/types/gameTypes";
import { playClickSound } from "@/utils/soundUtils";

type GameStep = 'menu' | 'options' | 'difficulty' | 'playing' | 'tutorial' | 'credits';

const Index = () => {
  const [step, setStep] = useState<GameStep>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [confirmKey, setConfirmKey] = useState<ConfirmKey>('space');
  const [customKey, setCustomKey] = useState<string>('');
  const [previousStep, setPreviousStep] = useState<GameStep>('menu');

  const handleStart = () => {
    playClickSound();
    setStep('difficulty');
  };

  const handleOptions = () => {
    playClickSound();
    setPreviousStep(step);
    setStep('options');
  };

  const handleDifficultySelect = (selectedDifficulty: DifficultyLevel) => {
    playClickSound();
    setDifficulty(selectedDifficulty);
    setStep('playing');
  };

  const handleShowTutorial = () => {
    playClickSound();
    setPreviousStep(step);
    setStep('tutorial');
  };

  const handleShowCredits = () => {
    playClickSound();
    setPreviousStep(step);
    setStep('credits');
  };

  const handleCloseTutorial = () => {
    playClickSound();
    setStep(previousStep);
  }

  const handleCloseCredits = () => {
    playClickSound();
    setStep(previousStep);
  }

  const handleOptionsBack = () => {
    playClickSound();
    setStep(previousStep);
  }

  const handleOptionsSave = () => {
    playClickSound();
    setStep(previousStep);
  }

  const onBackToMenu = () => {
    playClickSound();
    setStep('menu');
  };

  const onDifficultyChange = () => {
    playClickSound();
    setStep('difficulty');
  };

  const renderStep = () => {
    switch (step) {
      case 'menu':
        return <PlayerNameDialog 
          onStart={handleStart}
          onOptions={handleOptions}
          onTutorial={handleShowTutorial} 
          onCredits={handleShowCredits} 
        />;
      case 'options':
        return <GameOptions
          confirmKey={confirmKey}
          customKey={customKey}
          onConfirmKeyChange={setConfirmKey}
          onCustomKeyChange={setCustomKey}
          onBack={handleOptionsBack}
          onSave={handleOptionsSave}
        />;
      case 'difficulty':
        return <DifficultySelector 
          onSelect={handleDifficultySelect} 
          onBack={() => setStep('menu')} 
          onTutorial={handleShowTutorial} 
        />;
      case 'playing':
        return <TicTacToeGame 
          playerName="Jogador"
          difficulty={difficulty}
          confirmKey={confirmKey}
          customKey={customKey}
          onDifficultyChange={onDifficultyChange}
          onBackToMenu={onBackToMenu}
        />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      case 'credits':
        return <Credits onClose={handleCloseCredits} />;
      default:
        return <PlayerNameDialog 
          onStart={handleStart}
          onOptions={handleOptions}
          onTutorial={handleShowTutorial} 
          onCredits={handleShowCredits} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default Index;

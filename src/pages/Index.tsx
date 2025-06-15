
import { useState } from "react";
import TicTacToeGame from "@/components/TicTacToeGame";
import PlayerNameDialog from "@/components/PlayerNameDialog";
import GameOptions from "@/components/GameOptions";
import DifficultySelector from "@/components/DifficultySelector";
import Tutorial from "@/components/Tutorial";
import Credits from "@/components/Credits";
import { DifficultyLevel, ConfirmKey } from "@/types/gameTypes";

type GameStep = 'menu' | 'options' | 'difficulty' | 'playing' | 'tutorial' | 'credits';

const Index = () => {
  const [step, setStep] = useState<GameStep>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [confirmKey, setConfirmKey] = useState<ConfirmKey>('space');
  const [previousStep, setPreviousStep] = useState<GameStep>('menu');

  const handleStart = () => {
    setStep('difficulty');
  };

  const handleOptions = () => {
    setPreviousStep(step);
    setStep('options');
  };

  const handleDifficultySelect = (selectedDifficulty: DifficultyLevel) => {
    setDifficulty(selectedDifficulty);
    setStep('playing');
  };

  const handleShowTutorial = () => {
    setPreviousStep(step);
    setStep('tutorial');
  };

  const handleShowCredits = () => {
    setPreviousStep(step);
    setStep('credits');
  };

  const handleCloseTutorial = () => {
    setStep(previousStep);
  }

  const handleCloseCredits = () => {
    setStep(previousStep);
  }

  const handleOptionsBack = () => {
    setStep(previousStep);
  }

  const handleOptionsSave = () => {
    setStep(previousStep);
  }

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
          onConfirmKeyChange={setConfirmKey}
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
          onDifficultyChange={() => setStep('difficulty')}
          onNameChange={() => setStep('menu')}
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

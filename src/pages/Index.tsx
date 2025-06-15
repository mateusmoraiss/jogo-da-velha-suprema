
import { useState } from "react";
import TicTacToeGame from "@/components/TicTacToeGame";
import PlayerNameDialog from "@/components/PlayerNameDialog";
import DifficultySelector from "@/components/DifficultySelector";
import Tutorial from "@/components/Tutorial";
import Credits from "@/components/Credits";
import { DifficultyLevel, ConfirmKey } from "@/types/gameTypes";

type GameStep = 'name' | 'difficulty' | 'playing' | 'tutorial' | 'credits';

const Index = () => {
  const [step, setStep] = useState<GameStep>('name');
  const [playerName, setPlayerName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [confirmKey, setConfirmKey] = useState<ConfirmKey>('space');
  const [previousStep, setPreviousStep] = useState<GameStep>('name');

  const handleNameSubmit = (name: string, selectedConfirmKey: ConfirmKey) => {
    setPlayerName(name);
    setConfirmKey(selectedConfirmKey);
    setStep('difficulty');
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

  const renderStep = () => {
    switch (step) {
      case 'name':
        return <PlayerNameDialog 
          onSubmit={handleNameSubmit} 
          onTutorial={handleShowTutorial} 
          onCredits={handleShowCredits} 
        />;
      case 'difficulty':
        return <DifficultySelector 
          onSelect={handleDifficultySelect} 
          onBack={() => setStep('name')} 
          onTutorial={handleShowTutorial} 
        />;
      case 'playing':
        return <TicTacToeGame 
          playerName={playerName} 
          difficulty={difficulty}
          confirmKey={confirmKey}
          onDifficultyChange={() => setStep('difficulty')}
          onNameChange={() => setStep('name')}
        />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      case 'credits':
        return <Credits onClose={handleCloseCredits} />;
      default:
        return <PlayerNameDialog 
          onSubmit={handleNameSubmit} 
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


import { useState } from "react";
import TicTacToeGame from "@/components/TicTacToeGame";
import PlayerNameDialog from "@/components/PlayerNameDialog";
import DifficultySelector from "@/components/DifficultySelector";
import Tutorial from "@/components/Tutorial";
import { DifficultyLevel } from "@/types/gameTypes";

type GameStep = 'name' | 'difficulty' | 'playing' | 'tutorial';

const Index = () => {
  const [step, setStep] = useState<GameStep>('name');
  const [playerName, setPlayerName] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [previousStep, setPreviousStep] = useState<GameStep>('name');

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
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

  const handleCloseTutorial = () => {
    setStep(previousStep);
  }

  const renderStep = () => {
    switch (step) {
      case 'name':
        return <PlayerNameDialog onSubmit={handleNameSubmit} onTutorial={handleShowTutorial} />;
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
          onDifficultyChange={() => setStep('difficulty')}
          onNameChange={() => setStep('name')}
        />;
      case 'tutorial':
        return <Tutorial onClose={handleCloseTutorial} />;
      default:
        return <PlayerNameDialog onSubmit={handleNameSubmit} onTutorial={handleShowTutorial} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default Index;

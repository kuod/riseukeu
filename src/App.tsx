import { GameProvider } from './state/GameContext';
import { useGame } from './state/gameContextValue';
import { SetupScreen } from './components/SetupScreen';
import { GameBoard } from './components/GameBoard';

function Router() {
  const { state } = useGame();
  return state ? <GameBoard /> : <SetupScreen />;
}

function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}

export default App;

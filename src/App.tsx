import { Routes, Route } from 'react-router-dom';
import { useAppState } from './hooks/useAppState';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import HomePage from './pages/HomePage';
import DayPage from './pages/DayPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import TreadmillPage from './pages/TreadmillPage';
import MorningPage from './pages/MorningPage';

export default function App() {
  const {
    state,
    loading,
    completeDay,
    completeExercise,
    completeTreadmill,
    clearDay,
    removeTreadmill,
    updateTreadmillKm,
    finishOnboarding,
    completeMorning,
    removeMorning,
    setReminders,
    selectProgram,
    reset,
    resetTreadmill,
    updateCardioMode,
    updateDifficulty,
    updateFeedback,
  } = useAppState();

  if (loading || !state) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Nalagam izziv …</p>
      </div>
    );
  }

  return (
    <Layout>
      {!state.onboardingDone && (
        <Onboarding
          initialMode={state.cardioMode}
          onComplete={(mode) => void finishOnboarding(mode)}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<HomePage state={state} onSelectProgram={selectProgram} />}
        />
        <Route
          path="/day/:dayId"
          element={
            <DayPage
              state={state}
              onCompleteExercise={completeExercise}
              onCompleteDay={completeDay}
              onClearDay={clearDay}
              onCardioModeChange={updateCardioMode}
              onDifficultyChange={updateDifficulty}
            />
          }
        />
        <Route
          path="/morning"
          element={
            <MorningPage
              state={state}
              onCompleteRoutine={completeMorning}
              onDifficultyChange={updateDifficulty}
            />
          }
        />
        <Route
          path="/treadmill"
          element={
            <TreadmillPage state={state} onCompleteWorkout={completeTreadmill} />
          }
        />
        <Route
          path="/progress"
          element={
            <ProgressPage
              state={state}
              onClearDay={clearDay}
              onRemoveTreadmill={removeTreadmill}
              onUpdateTreadmillKm={updateTreadmillKm}
              onRemoveMorning={removeMorning}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <SettingsPage
              state={state}
              onUpdateReminders={setReminders}
              onReset={reset}
              onResetTreadmill={resetTreadmill}
              onCardioModeChange={updateCardioMode}
              onFeedbackChange={updateFeedback}
            />
          }
        />
      </Routes>
    </Layout>
  );
}

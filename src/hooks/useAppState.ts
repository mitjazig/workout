import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppState, CardioMode, FeedbackSettings, WorkoutDifficulty } from '../types';
import {
  loadState,
  markDayComplete,
  markExerciseComplete,
  markTreadmillComplete,
  clearDayProgress,
  removeTreadmillCompletion,
  updateTreadmillDistance,
  completeOnboarding,
  markMorningComplete,
  removeMorningCompletion,
  markBonusComplete,
  removeBonusCompletion,
  resetAllProgress,
  resetProgress,
  resetTreadmillProgress,
  setActiveProgram,
  setCardioMode,
  setDifficulty,
  setFeedback,
} from '../services/progress';
import { bindReminderState, updateReminders, initReminders } from '../services/reminders';
import { stopAudio } from '../utils/feedback';

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const stateRef = useRef<AppState | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    bindReminderState(() => stateRef.current);
    loadState().then((s) => {
      setState(s);
      initReminders(s.reminders);
      if (!s.feedback.sound) stopAudio();
      setLoading(false);
    });
  }, []);

  const completeDay = useCallback(async (dayId: string, exercisesCompleted: string[]) => {
    setState((prev) => {
      if (!prev) return prev;
      markDayComplete(prev, dayId, exercisesCompleted).then(setState);
      return prev;
    });
  }, []);

  const completeExercise = useCallback(async (dayId: string, exerciseId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      markExerciseComplete(prev, dayId, exerciseId).then(setState);
      return prev;
    });
  }, []);

  const completeTreadmill = useCallback(
    async (workoutId: string, durationSeconds: number, distanceKm?: number) => {
      setState((prev) => {
        if (!prev) return prev;
        markTreadmillComplete(prev, workoutId, durationSeconds, distanceKm).then(setState);
        return prev;
      });
    },
    [],
  );

  const setReminders = useCallback(async (settings: Partial<AppState['reminders']>) => {
    setState((prev) => {
      if (!prev) return prev;
      updateReminders(prev, settings).then(setState);
      return prev;
    });
  }, []);

  const selectProgram = useCallback(async (programId: string) => {
    const prev = stateRef.current;
    if (!prev) return;
    const next = await setActiveProgram(prev, programId);
    setState(next);
  }, []);

  const reset = useCallback(async (programId?: string) => {
    if (programId) {
      setState((prev) => {
        if (!prev) return prev;
        resetProgress(prev, programId).then(setState);
        return prev;
      });
    } else {
      const s = await resetAllProgress();
      setState(s);
    }
  }, []);

  const resetTreadmill = useCallback(async () => {
    setState((prev) => {
      if (!prev) return prev;
      resetTreadmillProgress(prev).then(setState);
      return prev;
    });
  }, []);

  const updateCardioMode = useCallback(async (mode: CardioMode) => {
    setState((prev) => {
      if (!prev) return prev;
      setCardioMode(prev, mode).then(setState);
      return prev;
    });
  }, []);

  const updateDifficulty = useCallback(async (difficulty: WorkoutDifficulty) => {
    setState((prev) => {
      if (!prev) return prev;
      setDifficulty(prev, difficulty).then(setState);
      return prev;
    });
  }, []);

  const updateFeedback = useCallback(async (patch: Partial<FeedbackSettings>) => {
    setState((prev) => {
      if (!prev) return prev;
      setFeedback(prev, patch).then(setState);
      return prev;
    });
  }, []);

  const clearDay = useCallback(async (dayId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      clearDayProgress(prev, dayId).then(setState);
      return prev;
    });
  }, []);

  const removeTreadmill = useCallback(async (completionId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      removeTreadmillCompletion(prev, completionId).then(setState);
      return prev;
    });
  }, []);

  const updateTreadmillKm = useCallback(async (completionId: string, distanceKm?: number) => {
    setState((prev) => {
      if (!prev) return prev;
      updateTreadmillDistance(prev, completionId, distanceKm).then(setState);
      return prev;
    });
  }, []);

  const finishOnboarding = useCallback(async (mode: CardioMode) => {
    setState((prev) => {
      if (!prev) return prev;
      completeOnboarding(prev, mode).then(setState);
      return prev;
    });
  }, []);

  const completeMorning = useCallback(async (routineId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      markMorningComplete(prev, routineId).then(setState);
      return prev;
    });
  }, []);

  const removeMorning = useCallback(async (completionId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      removeMorningCompletion(prev, completionId).then(setState);
      return prev;
    });
  }, []);

  const completeBonus = useCallback(async (routineId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      markBonusComplete(prev, routineId).then(setState);
      return prev;
    });
  }, []);

  const removeBonus = useCallback(async (completionId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      removeBonusCompletion(prev, completionId).then(setState);
      return prev;
    });
  }, []);

  return {
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
    completeBonus,
    removeBonus,
    setReminders,
    selectProgram,
    reset,
    resetTreadmill,
    updateCardioMode,
    updateDifficulty,
    updateFeedback,
  };
}

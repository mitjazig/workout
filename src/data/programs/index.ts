import { challengeProgram } from '../challengeProgram';
import type { Program } from '../../types';

export const allPrograms: Program[] = [challengeProgram];

export const programsById: Record<string, Program> = {
  [challengeProgram.id]: challengeProgram,
};

export function getProgram(programId: string): Program {
  return programsById[programId] ?? challengeProgram;
}

export function getDayById(programId: string, dayId: string) {
  return getProgram(programId).days.find((d) => d.id === dayId);
}

export function getDayByIndex(programId: string, index: number) {
  return getProgram(programId).days[index] ?? null;
}

export { challengeProgram };

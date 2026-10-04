import { challengeProgram } from '../challengeProgram';
import { chairTaiChiProgram } from '../chairTaiChiProgram';
import type { Program } from '../../types';

/** Vsi registrirani programi – Hub jih izriše dinamično */
export const allPrograms: Program[] = [challengeProgram, chairTaiChiProgram];

export const programsById: Record<string, Program> = Object.fromEntries(
  allPrograms.map((p) => [p.id, p]),
);

export function getProgram(programId: string): Program {
  return programsById[programId] ?? challengeProgram;
}

export function getDayById(programId: string, dayId: string) {
  return getProgram(programId).days.find((d) => d.id === dayId);
}

/** Najdi dan po ID-ju v kateremkoli programu (URL ne sme pasti na napačen program). */
export function findDayById(dayId: string): { program: Program; day: Program['days'][number] } | null {
  for (const program of allPrograms) {
    const day = program.days.find((d) => d.id === dayId);
    if (day) return { program, day };
  }
  return null;
}

export function getDayByIndex(programId: string, index: number) {
  return getProgram(programId).days[index] ?? null;
}

export { challengeProgram, chairTaiChiProgram };

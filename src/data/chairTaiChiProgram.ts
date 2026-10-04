import type { Program, TrainingDay } from '../types';
import {
  TAI_CHI_FULL_FLOW,
  taiChiMoves,
  type TaiChiExerciseId,
} from './taiChiExercises';

function day(
  dayNum: number,
  title: string,
  summary: string,
  estimatedMinutes: number,
  ids: TaiChiExerciseId[],
): TrainingDay {
  const exercises = taiChiMoves(...ids);
  return {
    id: `ctc28-d${dayNum}`,
    week: Math.ceil(dayNum / 7),
    day: dayNum,
    title,
    summary,
    focus: 'mobility',
    estimatedMinutes,
    exercises,
  };
}

/** Full flow brez Opening/Closing – za vstavljanje med Silk Reeling in Closing */
const FULL_FLOW_MID: TaiChiExerciseId[] = TAI_CHI_FULL_FLOW.filter(
  (id) => id !== 'tai-opening' && id !== 'tai-closing',
);

/**
 * 28 dni Chair Tai Chi
 * Teden 1: osnove · Teden 2: novi gibi · Teden 3: povezovanje · Teden 4: celoten flow
 * Gibi so definirani v taiChiExercises.ts (brez podvajanja).
 */
export const chairTaiChiProgram: Program = {
  id: 'chair-tai-chi-28',
  name: '28 dni Chair Tai Chi',
  description:
    '28-dnevni sedeči Chair Tai Chi program s postopnim učenjem posameznih gibov in njihovim povezovanjem v miren, tekoč flow.',
  shortDescription:
    '28 dni počasnega sedečega gibanja, koordinacije in dihanja.',
  safetyNote:
    'Vadbo izvajaj počasi in v udobnem obsegu gibanja. Uporabi stabilen stol brez koles. Če gib povzroča bolečino, ga prekini ali zmanjša obseg.',
  durationLabel: '28 dni',
  equipment: ['Stol'],
  badge: 'Tai Chi',
  weeks: 4,
  days: [
    // ── TEDEN 1 — Osnove ──
    day(1, 'Odpiranje in dvig', 'Opening, Rising Hands, Closing.', 10, [
      'tai-opening',
      'tai-rising-hands',
      'tai-closing',
    ]),
    day(2, 'Oblačne roke', 'Opening, Cloud Hands, Closing.', 12, [
      'tai-opening',
      'tai-cloud-hands',
      'tai-closing',
    ]),
    day(3, 'Očisti koleno', 'Opening, Brush Knee and Push, Closing.', 12, [
      'tai-opening',
      'tai-brush-knee',
      'tai-closing',
    ]),
    day(4, 'Peng – odboj', 'Opening, Ward Off, Closing.', 12, [
      'tai-opening',
      'tai-ward-off',
      'tai-closing',
    ]),
    day(5, 'Zvijanje in pritisk', 'Opening, Roll Back, Press, Closing.', 14, [
      'tai-opening',
      'tai-roll-back',
      'tai-press',
      'tai-closing',
    ]),
    day(6, 'Peng–Lu–Ji–An', 'Opening, Ward Off, Roll Back, Press, Push, Closing.', 16, [
      'tai-opening',
      'tai-ward-off',
      'tai-roll-back',
      'tai-press',
      'tai-push',
      'tai-closing',
    ]),
    day(7, 'Flow 1. tedna', 'Rising Hands, Peng–Lu–Ji–An, Cloud Hands.', 18, [
      'tai-opening',
      'tai-rising-hands',
      'tai-ward-off',
      'tai-roll-back',
      'tai-press',
      'tai-push',
      'tai-cloud-hands',
      'tai-closing',
    ]),

    // ── TEDEN 2 — Novi gibi ──
    day(8, 'Beli žerjav', 'Opening, White Crane Spreads Wings, Closing.', 12, [
      'tai-opening',
      'tai-white-crane',
      'tai-closing',
    ]),
    day(9, 'Griva divjega konja', "Opening, Part the Wild Horse's Mane, Closing.", 12, [
      'tai-opening',
      'tai-part-mane',
      'tai-closing',
    ]),
    day(10, 'Enojni bič', 'Opening, Single Whip, Closing.', 12, [
      'tai-opening',
      'tai-single-whip',
      'tai-closing',
    ]),
    day(11, 'Odganjanje opice', 'Opening, Repulse Monkey, Closing.', 12, [
      'tai-opening',
      'tai-repulse-monkey',
      'tai-closing',
    ]),
    day(12, 'Gospa pri stativih', 'Opening, Fair Lady Works at Shuttles, Closing.', 12, [
      'tai-opening',
      'tai-fair-lady',
      'tai-closing',
    ]),
    day(13, 'Diagonal in tiger', 'Opening, Diagonal Flying, Embrace Tiger, Closing.', 14, [
      'tai-opening',
      'tai-diagonal-flying',
      'tai-embrace-tiger',
      'tai-closing',
    ]),
    day(14, 'Flow 2. tedna', 'Mane, Crane, Brush Knee, Repulse, Cloud Hands, Single Whip.', 18, [
      'tai-opening',
      'tai-part-mane',
      'tai-white-crane',
      'tai-brush-knee',
      'tai-repulse-monkey',
      'tai-cloud-hands',
      'tai-single-whip',
      'tai-closing',
    ]),

    // ── TEDEN 3 — Povezovanje ──
    day(15, 'Navijanje svile', 'Opening, Silk Reeling, Closing.', 12, [
      'tai-opening',
      'tai-silk-reeling',
      'tai-closing',
    ]),
    day(16, 'Peng–Lu–Ji–An', 'Opening, Ward Off, Roll Back, Press, Push, Closing.', 16, [
      'tai-opening',
      'tai-ward-off',
      'tai-roll-back',
      'tai-press',
      'tai-push',
      'tai-closing',
    ]),
    day(17, 'Koleno in opica', 'Opening, Brush Knee, Repulse Monkey, Closing.', 14, [
      'tai-opening',
      'tai-brush-knee',
      'tai-repulse-monkey',
      'tai-closing',
    ]),
    day(18, 'Griva, žerjav, koleno', 'Opening, Mane, White Crane, Brush Knee, Closing.', 16, [
      'tai-opening',
      'tai-part-mane',
      'tai-white-crane',
      'tai-brush-knee',
      'tai-closing',
    ]),
    day(19, 'Oblaki in bič', 'Opening, Cloud Hands, Single Whip, Closing.', 14, [
      'tai-opening',
      'tai-cloud-hands',
      'tai-single-whip',
      'tai-closing',
    ]),
    day(20, 'Statve, diagonal, tiger', 'Opening, Fair Lady, Diagonal Flying, Embrace Tiger, Closing.', 16, [
      'tai-opening',
      'tai-fair-lady',
      'tai-diagonal-flying',
      'tai-embrace-tiger',
      'tai-closing',
    ]),
    day(21, 'Neprekinjen tok', 'Celoten Chair Tai Chi flow – povezovanje gibov.', 20, [
      ...TAI_CHI_FULL_FLOW,
    ]),

    // ── TEDEN 4 — Celoten flow ──
    day(22, 'Prva polovica', 'Opening do Push – prva polovica polnega toka.', 18, [
      'tai-opening',
      'tai-rising-hands',
      'tai-part-mane',
      'tai-white-crane',
      'tai-brush-knee',
      'tai-ward-off',
      'tai-roll-back',
      'tai-press',
      'tai-push',
      'tai-closing',
    ]),
    day(23, 'Druga polovica', 'Repulse Monkey do Embrace Tiger.', 16, [
      'tai-opening',
      'tai-repulse-monkey',
      'tai-cloud-hands',
      'tai-single-whip',
      'tai-fair-lady',
      'tai-diagonal-flying',
      'tai-embrace-tiger',
      'tai-closing',
    ]),
    day(24, 'Polni tok – počasi', 'Celoten flow od Opening do Closing. Tempo naj bo mirnejši.', 20, [
      ...TAI_CHI_FULL_FLOW,
    ]),
    day(
      25,
      'Polni tok + dihanje',
      'Danes posebno pozornost nameni počasnemu, neprekinjenemu dihanju.',
      20,
      [...TAI_CHI_FULL_FLOW],
    ),
    day(26, 'Polni tok + svila', 'Opening, Silk Reeling, polni flow, Closing.', 22, [
      'tai-opening',
      'tai-silk-reeling',
      ...FULL_FLOW_MID,
      'tai-closing',
    ]),
    day(
      27,
      'Neprekinjen polni tok',
      'Poskusi povezati gibe v miren in neprekinjen tok. Hitrost ni pomembna.',
      20,
      [...TAI_CHI_FULL_FLOW],
    ),
    day(
      28,
      'Zaključni 28-dnevni tok',
      'Zaključni dan 28-dnevnega programa. Gibaj se počasi, sproščeno in v svojem udobnem obsegu.',
      20,
      [...TAI_CHI_FULL_FLOW],
    ),
  ],
};

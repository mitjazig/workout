import type { MorningMove, MorningRoutine } from './morningRoutines';

function move(
  id: string,
  name: string,
  reps: number,
  description: string,
  howTo: string[],
): MorningMove {
  return {
    id,
    name,
    reps,
    description,
    howTo,
    durationSeconds: Math.max(30, Math.round(reps * 0.9)),
  };
}

/**
 * Bonus vaje – ločeno od programov in jutranjega bloka.
 * Video: challenge10official Short qDBlF5JM-bM (sedeči core na stolu).
 */
export const bonusRoutines: MorningRoutine[] = [
  {
    id: 'bonus-seated-core',
    title: 'Sedeči core',
    subtitle: '5 gibov · 1 krog · ~8 min',
    summary:
      'Na stolu: core, prsti, plavanje rok, odpiranje in stranski dotiki. Po Shortu ponovi še 1–2 kroge, če želiš.',
    estimatedMinutes: 8,
    when: 'Kadarkoli',
    finishNote:
      'En krog je opravljen. Za polno vadbo iz videa ponovi še 1–2× (Začni znova). Stol naj bo stabilen, brez koles.',
    video: {
      videoId: 'qDBlF5JM-bM',
      title: 'Sedeči core – Challenge10',
      channel: 'challenge10official',
      note: 'Demo iz Shortsa. V app-u tapni ponovitve; tempo naj bo počasen in kontroliran.',
    },
    moves: [
      move(
        'bc-1',
        'Sedeči core gib',
        20,
        'Sede na robu stabilnega stola, rahlo nagni trup – aktiviraj trebuh.',
        [
          'Stopala na tleh, kolena v liniji s stopali.',
          'Roke lahko pred prsi ali ob stegnih.',
          'Počasi naredi kratek sedeči gib (npr. majhen nagib nazaj ali dvig kolena – po občutku).',
          'Vrnitev v sredino = 1 ponovitev.',
          'Ne zadržuj diha.',
        ],
      ),
      move(
        'bc-2',
        'Izmenični dotik prstov',
        20,
        'Levo–desno dotik prstov noge ali gležnja (20 skupaj).',
        [
          'Sedi pokončno, ramena sproščena.',
          'Ena roka se nagne proti nasprotni nogi.',
          'Vrni se v sredino in zamenjaj stran.',
          'Gib naj bo majhen – brez bolečine v hrbtu.',
        ],
      ),
      move(
        'bc-3',
        'Plavanje rok',
        60,
        'Počasno «plavanje» z rokami – približno 1 minuta (≈60 tapov).',
        [
          'Roke pred telesom, krožno ali valovito gibanje.',
          'Ramena ostanejo nizko.',
          'En tap ≈ 1 sekunda gibanja.',
          'Lahko tapneš 30×, če ti 60 zadošča za krajši krog.',
        ],
      ),
      move(
        'bc-4',
        'Odpiranje in zapiranje',
        20,
        'Roke odpri in zapri pred prsnim košem (20×).',
        [
          'Komolci mehki, dlani proti drug drugemu.',
          'Odpri prsi, nato spusti roke nazaj.',
          'Tempo enakomeren.',
        ],
      ),
      move(
        'bc-5',
        'Stranski dotik tal',
        20,
        'S prstom proti tlu ob stolu – levo in desno (20 skupaj).',
        [
          'Brez skokov – majhen nagib ob strani.',
          'Ne siljenja do tal, če ne gre.',
          'Vrnitev v sredino med stranema.',
        ],
      ),
    ],
  },
];

export function getBonusRoutine(id: string): MorningRoutine | undefined {
  return bonusRoutines.find((r) => r.id === id);
}

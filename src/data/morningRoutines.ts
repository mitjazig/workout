import type { DayYoutubeVideo } from '../types';

/** Korak jutranje rutine */
export interface MorningMove {
  id: string;
  name: string;
  reps: number;
  description: string;
  howTo: string[];
  /** Ocena časa za timer (približno 1s / ponovitev) */
  durationSeconds: number;
}

/** Posebna jutranja zgodba – ločeno od 10-dnevnega izziva */
export interface MorningRoutine {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  estimatedMinutes: number;
  /** Kdaj: zjutraj / zjutraj+zvečer */
  when: string;
  finishNote: string;
  video: DayYoutubeVideo;
  moves: MorningMove[];
}

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
 * Jutranji blok – Challenge10 Shorts, vodeno v app-u.
 * Video je referenca / demo; koraki so v aplikaciji.
 */
export const morningRoutines: MorningRoutine[] = [
  {
    id: 'morning-wake-5',
    title: 'Zbudi telo',
    subtitle: '5 gibov · ~5 min',
    summary:
      'Pet preprostih gibov po 60 ponovitev – odpiranje prsi, teleta, počepi, rotacije. Nato kratka hoja.',
    estimatedMinutes: 5,
    when: 'Zjutraj',
    finishNote: 'Nato pojdi na kratko hojo – zunaj ali na stezi. To zaključi jutranjo zgodbo.',
    video: {
      videoId: '2sAGrXRz4uQ',
      title: '5 minut zjutraj – 5 gibov',
      channel: 'challenge10official',
      note: 'Demo iz Shortsa. V app-u slediš korakom; tempo naj bo počasen in kontroliran. Začetniki: 30× namesto 60.',
    },
    moves: [
      move(
        'mw5-1',
        'Odpiranje prsnega koša',
        60,
        'Roke vstran / nazaj – odpri prsi, lažje dihanje.',
        [
          'Stoj pokončno, ramena spuščena.',
          'Odpri prsni koš z rokami (kot »odpiranje vrat«).',
          'Diha mirno – ne zadržuj diha.',
          'Če peče v ramenih: zmanjšaj obseg giba.',
        ],
      ),
      move(
        'mw5-2',
        'Dvigi na prste',
        60,
        'Teleta črpajo kri navzgor – manj težkih nog.',
        [
          'Drži se stola ali stene, če treba.',
          'Počasi dvigni pete, nato spusti.',
          'Ne zaklepaj kolen.',
          'Enakomeren ritem.',
        ],
      ),
      move(
        'mw5-3',
        'Počepi',
        60,
        'Noge in srce – lahek, kontroliran tempo.',
        [
          'Noge v širini ramen.',
          'Spusti se, kot bi sedel na stol – kolena sledijo prstom.',
          'Peti ostanejo na tleh.',
          'Plitvejši počep je OK.',
        ],
      ),
      move(
        'mw5-4',
        'Rotacije trupa',
        60,
        'Zrahljaj hrbet – levo–desno.',
        [
          'Stopala mirno, obrača se zgornji del.',
          'Roke pred seboj ali na ramenih.',
          'Brez sunkov.',
          'Štej vsako stran (30+30) ali skupaj 60.',
        ],
      ),
      move(
        'mw5-5',
        'Še odpiranje prsi',
        60,
        'Še en krog za dihanje in ramena.',
        [
          'Enako kot prvi gib – mirno odpiranje.',
          'Rami stran od ušes.',
          'Zaključi z 3 globokimi vdihi.',
        ],
      ),
    ],
  },
  {
    id: 'morning-heart-2',
    title: 'Za srce',
    subtitle: '3 gibi · ~2 min',
    summary:
      'Tri lahke vaje po 30 ponovitev – teleta, zamahi + pete, odpiranje prsi. Ne nadomesti hoje; jo dopolni.',
    estimatedMinutes: 2,
    when: 'Zjutraj in zvečer',
    finishNote: 'Nato hoja – to je glavni del za srce. Te tri vaje so dodatek.',
    video: {
      videoId: 't25r_mTXT18',
      title: '2 minuti za srce',
      channel: 'challenge10official',
      note: 'Short poudari: ne sprint, ampak ti gibi + hoja. Demo sledi temu bloku.',
    },
    moves: [
      move(
        'mh2-1',
        'Dvigi pet (roke v bokih)',
        30,
        'Roke na boke, 30× dvig pet.',
        [
          'Roke v bokih, pokončna drža.',
          'Dvigni pete, počasi spusti.',
          'Ritem enakomeren.',
        ],
      ),
      move(
        'mh2-2',
        'Zamahi rok + dvigi pet',
        30,
        'Roke zamahujejo, pete se dvigujejo – 30×.',
        [
          'Zamahu rok uskladi z dvigom pet.',
          'Ne skakaj – ostani pri tleh.',
          'Dihaj skozi nos / usta po občutku.',
        ],
      ),
      move(
        'mh2-3',
        'Odpiranje prsi (komolci)',
        30,
        'Pokrivljeni komolci, odpiranje prsnega koša × 30.',
        [
          'Komolci pokrivljeni, odpri prsi.',
          'Ramena nizko.',
          'Mirno dihanje.',
        ],
      ),
    ],
  },
];

export function getMorningRoutine(id: string): MorningRoutine | undefined {
  return morningRoutines.find((r) => r.id === id);
}
